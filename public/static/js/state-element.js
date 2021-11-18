'use strict'

//Pongo por defecto parámetros
export default class StateElement {
    constructor(name = '', x = 0, y = 0, terminal = false, initial = false, comments = '') {
        this.name = name; //puedo recibir un dibujo o texto para poner en el estado, por defecto pondríamos el name
        this.isTerminalState = terminal;
        this.isInitialState = initial;
        this.comments = comments;
        //sus transiciones
        this.transitions = [];
        this.node = undefined; //hasta que no se pinta no se pone? 
        this.x = x;
        this.y = y;
        //Ahora va en pixels se supone, y se ajusta el tamaño para mantenerlo independientemente dl zoom
        this.r = 40; //esto podría o debería ser un atributo
        this.rterm = 0.8; //relación del circulo terminal respecto al otro
        this.tsize = 20;
    }

    getRadius() {
        return this.r;  //esto hace falta para calcular los puntos de corte con la recta que une dos estados, para diubujar la conexión
    }
    //Obtengo un svg textual primero y así sirve para exportarlo si quiero
    //Simplificación porque con el sistema de pintado por menú vale con pinchar en cualquier sitio
    //Haremos hover sobre el círculo completo
    toSVG(scale) {
        let r = this.r / scale;
        let out = `
            <g id="${this.name}" class="state" transform='translate(${this.x},${this.y})'>`;
        //Circulo básico exterior, fill del fondo y el borde es transparente hasta que el hover lo hace visible, incluye el nombre del estado
        //el vector-efffecto lo dejo para el css mejor
        out += `<circle class="state-circle" r="${this.r / scale}" id="border_${this.name}"  cx="0" cy="0" ></circle>
            <text class='state-text' style='pointer-events: none;font-size:${this.tsize/scale}px;'>${this.name}</text>`;
        //Añadimos un triángulo para indicar que es de tipo inicial, si lo es...
        if (this.isInitialState)
            out += `<path class="state-initial" d="M ${-r} 0 l${-r*0.866} ${0.5*r} v${-r} z" ></path>`;
        //Añadimos un círculo para indicar que es de tipo terminal, si lo es...
        if (this.isTerminalState)
            out += `<circle class="state-terminal" r="${this.rterm * r}" cx="0" cy="0" ></circle>`;
        //Un círculo fantasma por encima para que el hover (luego click) no lo haga en el texto o en el círculo de terminal
        //out += `<circle class="state-shadow" r="${this.r}" id="state_${this.name}"  cx="0" cy="0" ></circle></g>`;

        return (out);
    }

    //Y meto la escala del radio que el padre obtiene del gestor de zoom, también se puede pasar todo aquí, pero esto es más limpio
    toDOM(scale) {
        let out = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" preserveAspectRatio="xMidYMid meet" style=" stroke-width:1px;">${this.toSVG(scale)}</svg>`;
        let node = document.createElement('div');
        node.innerHTML = out;
        node = node.querySelector('g');
        this.node = node;
        this.node.addEventListener('leftDblclick', evt =>
            console.log(evt.currentTarget), false);
        return (node);
    }
    toSave() { //el +this.xxxxx es para forzar la conversión a número 
        return ({
            name: this.name,
            x: +this.x.toFixed(2),
            y: +this.y.toFixed(2),
            isInitialState: this.isInitialState,
            isTerminalState: this.isTerminalState,
            comments: this.comments,
            transitions: this.transitions.map(el=>el.toSave())  //la transición no debe devolver el toSave de un eestado porque habría bucles..
        });
    }
}