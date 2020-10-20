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
    indent:number = 1;
    

    constructor(estadoInicial: Estado, estadoObjectivo: Estado, acciones: Function[], estadoValido: Function){
        this.estadoInicial = estadoInicial;
        this.estadoObjectivo = estadoObjectivo;
        this.acciones = acciones;
        this.estadoValido = estadoValido;

        let nodoRaiz = new Nodo(estadoInicial);
        let nodoObjetivo = new Nodo(estadoObjectivo);
        
        let res: Nodo = this.bpi(nodoRaiz, nodoObjetivo);
        // console.log('========RESULTADO====');
        // console.log(res);
        // console.log('ENCONTRADOS');
        // console.log(this.estadosEncontrados.length);
        this.estadosEncontrados.forEach((e) =>{
            console.log(e.toString());
        });

        this.imprimirArbol(nodoRaiz);
        //console.log(nodoRaiz.hijos[0].hijos[0].hijos[0].estado.toString());
        
    }



    bpi(raiz: Nodo, objetivo: Nodo){

        let profundidad: number = 0;

        while(true) {
            this.estadosEncontrados = [];
            let resultado: Nodo = this.bpl(raiz, objetivo, profundidad)
            if(resultado){
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
            nodo.hijos = [];
            estadosSiguientes.forEach((es) => { 
                nodo.anadirHijo(es);
            });


            for (let i = 0; i < nodo.hijos.length; i++){
                let hijo = nodo.hijos[i];
                let resultado: Nodo =  this.bpl(hijo, objetivo, profundidad-1);
                if(resultado){
                    return resultado;
                }
            }
        } else {
            return null;
        }

    }

    stringArbol(nodo: Nodo, espacios:number = 0){
        let str ='\n';
        nodo.hijos.forEach((hijo) =>{
            str += `${" ".repeat(espacios)}${hijo.estado.toString()}${this.stringArbol(hijo, espacios+2)}`
        });
        return str;
    }
    
    imprimirArbol(nodoRaiz: Nodo){
        console.log(`\n${nodoRaiz.estado.toString()}${this.stringArbol(nodoRaiz, 2)}`)
    }



}

export default Problema;