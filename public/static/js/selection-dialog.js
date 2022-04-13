'use strict'

import StateChart from './state-chart.js';



export default class SelectionDialog extends HTMLElement {
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
        top: 10%;
        -webkit-box-shadow: 10px 10px 24px 13px rgba(0,0,0,0.75);
        -moz-box-shadow: 10px 10px 24px 13px rgba(0,0,0,0.75);
        box-shadow: 10px 10px 24px 13px rgba(0,0,0,0.75);
        color: white;
        text-align: center;

        }
        #sections-container {
            display:flex;
            flex-direction:row;
        }
        .section {
            display:flex;
            flex-direction: column;
            width: 70%;
        }
        input[type=text]{
            padding:4px;
            margin-top: 4px;
            margin-left:4px;
            border-radius: 4px;
            border: none;
        }
        input[type=file]{
            padding:4px;
            margin-top: 15%;
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
        label {
            border-style:solid;
            border-width: thin;
            padding: 4px;
            border-radius: 4px;
            margin:5px;
        }
        laber:hover {
            transform: scale(1.1);
            color: yellow;
        }
        #sigma-label, #filename-label ,#stack-label {
            border-style: none;
            text-align: center;
        }
        input[type=radio]{
        display:none;
        }
        input[type=radio]:checked + label {
            background: white;
            color: black;
        }
        #radio-container {
            display:flex;
            width: 100%;
            flex-direction: row;
            list-style: none;
            padding: 0;
            margin: 0;
            justify-content: space-evenly;
        }
        #text-input-container {
            display: inline-flex;
        }

        .headerDivider {
            margin-right: 8px;
            margin-left: 8spx;
            border-left: 1px solid #38546d;
            border-right: 1px solid #16222c;
            height: auto;
            
        }
    </style>
    `);
    }
        template() {
            return (
                `<dialog id="selection-dialog">
                <div id="sections-container">
                    <div class="section">
                        <span>Nueva máquina</span></br>
                        <div id="radio-container">
                            <input type="radio" name="machine" id="AFD" value="AFD" checked />
                            <label for="AFD">AFD</label>
                            <input type="radio" name="machine" id="AFND" value="AFND"/>
                            <label for="AFND">AFND</label>
                            <input type="radio" name="machine"id="APN"  value="APN"/>
                            <label for="APN">APN</label>
                            <input type="radio" name="machine" id="MTR"  value="MTR"/>
                            <label for="MTR">MTR</label>
                            <input type="radio" name="machine" id="MTC"  value="MTC"/>      
                            <label for="MTC">MTC</label>
                        </div>
                        <div id="text-input-container">
            
                            <label id="sigma-label">&#931<input type="text"  name="machine" id="alphabet-input" placeholder="p.ej: ab, 01"/></label></br>
                            <label id="stack-label">&#931 Pila<input type="text"  name="stack-machine" id="stack-alphabet-input" placeholder="p.ej: gv, 15"/></label></br>
                            <label id="filename-label">Nombre<input type="text"  name="filename" id="filename-input" placeholder="afd-01"/></label>
                        </div>
                    </div>
                    <div class="headerDivider"></div>
                    <div>
                        <span> Importar desde JSON</span></br>
                        <input type="file"  name="machine" id="file-input" /></br>
                    </div>
                    <div>
                    <span> Importar desde JFLAP</span></br>
                    <input type="file"  name="machine2" id="file-input2" /></br>
                </div>
                </div>
                <input type="button" id="end" value="Empezar"/>

        </dialog>`
            );
        }
        //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {

        this.dom.innerHTML = this.style() + this.template();
        this.dialog = this.dom.querySelector('#selection-dialog');
        this.data = { type: '', sigma: '', stack: '', states: [] };
        this.dom.querySelector('#end').addEventListener('click', () => this.sendData('OK'));
    }
    setSigma(sigma) {
        this.sigma = sigma;
        if (sigma.search(/[^A-Z,a-z]/) !== -1) //o un try-catch que permita a y b...
            console.log('el alfabeto pasado no es válido, no debería pasar');
        this.pattern = new RegExp('[' + this.sigma + ']');
    }
    setStack(stack) { //Misma idea que arriba, tengo que ver si funciona
        this.stack = stack;
        if (stack.search(/[^A-Z,a-z]/) !== -1) //o un try-catch que permita a y b...
            console.log('el alfabeto de la pila pasado no es válido, no debería pasar');
        this.pattern = new RegExp('[' + this.stack + ']');
    }
    setType(type) {
        this.type = type;
    }
    sendData(button) {
        this.data = {};
        if (button === 'OK') { //modifico campos
            let file = this.dom.querySelector("#file-input").files[0];
            let file2 = this.dom.querySelector("#file-input2").files[0];
            if (file && file2) {
                let filename = file.name.toLowerCase();
                let filename2 = file2.name.toLowerCase();
                if (!filename.endsWith('.json') && !filename2.endsWith('.xml')) {
                    alert('extensión de fichero no soportada');
                    return;
                }

                let reader = new FileReader();
                reader.readAsText(file);
                reader.onloadend = (evt) => {
                    let stored = JSON.parse(evt.target.result);
                    this.data.type = stored[0].type;
                    this.data.sigma = stored[0].sigma;
                    this.data.states = stored[0].states;
                    this.data.stack = stored[0].stack;
                    this.data.button = button;
                    let res = filename.split(".");
                    this.data.filename = res[0];
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                    //---------
                    
                }
                reader.readAsText(file2);
                reader.onloadend = (evt) => {
                    let stored = JSON.parse(evt.target.result);
                    this.data.type = stored[0].type;
                    this.data.sigma = stored[0].sigma;
                    this.data.states = stored[0].states;
                    this.data.stack = stored[0].stack;
                    this.data.button = button;
                    let res = filename2.split(".");
                    this.data.filename2 = res[0];
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                    //---------
                    
                }
            } else {
                this.data.type = this.dom.querySelector("input[name=machine]:checked").value;
                this.data.sigma = this.dom.querySelector("#alphabet-input").value;
                this.data.stack = this.dom.querySelector("#stack-alphabet-input").value;
                this.data.filename = this.dom.querySelector("#filename-input").value;
             if(this.data.type == "AFND" || this.data.type == "AFD")
             {
                if (this.data.type && this.data.sigma && this.data.filename ) {
                    //console.log("hay datos suficientes");
                    this.data.states = [];
                    this.data.button = button;
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                } else {
                    //console.log("no hay datos suficintes");
                    alert("Rellena todos los campos para continuar");
                    return;
                }
             }
             else{

                if (this.data.type && this.data.sigma && this.data.filename && this.data.stack) {
                    //console.log("hay datos suficientes");
                    this.data.states = [];
                    this.data.button = button;
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                } else {
                    //console.log("no hay datos suficintes");
                    alert("Rellena todos los campos para continuar");
                    return;
                }
             }
                //this.data.type = this.dom.querySelector("input[name=machine]:checked").value;
                //this.data.sigma = this.dom.querySelector("#alphabet-input").value;
            }
        }
        this.dialog.close()
    }
    open() {
        this.dialog.showModal();
    }
    disconnectedCallback() {}

    static get observedAttributes() {
        return ['parent', 'sigma', 'type', 'stack']; //a dónde hay que echar los eventos
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'parent':
                this.parent = document.querySelector('#' + newVal);
                break;
            case 'sigma':
                this.setSigma(newVal);
                break;
            case 'type':
                this.setType(newVal);
                break;
            case 'stack':
                this.setStack(newVal);
                break;
            default:
                break;
        }
    }

}

//esto ta fuera de la clase
customElements.define('selection-dialog', SelectionDialog);