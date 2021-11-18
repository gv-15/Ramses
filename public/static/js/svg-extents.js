"use strict";

//módulo para almacenar los datos de tamaño y transformación de los zooms, etc...
//El motivo es que el acceso a las rutinas de lectura de estas cosas del navegador sincroniza los theads de script y render
//lo que hace que cada llamada consuma esperas muy importantes
export default class FgSvgExtents {
    setMatrix(m) {
        this.matrix = { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f };
    }
    getMatrix() {
        return this.matrix;
    }
    setExtents(e) {
        this.extents = { xi: e.xi, yi: e.yi, xf: e.xf, yf: e.yf };
    }
    getExtents() {
        return this.extents;
    }
    getScale() {
        return this.matrix.a;
    }
}