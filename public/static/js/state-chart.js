"use strict";
//Nomenclatura estandarizada
// estados = q0,q1....
// sigma = alfabeto
// tipo de máquina, DFA, NFA
// Las NFA admiten transiciones del tipo a,b,c además de epsilon
// La transición t desde el estado 1 al estado 2 es UNICA (aunque puede admitir a,b,c como entradas)
// es decir, dados los estados q0 y q1 el identificador q0_q1 es único, así que se puede usar como id
// de una transición y obtener los estados origen y destino
// Los nombres de los estados son por supuesto únicos
//
import StateElement from "./state-element.js";
import TransitionElement from "./transition-element.js";
export default class StateChart {
  constructor(type = "AFD", sigma = "ab", stack = "mp", stateNaming = "q") {
    this.type = type;
    this.sigma = sigma;
    this.stack = stack;
    this.stackExtended =
      this.type === "APD" || this.type === "APN"
        ? this.stack + "Z" + "\u03F5"
        : this.stack + "R" + "L" + "\u25A1";
    this.sigmaExtended =
      this.type === "AFD" ? this.sigma : this.sigma + "\u03F5";
    this.defaultName = stateNaming; //No se cheque demasiado , es q o qs
    //esto virtualiza isValid y next. Genera sendas funciones ligadas a transiciones que pueden llamarse
    switch (this.type) {
      default:
      case "AFD":
        this.isValidTransitionName = (name) =>
          name.length === 1 && this.sigma.indexOf(name) !== -1;
        this.isValidTransitionName2 = (name) => true;
        this.siblings = () => {
          return [];
        }; //no hay epsilon
        break;
      case "AFND": //Voy a aceptar la sintaxis a,b,c  para abreviar, si se quiere, se limita a lo anterior
        //pero el epsilon es incompatible con otras cosas, no tiene sentido salvo que venga solo
        this.isValidTransitionName = (name) => {
          if (name.length === 0) return false;
          if (name.length === 1 && this.sigmaExtended.indexOf(name) !== -1)
            return true; //1 carácter admite epsilon
          return name.split(",").every((s) => this.sigma.indexOf(s) !== -1); //aquí tiene que ser un caracter normal
        };
        this.isValidTransitionName2 = (name) => true;
        this.siblings = (states) => {
          //busca los enlazados mediante epsilon
          let trs = [];
          states.forEach((st) =>
            trs.push(...st.transitions.filter((tr) => tr.accepts("\u03F5")))
          );
          return trs.map((tr) => tr.to);
        };
        break;
      case "APN": //todo Automata con pila No-Determinista
        this.isValidTransitionName = (name) => {
          if (name.length === 0) return false;
          if (name.length === 1 && this.sigmaExtended.indexOf(name) !== -1)
            return true; //1 carácter admite epsilon
          return name.split(",").every((s) => this.sigma.indexOf(s) !== -1); //aquí tiene que ser un caracter normal
        };
        this.isValidTransitionName2 = (name2) => {
          if (name2.length === 0) return false;
          if (name2.length === 1 && this.stackExtended.indexOf(name2) !== -1)
            return true; //1 carácter admite epsilon
          return name2.split(",").every((s) => this.stack.indexOf(s) !== -1); //aquí tiene que ser un caracter normal
        };
        this.siblings = (states) => {
          //busca los enlazados mediante epsilon
          let trs = [];
          states.forEach((st) =>
            trs.push(...st.transitions.filter((tr) => tr.accepts("\u03F5")))
          );
          return trs.map((tr) => tr.to);
        };
        break;

      /*  case "APD": //todo Automata con pila Determinista
        this.isValidTransitionName = (name) =>
          name.length === 1 && this.sigma.indexOf(name) !== -1;
        this.isValidTransitionName2 = (name2) =>
          name2.length === 1 && this.stack.indexOf(name) !== -1;

        this.siblings = () => {
          return [];
        };
        break; */

      case "MTR": //todo Maquinas de turing Reconocedoras, siempre son deterministas
        this.isValidTransitionName = (name) =>
          name.length === 1 && this.sigma.indexOf(name) !== -1;
        this.isValidTransitionName2 = (name2) =>
          name2.length === 1 && this.stackExtended.indexOf(name) !== -1;

        this.siblings = () => {
          return [];
        };
        break;
      case "MTC": //todo Maquinas de Turing Calculadoras, siempre son deterministas
        this.isValidTransitionName = (name) => {
          if (name.length === 0) return false;
          if (name.length === 1 && this.sigmaExtended.indexOf(name) !== -1)
            return true; //1 carácter admite epsilon
          return name.split(",").every((s) => this.sigma.indexOf(s) !== -1); //aquí tiene que ser un caracter normal
        };
        this.isValidTransitionName2 = (name2) => {
          if (name2.length === 0) return false;
          if (name2.length === 1 && this.stackExtended.indexOf(name2) !== -1)
            return true; //1 carácter admite epsilon
          return name2.split(",").every((s) => this.stack.indexOf(s) !== -1); //aquí tiene que ser un caracter normal
        };
        this.siblings = (states) => {
          //busca los enlazados mediante epsilon
          let trs = [];
          states.forEach((st) =>
            trs.push(...st.transitions.filter((tr) => tr.accepts("\u03F5")))
          );
          return trs.map((tr) => tr.to);
        };
        break;
    }

    this.init();
  }

