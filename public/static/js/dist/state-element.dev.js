'use strict';
/*Define la forma de los elementos básicos (nodos) que se utilizan en stored_states.json*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var shapes = {
  "default": {
    // id: [], //no lo estoy usando
    //name: [], //no lo estoy usando
    inputs: [{
      name: 'i1',
      x: 0,
      y: 25
    }],
    outputs: [{
      name: 'o1',
      x: 25,
      y: 25
    }]
  } //, hay que añadir la forma del estado inicial y final

};

var StateElement =
/*#__PURE__*/
function () {
  function StateElement() {
    var shape = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, StateElement);

    this.shape = shapes[shape] || shapes['default']; // por si acaso...en caso de pasarme alguna que no está definida

    this.name = name; //this.id = id; //no lo estoy usando

    this.node = undefined; //hasta que nose pinta no se pone 

    this.x = x;
    this.y = y;
    this.inputs = this.shape.inputs.map(function (el) {
      return {
        name: el.name,
        connections: []
      };
    });
    this.outputs = this.shape.outputs.map(function (el) {
      return {
        name: el.name,
        connections: []
      };
    });
    this.h = 10 * Math.max(this.inputs.length, this.outputs.length);
    this.w = 20;
  }

  _createClass(StateElement, [{
    key: "_drawShape",
    value: function _drawShape(x, y) {
      var r = 2;
      return "<circle cx=\"".concat(x, "\" cy=\"").concat(y, "\" r=\"10\" stroke=\"black\" stroke-width=\"3\" fill=\"none\" />\n                    <text x=\"").concat(x, "\" y=\"").concat(y, "\" text-anchor=\"middle\" stroke=\"black\" stroke-width=\"1px\" dy=\".3em\">I</text>"); //El I hay que cambiarlo por el nº de estado, con un +1 cada vez que se pinta uno.

      /*
      ESTADO INICIAL CON TRIANGULITO  
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1">
      <polygon points="0,20 20,40 0,60" stroke="black" stroke-width="3" fill="none" />
      <circle cx="40" cy="40" r="20" stroke="black" stroke-width="3" fill="none" />
      <text x="40" y="40" text-anchor="middle" stroke="black" stroke-width="1px" dy=".3em">Qx</text>
      </svg>
      */
    }
  }, {
    key: "_drawInputs",
    value: function _drawInputs() {
      var out = '';
      var nins = this.inputs.length; //nins = número entradas

      if (nins > 0) {
        var r = 2;
        var ox = 2;
        var oy = this.h / nins;
        var dy = oy / 2;

        for (var i = 0; i < nins; i++, dy += oy) {
          this.inputs[i].p = {
            x: this.x + ox,
            y: this.y + dy
          };
          out += "<circle id=\"".concat(this.inputs[i].name, "\" cx=\"").concat(ox, "\" cy=\"").concat(dy, "\" r=").concat(r, " fgtype=\"st-input\" class=\"input-connector\" ></circle>");
        }
      }

      return out;
    }
  }, {
    key: "_drawOutputs",
    value: function _drawOutputs() {
      var out = '';
      var nouts = this.outputs.length; //nouts = número salidas

      if (nouts > 0) {
        var r = 2;
        var ox = 2;
        var oy = this.h / nouts;
        var dy = oy / 2;

        for (var i = 0; i < nouts; i++, dy += oy) {
          this.outputs[i].p = {
            x: this.x + this.w - ox,
            y: this.y + dy
          };
          out += "<circle id=\"".concat(this.outputs[i].name, "\" cx=\"").concat(this.w - ox, "\" cy=\"").concat(dy, "\" r=").concat(r, " fgtype=\"st-output\" class=\"input-connector\" ></circle>");
        }
      }

      return out;
    }
  }, {
    key: "translate",
    value: function translate(dx, dy) {
      this.x += dx;
      this.y += dy;
      this.inputs.forEach(function (i) {
        i.p.x += dx;
        i.p.y += dy;
      });
      this.outputs.forEach(function (o) {
        o.p.x += dx;
        o.p.y += dy;
      });
    }
  }, {
    key: "toSVG",
    value: function toSVG() {
      var out = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.2\" preserveAspectRatio=\"xMidYMid meet\" style=\" stroke-width:1px;\">\n        <g id=\"".concat(this.name, "\" transform='translate(").concat(this.x, ",").concat(this.y, ")'>\n        ").concat(this._drawShape(0, 0), " ").concat(this._drawInputs(), " ").concat(this._drawOutputs(), "\n        </g></svg>");
      var node = document.createElement('div');
      node.innerHTML = out;
      node = node.querySelector('g');
      this.node = node;
      return node;
    }
  }, {
    key: "redrawConnections",
    value: function redrawConnections() {
      this.outputs.forEach(function (o) {
        return o.connections.forEach(function (c) {
          return c.redraw();
        });
      });
      this.inputs.forEach(function (i) {
        return i.connections.forEach(function (c) {
          return c.redraw();
        });
      });
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var data = {
        shape: this.shape,
        name: this.name,
        nins: this.nins,
        nouts: this.nouts,
        x: this.x,
        y: this.y,
        inputs: this.inputs,
        outputs: this.outputs
      };
      return JSON.stringify(data);
    }
  }]);

  return StateElement;
}();

exports["default"] = StateElement;