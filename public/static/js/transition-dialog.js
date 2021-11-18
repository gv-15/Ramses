'use strict'

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
            return (
                `<dialog id="transition-dialog">
        <select id='select-transition'></select>
        <input type="button" id="add" value=" Añadir "/>
        <input type="button" id="del" value=" Borrar "/></br>
        <span id='name' ></span></br>
        <span id='optional-text'></span></br>
        <div id="buttons">
          <input type="button" id="esc" value="Salir"/>
          <input type="button" id="end" value="Enviar"/>
        </div>
        </dialog>`
            );
        }
        //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
            this.dom.innerHTML = this.style() + this.template();
            this.dialog = this.dom.querySelector('#transition-dialog'),
                this.nameNode = this.dom.querySelector('#name');
            this.selNode = this.dom.querySelector('#select-transition');

            this.data = { name: '' };
            this.type = 'DFA';
            this.dom.querySelector('#add').addEventListener('click', () => {
                if (this.type === 'DFA')
                    this.nameNode.innerText = this.selNode.value;
                else {
                    if ((this.nameNode.innerText.length === 0) ||
                        (this.nameNode.innerText === '\u03F5') ||
                        (this.selNode.value === '\u03F5')) //El epsilon va solo, borra lo que haya antes o se borra al poner otra cosa
                        this.nameNode.innerText = this.selNode.value;
                    else if (this.nameNode.innerText.indexOf(this.selNode.value)) //evito repes
                        this.nameNode.innerText = this.nameNode.innerText + ',' + this.selNode.value;
                }
            });
            this.dom.querySelector('#del').addEventListener('click', () => { this.nameNode.innerText = '' });
            this.dom.querySelector('#end').addEventListener('click', () => this.sendData('OK'));
            this.dom.querySelector('#esc').addEventListener('click', () => this.sendData('ESC'));
        }
        //oldData es un clon de lo que se me pasa (esto por precaución)
        //new Data TIENE que ser un clon, porque si hacemos new = old, como copia por referencia, se machaca el old al tocar el new
    sendData(button) {
        this.data = this.oldData;
        if (button === 'OK') { //modifico campos
            this.data.name = this.nameNode.innerText;
        }
        this.data.button = button;
        this.dialog.close()
        this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'transition_data', data: this.data } }));
    }
    open(data, alphabet) {
            //copia de los datos del estado
            this.oldData = JSON.parse(JSON.stringify(data)); //por si hay que recuperar? esto hace un clone sencillo
            this.type = (alphabet.indexOf('\u03f5') !== -1) ? 'NFA' : 'DFA';
            this.nameNode.innerText = data.name;
            this.dom.querySelector('#optional-text').innerText = data.text || ''; //Aquí vendría texto de error
            this.selNode.innerHTML = alphabet.split('').reduce((out, el, ix) => (out += `<option value='${el}'>${el}</option>`), "");
            this.dialog.showModal();
        }
        //Se supone que aquí se llama al desconectar la página, pero en laa aplicaciones no parece que pase
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