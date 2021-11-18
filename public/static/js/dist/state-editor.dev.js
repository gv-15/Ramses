'use strict';

var _stateElement = _interopRequireDefault(require("./state-element.js"));

var _connectionElement = _interopRequireDefault(require("./connection-element.js"));

var _drawConnections = _interopRequireDefault(require("./draw-connections.js"));

var _svgHandler = _interopRequireDefault(require("./svg-handler.js"));

var _drawStates = _interopRequireDefault(require("./draw-states.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var StateEditor =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(StateEditor, _HTMLElement);

  function StateEditor() {
    var _this;

    _classCallCheck(this, StateEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StateEditor).call(this));
    _this.svgNS = "http://www.w3.org/2000/svg";
    _this.stateChartStyle = "\n      <style>\n        :host {\n          display: block;\n          background-color: transparent; \n          border: 1px solid red;\n          font-family: italic bold arial, sans-serif;\n          font-size: 60%;\n          min-width: 50px;\n          min-height: 50px;\n          display:block;\n          width: 100%;\n          height: 100%;\n        }\n        div{\n          width: 100%;\n          height: 100%;\n        }\n        path{\n          stroke-width:1;\n          stroke:#707070;\n          fill: transparent;\n          pointer-events:all;\n        }\n        path:hover{\n          stroke-width:2;\n        }\n        .state{\n          fill: yellow;\n          stroke: #009900;\n          stroke-width: 3;\n        }\n        .node-rect:hover{\n          fill: yellow;\n          stroke: #009900;\n          stroke-width: 3;\n        }\n        .node-rect{\n          fill: white;\n          stroke: #009900;\n          stroke-width: 2;\n        }\n        .out-connector{\n          fill: yellow;\n          stroke: #009900;\n          stroke-width: 1;\n        }\n        .out-connector:hover{\n          fill: red;\n        }\n        .input-connector{\n          fill: yellow;\n          stroke: #009900;\n          stroke-width: 1;\n        }\n        .input-connector:hover{\n          fill: blue;\n        }\n        .nominalTxt{\n          stroke: none;\n          fill: black;\n        }\n      </style>\n      ";
    _this.dom = _this.attachShadow({
      mode: 'open'
    });
    return _this;
  }

  _createClass(StateEditor, [{
    key: "initDiagram",
    value: function initDiagram(chart) {
      var _this2 = this;

      //chart tiene un array de estados y otro de conexiones.
      //Los estados tienen entradas y salidas, que tienen nombre
      //las conexiones van de un estado.salida a otro estado.entrada
      chart.states.forEach(function (st) {
        var state = new _stateElement["default"](st.shape, st.name, st.x, st.y);
        state.node = state.toSVG();

        _this2.svg.appendChild(state.node);

        _this2.states.push(state);
      });
      chart.connections.forEach(function (cx) {
        var from_st = _this2.states.find(function (el) {
          return el.name === cx.from.st;
        }); //from state 


        var to_st = _this2.states.find(function (el) {
          return el.name == cx.to.st;
        }); //to state


        if (from_st !== undefined && to_st !== undefined) {
          var from_co = from_st.outputs.find(function (o) {
            return o.name === cx.from.conn;
          });
          var to_co = to_st.inputs.find(function (i) {
            return i.name === cx.to.conn;
          });
          var connectionNode = new _connectionElement["default"]('', from_co, to_co);
          from_co.connections.push(connectionNode);
          to_co.connections.push(connectionNode);
        } else console.log('estado no encontrado en la conexion ' + cx.from.st + ' a ' + cx.to.st);
      });
      this.states.forEach(function (st) {
        st.outputs.forEach(function (o) {
          o.connections.forEach(function (c) {
            return _this2.svg.appendChild(c.node);
          });
        });
      });
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this.svg = document.querySelector('#' + this.svgName);
      this.svg.innerHTML = this.stateChartStyle;
      this.svgHandler = new _svgHandler["default"](this.svg);
      this.svgHandler.setExtents(0, 0, 200, 200);
      this.svg.addEventListener('zoom', this, false); //Aquí vienen los eventos con nombre zoom (de los botones por ejemplo)

      this.states = []; //Estos serían eventos para dibujar líneas y estados

      this.svg.addEventListener('draw', this, false);
      this.svg.addEventListener('state-editor', this, false);
    } //Aquí recibiríamos eventos de otras aplicaciones, por ejemplo de botones de home, etc...

  }, {
    key: "handleEvent",
    value: function handleEvent(evt) {
      var handler = evt.type;
      var command = evt.detail.action; //console.log(handler);
      //console.log(command);

      if (handler === 'zoom') {
        this.svgHandler.view(command);
      } else switch (command) {
        case 'draw-transition':
          //el tercer parámetro es a dónde debe enviar los mensajes (ej: linea dibujada)
          this.app = new _drawConnections["default"](this.svgHandler, this.states, this.svg);
          break;

        case 'draw-state':
          this.app = new _drawStates["default"](this.svgHandler, this.states, this.svg);
          break;

        case 'new_connection':
          this.svg.appendChild(evt.detail.node);
          break;

        case 'new_state':
          this.svg.appendChild(evt.detail.node);
          break;

        case 'readStored':
          this.initDiagram(evt.detail.value);
          break;

        default:
          break;
      }
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {}
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldVal, newVal) {
      switch (name) {
        case 'svg':
          this.svgName = newVal;

        default:
          break;
      }
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['svg'];
    }
  }]);

  return StateEditor;
}(_wrapNativeSuper(HTMLElement));

customElements.define('state-editor', StateEditor);