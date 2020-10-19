/**
 * PROBLEMA: Mover los misioneros y canibales de u
 * 
 */

import Estado from "./Estado";
import Arbol from "./Arbol/Arbol";
import Nodo from './Arbol/Nodo';

class Problema {

    estadoInicial: Estado;
    estadoObjectivo: Estado;
    acciones: Function[];
    
    estadoValido: Function;

    estadosEncontrados: Estado[] = [];

    conjuntoDeEsatados: Arbol;
    

    constructor(estadoInicial: Estado, estadoObjectivo: Estado, acciones: Function[], estadoValido: Function){
        this.estadoInicial = estadoInicial;
        this.estadoObjectivo = estadoObjectivo;
        this.acciones = acciones;
        this.estadoValido = estadoValido;

        let nodoRaiz = new Nodo(estadoInicial);
        
        this.obtnerConjuntoDeEstados(nodoRaiz);

        
    }

    obtnerConjuntoDeEstados(actual: Nodo) {
        this.estadosEncontrados.push(actual.estado);
        let estadosSiguientes = [];
        this.acciones.forEach((accion) =>{
            estadosSiguientes.push(accion(actual.estado));
        });
        estadosSiguientes = estadosSiguientes.filter((e) => e != null);
        estadosSiguientes = estadosSiguientes.filter((e) => !this.estadosEncontrados.some(en => en.igual(e)));
        estadosSiguientes = estadosSiguientes.filter((e) => this.estadoValido(e));
        estadosSiguientes.forEach((es) => actual.anadirHijo(es));
        actual.hijos.forEach((h) => this.obtnerConjuntoDeEstados(h));
    }


}

export default Problema;