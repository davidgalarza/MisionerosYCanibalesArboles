/**
 * PROBLEMA: Mover los misioneros y canibales de u
 * 
 */

import Estado from "./Estado";
import Arbol from "./Arbol/Arbol";
import Nodo from './Arbol/Nodo';
import console from "console";

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
        let nodoObjetivo = new Nodo(estadoObjectivo);
        
        let res: Nodo = this.bpi(nodoRaiz, nodoObjetivo);
        console.log('========RESULTADO====');
        console.log(res);
        console.log('ENCONTRADOS');
        console.log(this.estadosEncontrados.length);
        this.estadosEncontrados.forEach((e) =>{
            console.log(e);
        });
        console.log(nodoRaiz);
        
    }



    bpi(raiz: Nodo, objetivo: Nodo){

        let profundidad: number = 0;

        while(true){
            this.estadosEncontrados = [];
            let resultado: Nodo = this.bpl(raiz, objetivo, profundidad)
            if(resultado){
                console.log(profundidad);
                return resultado;
            }
            profundidad++;
        }

    }


    bpl(nodo: Nodo, objetivo: Nodo, profundidad: number): Nodo{
        this.estadosEncontrados.push(nodo.estado);
        if(profundidad == 0 && nodo.estado.igual(objetivo.estado)){
            return nodo;
        } else if(profundidad > 0) {
            let estadosSiguientes: Estado[] = [];
            this.acciones.forEach((accion) =>{
                estadosSiguientes.push(accion(nodo.estado));
            });
            estadosSiguientes = estadosSiguientes.filter((e) => e != null);
            estadosSiguientes = estadosSiguientes.filter((e) => !this.estadosEncontrados.some(en => en.igual(e)));
            estadosSiguientes = estadosSiguientes.filter((e) => this.estadoValido(e));
            estadosSiguientes.forEach((es) => nodo.anadirHijo(es));
            for (let i = 0; i < estadosSiguientes.length; i++){
                let hijo = estadosSiguientes[i];
                let resultado: Nodo =  this.bpl(new Nodo(hijo), objetivo, profundidad-1);
                if(resultado){
                    
                    return resultado;
                }
            }
        } else {
            return null;
        }

    }

    // obtnerConjuntoDeEstados(actual: Nodo) {
    //     // this.estadosEncontrados.push(actual.estado);
    //     // let estadosSiguientes = [];
    //     // this.acciones.forEach((accion) =>{
    //     //     estadosSiguientes.push(accion(actual.estado));
    //     // });
    //     // estadosSiguientes = estadosSiguientes.filter((e) => e != null);
    //     // estadosSiguientes = estadosSiguientes.filter((e) => !this.estadosEncontrados.some(en => en.igual(e)));
    //     // estadosSiguientes = estadosSiguientes.filter((e) => this.estadoValido(e));
    //     // estadosSiguientes.forEach((es) => actual.anadirHijo(es));
    //     // actual.hijos.forEach((h) => this.obtnerConjuntoDeEstados(h));
    // }


}

export default Problema;