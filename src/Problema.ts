/**
 * PROBLEMA: Mover los misioneros y canibales de u
 * 
 */

import Estado from "./Estado";
import Nodo from './Arbol/Nodo';
import console from "console";

var fs = require('fs');

class Problema {

    estadoInicial: Estado; // Estado del nodo raiz
    estadoObjectivo: Estado; // Estado del nodo objetivo
    acciones: Function[]; // Acciones que modifican los estados
    
    movimientos: String[] = []; // Acciones a ejecutar para llegar al estado objetivo
    estadosEncontrados: Estado[] = []; // Historial de nodos que se encntraron


    

    constructor(estadoInicial: Estado, estadoObjectivo: Estado, acciones: Function[]){
        this.estadoInicial = estadoInicial;
        this.estadoObjectivo = estadoObjectivo;
        this.acciones = acciones;

        let nodoRaiz = new Nodo(estadoInicial); // Crear nodo raiz 
        let nodoObjetivo = new Nodo(estadoObjectivo); // Crear nodo objetivo
        
        let res: Nodo = this.bpi(nodoRaiz, nodoObjetivo); // Busqueda en profundidad iterativa
       

        for (let i = 1; i < this.estadosEncontrados.length; i++) {
            const estadoNuevo = this.estadosEncontrados[i];
            const estadoAnterior = this.estadosEncontrados[i-1];
            this.movimientos.push(estadoAnterior.cambioParaLlegar(estadoNuevo));
        }

        console.log('===== ARBOL =====');
        this.imprimirArbol(nodoRaiz);

        console.log('===== ESTADOS =====');

        this.estadosEncontrados.forEach((estado) =>{
            console.log(estado.toString());
        })


        this.crearArchivo(nodoRaiz);


        
    }


    // Busqueda en profundidad iterativa
    bpi(raiz: Nodo, objetivo: Nodo){

        let profundidad: number = 0;

        while(true) {
            this.estadosEncontrados = [];
            let resultado: Nodo = this.bpl(raiz, objetivo, profundidad)
            if(resultado){
                return resultado;
            }
            profundidad++; // Aumentar profundidad maxima mientras no encuentre el resultado
        }

    }

    // Busqueda profundidad limitada
    bpl(nodo: Nodo, objetivo: Nodo, profundidad: number): Nodo{
        this.estadosEncontrados.push(nodo.estado); // anadir al historial de estados
        if(profundidad == 0 && nodo.estado.igual(objetivo.estado)){
            return nodo; // Retorna cuando llega al objetivo
        } else if(profundidad > 0) {
            // Cuando debe bajar aun mas
            let estadosSiguientes: Estado[] = [];
            this.acciones.forEach((accion) =>{
                // Ejecutar las accines sobre el nodo
                estadosSiguientes.push(accion(nodo.estado));
            });

            // Quitar las acciones que no se pueden ejecutar
            estadosSiguientes = estadosSiguientes.filter((e) => e != null);


            // Anadir al nodo actual los hijos
            nodo.hijos = [];
            estadosSiguientes.forEach((es) => { 
                nodo.anadirHijo(es);
            });

            // Volver a buscar en los hijos
            for (let i = 0; i < nodo.hijos.length; i++){
                let hijo = nodo.hijos[i];
                // true si ya esta en el historial
                let estadoEncontrado: boolean = this.estadosEncontrados.some(en => en.igual(hijo.estado));

                if(hijo.estado.esValido && !estadoEncontrado){
                    // Si sigue vivo y no se a visitado el nodo buscar de nuevo
                    let resultado: Nodo =  this.bpl(hijo, objetivo, profundidad-1);
                    if(resultado){
                        return resultado;
                    }
                } else if(estadoEncontrado){
                    // Si ya esta en el historial marcar como duplicado
                    hijo.estado.duplicado = true;
                }
            }
        } else {
            // No se encontro nada en la busqueda
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


    // 

    htmlArbol(nodo: Nodo, espacios:number = 0){
        let str ='\n';
        nodo.hijos.forEach((hijo) =>{
            let esCamino = this.estadosEncontrados.some(en => en.igual(hijo.estado)) && hijo.hijos.length > 0;
            let esSolucion = this.estadoObjectivo.igual(hijo.estado);
            let muerte = !hijo.estado.esValido;
            str += `<li><span class="caret ${esCamino ? 'nodo_camino' : ''} ${esSolucion ? 'nodo_solucion' : ''} ${muerte ? 'nodo_muerte' : ''}">${hijo.estado.toString()}${esSolucion ? ' 🎊' : ''} ${muerte ? '⚰️☠️' : ''}</span><ul class="nested">${this.htmlArbol(hijo, espacios+2)}</ul></li>`
        });
        return str;
    }
    
    html(nodoRaiz: Nodo){
        return (`<ul id="myUL"><span class="caret nodo_camino">${nodoRaiz.estado.toString()}</span><ul class="nested">${this.htmlArbol(nodoRaiz, 2)}</ul></ul>`)
    }


    crearArchivo(nodo: Nodo){
        let contenidoHTML = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        <link rel="stylesheet" href="style.css">
        </head>
        <body>
        <div class="centrar">
        <h2>Solucion</h2>
        <div class="caja">
          <span class="desc">${this.estadoInicial.toString()}</span>
          <br />
          <span class="titulo">Estado Inicial</span>
        </div>
        <div class="caja">
          <span class="desc">${this.estadoObjectivo.toString()}</span>
          <br />
          <span class="titulo">Estado Objetivo</span>
        </div>
        <div class="caja">
          <span class="desc">${this.estadosEncontrados.length}</span>
          <br />
          <span class="titulo">Numero de estados</span>
        </div>
      </div>

      <h3>Conjuntos de estados</h3>
      <div class="tags">
        <span class="nodo_camino">- Siguiente paso</span>
        <span class="nodo_muerte">- Muerte</span>
        <span>- Repetido</span>
        <span class="nodo_solucion">- Objetivo</span>
      </div>
        ${this.html(nodo)}

        <h3>Secuencia de estados</h3>

        <ul>
            ${this.estadosEncontrados.reduce((m, c) => m+`<li>${c.toString()}</li>`, '')}
        </ul>

        <h3>Pasos</h3>

        <ul>
            ${this.movimientos.reduce((m, c) => c+`<li>${m}</li>`, '')}
        </ul>
        
            <script >
                var toggler = document.getElementsByClassName("caret");
        var i;
        
        for (i = 0; i < toggler.length; i++) {
          toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
          });
        }
            </script>
        </body>
        </html>`;

        fs.writeFile('./src/index.html',contenidoHTML,() => {
            console.log('CREADO')
        });
        

    }



}

export default Problema;