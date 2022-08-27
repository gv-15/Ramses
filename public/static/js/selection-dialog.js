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
                    <div class="headerDivider"></div>
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

    //Aquí se llama cuando se conectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
        if (getLang() === 'es') {
            this.dom.innerHTML = this.style() + this.template();
        } else if (getLang() === 'en') {
            this.dom.innerHTML = this.style() + this.template2();
        } else {
            this.dom.innerHTML = this.style() + this.template3();
        }
        this.dialog = this.dom.querySelector('#selection-dialog');
        this.data = {type: '', sigma: '', stack: '', states: []};
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

            if (file && file2 == null) {
                let filename = file.name.toLowerCase();
                // let filename2 = file2.name.toLowerCase();
                if (!filename.endsWith('.json')) {
                    alert('extensión de fichero no soportada');
                    return;
                }

                let reader = new FileReader();
                reader.readAsText(file);
                reader.onloadend = (evt) => {
                    let stored = JSON.parse(evt.target.result);
                    console.log("stored es" + stored);
                    this.data.type = stored[0].type;
                    this.data.sigma = stored[0].sigma;
                    this.data.states = stored[0].states;
                    this.data.stack = stored[0].stack;
                    this.data.button = button;
                    let res = filename.split(".");
                    this.data.filename = res[0];
                    this.parent.dispatchEvent(new CustomEvent('dialog', {
                        detail: {
                            action: 'selection_data',
                            data: this.data
                        }
                    }));

                }

            } else if (file2 && file == null) {
                let filename2 = file2.name.toLowerCase();
                if (!filename2.endsWith('.xml')) {
                    alert('extensión de fichero no soportada');
                    return;
                }

                let reader2 = new FileReader();
                reader2.readAsText(file2);
                reader2.onloadend = (evt) => {

                    var a = evt.target.result;
                    console.log(a.toString());
                    //----------------------------

                    //el b2 es para no estropear el b con las pruebas, que si lo cambias no dibuja
                    var b2 = "<automaton>" + a.toString() + "</automaton>";
                    var b_array = "<automaton>" + a.toString() + "</automaton>";

                    //esto saca cuantos estados hay
                    var count = b2.match(/\bstates\b/g);
                    count = count ? count.length : 0;  //checking if there are matches or not.

                    var countf = count / 2;
                    var number = 0;

                    var b3 = b2.split("</stack>");
                    b3[0] = b3[0] + "</stack>";

                    b2 = b3[1];
                    var mapObj = {
                        type: "type",
                        states: "states",
                        name: "name",
                        x: "x",
                        y: "y",
                        isInitialState: "isInitialState",
                        isTerminalState: "isTerminalState",
                        comments: "comments",
                        transitions: "transition",
                        id: "id",
                        names: "names",
                        namess: "namess",
                        namesss: "namesss"
                    };
                    b2 = b2.replace(/(type)/gi, function (matched) {
                        return mapObj[matched];

                    });


                    var pre = b_array.split("</stack>");
                    pre[0] = pre[0] + "</stack>";

                    var post = pre[1].split("</automaton>");
                    post[1] = post[1] + "</automaton>";

                    var states_array = post[0].split("</states>");

                    var statesCopy = [];

                    for (var k = 0; k < countf; k++) {
                        states_array[k] = states_array[k] + "</states>"
                        var states_array2 = states_array[k].split("<transitions>");

                        let contadorEstados = 0;
                        for (let l = 1; l < states_array2.length; l++) {
                            states_array2[l] = "<transitions>" + states_array2[l];
                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                snames: "snames",
                                pnames: "pnames"
                            };
                            states_array2[l] = states_array2[l].replace(/(states)/gi, function (matched) {
                                return mapObj[matched] + k;
                            });

                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                sname: "sname",
                                pname: "pname"
                            };
                            states_array2[l] = states_array2[l].replace(/(tname)/gi, function (matched) {
                                if (contadorEstados > 0) {
                                    return mapObj[matched] + k + contadorEstados;
                                } else {
                                    return mapObj[matched] + k;
                                }
                            });

                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                sname: "sname",
                                pname: "pname"
                            };
                            states_array2[l] = states_array2[l].replace(/(sname)/gi, function (matched) {
                                if (contadorEstados > 0) {
                                    return mapObj[matched] + k + contadorEstados;
                                } else {
                                    return mapObj[matched] + k;
                                }
                            });

                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                sname: "sname",
                                pname: "pname"
                            };
                            states_array2[l] = states_array2[l].replace(/(pname)/gi, function (matched) {
                                if (contadorEstados > 0) {
                                    return mapObj[matched] + k + contadorEstados;
                                } else {
                                    return mapObj[matched] + k;
                                }
                            });

                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                sname: "sname",
                                pname: "pname"
                            };
                            states_array2[l] = states_array2[l].replace(/(id)/gi, function (matched) {
                                if (contadorEstados > 0) {
                                    return mapObj[matched] + k + contadorEstados;
                                } else {
                                    return mapObj[matched] + k;
                                }
                            });

                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                sname: "sname",
                                pname: "pname"
                            };
                            states_array2[l] = states_array2[l].replace(/(comments)/gi, function (matched) {
                                if (contadorEstados > 0) {
                                    return mapObj[matched] + k + contadorEstados;
                                } else {
                                    return mapObj[matched] + k;
                                }
                            });

                            var mapObj = {
                                states: "states",
                                name: "name",
                                x: "x",
                                y: "y",
                                isInitialState: "isInitialState",
                                isTerminalState: "isTerminalState",
                                comments: "comments",
                                transitions: "transitions",
                                id: "id",
                                tname: "tname",
                                sname: "sname",
                                pname: "pname"
                            };
                            states_array2[l] = states_array2[l].replace(/(transitions)/gi, function (matched) {
                                if (contadorEstados > 0) {
                                    return mapObj[matched] + k + contadorEstados;
                                } else {
                                    return mapObj[matched] + k;
                                }
                            });
                            contadorEstados++;
                        }

                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(states)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });


                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(name)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });


                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(x)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });


                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(Y)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });

                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(IsInitialState)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });

                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(isTerminalState)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });


                        var mapObj = {
                            states: "states",
                            name: "name",
                            x: "x",
                            y: "y",
                            isInitialState: "isInitialState",
                            isTerminalState: "isTerminalState",
                            comments: "comments",
                            transitions: "transitions",
                            id: "id",
                            tname: "tname",
                            sname: "sname",
                            pname: "pname"
                        };
                        states_array2[0] = states_array2[0].replace(/(comments)/gi, function (matched) {
                            return mapObj[matched] + k;
                        });

                        statesCopy.push(states_array2);
                    }

                    var Automaton = pre[0];

                    for (let j = 0; j < statesCopy.length; j++) {
                        Automaton += statesCopy[j];
                    }
                    Automaton += post[1];

                    var automata = Automaton.replaceAll(',', '');

                    console.log('Automata estandar importado: ' + automata);

                    //-------------------------------------------------------------------------------------------

                    const parser = new DOMParser();

                    var c = formatXml(automata);
                    const doc = parser.parseFromString(c, "application/xml");

                    this.data.type = doc.querySelector('type')?.textContent || 'default';
                    this.data.sigma = doc.querySelector('sigma')?.textContent || 'default';
                    this.data.stack = doc.querySelector('stack')?.textContent;
                    let array = [];
                    let transitions = [];
                    let f = 0;
                    let i = 0;

                    if (this.data.type === 'AFD') {
                        while (f < 1) {
                            transitions = [];
                            let name = doc.querySelector('name' + i).textContent;
                            let x = doc.querySelector('x' + i).textContent;
                            let y = doc.querySelector('y' + i).textContent;
                            let isInitialState = doc.querySelector('isInitialState' + i).textContent;
                            let isTerminalState = doc.querySelector('isTerminalState' + i).textContent;

                            if (doc.querySelector('tname' + i) === null) {
                                transitions = [];
                            } else {
                                let name2 = doc.querySelector('tname' + i).textContent;
                                let id = doc.querySelector('id' + i).textContent;

                                transitions.push({name: name2, id: id});

                                let u = 1;
                                let x = 0;
                                while (x < 1) {
                                    if (doc.querySelector('tname' + i + u) != null) {
                                        let name2 = doc.querySelector('tname' + i + u).textContent;
                                        let id = doc.querySelector('id' + i + u).textContent;

                                        transitions.push({name: name2, name2: '', name3: '', id: id});
                                        u++;
                                        if (doc.querySelector('name' + i + u) === null) {
                                            x++;
                                        }
                                    } else {
                                        x++;
                                    }
                                }

                            }

                            array.push({
                                name: name,
                                x: x,
                                y: y,
                                isTerminalState: isTerminalState,
                                isInitialState: isInitialState,
                                comments: '',
                                transitions: transitions
                            });
                            i++;
                            if (doc.querySelector('name' + i) === null) {
                                f++;
                            }

                        }
                    } else if (this.data.type === 'AFND') {
                        while (f < 1) {
                            transitions = [];
                            let name = doc.querySelector('name' + i).textContent;
                            let x = doc.querySelector('x' + i).textContent;
                            let y = doc.querySelector('y' + i).textContent;
                            let isInitialState = doc.querySelector('isInitialState' + i).textContent;
                            let isTerminalState = doc.querySelector('isTerminalState' + i).textContent;

                            if (doc.querySelector('tname' + i) === null) {
                                transitions = [];
                            } else {
                                let name2 = doc.querySelector('tname' + i).textContent;
                                let id = doc.querySelector('id' + i).textContent;

                                transitions.push({name: name2, id: id});

                                let u = 1;
                                let x = 0;
                                while (x < 1) {
                                    if (doc.querySelector('tname' + i + u) != null) {
                                        let name2 = doc.querySelector('tname' + i + u).textContent;
                                        let id = doc.querySelector('id' + i + u).textContent;

                                        transitions.push({name: name2, name2: '', name3: '', id: id});
                                        u++;
                                        if (doc.querySelector('name' + i + u) === null) {
                                            x++;
                                        }
                                    } else {
                                        x++;
                                    }
                                }

                            }

                            array.push({
                                name: name,
                                x: x,
                                y: y,
                                isTerminalState: isTerminalState,
                                isInitialState: isInitialState,
                                comments: '',
                                transitions: transitions
                            });
                            i++;
                            if (doc.querySelector('name' + i) === null) {
                                f++;
                            }

                        }
                    } else {
                        while (f < 1) {
                            transitions = [];
                            let name = doc.querySelector('name' + i).textContent;
                            let x = doc.querySelector('x' + i).textContent;
                            let y = doc.querySelector('y' + i).textContent;
                            let isInitialState = doc.querySelector('isInitialState' + i).textContent;
                            let isTerminalState = doc.querySelector('isTerminalState' + i).textContent;

                            if (doc.querySelector('tname' + i) === null) {
                                transitions = [];
                            } else {
                                let name2 = doc.querySelector('tname' + i).textContent;
                                let name3 = doc.querySelector('sname' + i).textContent;
                                let name4 = doc.querySelector('pname' + i).textContent;
                                let id = doc.querySelector('id' + i).textContent;

                                transitions.push({name: name2, name2: name3, name3: name4, id: id});

                                let u = 1;
                                let x = 0;
                                while (x < 1) {
                                    if (doc.querySelector('tname' + i + u) != null) {
                                        let name2 = doc.querySelector('tname' + i).textContent;
                                        let name3 = doc.querySelector('sname' + i).textContent;
                                        let name4 = doc.querySelector('pname' + i).textContent;

                                        let id = doc.querySelector('id' + i + u).textContent;

                                        transitions.push({name: name2, name2: name3, name3: name4, id: id});
                                        u++;
                                        if (doc.querySelector('name' + i + u) === null) {
                                            x++;
                                        }
                                    } else {
                                        x++;
                                    }
                                }
                            }
                            array.push({
                                name: name,
                                x: x,
                                y: y,
                                isTerminalState: isTerminalState,
                                isInitialState: isInitialState,
                                comments: '',
                                transitions: transitions
                            });
                            i++;
                            if (doc.querySelector('name' + i) === null) {
                                f++;
                            }
                        }
                    }

                    this.data.states = array;
                    console.log(this.data.states);

                    this.data.button = button;
                    let res = filename2.split(".");
                    this.data.filename = res[0];
                    this.parent.dispatchEvent(new CustomEvent('dialog', {
                        detail: {
                            action: 'selection_data',
                            data: this.data
                        }
                    }));

                }
            } else {
                this.data.type = this.dom.querySelector("input[name=machine]:checked").value;
                this.data.sigma = this.dom.querySelector("#alphabet-input").value;
                this.data.stack = this.dom.querySelector("#stack-alphabet-input").value;
                this.data.filename = this.dom.querySelector("#filename-input").value;

                if (this.data.type == "AFND" || this.data.type == "AFD") {
                    if (this.data.type && this.data.sigma && this.data.filename) {
                        this.data.states = [];
                        this.data.button = button;
                        this.parent.dispatchEvent(new CustomEvent('dialog', {
                            detail: {
                                action: 'selection_data',
                                data: this.data
                            }
                        }));
                    } else if (this.data.type && this.data.sigma && this.data.filename2) {

                        this.data.states = [];
                        this.data.button = button;
                        this.parent.dispatchEvent(new CustomEvent('dialog', {
                            detail: {
                                action: 'selection_data',
                                data: this.data
                            }
                        }));
                    } else {
                        alert("Rellena todos los campos para continuar");
                        return;
                    }
                } else {

                    if (this.data.type && this.data.sigma && this.data.filename && this.data.stack) {
                        this.data.states = [];
                        this.data.button = button;
                        this.parent.dispatchEvent(new CustomEvent('dialog', {
                            detail: {
                                action: 'selection_data',
                                data: this.data
                            }
                        }));
                    } else {
                        alert("Rellena todos los campos para continuar");
                        return;
                    }
                }
            }
        }
        this.dialog.close()
    }


    open() {
        this.connectedCallback();
        this.dialog.showModal();
    }

    disconnectedCallback() {
    }

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

customElements.define('selection-dialog', SelectionDialog);

function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
    var formatted = '', indent = '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function (node) {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length - 3);
}
