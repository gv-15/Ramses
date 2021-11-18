'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _stateElement = _interopRequireDefault(require("./state-element.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DrawState =
/*#__PURE__*/
function () {
  function DrawState(mouseHandler, elements, application) {
    _classCallCheck(this, DrawState);

    this.mouse = mouseHandler;
    this.elements = elements;
    this.app = application;

    this._init();
  }

  _createClass(DrawState, [{
    key: "_init",
    value: function _init() {
      var _this = this;

      this.rightClick = function (evt) {
        _this.drawNewState(evt.x, evt.y);
      };

      this.mouse.app(this);
    }
  }, {
    key: "drawNewState",
    value: function drawNewState(x, y) {
      var nuevo = new _stateElement["default"]('default', 'q0', x, y);
      this.elements.push(nuevo);
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", 10);
      rect.setAttribute("height", 10);
      rect.style.fill = "red";
      var svg = document.querySelector('svg');
      svg.appendChild(rect);
      /*
      let state = new StateElement(st.shape, st.name, st.x, st.y);
          state.node = state.toSVG();
          this.svg.appendChild(state.node);
          this.states.push(state);
          */
      //this.app.dispatchEvent(new CustomEvent('draw', { detail: { action: 'new_state', node: this.state.node } }));
    }
  }]);

  return DrawState;
}();

exports["default"] = DrawState;