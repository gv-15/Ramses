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
            margin-left: 8px;
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
                    <div class="headerDivider">
                    <a data-lang="es" href="javascript:translate(es)">ES</a>
                    <a data-lang="en" href="javascript:translate(en)">EN</a>
                    <a data-lang="fr" href="javascript:translate(fr)">FR</a>
                    </div>
                    <div>
                        <span> Importar desde JSON</span></br>
                        <input type="file"  name="machine" id="file-input" /></br>
                    </div>
                    <div>
                    <span>Importar desde JFLAP</span></br>
                    <input type="file"  name="machine2" id="file-input2" /></br>
                </div>
                </div>
                <input type="button" id="end" value="Empezar"/>

        </dialog>`
            );
        }

    template2() {
        return (
            `<dialog id="selection-dialog">
                <div id="sections-container">
                    <div class="section">
                        <span>New machine</span></br>
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
            
                            <label id="sigma-label">&#931<input type="text" name="machine" id="alphabet-input" placeholder="p.ej: ab, 01"/></label></br>
                            <label id="stack-label">&#931 Stack<input type="text"  name="stack-machine" id="stack-alphabet-input" placeholder="p.ej: gv, 15"/></label></br>
                            <label id="filename-label">Name<input type="text"  name="filename" id="filename-input" placeholder="afd-01"/></label>
                        </div>
                    </div>
                    <div class="headerDivider"></div>
                    <div>
                        <span>Import from JSON</span></br>
                        <input type="file"  name="machine" id="file-input" /></br>
                    </div>
                    <div>
                    <span>Import from JFLAP</span></br>
                    <input type="file"  name="machine2" id="file-input2" /></br>
                </div>
                </div>
                <input type="button" id="end" value="Start"/>

        </dialog>`
        );
    }

    template3() {
        return (
            `<dialog id="selection-dialog">
                <div id="sections-container">
                    <div class="section">
                        <span>Machine neuve</span></br>
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
            
                            <label id="sigma-label">&#931<input type="text" name="machine" id="alphabet-input" placeholder="p.ej: ab, 01"/></label></br>
                            <label id="stack-label">&#931 Batterie<input type="text"  name="stack-machine" id="stack-alphabet-input" placeholder="p.ej: gv, 15"/></label></br>
                            <label id="filename-label">Nom<input type="text"  name="filename" id="filename-input" placeholder="afd-01"/></label>
                        </div>
                    </div>
                    <div class="headerDivider"></div>
                    <div>
                        <span>Importation à partir de JSON</span></br>
                        <input type="file"  name="machine" id="file-input"/></br>
                    </div>
                    <div>
                    <span>Importation à partir de JFLAP</span></br>
                    <input type="file" name="machine2" id="file-input2"/></br>
                </div>
                </div>
                <input type="button" id="end" value="Commencer"/>

        </dialog>`
        );
    }

        //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
        if(getLang() === 'es') {
            this.dom.innerHTML = this.style() + this.template();
        }
        else if(getLang() === 'en') {
            this.dom.innerHTML = this.style() + this.template2();
        }
        else {
            this.dom.innerHTML = this.style() + this.template3();
        }
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
            
            if (file && file2==null) {
                let filename = file.name.toLowerCase();
               // let filename2 = file2.name.toLowerCase();
                if (!filename.endsWith('.json')) {
                    alert('extensión de fichero no soportada');
                    return;
                }

                let reader = new FileReader();
                reader.readAsText(file);
                reader.onloadend = (evt) => {
                    console.log("lo de evt" + evt.target.result);
                    let stored = JSON.parse(evt.target.result);
                    console.log("stored es" + stored);
                    console.log(stored[0].type);
                    this.data.type = stored[0].type;
                    this.data.sigma = stored[0].sigma;
                    this.data.states = stored[0].states;
                    console.log("los state son" + stored[0].states);
                    this.data.stack = stored[0].stack;
                    this.data.button = button;
                    let res = filename.split(".");
                    this.data.filename = res[0];
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                    //---------
                    
                }

            } 
            else if(file2 && file==null)
            {
                let filename2 = file2.name.toLowerCase();
                console.log("aaa");
                    if (!filename2.endsWith('.xml')) {
                        alert('extensión de fichero no soportada');
                        return;
                    }  
                    
                let reader2 = new FileReader();
                reader2.readAsText(file2);
                reader2.onloadend = (evt) => {
                    console.log(evt.target.result);
                    console.log("---------------")                          
                           var a = evt.target.result;
                           const parser = new DOMParser();

                           const xmlString = "<warning>Beware of the missing closing tag</warning>";
                           var b = "<automaton>" + a + "</automaton>";
                           var c = formatXml(b);
                           console.log(c);
                           const doc = parser.parseFromString(c, "application/xml");
                           console.log(doc);                      
                           var theJson = xmlToJson2(doc);
                           //var theJson2 =  JSON.parse(theJson);
                          
                           /*const bby= "<type>AFD</type><sigma>ab,01</sigma>";
                           var ay = "<automaton>" + a + "</automaton>";
                           var ojala = formatXml(ay);
                           const docc = parser.parseFromString(ojala, "application/xml");
                           console.log(docc);                          
                           var oooo = xmlToJson2(docc);
                           console.log("convierte asi" + oooo);*/

                   console.log("eyyy" + theJson); 
                   console.log(doc.querySelector('type')?.textContent || 'default');
                    this.data.type = doc.querySelector('type')?.textContent || 'default';
                    console.log(doc.querySelector('sigma')?.textContent || 'default');
                    this.data.sigma = doc.querySelector('sigma')?.textContent || 'default';
                    console.log(doc.querySelector('states')?.textContent || 'default');
                    this.data.states = document.querySelector('states')?.textContent || 'default';
                    console.log(doc.querySelector('stack')?.textContent  || 'default');
                    this.data.stack = doc.querySelector('stack')?.textContent || 'default';
                    this.data.button = button;
                    let res = filename2.split(".");
                    this.data.filename2 = res[0];
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                    //---------
                    
                } 
            }
            else {  
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
                } 
                else if (this.data.type && this.data.sigma && this.data.filename2)
                {

                    this.data.states = [];
                    this.data.button = button;
                    this.parent.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'selection_data', data: this.data } }));
                }
                
                
                else {
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
        this.connectedCallback();
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

function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
       try { 
          dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
          console.log(dom);
       } 
       catch (e) { dom = null; }
    }
    else
       alert("cannot parse xml string!");
    return dom;
 }
 


function xmlToJson2(xml) {
   // Create the return object
   var obj = {};

   // console.log(xml.nodeType, xml.nodeName );

   if (xml.nodeType == 1) { // element
       // do attributes
       if (xml.attributes.length > 0) {
       obj["@attributes"] = {};
           for (var j = 0; j < xml.attributes.length; j++) {
               var attribute = xml.attributes.item(j);
               obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
           }
       }
   } 
   else if (xml.nodeType == 3 || 
            xml.nodeType == 4) { // text and cdata section
       obj = xml.nodeValue
   }

   // do children
   if (xml.hasChildNodes()) {
       for(var i = 0; i < xml.childNodes.length; i++) {
           var item = xml.childNodes.item(i);
           var nodeName = item.nodeName;
           if (typeof(obj[nodeName]) == "undefined") {
               obj[nodeName] = xmlToJson2(item);
           } else {
               if (typeof(obj[nodeName].length) == "undefined") {
                   var old = obj[nodeName];
                   obj[nodeName] = [];
                   obj[nodeName].push(old);
               }
               if (typeof(obj[nodeName]) === 'object') {
                   obj[nodeName].push(xmlToJson2(item));
                   
               }
           }
       }
   }
   
   return obj;
}


function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
    var formatted = '', indent= '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
}
