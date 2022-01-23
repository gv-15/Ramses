'use strict'

import StateElement from './state-element.js';
import DrawStateChart from './draw-state-chart.js';
import TransitionElement from './transition-element.js';
import FgSvgHandler from './svg-handler.js';
import StateDialog from "./state-dialog.js";
import SelectionDialog from "./selection-dialog.js";
import TransitionDialog from "./transition-dialog.js";
import InputDialog from "./input-dialog.js";
import StateChart from './state-chart.js';

//Esto podría ser JSNO, fichero aparte...
const fileButtonsData = {
    appName: 'file', //gestiono en el mismo switch
    type: 'once',
    buttons: [{
            value: "Descargar json",
            action: 'json',
            id: 'b-json'
        },
        {
            value: "Capturar",
            action: 'screenshot',
            id: 'b-screenshot'
        },
        {
            value: "Descargar xml",
            action: 'xml',
            id: 'b-xml'
        },
        {
            value: "Guardar en BD",
            action: 'bd',
            id: 'b-bd'
        }
    ]
}
const zoomButtonsData = {
    appName: 'zoom',
    type: 'once',
    buttons: [{
            value: "Zoom+",
            action: 'fgZoomIn',
            id: 'b-zoomin'
        },
        {
            value: "Zoom-",
            action: 'fgZoomOut',
            id: 'b-zoomout'
        },
        {
            value: "Home",
            action: 'fgZoomHome',
            id: 'b-home'
        },
        {
            value: "SetHome",
            action: 'fgSetHome',
            id: 'b-sethome'
        },
        {
            value: "Expandir",
            action: 'fit',
            id: 'b-fit'
        }
        /*,
                {
                    value: "ZOOM",
                    action: 'set_zoom_mode',
                    id: 'b-setzoom'
                }*/
    ]
}
const editButtonsData = {
    appName: 'edit',
    type: 'radio',
    buttons: [{
            value: "Nuevo nodo",
            action: 'start_insert_state',
            class: 'insert',
            id: 'b-state'
        },
        {
            value: "Nueva transición",
            action: 'start_insert_transition',
            class: 'insert',
            id: 'b-trans'
        },
        {
            value: "Mover",
            action: 'start_drag',
            class: 'drag',
            id: 'b-drag'
        },
        {
            value: "Borrar",
            action: 'start_delete_mode',
            class: 'delete',
            id: 'b-delete'
        },
        {
            value: "Modificar",
            action: 'start_edit_node',
            class: 'edit',
            id: 'b-edit'
        }
       
    ]
}
const undoButtonsData = {
    appName: 'edit', //gestiono en el mismo switch
    type: 'once',
    buttons: [{
            value: "Deshacer",
            action: 'undo',
            id: 'b-undo'
        },
        {
            value: "Rehacer",
            action: 'redo',
            id: 'b-redo'
        },
        {
            value: "Minimizar", //Esta creado el boton pero falta toda la implementacion, LO DEJO AQUI??
            action: 'start_minimize_node',
            class: 'minimize',
            id: 'b-minimize'
        }
    ]
}
const modeButtonsData = {
    appName: 'mode',
    type: 'radio',
    buttons: [{
            value: "Modo Dibujar",
            action: 'draw',
            class: 'selected',
            id: 'b-drawmode'
        },
        {
            value: "Modo Ejecutar",
            action: 'test',
            id: 'b-testmode'
        }
    ]
}
const testButtonsData = {
    appName: 'test',
    type: 'radio',
    buttons: [{
            value: "<<",
            action: 'reset',
            class: 'selected',
            id: 'b-fback'
        },
        {
            value: "<",
            action: 'back',
            id: 'b-back'
        },
        {
            value: "||",
            action: 'stop',
            id: 'b-stop'
        },
        {
            value: ">",
            action: 'step',
            id: 'b-play'
        },
        {
            value: ">>",
            action: 'run',
            id: 'b-fforward'
        }
    ]
}


