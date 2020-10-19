import Estado from "../Estado";

class Nodo {
    estado: Estado;
    hijos: Nodo[];

    constructor(contenido: Estado){
        this.estado = contenido;
        this.hijos = [];
    }

    anadirHijo(contenido: Estado){
        this.hijos.push(new Nodo(contenido));
    }

}

export default Nodo;