  getType() {
    //Para recuperar el tipo de automata que es el que hemos creado
    return this.type;
  }

  toDownload() {
    //el objeto puede tener cosas que no se salvan, por eso creamos otros con lo que hay que salvar
    let states = [];
    this.states.forEach((st) => states.push(st.toSave()));
    console.log(JSON.stringify(states));
    if (this.type === 'AFD' || 'AFND') {
      return JSON.stringify([
        { type: this.type, sigma: this.sigma, states: states },
      ]);    }
    else {
      return JSON.stringify([
        { type: this.type, sigma: this.sigma, stack: this.stack, states: states },
      ]);
    }

    //return (JSON.stringify(states));
  }
  toDownload2() {
    //el objeto puede tener cosas que no se salvan, por eso creamos otros con lo que hay que salvar
    let states = [];
    this.states.forEach((st) => states.push(st.toSave()));
    var dat;
    if (this.type === 'AFD' || 'AFND') {
      dat = { type: this.type, sigma: this.sigma , states: states };
    }
    else {
      dat = { type: this.type, sigma: this.sigma, stack: this.stack , states: states };

    }

    if (this.type != 'AFD' || 'AFND') {
      let mydata = this.fix(dat);
      dat = mydata;
    }

    return this.OBJtoXML2(dat);
    //return (JSON.stringify(states));
  }

  fix(datos) {
    let d = [{ type: this.type, sigma: this.sigma, stack: this.stack , states: datos.states}]
    return d;
  }

  toJSON() {
    //el objeto puede tener cosas que no se salvan, por eso creamos otros con lo que hay que salvar
    let states = [];
    this.states.forEach((st) => states.push(st.toSave()));
    return JSON.stringify(states);
  }
  fromJSON(data) {
    let states = JSON.parse(data);
    this.init(states);
  }
  fileToJSON(dataObject) {
    var data = dataObject.data;
    let newChart = JSON.parse(data);
    this.initDiagram(newChart);
  }
  fromModal(states) {
    this.init(states);
  }
  init(states = []) {
    this.states = [];
    //Primero creo los estados, sus transiciones se quedan vacías
    states.forEach((st) => {
      this.states.push(
        new StateElement(
          st.name,
          st.x,
          st.y,
          st.isTerminalState,
          st.isInitialState,
          st.comments
        )
      );
    });
    if (this.states.length === 0) {
      this.stateIndex = 0;
      this.transitionIndex = 0;
      this.isTotal = false;
    } else {
      let numbers = this.states.map((st) => parseInt(st.name.substring(1))); //quito la q y convierto a número
      this.stateIndex = Math.max(...numbers) + 1;
      this.transitionIndex = Math.max(...numbers) + 1;
    }

    //Ahora que están creados, les añado las transiciones
    states.forEach((st) => {
      let from_st = this.states.find((el) => el.name === st.name); //states es un objeto, necesito la clase que está en this.
      if (st.transitions === undefined) {
        return;
      } else {
        st.transitions.forEach((tr) => {
          let to_st = this.states.find((el) => el.name == tr.id.split("_")[1]); //to state, viene codificado qa_qb

          let transitionNode = new TransitionElement(
            tr.id,
            from_st,
            to_st,
            tr.name,
            tr.name2,
            tr.name3,
            this.type
          ); // Aqui hay que averiguar cosas
          if (!transitionNode.error) {
            tr.node = transitionNode;
            from_st.transitions.push(transitionNode);
          } else
            console.log(
              "estado no encontrado en la conexion " +
                st.name +
                " to " +
                tr.id.split("_")[1]
            ); //TODO mejorar si se quiere
        });
      }
    });
    // this._redraw();
  }

