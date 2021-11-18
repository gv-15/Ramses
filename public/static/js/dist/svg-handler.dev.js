"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _svgTransformations = _interopRequireDefault(require("./svg-transformations.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//La función fundamental de esta clase es escuchar los eventos de ratón y transformar las coordenadas a las del SVG
var SvgHandler =
/*#__PURE__*/
function () {
  function SvgHandler(svg) {
    var _this = this;

    _classCallCheck(this, SvgHandler);

    if (svg) {
      this.svg = svg;
      this.svgExtents = new _svgTransformations["default"](); //para pixels

      this.initialPoint = this.svg.createSVGPoint();
      this.finalPoint = this.svg.createSVGPoint(); //para unidades usuario

      this.pi = this.svg.createSVGPoint(); //punto inicial

      this.pf = this.svg.createSVGPoint(); //punto final

      this.zoom = 1.0; //OJO viewbox

      var ws = {
        x: 0,
        y: 0,
        w: 300,
        h: 300
      };
      this.initialExtents = Object.assign({}, ws);
      this.actualExtents = Object.assign({}, ws);
      this.midPoint = {
        x: ws.x + ws.w / 2,
        y: ws.y + ws.h / 2
      };
      this.view('ZoomHome'); //tipos de eventos

      ["mousedown", "mousemove", "mouseup", "mouseleave", "dblclick", "contextmenu", "setOrigin", "wheel"].forEach(function (evt) {
        _this.svg.addEventListener(evt, _this, false);
      });
    }

    this.application = {
      //Incluir aqui los eventos de ratón
      leftClick: function leftClick(pi, evt) {
        if (_this.z) _this.svg.removeChild(_this.z);
      },
      leftDblclick: function leftDblclick(pi, evt) {},
      leftClickStart: function leftClickStart(point) {
        var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('class', 'zoom');
        _this.z = r;

        _this.z.setAttribute('x', point.x);

        _this.z.setAttribute('y', point.y);

        _this.z.setAttribute('width', 0);

        _this.z.setAttribute('height', 0);

        _this.svg.appendChild(_this.z);
      },
      leftClickMove: function leftClickMove(pi, pf) {
        if (_this.z) {
          _this.z.setAttribute('x', pi.x < pf.x ? pi.x : pf.x);

          _this.z.setAttribute('width', Math.abs(pf.x - pi.x));

          _this.z.setAttribute('y', pi.y < pf.y ? pi.y : pf.y);

          _this.z.setAttribute('height', Math.abs(pf.y - pi.y));

          _this.z.setAttribute('vector-effect', "non-scaling-stroke");
        }
      },
      leftClickUp: function leftClickUp(pi, pf) {
        var m = Object.assign({}, {
          x: (pi.x + pf.x) / 2,
          y: (pi.y + pf.y) / 2
        });
        var e = Object.assign({}, {
          w: Math.abs(pf.x - pi.x),
          h: Math.abs(pf.y - pi.y)
        });

        _this.view('ZoomInDrag', m, e);

        _this.svg.removeChild(_this.z);
      },
      leftClickLeave: function leftClickLeave(pi, pf) {
        _this.svg.removeChild(_this.z);
      },
      rightClick: function rightClick(pi, evt) {
        _this.svg.classList.remove("paneClickCursor");
      },
      rightClickStart: function rightClickStart(point) {
        _this.svg.classList.add("paneClickCursor");

        _this.originalViewBox = Object.assign({}, {
          x: _this.svg.viewBox.baseVal.x,
          y: _this.svg.viewBox.baseVal.y,
          w: _this.svg.viewBox.baseVal.width,
          h: _this.svg.viewBox.baseVal.height
        });
      },
      rightClickMove: function rightClickMove(pi, pf) {
        var dx = pf.x - pi.x;
        var dy = pf.y - pi.y;

        _this.svg.setAttribute('viewBox', _this.originalViewBox.x - dx + ' ' + (_this.originalViewBox.y - dy) + ' ' + _this.originalViewBox.w + ' ' + _this.originalViewBox.h);
      },
      rightClickUp: function rightClickUp(pi, pf) {
        _this.svg.classList.remove("paneClickCursor");

        var dx = pf.x - pi.x;
        var dy = pf.y - pi.y;

        _this.view('Pane', {
          x: dx,
          y: dy
        });
      },
      rightClickLeave: function rightClickLeave() {},
      wheelHandler: function wheelHandler(evt) {
        _this.view(evt.deltaY > 0 ? 'ZoomOut' : 'ZoomIn');
      }
    };
    this.setZoomMode();
  }

  _createClass(SvgHandler, [{
    key: "app",
    value: function app(application) {
      var _this2 = this;

      ['leftClick', 'leftDblclick', 'leftClickStart', 'leftClickMove', 'leftClickUp', 'leftClickLeave', 'rightClick', 'rightClickStart', 'rightClickMove', 'rightClickUp', 'rightClickLeave', 'wheelHandler'].forEach(function (event) {
        if (application[event]) {
          _this2[event] = application[event];
        }
      });
    }
  }, {
    key: "setOrigin",
    value: function setOrigin() {
      //https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
      this.ctm_inv = this.svg.getScreenCTM().inverse();
    }
  }, {
    key: "setExtents",
    value: function setExtents(x, y, w, h) {
      this.initialExtents = Object.assign({}, {
        x: x,
        y: y,
        w: w,
        h: h
      });
      this.view('ZoomHome');
    }
  }, {
    key: "getExtentsAndSetMatrix",
    value: function getExtentsAndSetMatrix() {
      var matrix = this.svg.getScreenCTM();
      this.ctm_inv = matrix.inverse();
      var p0 = this.svg.createSVGPoint(),
          p1 = this.svg.createSVGPoint(); // getBoundingClientRect() devuelve el tamaño de un elemento y su posición relativa 
      //respecto a la ventana de visualización (viewport)

      var r = this.svg.getBoundingClientRect();
      p0.x = r.left, p0.y = r.bottom, p1.x = r.right, p1.y = r.top;
      p0 = p0.matrixTransform(this.ctm_inv);
      p1 = p1.matrixTransform(this.ctm_inv);
      this.svgExtents.setMatrix(matrix);
      this.svgExtents.setExtents({
        xi: p0.x,
        yi: p0.y,
        xf: p1.x,
        yf: p1.y
      });
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(evt) {
      var handler = evt.type;

      if (typeof this[handler] === "function") {
        evt.preventDefault();
        return this[handler](evt);
      }
    }
  }, {
    key: "contextmenu",
    value: function contextmenu(evt) {
      evt.preventDefault();
    }
  }, {
    key: "dblclick",
    value: function dblclick(evt) {
      this.leftDblclick(this.pi, evt);
    }
  }, {
    key: "mousedown",
    value: function mousedown(evt) {
      Object.assign(this.initialPoint, {
        x: evt.clientX,
        y: evt.clientY
      });
      this.pi = this.initialPoint.matrixTransform(this.ctm_inv);

      if (evt.which === 1) {
        //click botón izquierdo
        this.leftClickStart(this.pi, evt);
      } else if (evt.which === 3) {
        //click botón derecho
        this.rightClickStart(this.pi, evt);
      }
    }
  }, {
    key: "mousemove",
    value: function mousemove(evt) {
      Object.assign(this.finalPoint, {
        x: evt.clientX,
        y: evt.clientY
      });
      this.pf = this.finalPoint.matrixTransform(this.ctm_inv);

      if (evt.which === 1) {
        // botón izquierdo
        this.leftClickMove(this.pi, this.pf);
      } else if (evt.which === 3) {
        // botón derecho
        this.rightClickMove(this.pi, this.pf);
      }

      var event = new CustomEvent("MouseChanged", {
        detail: this.pf
      });
      this.svg.dispatchEvent(event, true);
    }
  }, {
    key: "mouseup",
    value: function mouseup(evt) {
      Object.assign(this.finalPoint, {
        x: evt.clientX,
        y: evt.clientY
      });
      this.pf = this.finalPoint.matrixTransform(this.ctm_inv);
      var isShortStroke = Math.abs(this.finalPoint.x - this.initialPoint.x) < 25 && Math.abs(this.finalPoint.y - this.initialPoint.y) < 25;

      if (evt.which === 1) {
        //click botón izquierdo   
        if (isShortStroke) {
          this.leftClick(this.pi, evt); // es una manera de tener un click
        } else {
          //Aquí es un zoom o selección grande
          this.leftClickUp(this.pi, this.pf, evt);
        }
      } else if (evt.which === 3) {
        //click botón derecho
        if (isShortStroke) {
          this.rightClick(this.pi, evt);
        } else {
          this.rightClickUp(this.pi, this.pf);
        }
      }
    }
  }, {
    key: "mouseleave",
    value: function mouseleave(evt) {
      Object.assign(this.finalPoint, {
        x: evt.clientX,
        y: evt.clientY
      });
      this.pf = this.finalPoint.matrixTransform(this.ctm_inv);

      if (evt.which === 1) {
        //click botón izquierdo
        this.leftClickLeave(this.pi, this.pf);
      } else if (evt.which === 3) {
        //click botón derecho
        this.rightClickUp(this.pi, this.pf);
      }
    }
  }, {
    key: "wheel",
    value: function wheel(evt) {
      this.wheelHandler(evt);
    }
  }, {
    key: "takeScreenshot",
    value: function takeScreenshot() {
      var svgElement = document.querySelector('svg');
      var width = this.actualExtents.w;
      var height = this.actualExtents.h;
      var clonedSvgElement = svgElement.cloneNode(true);
      var outerHTML = clonedSvgElement.outerHTML,
          blob = new Blob([outerHTML], {
        type: 'image/svg+xml;charset=utf-8'
      });
      var URL = window.URL || window.webkitURL || window;
      var blobURL = URL.createObjectURL(blob);
      console.log(blobURL);
      var image = document.querySelector('#img-placer');
      var canvas = document.createElement('canvas');
      canvas.widht = width;
      canvas.height = height;
      console.log(width);
      console.log(height);
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, width, height);
      image.src = blobURL;
    }
  }, {
    key: "view",
    value: function view(cmd, m, e) {
      switch (cmd) {
        case 'Pane':
          //aquí me paso {dx,dy}
          this.midPoint.x -= m.x;
          this.midPoint.y -= m.y;
          break;

        case 'ZoomHome':
          this.zoom = 1.0;
          this.midPoint.x = this.initialExtents.x;
          this.midPoint.y = this.initialExtents.y;
          break;

        case 'ZoomIn':
          this.zoom = this.zoom * 0.9;
          break;

        case 'ZoomOut':
          this.zoom = this.zoom / 0.9;
          break;

        case 'ZoomAdjust':
          // (largo/2-diam, alto/2-diam, same, same)
          this.setExtents(80, -80, this.initialExtents.w, this.initialExtents.h);
          break;

        case 'Screenshot':
          this.takeScreenshot();
          break;
      }

      if (cmd !== "fit") {
        var mp = this.midPoint;
        var ex = Object.assign({}, this.initialExtents);
        ex.w *= this.zoom;
        ex.h *= this.zoom;
        this.svg.setAttribute('viewBox', mp.x - 0.5 * ex.w + '  ' + (mp.y - 0.5 * ex.h) + ' ' + ex.w + ' ' + ex.h);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        this.svg.setAttribute('transform', 'matrix(1 0 0 -1 0 0 )');
        this.getExtentsAndSetMatrix();
      }

      this.svg.dispatchEvent(new CustomEvent('zoom_end'));
    }
  }, {
    key: "setZoomMode",
    value: function setZoomMode() {
      this.app(this.application);
    }
  }]);

  return SvgHandler;
}();

exports["default"] = SvgHandler;