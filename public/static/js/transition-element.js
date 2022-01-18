'use strict'
import StateElement from './state-element.js';

export default class TransitionElement {
    constructor( trId, from, to, name, stack, stack2, type) {
        if (!(from instanceof StateElement) || !(from instanceof StateElement)) {
            console.log('error : se conectan estados');
            this.error = true; //Los constructores siempre deben terminar y devolver el objeto
            return;
        }
        //this.name = name ; //dejo vacío si está vacío, ya miraré luego si vale   
        this.from = from;
        this.to = to;
        this.id = trId;
        this.tsize = 20;
        this.stack = stack;
        this.stack2 = stack2;
        this.type = type;
        this.setName(name);
        
    }
    setName(name){//se supone que lo de DFA o NFA ya se ha chequeado antes, la transición engloba los casos DFA y NFA
        this.name = name;
        this.accepts = (input)=>(this.name.split(',').some(ch=>ch === input));
    }
    //Divido en SVG text y su inclusión en el dom
    toSVG(scale) {
        //Son estados, por tanto grupos movidos por el transform, busco los puntos de corte de la recta que une los centros
        //si son distintos, si no, pues un círculo que decido que sea de 270 grados, por ejemplo, porque es fácil
        let path = '';
        let transformMatrix = this.from.node.transform.baseVal.consolidate().matrix;
        let fromPos = {
            x: transformMatrix.e,
            y: transformMatrix.f
        };
        let fromR = this.from.getRadius() / scale;

        if (this.from !== this.to) {
            transformMatrix = this.to.node.transform.baseVal.consolidate().matrix;
            let toPos = {
                x: transformMatrix.e,
                y: transformMatrix.f
            };
            let vector = {
                x: (toPos.x - fromPos.x),
                y: (toPos.y - fromPos.y)
            };
            let d = Math.sqrt(vector.x * vector.x + vector.y * vector.y); //módulo
            let alfa = Math.atan2(vector.y, vector.x);
            let delta = Math.PI / 12; //15 grados por ejemplo ?
            let xi = fromR * Math.cos(alfa - delta),
                yi = fromR * Math.sin(alfa - delta);
            let toR = this.to.getRadius() / scale; //Lo normal es que sean todos los círculos iguales, pero por si acaso
            let xf = vector.x - toR * Math.cos(alfa + delta),
                yf = vector.y - toR * Math.sin(alfa + delta);
            //vector = { x: vector.x / d, y: vector.y / d };  //vector unitario del centro de from al de to
            //d = d - fromR - toR;    //longitud a pintar
            //path = `'M ${fromR*vector.x} ${fromR*vector.y} l ${d*vector.x} ${d*vector.y}'`;

            path = `'M ${xi} ${yi} A ${2*d} ${2*d} 0 0 1 ${xf} ${yf}'`;
        } else { //dibujo un arco en la parte de arriba, se puede ir mejorando...
            path = `'M ${-0.717*fromR} ${-0.717*fromR} A ${fromR*0.9} ${fromR*0.9} 0 1 1 ${0.717*fromR} ${-0.717*fromR} '`;
        }
        //Usamos como origen el centro del circulo from
        //Y ahora el dibujo propiamente dicho, le subo 2 px al texto, lo que no sé hacer en css...
        //startOffset=50% alinea el texto con el path, que a su vez lo cogemos en la mitad (center:middle)
        let out;
       if(this.type == "AFD" || this.type == "AFND"){
        out = `
        <g id='${this.id}' transform='translate(${fromPos.x},${fromPos.y})'>
            <path class='transition' id="path_${this.id}"  d=${path}></path>
            <text  class='transition-text' style='font-size:${this.tsize/scale}px;' dy='-2'>
            <textPath startOffset="50%" xlink:href="#path_${this.id}" >${this.name}</textPath>
            </text>                                                            
        </g>`;
       }
       else{
        out = `
            <g id='${this.id}' transform='translate(${fromPos.x},${fromPos.y})'>
                <path class='transition' id="path_${this.id}"  d=${path}></path>
                <text  class='transition-text' style='font-size:${this.tsize/scale}px;' dy='-2'>
                <textPath startOffset="50%" xlink:href="#path_${this.id}" >${this.name},${this.stack};${this.stack2}</textPath>
                </text>                                                                 //Esta en proceso traer aqui lo que seleccionas y cambiar los string de prueba por eso
            </g>`;
       }
      
       
        return (out);
    }
    toDOM(sc) {
        
        let node = document.createElement('div');
        node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" preserveAspectRatio="xMidYMid meet" style=" stroke-width:1px;">${this.toSVG(sc)}</svg>`;
        this.transitionNode = node.querySelector('g');
        return (this.transitionNode); //just in case
    }
    toSave() {
        return ({
            name: this.name,
            id: this.id,
            comments: this.comments
        });
    }
}