    obtainStates(){
        let states = [];
        this.states.forEach(st => states.push(st.toSave()));
        //console.log(JSON.stringify(states));
        return JSON.stringify([{"states": states }]);
        
    }

   
    toJSON() { //el objeto puede tener cosas que no se salvan, por eso creamos otros con lo que hay que salvar
        let states = [];
        this.states.forEach(st => states.push(st.toSave()));
        return (JSON.stringify(states));
    }
    fromJSON(data) {
        let states = JSON.parse(data);
        this.init(states);
    }
    fileToJSON(dataObject) {
        var data = dataObject.data;
        let newChart = JSON.parse(data);
        this.initDiagram(newChart);
    }
    fromModal(states) {
        this.init(states);
    }
    init(states = []) {
      this.states = [];
      //Primero creo los estados, sus transiciones se quedan vacías
      states.forEach((st) => {
        this.states.push(
          new StateElement(
            st.name,
            st.x,
            st.y,
            st.isTerminalState,
            st.isInitialState,
            st.comments
          )
        );
      });
      if (this.states.length === 0){
        this.stateIndex = 0;
        this.transitionIndex = 0;
        this.isTotal = false;
  
      } 
      else {
        let numbers = this.states.map((st) => parseInt(st.name.substring(1))); //quito la q y convierto a número
        this.stateIndex = Math.max(...numbers) + 1;
        this.transitionIndex = Math.max(...numbers) + 1;
      }
      //Ahora que están creados, les añado las transiciones
      states.forEach((st) => {
        let from_st = this.states.find((el) => el.name === st.name); //states es un objeto, necesito la clase que está en this.
        if (st.transitions === undefined) {
          return;
        } else {
          st.transitions.forEach((tr) => {
            let to_st = this.states.find((el) => el.name == tr.id.split("_")[1]); //to state, viene codificado qa_qb
  
            let transitionNode = new TransitionElement(
              tr.id,
              from_st,
              to_st,
              tr.name,
              tr.name2,
              tr.name3,
              this.type
            ); // Aqui hay que averiguar cosas
            if (!transitionNode.error) {
              tr.node = transitionNode;
              from_st.transitions.push(transitionNode);
            } else
              console.log(
                "estado no encontrado en la conexion " +
                  st.name +
                  " to " +
                  tr.id.split("_")[1]
              ); //TODO mejorar si se quiere
          });
        }
      });
      // this._redraw();
    }
  isValidInputStream(input) {
    return input.search(`[^${this.sigma}]`) === -1; //Si encuentro caracteres fuera del conjunto search devuelve !== -1,
  }
  //Puesto que los estados tienen nombre UNICO y SOLO HAY 1 transición de un origen a un destino, la combinación qx_qy es UNICA
  //Y así codifico los estados de origen y destino de forma sencilla
  //Este conocimiento se debe tener básicamente aquí. Las transiciones, una vez creadas, se pueden gestionar solo con el id

  insertTransition(idFrom, idTo) {
    let from = this.states.find((el) => el.name === idFrom);
    let to = this.states.find((el) => el.name === idTo);
    let trId = idFrom + "_" + idTo;
    trId = trId + "_" + this.transitionIndex++;
    from.transitions.push(
      new TransitionElement(
        trId,
        from,
        to,
        "",
        "",
        "",
        this.type,
        true,
        this.transitionIndex
      )
    ); //le decimos el tipo de transición permitida (DFA, NFA)
    return trId;
  }
  insertTransition2(idFrom, idTo, letra) {
    let from = this.states.find((el) => el.name === idFrom);
    let to = this.states.find((el) => el.name === idTo);
    let trId = idFrom + "_" + idTo + "_" + this.transitionIndex++;
    from.transitions.push(
      new TransitionElement(
        trId,
        from,
        to,
        letra,
        "",
        "",
        this.type,
        true,
        this.transitionIndex
      )
    );
    return trId;
  }
  modifyTransitionData(id, data) {
    let st = id.split("_");
    let tr = this.getTransition(id);

    if (!this.isValidTransitionName(data.name))
      return `error: la transición ${data.name} no es válida para máquinas de tipo ${this.type} y alfabeto ${this.sigma}, tampoco se puede dejare vacio`;
    tr.setName(data.name);

    if (data.type != "AFD" || data.type != "AFND") {
      if (!this.isValidTransitionName2(data.name2)) {
        return `error: la transición ${data.name2} no es válida para máquinas de tipo ${this.type} y alfabeto de la pila ${this.stack}, tampoco se puede dejare vacio`;
      } else {
        tr.setName2(data.name2);
      }

      if (!this.isValidTransitionName2(data.name3)) {
        return `error: la transición ${data.name3} no es válida para máquinas de tipo ${this.type} y alfabeto de la pila ${this.stack}, tampoco se puede dejare vacio`;
      } else {
        tr.setName3(data.name3);
      }
    }

    return "";
  }
  getTransition(trId) {
    let st = trId.split("_");
    let from = this.states.find((el) => el.name === st[0]);
    //return from.transitions.find((tr) => tr.to.name === st[1]);
    return from.transitions.find(
      (tr) => tr.to.name === st[1] && tr.id.split("_")[2] === st[2]
    );
  }
  deleteTransition(id) {
    let states = id.split("_");
    let from = this.states.find((el) => el.name === states[0]);
    from.transitions.splice(
      from.transitions.findIndex((t) => t === states[1]),
      1
    );
  }
  IsTerminal() {
    console.log(this.terminal);
    return this.terminal;
  }
  //me pasan solo coordenadas, en principio
  insertState(x, y, terminal = false, initial = false, comments = "") {
    if (this.stateIndex === 0) {
      this.states.push(
        new StateElement(
          this.defaultName + this.stateIndex++,
          x,
          y,
          terminal,
          true,
          comments
        )
      );
    } else {
      this.states.push(
        new StateElement(
          this.defaultName + this.stateIndex++,
          x,
          y,
          terminal,
          initial,
          comments
        )
      );
    }
  }