class StateEditor extends HTMLElement {
    constructor() {
            super();
            //el statechart completo decido hacerle shadow dom porque sí,
            this.dom = this.attachShadow({
                mode: 'open'
            });
        }
        //Cuando leemos un chart de un fichero debe venir aquí, se crean los estados y las conexiones como clases
        //Por otra parte, mantener las dimensiones de circulos en zoom implica redibujar constantemente, así que separo a redraw
        //lo que es rendering propiamente dicho
    _redraw() {
            this.svg.querySelectorAll('g').forEach(n => n.remove());
            let sc = this.svgHandler.svgExtents.matrix.a;
            //Hay que hacer primero los estados porque las transiciones luego usan sus nodos y deben estar creados previamente!!
            this.chart.states.forEach(st => {
                st.node = st.toDOM(sc); //apunta de svg a la clase
                st.node.state = st; //pongo un enlace hacia atrás, desde el nodo svg al estado del modelo
                this.svg.appendChild(st.node);
            });
            this.chart.states.forEach(st => {
                st.transitions.forEach(tr => {
                    tr.node = tr.toDOM(sc);
                    tr.node.transition = tr;
                    this.svg.appendChild(tr.node);
                });
            });
        }
        //Al igual que redraw, esta rutina save que hay estados y transiciones... a mejorar
    _showStates(activeStates, activeTransitions) {
        if (activeStates !== undefined) {
            this.chart.states.forEach(st => st.node.classList.remove('selected', 'selected-end'));
            activeStates.forEach(st => st.node.classList.add(st.isTerminalState ? 'selected-end' : 'selected'));
        }
        if (activeTransitions !== undefined) {
            let trNodes = Array.from(this.dom.querySelectorAll('.transition'));
            trNodes.forEach(node => node.classList.remove('selected'));
            //el node apunta al grupo pero el css lo tenemos en la transición
            activeTransitions.forEach(tr => tr.node.firstElementChild.classList.add('selected'));
        }
        this._showOutput();
    }

    _saveStateChart() {
        this.history.push(this.chart.toJSON());
        this.redo = [];
        if (this.history.length > 99)
            this.history.slice(-1); //por ejemplo, para no saturar, solo si hace falta
    }

