'use strict';

var _connectionElement = _interopRequireDefault(require("./connection-element.js"));

var _stateElement = _interopRequireDefault(require("./state-element.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n            .visualTools {\n                border-style: groove;\n            }\n            .editionTools {\n                border-style: groove;\n            }\n        </style>\n        <div>\n            <div class=\"editionTools\">\n                <input type=\"button\" id=\"draw-state\" value=\"Draw State\" action='draw-state' app=\"draw\"/>\n                <input type=\"button\" id=\"draw-conn\" value=\"Draw Connection\" action='draw-transition' app=\"draw\"/>       \n            </div>\n            <div class=\"visualTools\">\n                <input type=\"button\" id=\"zoom-minus\" value=\"Zoom -\" action='ZoomOut' app=\"zoom\"/>\n                <input type=\"button\" id=\"zoom-plus\" value=\"Zoom +\" action='ZoomIn' app=\"zoom\"/>\n                <input type=\"button\" id=\"zoom-adjust\" value=\"Zoom Adjust\" action='ZoomAdjust' app=\"zoom\"/>\n                <input type=\"button\" id=\"screenshot\" value=\"Screenshot\" action='Screenshot' app=\"zoom\"/> \n                <input type=\"file\"  id=\"json-input-file\" name=\"\" >\n                <input type=\"file\"  id=\"xml-input-file\" name=\"\" >\n                <input type=\"file\"  id=\"based-input-file\" name=\"\" >\n           </div>\n        </div>\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

var SVGEditor =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(SVGEditor, _HTMLElement);

  function SVGEditor() {
    var _this;

    _classCallCheck(this, SVGEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SVGEditor).call(this));
    _this.dom = _this.attachShadow({
      mode: 'open'
    });
    return _this;
  }

  _createClass(SVGEditor, [{
    key: "menu",
    value: function menu() {
      return String.raw(_templateObject());
    }
  }, {
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
      }); //de momento no he pintado conexiones en stored_states.json

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
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(evt) {
      this.initDiagram(evt.detail.value);
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this3 = this;

      this.app = document.querySelector('#' + this.appName);
      this.target = document.querySelector('#' + this.targetName); //Creación de los eventos del menú

      this.dom.innerHTML = this.menu();
      var ins = Array.from(this.dom.querySelectorAll('input'));
      ins.forEach(function (el) {
        return el.app = el.getAttribute('app');
      });
      ins.forEach(function (el) {
        return el.action = el.getAttribute('action');
      });
      ins.forEach(function (el) {
        if (el.type === 'button') {
          el.addEventListener('click', function (event) {
            return _this3.target.dispatchEvent(new CustomEvent(event.currentTarget.app, {
              detail: {
                action: event.currentTarget.action
              }
            }));
          });
        } else if (el.type === 'number') //de momento no hay
          el.addEventListener('change', function (event) {
            return _this3.target.dispatchEvent(new CustomEvent(event.currentTarget.app, {
              detail: {
                action: event.currentTarget.action,
                value: event.currentTarget.value
              }
            }));
          });
      }); //TO-DO: Hacer esto mediante un fetch, que es más corto

      this.dom.querySelector('#json-input-file').addEventListener('change', function (evt) {
        var file = evt.target.files[0];
        var filename = file.name.toLowerCase();

        if (!filename.endsWith('.json')) {
          alert('extensión de fichero no soportada');
          return;
        }

        var reader = new FileReader();

        reader.onprogress = function (evt) {
          return console.log(evt.loaded / evt.total);
        };

        reader.onabort = function () {
          return reader.abort();
        };

        reader.onerror = function (evt) {
          switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
              alert('Archivo no encontrado');
              break;

            case evt.target.error.NOT_READABLE_ERR:
              alert('No se puede leer el fichero');
              break;

            case evt.target.error.ABORT_ERR:
              break;

            default:
              alert('Ha ocurrido un error de lectura.');
          }
        };

        reader.onloadend = function (evt) {
          var stored = JSON.parse(evt.target.result);

          _this3.target.dispatchEvent(new CustomEvent(_this3.appName, {
            detail: {
              action: 'readStored',
              value: stored
            }
          }));
        };

        reader.readAsText(file);
      }); //Fin del código de la lectura de fichero
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {}
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldVal, newVal) {
      switch (name) {
        case 'app':
          this.appName = newVal;
          break;

        case 'target':
          this.targetName = newVal;
          break;

        default:
          break;
      }
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['app', 'target'];
    }
  }]);

  return SVGEditor;
}(_wrapNativeSuper(HTMLElement));

customElements.define('svg-editor', SVGEditor);