  addFinalState() {
    this.states.push(
      new StateElement(
        "Trap Final",
        717.9859619140625,
        564.9700317382812,
        true,
        false,
        ""
      )
    );
  }

  totalAutomaton() {
    if (this.isTotal == false) {
      this.states.push(
        new StateElement(
          "Trap",
          717.9859619140625,
          564.9700317382812,
          false,
          false,
          ""
        )
      );
      this.isTotal = true;
    }
  }
  //voy a mirar tanbién si es inicial
  modifyStateData(stId, data) {
    let state = this.states.find((el) => el.name === stId);
    if (data.isInitialState) {
      if (this.states.some((el) => el.isInitialState))
        return `error: solo puede haber un estado inicial`;
    }
    ["comments", "isTerminalState", "isInitialState"].forEach(
      (field) => (state[field] = data[field])
    );
    return "";
  }
  getState(stName) {
    return this.states.find((st) => st.name === stName);
  }
  deleteState(q) {
    let deletedState = this.states.find((st) => st.name === q);
    let states = q.split('');
    if(deletedState.isInitialState == true){
      let number = parseInt(states[1]) +1;
      this.getState('q'+number).setIsInicial();
    }
    this.states.forEach(
      (st) => (st.transitions = st.transitions.filter((t) => t.to !== q))
    ); //solo las que no apuntaban
    this.states.splice(
      this.states.findIndex((st) => st.name === q),
      1
    );
  }

  clearAll(q) {
    this.states.forEach(
      (st) => (st.transitions = st.transitions.filter((t) => t.to !== q))
    ); //solo las que no apuntaban
    this.states.splice(
      this.states.findIndex((st) => st.name === q),
      1
    );
  }
  //Rutinas ligadas a la ejecución, activación de estados, etc...
  //Comprobación de que solo hay un estado inicial, por ejemplo y cosas así, debería avisar si es no determinista
  //esto lo podría hacer el editor el soloito....
  executionReset() {
    console.log("executionreset");
    console.log(this.states);
    //console.log(this.states);
    let initial = this.states.filter((st) => st.isInitialState); //Que debe ser único, claro
    //Puede el estado inicial emlazar con otro en una NFA con epsilon???
    console.log(this.siblings(initial));
    //console.log(this.siblings());
    // console.log(this.siblings(initial));
    /*if (this.siblings() === undefined) {
                //console.log("{por fin}");
                return initial;
            }*/
    return initial.concat(this.siblings(initial));
  }
  //Las rutinas de transición (delta) miran más de un carácter a la vez, así que valen para NFA,
  //Si es DFA hay que mirar, en el init, que las trnasiciones no sean epsilon y sean solo un carácter
  //Hemos quedado en que se mira un carácter a la vez.
  _getActiveTransitions(activeStates, input) {
    let trs = [];
    let ip = input.charAt(0);
    activeStates.forEach((st) => {
      trs.push(...st.transitions.filter((tr) => tr.accepts(ip)));
    });
    return trs;
  }
  executionStep(activeTransitions) {
    let direct = activeTransitions.map((tr) => tr.to); //estos estados pueden tener transiciones con epsilon
    return direct.concat(this.siblings(direct));
  }

  OBJtoXML2(obj) {
  console.log(obj);
    var xml = "";
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? "" : "<" + prop + ">";

      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += this.OBJtoXML2(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += this.OBJtoXML2(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }

      xml += obj[prop] instanceof Array ? "" : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
   

    return xml;
 
  }
  xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
  
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 4) {
      obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
  
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].length == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
  
          if (typeof obj[nodeName] === "object") {
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
    }
  
    return obj;
  }




}
