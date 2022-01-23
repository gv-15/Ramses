'use strict'


export default class DrawStateChart {
    constructor(mouseHandler, application) {
        this.mouse = mouseHandler;
        this.app = application; //a dónde hay que mandar los eventos generados
        this.svg = this.mouse.svg;

        this.init('none'); //no habilitamos ninguna acción
    }
    init(mode) {
        //Creo una línea para dibujar conexiones, la creo una vez y luego la conecto o desconecto del svg
        this.provisionalTransition = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.provisionalTransition.classList.add('provisional-transition'); //Para darle css fuera
        switch (mode) {
            case 'none':
                this.mouse.app(this.mouse);
                break; //igual es mejor que se ponga más arriba, en la apliación
            case 'start_insert_state': //habilito el click y deshabilito el resto??
                this.leftClick = (pi, evt) => {
                    this.app.dispatchEvent(new CustomEvent('edit', {
                        detail: {
                            action: 'new_state',
                            state: undefined,
                            pos: pi
                        }
                    }));
                }
                this.leftClickStart = ()=>{}; //para que no intente arrancar el zoom con cuadrado
                this.mouse.app(this); //el DRAW instala la gestión de ratón solo con el click
                break;
            case 'start_drag': {
                this.leftClick = () => {}; //si no, sigue haciendo lo que estaba, o sea, estados
                this.leftClickMove = ()=>{};    //Si drag, NO zoom
                //this.rightClickUp = ()=>{};
                this.leftClickStart = (pi, evt) => {
                    if (evt.target.nodeName === 'circle') { // } if(clicked === 'border'){ //queremos hacer una conexión
                        this.stateNode = evt.target.parentNode;
                        this.pi = pi; //punto de comienzo de drag y referencia de cuánto me muevo
                        //busco el centro del círculo del estado clickado. Los estados son circulos de centro 0,0 pero transformados
                        let transformMatrix = this.stateNode.transform.baseVal.consolidate().matrix;
                        //Los coeficientes de traslado de la matriz de transformación homogénea de svg son e y f
                        //Los de rotación y escalado serían a,b,c,d
                        this.trx = transformMatrix.e;
                        this.try = transformMatrix.f;
                        //Como tengo toda la info del estado con la referencia que he guardado en el DOM, todo la estructura
                        this.leftClickMove = (pi, pf) => { //creo que no hace falta mirar el drag
                            let x = this.trx + pf.x - this.pi.x;
                            let y = this.try + pf.y - this.pi.y;
                            this.stateNode.state.x = x;
                            this.stateNode.state.y = y;                  
                            this.app.dispatchEvent(new CustomEvent('edit', {
                                detail: {
                                    action: 'state_moved',
                                }
                            }));
                        }
                        this.leftClickUp = (pi, pf) => {
                            this.leftClickMove = ()=>{};
                            this.leftClickUp = ()=>{};
                            this.mouse.app(this); //el DRAW instala la gestión de ratón solo con el click
                            this.app.dispatchEvent(new CustomEvent('edit', {
                                detail: {
                                    action: 'state_moved_end',
                                    state: this.stateNode.state,
                                }
                            }));
                            this.stateNode = undefined;
                        }
                        this.mouse.app(this); //el DRAW instala la gestión de ratón solo con el click
                    }
                }
                this.mouse.app(this);
            }
            break;
            case 'start_insert_transition': {
                this.leftClick = () => {};
                this.leftClickMove = ()=>{};
                this.leftClickUp = ()=>{};
                this.leftClickStart = (pi, evt) => {
                    if (evt.target.nodeName === 'circle') { // } if(clicked === 'border'){ //queremos hacer una conexión
                        this.stateNode = evt.target.parentNode;
                        this.pi = pi; //punto de comienzo de drag y referencia de cuánto me muevo
                        this.provisionalTransition.setAttribute('d', `M ${this.pi.x} ${this.pi.y}`);
                        this.svg.insertBefore(this.provisionalTransition, this.svg.firstChild);

                        this.leftClickMove = (pi, pf) => { //aquí movemos la punta de la línea
                            this.provisionalTransition.setAttribute('d', `M ${this.pi.x} ${this.pi.y} L ${pf.x} ${pf.y}`);
                        }
                        this.leftClickUp = (pi, pf, evt) => {
                            if (evt.target.nodeName === 'circle') { //Miro si hemos levantado en un estado (circulo por simplicidad, sería más elegante que fuese un custom)  
                                let finalStateNode = evt.target.parentNode;
                                this.app.dispatchEvent(new CustomEvent('edit', {
                                    detail: {
                                        action: 'new_transition',
                                        from: this.stateNode,
                                        to: finalStateNode
                                    }
                                }));
                            }
                            this.stateNode = undefined;
                            this.provisionalTransition.setAttribute('d', '');
                            this.leftClickMove = ()=>{};
                            this.leftClickUp = ()=>{};
                            this.mouse.app(this);
                        }
                        this.mouse.app(this);
                    }
                }
                this.mouse.app(this); //el DRAW instala la gestión de ratón solo con el click
            }
            break;
            case 'start_delete_mode': {
                this.leftClickStart = () => {};
                this.leftClick = (pi, evt) => {
                    if (evt.target.nodeName === 'circle') {
                        this.app.dispatchEvent(new CustomEvent('edit', {detail: {action: 'delete_state', stateId: evt.target.parentNode.id } }));
                    } else if ((evt.target.nodeName === 'path') || (evt.target.nodeName === 'textPath')) { //pincho en transición
                        let theTransition = evt.target.nodeName === 'path' ? evt.target.parentNode : evt.target.parentNode.parentNode;
                        this.app.dispatchEvent(new CustomEvent('edit', { detail: { action: 'delete_transition', transitionId: theTransition.id}}));
                    }
                }
                this.mouse.app(this);
            }
            break;
            case 'start_edit_node': {
                this.leftClickStart = () => {};
                this.leftClick = (pi, evt) => {
                    if (evt.target.nodeName === 'circle') {
                        this.app.dispatchEvent(new CustomEvent('edit', {
                            detail: {
                                action: 'edit_state',
                                state: evt.target.parentNode.state
                            }
                        }));
                    } else if ((evt.target.nodeName === 'path') || (evt.target.nodeName === 'textPath')) { //pincho en transición
                        let theTransition = evt.target.nodeName === 'path' ? evt.target.parentNode : evt.target.parentNode.parentNode;
                        this.app.dispatchEvent(new CustomEvent('edit', {
                            detail: {
                                action: 'edit_transition',
                                transition: theTransition.transition
                            }
                        }));
                    }
                }
                this.mouse.app(this);
            }
            break;
            case 'start_minimize_node': { // Por hacer completamente solo esta puesto por ahora
                this.leftClickStart = () => {};
                this.leftClick = (pi, evt) => {
                    if (evt.target.nodeName === 'circle') {
                        this.app.dispatchEvent(new CustomEvent('minimize', {
                            detail: {
                                action: 'minimize_automaton',
                                state: evt.target.parentNode.state
                            }
                        }));
                    } else if ((evt.target.nodeName === 'path') || (evt.target.nodeName === 'textPath')) { //pincho en transición
                        let theTransition = evt.target.nodeName === 'path' ? evt.target.parentNode : evt.target.parentNode.parentNode;
                        this.app.dispatchEvent(new CustomEvent('minimize', {
                            detail: {
                                action: 'minimize_transition',
                                transition: theTransition.transition
                            }
                        }));
                    }
                }
                this.mouse.app(this);
            }
            break;
            default:
            break;
        }
    }
}