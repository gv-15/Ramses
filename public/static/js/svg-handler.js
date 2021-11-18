"use strict";
//How to manage mouse events depending on mode?
//We define  here  different actions and inject them to the mouse events
import FgSvgExtents from './svg-extents.js';

//La función fundamental de esta clase es escuchar los eventos de ratón y transformar las coordenadas a las del SVG
//es decir, se usan las transformadas inversas para saber en qué punto de las coordenadas de usuario estamos
//Y para usarlos implemente hay que inyectar las funciones de start, etc...
//Otra posibilidad hubiera sido mandar eventos, pero complica la gestión por lo de bubble.
//La gestión de qué se hace con estos eventos queda en manos de la aplicación principal que instala las funciones
export default class FgSvgHandler {
    constructor(svg) {
        if (svg) {
            this.svg = svg;

            this.svgExtents = new FgSvgExtents();

            //para pixels
            this.initialPoint = this.svg.createSVGPoint();
            this.finalPoint = this.svg.createSVGPoint();
            //para unidades usuario
            this.pi = this.svg.createSVGPoint();
            this.pf = this.svg.createSVGPoint();
            this.zoom = 1.0;
            let ws = { x: 0, y: 0, w: 300, h: 100 };
            this.initialExtents = Object.assign({}, ws); //copia
            this.actualExtents = Object.assign({}, ws);
            this.midPoint = { x: ws.x + ws.w / 2, y: ws.y + ws.h / 2 };

            this.view('fgZoomHome');

            //matriz
            ["mousedown", "mousemove", "mouseup", "mouseleave", "dblclick", "contextmenu", "setOrigin", "wheel"].forEach(evt => {
                this.svg.addEventListener(evt, this, false);
            });
        }
        this.application = {
            leftClick: (pi, evt) => {
                if (this.z) {
                    this.svg.removeChild(this.z);
                    this.z = undefined;
                }
            },
            leftDblclick: (pi, evt) => { console.log('dblclick'); }, //debug
            leftClickStart: (point) => {
                let r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('class', 'zoom');
                this.z = r;
                this.z.setAttribute('x', point.x);
                this.z.setAttribute('y', point.y);
                this.z.setAttribute('width', 0);
                this.z.setAttribute('height', 0);
                this.svg.appendChild(this.z);
            },
            leftClickMove: (pi, pf) => {
                if (this.z) {
                    this.z.setAttribute('x', (pi.x < pf.x ? pi.x : pf.x));
                    this.z.setAttribute('width', Math.abs(pf.x - pi.x));
                    this.z.setAttribute('y', (pi.y < pf.y ? pi.y : pf.y));
                    this.z.setAttribute('height', Math.abs(pf.y - pi.y));
                    this.z.setAttribute('vector-effect', "non-scaling-stroke");
                }
            },
            leftClickUp: (pi, pf) => {
                let m = Object.assign({}, { x: (pi.x + pf.x) / 2, y: (pi.y + pf.y) / 2 });
                let e = Object.assign({}, { w: Math.abs(pf.x - pi.x), h: Math.abs(pf.y - pi.y) });
                this.view('fgZoomInDrag', m, e);
                this.svg.removeChild(this.z);
                this.z = undefined;
            },
            leftClickLeave: (pi, pf) => {
                this.svg.removeChild(this.z);
                this.z = undefined;
            },
            rightClick: (pi, evt) => {
                this.svg.classList.remove("paneClickCursor");
            },
            rightClickStart: (point) => {
                this.svg.classList.add("paneClickCursor");
                this.originalViewBox = Object.assign({}, { x: this.svg.viewBox.baseVal.x, y: this.svg.viewBox.baseVal.y, w: this.svg.viewBox.baseVal.width, h: this.svg.viewBox.baseVal.height });
            },
            rightClickMove: (pi, pf) => {
                let dx = pf.x - pi.x;
                let dy = pf.y - pi.y;
                this.svg.setAttribute('viewBox', (this.originalViewBox.x - dx) + ' ' + (this.originalViewBox.y - dy) + ' ' + this.originalViewBox.w + ' ' + this.originalViewBox.h);
            },
            rightClickUp: (pi, pf) => {
                this.svg.classList.remove("paneClickCursor");
                let dx = pf.x - pi.x;
                let dy = pf.y - pi.y;

                this.view('fgPane', { x: dx, y: dy });
            },
            rightClickLeave: () => {},
            wheelHandler: (evt) => {
                this.view(evt.deltaY > 0 ? 'fgZoomOut' : 'fgZoomIn');
            }
        };
        this.setZoomMode();
    }
    app(application) {
        ['leftClick', 'leftDblclick', 'leftClickStart', 'leftClickMove', 'leftClickUp', 'leftClickLeave',
            'rightClick', 'rightClickStart', 'rightClickMove', 'rightClickUp', 'rightClickLeave', 'wheelHandler'
        ].forEach(event => {
            if (application[event]) {
                this[event] = application[event];
            }
        });
    }
    setOrigin() {
        this.ctm_inv = this.svg.getScreenCTM().inverse();
    }
    setExtents(x, y, w, h) {
        this.initialExtents = Object.assign({}, { x: x, y: y, w: w, h: h });

        this.initialExtents.w = this.initialExtents.w ? this.initialExtents.w : 0.0001; // Avoid 0 value in width
        this.initialExtents.h = this.initialExtents.h ? this.initialExtents.h : 0.0001; // Avoid 0 value in height

        this.view('fgZoomHome');
    }
    getInitialExtents() {
        return this.initialExtents;
    }
    setInitialExtents(extents) {
        this.initialExtents = extents;
        this.zoom = 1.0;
    }
    getZoom() {
        return { zoom: this.zoom, midPoint: this.midPoint };
    }
    setZoom(config) {
        this.zoom = config.zoom;
        this.midPoint = config.midPoint;
    }
    getExtentsAndSetMatrix() { //esta rutina ya no se llama desde fuera
            let matrix = this.svg.getScreenCTM();
            this.ctm_inv = matrix.inverse();
            let p0 = this.svg.createSVGPoint(),
                p1 = this.svg.createSVGPoint();
            let r = this.svg.getBoundingClientRect();
            p0.x = r.left, p0.y = r.bottom, p1.x = r.right, p1.y = r.top;
            p0 = p0.matrixTransform(this.ctm_inv);
            p1 = p1.matrixTransform(this.ctm_inv);
            this.svgExtents.setMatrix(matrix);
            this.svgExtents.setExtents({ xi: p0.x, yi: p0.y, xf: p1.x, yf: p1.y });
        }
        //código copiado
    handleEvent(evt) {
            let handler = evt.type;
            if (typeof this[handler] === "function") {
                evt.preventDefault(); //así no hay que hacerlo en cada una?
                return this[handler](evt);
            }
        }
        //Falta meter el return en las funciones handler
    contextmenu(evt) {
            evt.preventDefault();
        } //redundante
    dblclick(evt) {
        this.leftDblclick(this.pi, evt);
    }
    mousedown(evt) {
        Object.assign(this.initialPoint, { x: evt.clientX, y: evt.clientY }); //pixels
        this.pi = this.initialPoint.matrixTransform(this.ctm_inv);
        //aquí llamamos a la función que nos hayan inyectado
        if (evt.which === 1) { //left button pressed
            this.leftClickStart(this.pi, evt);
        } else if (evt.which === 3) { //right button pressed
            this.rightClickStart(this.pi, evt);
        }
    }
    mousemove(evt) {
        Object.assign(this.finalPoint, { x: evt.clientX, y: evt.clientY }); //pixels
        this.pf = this.finalPoint.matrixTransform(this.ctm_inv);
        if (evt.which === 1) { //left button pressed
            this.leftClickMove(this.pi, this.pf);
        } else if (evt.which === 3) { //right button pressed
            this.rightClickMove(this.pi, this.pf);
        }
        let event = new CustomEvent("fgMouseChanged", { detail: this.pf });
        this.svg.dispatchEvent(event, true); //bubbling
    }
    mouseup(evt) {
        Object.assign(this.finalPoint, { x: evt.clientX, y: evt.clientY }); //pixels
        this.pf = this.finalPoint.matrixTransform(this.ctm_inv);
        let isShortStroke = ((Math.abs(this.finalPoint.x - this.initialPoint.x) < 25) && (Math.abs(this.finalPoint.y - this.initialPoint.y) < 25));
        if (evt.which === 1) { //left button pressed
            //Miro si los dos puntos están cercanos y lo trato como click (habitualmente selección)
            //if (Math.abs(this.finalPoint.x - this.initialPoint.x) < 25 && Math.abs(this.finalPoint.y - this.initialPoint.y) < 25) {
            if (isShortStroke) {
                this.leftClick(this.pi, evt); // es una manera de tener un click
            } else { //Aquí es un zoom o selección grande
                this.leftClickUp(this.pi, this.pf, evt);
            }
        } else if (evt.which === 3) {
            if (isShortStroke) {
                this.rightClick(this.pi, evt); // es una manera de tener un click
            } else {
                this.rightClickUp(this.pi, this.pf);
            }
        }
    }
    mouseleave(evt) {
        Object.assign(this.finalPoint, { x: evt.clientX, y: evt.clientY }); //pixels
        this.pf = this.finalPoint.matrixTransform(this.ctm_inv);
        if (evt.which === 1) { //left button pressed
            this.leftClickLeave(this.pi, this.pf);
        } else if (evt.which === 3) {
            this.rightClickUp(this.pi, this.pf);
        }
    }
    wheel(evt) {
            this.wheelHandler(evt);
        }
        //El zoom es la relación entre InitialExtents y ActualExtents
        //InitialExtents solo se toca en el setHome y en el inicio 
        //Pane NO modifica el zoom pero sí el centro    
    view(cmd, m, e) {
        switch (cmd) { //teclas, el 0.9 es obviamente opcional
            case 'fgPane': //aquí me paso {dx,dy}
                this.midPoint.x -= m.x;
                this.midPoint.y -= m.y;
                break;
            case 'fgZoomInDrag':
                [this.midPoint.x, this.midPoint.y] = [m.x, m.y];
                this.zoom = Math.max(e.w / this.initialExtents.w, e.h / this.initialExtents.h);
                break;
            case 'fgZoomIn':
                this.zoom = this.zoom * 0.9;
                break; //No modifican el midpoint m
            case 'fgZoomOut':
                this.zoom = this.zoom / 0.9;
                break;
            case 'fgZoomHome':
                this.zoom = 1.0;
                this.midPoint.x = this.initialExtents.x + this.initialExtents.w / 2;
                this.midPoint.y = this.initialExtents.y + this.initialExtents.h / 2;
                break;
            case 'fgSetHome': //repito algún cálculo, pero queda más claro
                let ex = this.initialExtents;
                ex.w *= this.zoom;
                ex.h *= this.zoom;
                this.initialExtents = Object.assign({}, { x: this.midPoint.x - ex.w / 2, y: this.midPoint.y - ex.h / 2, w: ex.w, h: ex.h });
                this.zoom = 1.0;
                this.hist = [];
                break;
            case 'O':
                let offset = m;
                this.midPoint.x -= offset.x;
                this.midPoint.y -= offset.y;
                this.initialExtents.x -= offset.x;
                this.initialExtents.y -= offset.y;
                break;
            case 'fit':
                let box = this.svg.getBBox();
                this.setExtents(box.x, box.y, box.width, box.height);
                this.getExtentsAndSetMatrix();
                break;
        }

        if (cmd !== "fit") {
            let mp = this.midPoint;
            let ex = Object.assign({}, this.initialExtents); //clone
            ex.w *= this.zoom;
            ex.h *= this.zoom;
            console.log('mp:' + mp.x + ':' + mp.y);
            //Unico punto de poner el tamaño de window
            this.svg.setAttribute('viewBox', (mp.x - 0.5 * ex.w) + '  ' + (mp.y - 0.5 * ex.h) + ' ' + (ex.w) + ' ' + (ex.h));
            this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            //Esto pone las coordenadas hacia arriba o hacia abajo...
            //this.svg.setAttribute('transform', 'matrix(1 0 0 -1 0 0 )'); // + e.h +')');

            //Esto busca la matriz, la invierte, calcula y pone las globaels...
            this.getExtentsAndSetMatrix();
        }

        this.svg.dispatchEvent(new CustomEvent('zoom_end')); //redraw
    }
    setZoomMode() {
        this.app(this.application); //Instala los servicios
    }
}