    //Este es el html del web component
    //El tamaño del svg se ajusta al 100% del div que lo encierra, hace falta que le padre sea de tipo block, el tamaño , etc... podría ir variable, claro
    //Lo divido en dos (quito el </svg> final) para que el toSVG quede más modular
    templateHeader() {
        return (
            `<svg id = 'svg-view' xmlns="http://www.w3.org/2000/svg" version="1.2" xmlns:xlink="http://www.w3.org/1999/xlink" >
          <defs>  
            <marker id="markerArrow" markerWidth="5" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <path d="M0,0 l5,2.5 L0,5 z" style="fill: #6495ed; stroke:none" />
            </marker>
          </defs>
      `
        );
    }
    templateFooter() {
        return `
      </svg>
      <transition-dialog id='transition-input' ></transition-dialog>
      <selection-dialog id='selection-input' ></selection-dialog>
      <state-dialog id='state-input'></state-dialog>
      <div id='data-in-out' class='hide'>
        <div id='data-input'><input type='text' id='input-text'></div>
        <div id='data-output'></div>
        <div id='config-data-output'></div>
      </div>
      `;
    }
    style() {
            return (`
      <style>
        :host { /*este es el estilo del div que contiene todo*/
          display: block;
          background-color: transparent; 
          font-family: italic bold arial, sans-serif;
          min-width: 50px;
          min-height: 50px;
          display:block;
          width: 100%;
          height: 100%;
        }
        svg {
          background-color: #white;
          display:block;
          min-width: 100px;
          min-height: 100px;
          width: 100%;
          height: 90%;
        }
        svg.drag {
          cursor: grab;
        }
        svg.delete {
          cursor: not-allowed;
        }
        svg.insert {
          cursor: cell;
        }
        .zoom{
          fill: none;
          stroke-width:1;
            stroke:#880000;
        }  
        path{
          stroke-width:1;
          stroke:#aa0000;
          fill: transparent;
          vector-effect:non-scaling-stroke;
        }
        path:hover{
            stroke-width:3;
        }
        .state.selected{
          fill: green;
        }
        .state.selected-end{
          fill: blue;
        }
        .state{
          fill: #E0E0E0;
        }
        .state-circle:hover{
          fill: white;
          stroke: #000099;
          stroke-width: 8;
        }
        .state-circle{
          stroke: black;
          stroke-width: 3;
          vector-effect:non-scaling-stroke;
        }
        .state-terminal{
          fill: transparent;
          stroke: black;
          stroke-width: 2;
          vector-effect:non-scaling-stroke;
        }
        .state-initial{
          fill: #E0E0E0;
          stroke: black;
          stroke-width: 2;
          vector-effect:non-scaling-stroke;
        }
        .state-text{
          /*font-size: 6px;*/
          fill: black;
          text-anchor: middle; /* align center */
          dominant-baseline: middle; /* vertical alignment fix */
        }
        .transition.selected{
          stroke: red;
          stroke-width : 4;
        }
        .transition{
          stroke: black;
          stroke-width : 2;
          marker-start:url(#markerCircle);
          marker-end: url(#markerArrow);
        }
        .transition-text{
          text-anchor: middle;
          stroke: none;
          fill: black;
          font-family:courier;
          font-size:12px;
        }
        .hide {
            visibility:hidden;
        }

        #data-in-out{
          width:100%;
          heigth: 90%; 
          display: flex;
          justify-content: space-between;         
        }
        #data-input{
          width:49%;
          background-color: #505050;
        }
        #data-input:focus{
          background-color: yellow;
        }
        #data-input > input{
          width:100%;
          border-width:0px;
          background-color: Lavender;
        }
        #data-output{
          width:25%;
          background-color: Beige;
        }
        #config-data-output{
          width:25%;
          background-color: Beige;
        }

      </style>
      `);
        }
        //El componente editor es la aplicación propiamente dicha y la que controla las acciones de los demás componentes
        //Así que se centraliza aquí la inicialización de las partes que componen la aplicación
        //Aquí se llama cuando se comectan los custom elements, se supone, o sea, donde se deberían crear los event handlers y tal
    connectedCallback() {
            this.dom.innerHTML = this.style() + this.templateHeader() + this.templateFooter();
            this.svg = this.dom.querySelector('svg');

            this.svgHandler = new FgSvgHandler(this.svg);
            //unidades arbitrarias, podría venir de leer el dibujo, las inicializo a pixels
            this.svgHandler.setExtents(0, 0, this.svg.clientWidth, this.svg.clientHeight);
            //busca los gestores de botones y los inicializa. Se pdoría hacer try-catch en vez de log
            //Y sería más elegante que los nombres se pasen como atributos
            this.fileButtons = document.querySelector('#fileButtons');
            this.zoomButtons = document.querySelector('#zoomButtons');
            this.editButtons = document.querySelector('#editButtons');
            this.undoButtons = document.querySelector('#undoButtons');
            this.modeButtons = document.querySelector('#modeButtons');
            //Inicializamos los botones y le decimos al componente a dónde debe dirigir los eventos
            this.fileButtons.setButtons(this, fileButtonsData);
            this.zoomButtons.setButtons(this, zoomButtonsData);
            //Preparamos las funciones que deben atender a los eventos. Lo hago en modo funcional porque el switch queda un poco largo si no...
            //pero a elegir.
            //las de edición necesitan pinchar, así que el mensaje estart pone un modo, es un radio button, solo uno
            this.editButtons.setButtons(this, editButtonsData);
            this.undoButtons.setButtons(this, undoButtonsData);
            this.modeButtons.setButtons(this, modeButtonsData);

            //Apunto a los diálogos y les digo a quién deben echar los eventos (aquí) para que sean autónomos más o menos
            //Lo hago mediante un atributo, podría ponerse en el HTML incluso
            this.stateDialog = this.dom.querySelector('#state-input');
            this.stateDialog.setAttribute('parent', this.id);
            this.transitionDialog = this.dom.querySelector('#transition-input');
            this.transitionDialog.setAttribute('parent', this.id);
            this.selectionDialog = this.dom.querySelector('#selection-input');
            this.selectionDialog.setAttribute('parent', this.id);

            //La entrada-salida la pongo permanente en sitio fijo en vez de modal para que se actualice continuamente

            this.inputText = this.dom.querySelector('#input-text');
            this.outputText = this.dom.querySelector('#data-output');
            this.configOutputText = this.dom.querySelector('#config-data-output');


            //aplicación de estado, solo hace click...
            this.drawApp = new DrawStateChart(this.svgHandler, this);
            this.selectionDialog.open();
            //console.log(this.chart);

            //PRUEBAS
            /*this.alphabet = 'ab';
            const machineType = 'NFA';
            if (this.alphabet.search(/[^a-z]/) !== -1)
                console.log('el alfabeto pasado no es válido, no debería pasar');
            this.inputText.pattern = new RegExp('[' + this.alphabet + ']');
            this.chart = new StateChart(machineType, this.alphabet, 'q');
            this.chart.fromJSON(`
      [{"name":"q0","x":236.85,"y":440.85,"isInitialState":true,"isTerminalState":false,"comments":"","transitions":[{"name":"b","id":"q0_q1"}]},{"name":"q1","x":366.92,"y":226.74,"isInitialState":false,"isTerminalState":false,"comments":"","transitions":[{"name":"b","id":"q1_q2"},{"name":"a","id":"q1_q3"}]},{"name":"q2","x":716.11,"y":238.74,"isInitialState":false,"isTerminalState":false,"comments":"","transitions":[{"name":"b","id":"q2_q2"},{"name":"a","id":"q2_q4"}]},{"name":"q3","x":546.02,"y":452.86,"isInitialState":false,"isTerminalState":false,"comments":"","transitions":[{"name":"ϵ","id":"q3_q6"},{"name":"a","id":"q3_q5"}]},{"name":"q4","x":726.12,"y":445.86,"isInitialState":false,"isTerminalState":true,"comments":"","transitions":[]},{"name":"q5","x":671.09,"y":594.94,"isInitialState":false,"isTerminalState":true,"comments":"","transitions":[]},{"name":"q6","x":603.05,"y":315.79,"isInitialState":false,"isTerminalState":false,"comments":"","transitions":[{"name":"b","id":"q6_q4"}]}]
      `);
            this.history = [];
            this.redo = [];*/
            //fin pruebas
            //Estos serían eventos para dibujar líneas y estados y tal
            ['edit', 'draw', 'state-editor', 'zoom', 'dialog', 'mode', 'file'].forEach(ev => this.addEventListener(ev, this, false));
            //Del dialogo, hasta decidir cómo pasarle al diálogo el destino, así funciona
            //document.addEventListener('dialog', this, false);
            //El gestor de ratón llama aquí cuando ha hecho zoom, y manda el evento al svg, así que hay que escuchar allí
            this.svg.addEventListener('zoom_end', this, false);
            this._redraw();
        }
        //Aquí recibiríamos eventos de otras aplicaciones, por ejemplo de botones de home, etc...
    zoom_end() {
        this._redraw(); //al terminar una operación como pane, zoom, etc... se manda este evento
    }
    zoom(command, data) {
            console.log(command, data);
            switch (command) {
                case 'set_zoom_mode': //restauramos modo zoom
                    this.svgHandler.app(this.svgHandler.application);
                    break
                default:
                    this.svgHandler.view(command);
                    break;
            }
        }
        //separo las acciones en dos switch sucesivos por sencillez.
        //Un switch hace la acción y el otro mira si redibuja o toca la historia
    edit(command, data) {
        switch (command) {
            //Las que ponen modo de edición con ratón, vienen de un botón 
            case 'start_insert_state':
            case 'start_insert_transition':
            case 'start_drag':
            case 'start_delete_mode':
            case 'start_edit_node':
                this.svg.classList.remove(...this.editButtons.buttons.map(b => b.class)); //quito la clase del svg que dice lo que estoy haceindo (para el cursor o fondo...)
                this.svg.classList.add(this.editButtons.buttons[data.pressed].class || ''); //gestión de radiobutton para el cursor
                this.drawApp.init(command); //Esto se podría tal vez mandar directamente al componente
                break;
                //Aquí los mensajes que provienen de las acciones de dibujo (insertar, drag, editar, borrar)
            case 'new_state': //cuando le dé al click debería venir aquí con la posición puesta
                this.chart.insertState(data.pos.x, data.pos.y); //no le paso terminal, inicial ni comentarios
                break;
                //Las rutinas de dibujar NO saben lo que conectan, devuelven nodos de svg a los que habíamos puesto ids
                //Aquí sí sabemos qué info lleva porque se la ponemos nosotros en la rutina draw
            case 'new_transition': //esto crea la raya y la entrada de datos
                let trId = this.chart.insertTransition(data.from.id, data.to.id)
                    //Aquí podríamos chequear si hubo problema en la creación. 
                    //Lanzo automáticamente el diálogo de editar la transición,
                this.transitionDialog.open(this.chart.getTransition(trId).toSave(), this.chart.sigmaExtended);
                break;
            case 'delete_state': //NO puede haber más de una conexión de un estado a otro o a sí mismo
                this.chart.deleteState(data.stateId);
                break;
            case 'delete_transition':
                this.chart.deleteTransition(data.transitionId);
                break;
            case 'undo':
                {
                    //tanto al crear uno nuevo como al cargar, el history siempre va a estar vacío.
                    if (this.history.length !== 0)
                        this.redo.push(this.history.pop());
                    if (this.history.length !== 0) {
                        this.chart.fromJSON(this.history[this.history.length - 1]);
                        this._redraw();
                    } else { //si el history está vacío
                        this.chart.init();
                        this._redraw();
                    }
                }
                break;
            case 'redo':
                {
                    if (this.redo.length !== 0) {
                        let states = this.redo.pop();
                        this.chart.fromJSON(states);
                        this.history.push(states)
                        this._redraw();
                    }
                }
                break;
            case 'edit_state': //aquí viene si, en modo edit, pincha en estado, sacamos un dialogo, pongo los mismos nombres en el objeto de ida y vuelta,
                this.stateDialog.open(data.state.toSave());
                break;
            case 'edit_transition': //aquí viene si, en modo edit, pincha en conexión
                this.transitionDialog.open(data.transition.toSave(), this.chart.sigmaExtended);
                break;
            default:
                break;
        }
        //Miro si debo guardar en la historia, en ve de andar con flags todo el rato
        //Y lo mismo redibujar, que coincide casi siempre pero no siempre
        switch (command) { //tratamiento de undo-redo
            case 'new_state':
            case 'new_transition':
            case 'state_moved_end':
            case 'delete_state':
            case 'delete_transition':
                this._saveStateChart();
                this._redraw();
                break;
            case 'state_moved':
                this._redraw(); //este redibuja pero no guarda por donde pasa.
                break;
            default:
                break; //no se guarda
        }
    }
    dialog(command, datos) {
            //se redibuja en ambos casos, al final
            //pero si la acción no era OK no guardamos estado ni hacemos nada, por optimizar
            //Por otra parte, los estados NO pueden cambiar de nombre ni las transiciones de estados, eso se hace gráficamente
            //Pasamos la info al chart que es quién conoce la estructura
            let err = '';
            let data = datos.data;
            if (data.button !== 'OK') //Hay dos acciones, esc y OK, ESC no hace nada, aunque debe devolver todo lo que había
                return;
            switch (command) {
                case 'state_data': //El estado se crea aparte, cuando llega aquí es que ya existía
                    err = this.chart.modifyStateData(data.name, data);
                    if (err !== '') {
                        let stData = this.chart.getState(data.name).toSave();
                        stData.text = err;
                        this.stateDialog.open(stData);
                    }
                    break;
                case 'transition_data': //meto testeo de validez. Si no es válido vuelvo a sacar el diálogo
                    let trId = data.id;
                    err = this.chart.modifyTransitionData(trId, data);
                    if (err !== '') {
                        let trData = this.chart.getTransition(trId).toSave();
                        trData.text = err;
                        this.transitionDialog.open(trData, this.chart.sigmaExtended);
                    }
                    break;
                case 'input_data': //Aquí se podría chequear la entrada antes de cambiar de botones
                    if (!this.chart.isValidInputStream(data.input)) {
                        alert('algún carácter no pertenece al alfabeto ');
                        return;
                    }
                    this.input = data.input;
                    this.editButtons.setButtons(this, testButtonsData);
                    this.addEventListener('test', this, false);
                    //Si llamamos al click directamente no manda el evento sino que ejecuta la acción y luego el redraw se machaca el reset
                    setTimeout(() => this.editButtons.click('reset'), 100);
                    break
                case 'selection_data':
                    console.log({ data });
                    if (data.states.length == 0) {
                        //console.log("holi");
                        //si no tengo estados ni transic, me da igual cargar desde un archivo vacio que hacer un chart nuevo
                        this.chart = new StateChart(data.type, data.sigma, 'q');
                        //this.inputDialog.setAttribute('alphabet', data.sigma);
                        this.history = [];
                        this.redo = [];
                        this._redraw();
                        //rellenamos el span de info
                        let machineInfo = document.querySelector('#machine-info');
                        machineInfo.innerHTML = `
                        <span id="saved-name" value="${data.filename}"> Nombre: ${data.filename} </span>
                        <span id="type" value = "${data.type}" > Tipo: ${data.type} </span>
                        <span id="sigma" value = "${data.sigma}"> &#931: ${data.sigma} </span>`;
                    }
                    //console.log("pintar lo que me han mandao");
                    this.chart = new StateChart(data.type, data.sigma, 'q');
                    //this.inputDialog.setAttribute('alphabet', data.sigma);
                    this.history = [];
                    this.redo = [];
                    //console.log(data.states);
                    this.chart.fromModal(data.states);
                    this._redraw();
                    let machineInfo = document.querySelector('#machine-info');
                    machineInfo.innerHTML = `
                    <span id="saved-name" value="${data.filename}"> Nombre: ${data.filename}</span>
                    <span id="type" value = "${data.type}" > Tipo: ${data.type} </span>
                    <span id="sigma" value = "${data.sigma}"> &#931: ${data.sigma} </span>`;
                    break;
                default:
                    break;
            }
            //this._saveStateChart();
            this._redraw();
        }
        //Es un poco lío mandar y recibir los mensajes entre ejecución y pintada, que está aquí...
        //Incluyo lo de ejecución para simplificar y quitar líneas
    mode(command, datos) {
        let err = ''; //texto de error o ''
        switch (command) {
            case 'test':
                //console.log (this.chart.toJSON()); //para pruebas, cutypaste
                //PONER el div de input output de la vista!
                let configPlacement = this.dom.querySelector('#data-in-out');
                // let undoButt = document.querySelector('#undoButtons');
                //console.log(configPlacement);
                configPlacement.classList.remove('hide');
                // undoButt.classList.add('hide');
                this.inputText.focus();
                this.inputText.addEventListener('keydown', (evt) => {
                    if (evt.key === 'Enter')
                        this.dispatchEvent(new CustomEvent('dialog', { detail: { action: 'input_data', data: { button: 'OK', input: this.inputText.value } } }))
                });
                break;
            case 'draw':
                //Aquí se puede quitar el foco al input o deshabilitarlo o borrarlo o...
                let configPlace = this.dom.querySelector('#data-in-out');
                //let undoButts = document.querySelector('#undoButtons');

                configPlace.classList.add('hide');
                //undoButts.classList.remove('hide');
                this.outputText.innerHTML = '';
                this.editButtons.setButtons(this, editButtonsData);
                this.history = [];
                this.chart.states.forEach(st => st.node.classList.remove('selected'));
                break;
            default:
                break;
        }
    }
    file(command, datos, data) {
        let err = ''; //texto de error o ''
        switch (command) {
            case 'json':
                //console.log(this.chart.toDownload()); //abrir el modal del sistema para guardarlo
                let filename = document.querySelector('#saved-name').getAttribute('value');
                //descarga automática de un fichero json
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.chart.toDownload());
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", filename.concat(".json"));
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                break;
            case 'screenshot':
                console.log("screenshot");
                let svg = this.shadowRoot.getElementById('svg-view');
                let pngname = document.querySelector('#saved-name').getAttribute('value');
                let width = svg.viewBox.baseVal.width;
                let height = svg.viewBox.baseVal.height;
                let clonedSvgElement = svg.cloneNode(true);
                let outerHTML = clonedSvgElement.outerHTML,
                    blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
                let URL = window.URL || window.webkitURL || window;
                let blobURL = URL.createObjectURL(blob);
                let image = new Image();
                image.onload = () => {
                    let canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    console.log({ width, height });
                    let context = canvas.getContext('2d');
                    // draw image in canvas starting left-0 , top - 0  
                    context.drawImage(image, 0, 0, width, height);
                    let png = canvas.toDataURL(); // default png
                    var download = function(href, name) {
                        var link = document.createElement('a');
                        link.download = name;
                        link.style.opacity = "0";
                        link.href = href;
                        link.click();
                        link.remove();
                    }
                    download(png, pngname.concat(".png"));
                };
                image.src = blobURL;
                console.log(image.src);


                break;
            default:
                break;
            case 'xml':

                    //console.log(this.chart.toDownload()); //abrir el modal del sistema para guardarlo
                    /*let filename2 = document.querySelector('#saved-name').getAttribute('value');
                    let type = document.querySelector('#type').getAttribute('value');
                    let sigma = document.querySelector('#sigma').getAttribute('value');
                    console.log("el contenido es " + filename2 + type + sigma);
                    console.log("------------------------------");
                    let states = [];
                    let states2 = [filename2, type, sigma];
                    var InputJSON1 = JSON.stringify([{ "type": type, "sigma": sigma, "filename": filename2, "states": states }]);
                    console.log([{ "type": type, "sigma": sigma, "filename": filename2, "states": states }]);                 
                    //var InputJSON = '{"body":{"entry": [{ "fullURL" : "abcd","Resource": " 1234"},{ "fullURL" : "efgh","Resource": "5678"}]}}';
                    //var InputJSON1 = filename2.valueOf();
                    InputJSON1.replaceAll("'", '"');
                    console.log("is " + InputJSON1 );
                    //var InputJSON2 = JSON.parse(InputJSON1);
                    // Now execute the 'OBJtoXML' function
                    var output = OBJtoXML(InputJSON1);
                    console.log("uiiii " + output );*/

                    //--------------------------------------------

                    let filename2 = document.querySelector('#saved-name').getAttribute('value');
                    let s = filename2.toString();
                    var InputJSON = '{"body":{"entry": [{ "fullURL" : "abcd","Resource": " 1234"},{ "fullURL" : "efgh","Resource": "5678"}]}}';
                    console.log("is " + InputJSON );
                    var InputJSON2 = JSON.parse(InputJSON);
                    // Now execute the 'OBJtoXML' function
                    var output = OBJtoXML(InputJSON2);
                    console.log("1 es " + output);
                    output.toString();
                    //----------------------------------------------
                        var dataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(this.chart.toDownload());
                        var downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        console.log("llega");
                        downloadAnchorNode.setAttribute("download", output.concat(".xml"));
                        console.log("llega2");
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                        break;        
        }
    }
    _showOutput() {
        this.outputText.innerHTML = `<span style="color:green">${this.input.substring(0,this.index)}</span>
      <span style="color:red">${this.input.substring(this.index,this.index+1)}</span>
      <span style="color:grey">${this.input.substring(this.index+1)}</span>`;
        //console.log(this.activeStates[0].name);
        this.configOutputText.innerHTML = `<span>${this.activeStates[0].name}</span>`;
    }
    test(command, datos) {
        switch (command) {
            case 'reset':
                this.activeStates = this.chart.executionReset();
                console.log(this.activeStates);
                //console.log(this.chart);
                //console.log(this.activeStates.length);
                if (this.activeStates.length !== 1) {
                    alert('Debe haber un estado inicial y solo uno');
                    return;
                }
                this.index = 0;
                this.pause = true;
                //Info para deshacer:
                this.history = []; //aprovechamos el mismo array de edición 
                this._showStates(this.activeStates, []);
                break;
            case 'back':
                if (this.history.length > 0) {
                    let state = this.history.pop();
                    this.activeStates = state.states;
                    this.index = state.index;
                    this._showStates(this.activeStates, undefined);
                }
                break;
            case 'stop':
                clearInterval(this.timer);
                this.pause = true;
                break;
            case 'step':
                this.pause = true; //el resto es igual
            case 'runstep':
                clearInterval(this.timer);
                this.history.push({ states: this.activeStates, index: this.index });
                this.activeTransitions = this.chart._getActiveTransitions(this.activeStates, this.input.charAt(this.index));
                if (this.activeTransitions.length !== 0) {
                    this.activeStates = this.chart.executionStep(this.activeTransitions);
                    this.index++
                        setTimeout(() => this._showStates(undefined, this.activeTransitions), 100);
                    setTimeout(() => this._showStates(this.activeStates, []), 500);
                    //Nueva especificación, actualizar la ventanilla de salida
                    //si modo run, nos autolanzamos un evento dentro de un tiempo...si no es terminal, claro
                    if (this.activeStates.some(st => st.isTerminalState)) {
                        //Puede llegar a un terminal sin agotar la entrada
                        setTimeout(() => alert(`entrada correcta ${this.index===this.input.length?'':'pero no agotada'}, alcanzado estado terminal`), 550);
                    } else if (this.index >= this.input.length) { //caracteres acabados y no he llegado a un terminal
                        setTimeout(() => alert(`entrada correcta pero agotada sin haber alcanzado estado terminal`), 550);
                    } else if (!this.pause)
                        this.timer = setTimeout(() => this.dispatchEvent(new CustomEvent('test', { detail: { action: 'runstep' } })), 1000);
                } else { //Si Entrada incorrecta o estado final, volvemos a sacar el diálogo
                    alert(`entrada incorrecta: ${this.input.charAt(this.index)}`)
                }
                break;
            case 'run':
                this.pause = false;
                this.timer = setTimeout(() => this.dispatchEvent(new CustomEvent('test', { detail: { action: 'runstep' } })), 1000);
                //this.timer = setTimeout(()=>this._runstep(),1000);  //Un rollo la sintaxis del timeout
                break;
            default:
                break;
        }
    }
    handleEvent(evt) {
            let appName = evt.type; //zoom_end, zoom, edit y dialog de momento
            if (evt.detail)
                this[appName](evt.detail.action, evt.detail);
            else this[appName]();
        }
        //Se supone que aquí se llama al desconectar la página, pero en laa aplicaciones no parece que pase
    disconnectedCallback() {
        //hay que quitar los listeners... pero no se dejan?!
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            default: break;
        }
    }
}

//esto ta fuera de la clase
customElements.define('state-editor', StateEditor);

//------------
function OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += OBJtoXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
  }