'use strict'

import StateChart from "./state-chart.js";
//Este lo registramos en código en javascript y el constructor NO se deja pasar parámetros
//Pasamos las cosas en atributos a ver.


export default class TransitionDialog extends HTMLElement {
    constructor() {
        super();
        this.dom = this.attachShadow({
            mode: 'open'
        });
    }
    style() {
        return (String.raw `
      <style>
        :host {
          display: block;
        }
        dialog {
          font-family: 'Maven Pro', sans-serif;
          background: linear-gradient(to left, #955DFF, #6FAAFF);
          border-radius:10px;
          border-width: thin;
          top: 30%;
          -webkit-box-shadow: 10px 10px 24px 13px rgba(0,0,0,0.75);
          -moz-box-shadow: 10px 10px 24px 13px rgba(0,0,0,0.75);
        box-shadow: 10px 10px 24px 13px rgba(0,0,0,0.75);
        color: white;
        text-align: center;
        width: 30%;
        }
       
        #esc, #end {
          margin-top: 4px;
            color: white;
            height: 40px;
            //background-color: cornflowerblue;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            border-radius: 4px;
            width: 30%;
            line-height: 40px;
        }
        #buttons{
          display: flex;
          justify-content: space-around;
          margin-top: 8px;
        }

      </style>
      `);
    }
    template() {
    //   if(this.data.type == "AFD" ){
        
        return (
        `<dialog id="transition-dialog">
        <select id='select-transition'></select>
        <input type="button" id="add" value=" Añadir "/>
        <input type="button" id="del" value=" Borrar "/></br></br>
        <select id='select-stack-transition'></select>
        <input type="button" id="add2" value=" Añadir "/>
        <input type="button" id="del2" value=" Borrar "/></br></br>
        <select id='select-stack-transition2'></select>
        <input type="button" id="add3" value=" Añadir "/>
        <input type="button" id="del3" value=" Borrar "/></br></br>
        <span id='name' ></span>,<span id='name2' ></span>;<span id='name3' ></span></br>
        <span id='optional-text'></span></br>
        <div id="buttons">
         <input type="button" id="esc" value="Salir"/>
         <input type="button" id="end" value="Enviar"/>
        </div>
        </dialog>`
        );
    //}
   
        }
        //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
       
            this.dom.innerHTML = this.style() + this.template();
            this.dialog = this.dom.querySelector('#transition-dialog'),
            this.nameNode = this.dom.querySelector('#name');
            this.nameNode2 = this.dom.querySelector('#name2');
            this.nameNode3 = this.dom.querySelector('#name3');
            this.selNode = this.dom.querySelector('#select-transition');
            this.selNode2 = this.dom.querySelector('#select-stack-transition');
            this.selNode3 = this.dom.querySelector('#select-stack-transition2');
            this.data = { name: '' };

           
            this.type = 'DFA';

            this.dom.querySelector('#add').addEventListener('click', () => {
                if (this.type === 'DFA'){

                    this.nameNode.innerText = this.selNode.value;
                 

                }

                else {
                    if ((this.nameNode.innerText.length === 0) ||
                        (this.nameNode.innerText === '\u03F5') ||
                        (this.selNode.value === '\u03F5')){

                            this.nameNode.innerText = this.selNode.value;
    
                        } //El epsilon va solo, borra lo que haya antes o se borra al poner otra cosa
                      
                        
                    else if (this.nameNode.innerText.indexOf(this.selNode.value)){

                        this.nameNode.innerText = this.nameNode.innerText + ',' + this.selNode.value;
                
                    } //evito repes
                        
                }
            });
            this.dom.querySelector('#add2').addEventListener('click', () => {
                if (this.type === 'DFA'){

                    this.nameNode2.innerText = this.selNode2.value;
                  
                }

                else {
                    if ((this.nameNode2.innerText.length === 0) ||
                        (this.nameNode2.innerText === '\u03F5') ||
                        (this.selNode2.value === '\u03F5')){

                            this.nameNode2.innerText = this.selNode2.value;
                
                        } //El epsilon va solo, borra lo que haya antes o se borra al poner otra cosa
                      
                        
                    else if (this.nameNode2.innerText.indexOf(this.selNode2.value)){

                        this.nameNode2.innerText = this.nameNode2.innerText + ',' + this.selNode2.value;

                    } //evito repes
                        
                }
            });
            this.dom.querySelector('#add3').addEventListener('click', () => {
                if (this.type === 'DFA'){

                   
                    this.nameNode3.innerText = this.selNode3.value;
                }

                else {
                    if ((this.nameNode3.innerText.length === 0) ||
                        (this.nameNode3.innerText === '\u03F5') ||
                        (this.selNode3.value === '\u03F5')){

                            this.nameNode3.innerText = this.selNode3.value;

                        } //El epsilon va solo, borra lo que haya antes o se borra al poner otra cosa
                      
                        
                    else if (this.nameNode3.innerText.indexOf(this.selNode3.value)){
                       
                        this.nameNode3.innerText = this.nameNode3.innerText + ',' + this.selNode3.value;

                    } //evito repes
                        
                }
            });
            this.dom.querySelector('#del').addEventListener('click', () => { this.nameNode.innerText = '' });
            this.dom.querySelector('#del2').addEventListener('click', () => { this.nameNode2.innerText = '' });
            this.dom.querySelector('#del3').addEventListener('click', () => { this.nameNode3.innerText = '' });
            this.dom.querySelector('#end').addEventListener('click', () => this.sendData('OK'));
            this.dom.querySelector('#esc').addEventListener('click', () => this.sendData('ESC'));
        }
        //oldData es un clon de lo que se me pasa (esto por precaución)
        //new Data TIENE que ser un clon, porque si hacemos new = old, como copia por referencia, se machaca el old al tocar el new
    sendData(button) {
        this.data = this.oldData;
        if (button === 'OK') { //modifico campos
            this.data.name = this.nameNode.innerText;
            this.data.name2 = this.nameNode2.innerText;
            this.data.name3 = this.nameNode3.innerText;
        }
        this.data.button = button;
        this.dialog.close()
        this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'transition_data', data: this.data } }));
    }
    open(data, alphabet, stack) {
            //copia de los datos del estado
            this.oldData = JSON.parse(JSON.stringify(data)); //por si hay que recuperar? esto hace un clone sencillo
            this.type = (alphabet.indexOf('\u03f5') !== -1) ? 'NFA' : 'DFA';
            this.nameNode.innerText = data.name;
            this.dom.querySelector('#optional-text').innerText = data.text || ''; //Aquí vendría texto de error
            this.selNode.innerHTML = alphabet.split('').reduce((out, el, ix) => (out += `<option value='${el}'>${el}</option>`), ""); //de donde sale este alphabet
            this.selNode2.innerHTML =  stack.split('').reduce((out, el, ix) => (out += `<option value='${el}'>${el}</option>`), "");
            this.selNode3.innerHTML =  stack.split('').reduce((out, el, ix) => (out += `<option value='${el}'>${el}</option>`), "");
            this.machineT = data.type;
            this.dialog.showModal();
        }
        //Se supone que aquí se llama al desconectar la página, pero en las aplicaciones no parece que pase
    disconnectedCallback() {
        //hay que quitar los listeners...
    }
    static get observedAttributes() {
        return ['parent']; //a dónde hay que echar los eventos
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'parent':
                this.parent = document.querySelector('#' + newVal);
                break;
            default:
                break;
        }
    }
}
//esto ta fuera de la clase
customElements.define('transition-dialog', TransitionDialog);