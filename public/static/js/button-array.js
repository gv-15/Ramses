"use strict";
/**
 * Clase que define un array de botones HTML.
 */
export default class ButtonArray extends HTMLElement {
    constructor() {
        super();
        //el statechart completo decido hacerle shadow dom porque sí,
        this.dom = this.attachShadow({
            mode: 'open'
        });
        this.type = 'radio'; //por defecto radiobutton?
    }

    createStyle() {
        let style = `
    <style>
        :host {
            font-family: italic bold arial, sans-serif;
            font-size: 12px;
            color: black;
            width:100%;
            height:100%;
        }
        div{
            display: flex;
            flex-direction: row;
            background-color: transparent;
            padding: 1px 1px 1px 1px;
            cursor: pointer;
            user-select: none;
            border-radius: 4px;
            justify-content: space-around;
        }
        div.selected{
            border-width: 0px;

            border-radius: 0px;    
        }
        .esti-button{
            margin-bottom: 1px;
            padding: 0px;
            margin: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 90%;
            width: ${this.buttonWidth}%;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
            background-color: #FAFAFA;
            /*cursor: pointer;*/
        }
        .esti-button.selected{          
            color:transparent;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
        }
        .esti-button:hover {
            transform:scale(0.9);
        }

        .esti-button:active {
            color:transparent;
        /* transform: translateY(4px);*/
        }
        .hide {
            display: none;
        }

        #b-testmode {
            color: black;
            border:none;
            background-repeat: no-repeat;
            background-position: right;
        }
        #b-testmode {background-image: url(/static/images/lightning.svg);}
        #b-testmode.selected {background-image: url(/static/images/lightning-blue.svg);}

        #b-testmode.selected, #b-drawmode.selected {
            color: cornflowerblue;
        }

        #b-drawmode {
            color: black;
            border:none;
            background-repeat: no-repeat;
            background-position: left;
        }
        #b-drawmode {background-image: url(/static/images/edit.svg);}
        #b-drawmode.selected {background-image: url(/static/images/edit-blue.svg);}

        #b-download, #b-screenshot, #b-based , #b-json, #b-xml, #b-based,
        #b-zoomin, #b-zoomout, #b-home, #b-sethome, #b-fit, #b-setzoom,
        #b-state, #b-trans, #b-drag, #b-delete, #b-edit,
        #b-undo, #b-redo, #b-nuevo, #b-total, #b-determinista, #b-complementar, #b-invertir, #b-complementarTotal, 
        #b-play, #b-stop, #b-back, #b-fback, #b-fforward {
            background-repeat: no-repeat;
            background-position: center;
        }
        #b-play {background-image: url(/static/images/play.svg);}
        #b-play.selected {background-image: url(/static/images/play-blue.svg);}
        #b-stop {background-image: url(/static/images/pause.svg);}
        #b-stop.selected {background-image: url(/static/images/pause-blue.svg);}
        #b-back {background-image: url(/static/images/back.svg);}
        #b-back.selected {background-image: url(/static/images/back-blue.svg);}
        #b-fback {background-image: url(/static/images/fback.svg);}
        #b-fback.selected {background-image: url(/static/images/fback-blue.svg);}
        #b-fforward {background-image: url(/static/images/fforward.svg);}
        #b-fforward.selected {background-image: url(/static/images/fforward-blue.svg);}

        #b-based {background-image: url(/static/images/bd.svg);}
        #b-based.selected {background-image: url(/static/images/bd.svg);}
        #b-xml {background-image: url(/static/images/xml.svg);}
        #b-xml.selected {background-image: url(/static/images/xml.svg);}
        #b-json {background-image: url(/static/images/json.svg);}
        #b-json.selected {background-image: url(/static/images/json.svg);}
        #b-screenshot {background-image: url(/static/images/camera.svg);}
        #b-screenshot.selected {background-image: url(/static/images/camera.svg);}
        #b-zoomin {background-image: url(/static/images/zoom-in.svg);}
        #b-zoomin.selected {background-image: url(/static/images/zoom-in-blue.svg);}
        #b-zoomout {background-image: url(/static/images/zoom-out.svg);}
        #b-zoomout.selected {background-image: url(/static/images/zoom-out-blue.svg);}
        #b-home {background-image: url(/static/images/home.svg);}
        #b-home.selected {background-image: url(/static/images/home-blue.svg);}
        #b-sethome {background-image: url(/static/images/lock.svg);}
        #b-sethome.selected {background-image: url(/static/images/lock-blue.svg);}
        #b-fit {background-image: url(/static/images/maximize-size.svg);}
        #b-fit.selected {background-image: url(/static/images/maximize-size-blue.svg);}
        #b-state {background-image: url(/static/images/new-circle.svg);}
        #b-state.selected {background-image: url(/static/images/new-circle-blue.svg);}
        #b-trans {background-image: url(/static/images/trans.svg);}
        #b-trans.selected {background-image: url(/static/images/trans-blue.svg);}
        #b-drag {background-image: url(/static/images/move.svg);}
        #b-drag.selected {background-image: url(/static/images/move-blue.svg);}
        #b-delete {background-image: url(/static/images/delete.svg);}
        #b-delete.selected {background-image: url(/static/images/delete-blue.svg);}
        #b-edit {background-image: url(/static/images/edit-nuevo.svg);}
        #b-nuevo {background-image: url(/static/images/nuevo.svg);}
        #b-determinista {background-image: url(/static/images/determinista.svg);}
        #b-complementar {background-image: url(/static/images/complementary.svg);}
        #b-complementarTotal {background-image: url(/static/images/complementarTotal.svg);}
        #b-invertir {background-image: url(/static/images/invertir.svg);}  
        #b-total {background-image: url(/static/images/total.svg);}  
        #b-edit.selected {background-image: url(/static/images/edit-blue-nuevo.svg);}
        #b-undo {background-image: url(/static/images/rotate-left.svg);}
        #b-undo.selected {background-image: url(/static/images/rotate-left-blue.svg);}
        #b-redo {background-image: url(/static/images/rotate-right.svg);}
        #b-redo.selected {background-image: url(/static/images/rotate-right-blue.svg);}

        .tooltiptext {
            visibility: hidden;
            width: 100px;
            background-color: grey;
            color: black;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;

            /* Position the tooltip */
            position: absolute;
            z-index: 1;
        }
        .tooltiptext:before {
            content 'holaaa';
            background-color: pink;
            border-color: black;
        }
        .esti-button:hover .tooltiptext {
            visibility: visible;
        }
        #menu {
            width: 100%;
        }
    </style>
    `;
        return style;
    }
    createButtons() {
        let n = this.buttons.length; //los haremos iguales, si puede ser
        this.buttonWidth = Math.trunc(100 / n); //los hace ligeramente más pequeños para que el redondeo no sume más de 100
        let out = this.createStyle() + '<div id=menu>';
        this.buttons.forEach(b => out += `<div class="esti-button ${b.class}" id="${b.id}">${b.txt}
        <span class="tooltiptext">${b.txt}</span></div>`);
        out += '</div>';
        this.dom.innerHTML = out;
        this.nodes = Array.from(this.dom.querySelectorAll('.esti-button'));
        //pongo seleccionados los que me lo digan, eso lo controla la aplicación
        //  this.buttons.forEach((el,ix)=>{if(el.selected) this.nodes[ix].classList.add('selected')});
        this.nodes.forEach((b, ix) =>
            b.addEventListener('click', (event) => {
                if (this.type === 'radio') {
                    this.nodes.forEach(n => n.classList.remove(...this.buttonClasses));
                    b.classList.add(this.buttons[ix].class === undefined ? 'selected' : this.buttons[ix].class, 'selected');
                }
                (this.app.dispatchEvent(new CustomEvent(this.appName, {
                    detail: {
                        action: this.buttons[ix].msg,
                        pressed: ix
                    }
                })));
            })
        );
    }
    setButtons(app, data) {
        this.app = app;
        this.appName = data.appName;
        this.type = data.type || 'radio';
        this.buttons = []; //aunque usamos lo mismo que viene, copio los datos porque puede venir por referencia y usar la misma variable para otros botones...
        this.buttons = data.buttons.map(b => ({
            txt: b.value,
            msg: b.action,
            id: b.id,
            class: b.class
        }));
        this.buttonClasses = data.buttons.map(b => b.class).filter(b => b !== '').concat(['selected']); //lista de strings, igual hay vacíos o repetidos, pero da un poc igual
        this.createButtons();
    }
    click(button) {
        let ix = this.buttons.findIndex(el => el.msg === button);
        this.nodes[ix].click();
    }
    connectedCallback() {
            //Los ids deben ser únicos...
            this.app = document.querySelector('#' + this.appName) || this; //los atributos se ponen muy pronto, en la creación, pero igual el elemento no está...?
            //Si no existe el id ese, pues los eventos vienen aquí y daremos error o algo?
        }
        //Aquí recibiríamos eventos que son para nosotros o aquellos cuya app no se ha puesto bien
    handleEvent(evt) {
            if (evt.type === this.app) {
                let command = evt.detail.action;
                switch (command) {
                    default: console.log('unhandled event: ' + command + 'or unknown app ' + this.appName);
                    break;
                }
            }
        }
        //Se supone que aquí se llama al desconectar la página, pero en laa aplicaciones no parece que pase
    disconnectedCallback() {
        //hay que quitar los listeners... pero no se dejan?!
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            default: break;
        }
    }
}
customElements.define('button-array', ButtonArray);