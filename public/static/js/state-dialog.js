'use strict'

//Este lo registramos en código en javascript y el constructor NO se deja pasar parámetros
//Pasamos las cosas en atributos a ver.
export default class StateDialog extends HTMLElement {
    constructor() {
        super();
        this.dom = this.attachShadow({
            mode: 'open'
        });
    }

    style() {
        return (String.raw`
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
        }
        #state-dialog div {
          display:flex;
        }
        input[type=button]{
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
          justify-content: space-around;
          margin-top: 8px;
        }
      </style>
      `);
    }

    template() {
        return (
            `<dialog id="state-dialog">
        </br><span id='optional-text'></span></br>
              <div>
                <label for='is-initial' >Inicial</label><input type="checkbox" id="is-initial-state" value="Initial"/><br/>
                <label for='is-terminal' >Final</label><input type="checkbox" id="is-terminal-state" value="Terminal"/><br/>
              </div>    <br/>
              <label for='comments' >Comentarios</label><input type="text" id="comments"/><br/>
              <div id="buttons">
                <input type="button" id="esc" value="Salir"/><input type="button" id="end" value="Enviar"/>
              </div>

      </dialog>`
        );
    }

    //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
        this.dom.innerHTML = this.style() + this.template();
        this.dialog = this.dom.querySelector('#state-dialog');
        this.dom.querySelector('#end').addEventListener('click', () => this.sendData('OK'));
        this.dom.querySelector('#esc').addEventListener('click', () => this.sendData('ESC')); //Por ortogonalidad, se podría cerrar el diálogo aquí, creo
    }

    //oldData es un clon de lo que se me pasa (esto por precaución)
    //Los campos se actualizan de 1 en uno y no como estructura completa
    sendData(button) {
        this.data = JSON.parse(JSON.stringify(this.oldData)); //Esto lo trata luego e que recibe, pero por si acaso lo dejo como estaba
        if (button === 'OK') { //modifico campos
            this.data.isTerminalState = this.dom.querySelector('#is-terminal-state').checked;
            this.data.isInitialState = this.dom.querySelector('#is-initial-state').checked;
            this.data.comments = this.dom.querySelector('#comments').value;
        }
        this.data.button = button;
        this.dialog.close()
        this.parent.dispatchEvent(new CustomEvent('dialog', {detail: {action: 'state_data', data: this.data}}));
    }

    open(data) {
        //copia de los datos del estado
        this.oldData = JSON.parse(JSON.stringify(data)); //por si hay que recuperar? esto hace un clone sencillo
        //lo que sale en el dialog box, no es fácil de tratar en array porque usan value, checked... y se hace engorroso, demasiado listo
        this.dom.querySelector('#optional-text').innerText = data.text || '';
        this.dom.querySelector('#is-initial-state').checked = data.isInitialState;
        this.dom.querySelector('#is-terminal-state').checked = data.isTerminalState;
        this.dom.querySelector('#comments').value = data.comments;
        this.dialog.showModal();
    }

    //Se supone que aquí se llama al desconectar la página, pero en laa aplicaciones no parece que pase
    disconnectedCallback() {
        //hay que quitar los listeners... pero no se dejan?!
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
customElements.define('state-dialog', StateDialog);