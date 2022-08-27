'use strict'

export default class InputDialog extends HTMLElement {
    constructor() {
        super();
        this.dom = this.attachShadow({
            mode: 'open'
        });
        this.setAlphabet('ab');
    }

    style() {
        return (String.raw`
      <style>
        :host {
          display: block;
        }
        dialog {
          background-color: #ffcc66; 
        }
      </style>
      `);
    }

    template() {
        return (
            `<dialog id="input-dialog">
        <span id='error-text'></span></br>
        <span>introduce la secuencia de caracteres</span></br>
        <input type="text" id="input" pattern=${this.pattern}/></br>
        </dialog>`
        );
    }

    setAlphabet(alphabet) {
        this.alphabet = alphabet;   //podríamos chequear que son caracteres a-z
        if (alphabet.search(/[^A-Z,a-z]/) !== -1)    //o un try-catch que permita a y b...
            console.log('el alfabeto pasado no es válido, no debería pasar');
        this.pattern = new RegExp('[' + this.alphabet + ']');
    }

    //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
        this.dom.innerHTML = this.style() + this.template();
        this.dialog = this.dom.querySelector('#input-dialog');
        this.error = this.dom.querySelector('#error-text');
        this.dom.querySelector('#input').addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter') this.sendData('OK')
        });
    }

    //oldData es un clon de lo que se me pasa (esto por precaución)
    //new Data TIENE que ser un clon, porque si hacemos new = old, como copia por referencia, se machaca el old al tocar el new
    sendData(button) {
        this.data = {};
        if (button === 'OK') { //modifico campos
            this.data.text = this.dom.querySelector('#input').value;
        }
        this.data.button = button;
        this.dialog.close() //Si no se quita, se come todos los eventos
        this.parent.dispatchEvent(new CustomEvent('dialog', {detail: {action: 'input_data', data: this.data}}));
    }

    open(data) {
        if (data) {
            this.error.innerHTML = data;
        }
        this.dialog.showModal();
    }

    //Se supone que aquí se llama al desconectar la página, pero en laa aplicaciones no parece que pase
    disconnectedCallback() {
        //hay que quitar los listeners... pero no se dejan?!
    }

    static get observedAttributes() {
        return ['parent', 'alphabet'];  //a dónde hay que echar los eventos
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'parent':
                this.parent = document.querySelector('#' + newVal);
                break;
            case 'alphabet':
                this.setAlphabet(newVal);
            default:
                break;
        }
    }
}
//esto ta fuera de la clase
customElements.define('input-dialog', InputDialog);