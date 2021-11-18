'use strict';
/*Crea el menú con Web Components y ShadowDOM*/

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n          @import url('https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap');\n            input[type=button] {\n                font-family: 'Maven Pro', sans-serif;\n            }\n        </style>\n        <div>\n                <input type=\"button\" id=\"af\" value=\"Aut\xF3mata Finito\" action='af' app=\"menu\"/>\n                <input type=\"button\" id=\"ap\" value=\"Aut\xF3mata con Pila\" action='ap' app=\"menu\"/>       \n                <input type=\"button\" id=\"mt\" value=\"M\xE1quina de Turing (MT)\" action='mt' app=\"menu\"/>\n                <input type=\"button\" id=\"er\" value=\"Expresi\xF3n Regular (ER)\" action='er' app=\"menu\"/>\n                <input type=\"button\" id=\"gr\" value=\"Gram\xE1tica Regular (GR)\" action='gr' app=\"menu\"/>\n                <input type=\"button\" id=\"gic\" value=\"Gram\xE1tica Independiente de Contexto (GIC)\" action='gic' app=\"menu\"/>\n                <input type=\"button\" id=\"gg\" value=\"Gram\xE1tica General (GG)\" action='gg' app=\"menu\"/> \n                <input type=\"button\" id=\"out\" value=\"Salir\" action='out' app=\"menu\"/> \n        </div>\n            "]);

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

var ActivitiesDialogs =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(ActivitiesDialogs, _HTMLElement);

  function ActivitiesDialogs() {
    var _this;

    _classCallCheck(this, ActivitiesDialogs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActivitiesDialogs).call(this));
    _this.dom = _this.attachShadow({
      mode: 'open'
    });
    return _this;
  }

  _createClass(ActivitiesDialogs, [{
    key: "menu",
    value: function menu() {
      return String.raw(_templateObject());
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      switch (event.target.action) {
        case 'er':
          console.log("switch ok");
          break;
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      this.app = document.querySelector('#' + this.appName);
      this.target = document.querySelector('#' + this.targetName);
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
          el.addEventListener("click", _this2.handleEvent);
        }
      });
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

  return ActivitiesDialogs;
}(_wrapNativeSuper(HTMLElement));

customElements.define('activities-dialogs', ActivitiesDialogs);