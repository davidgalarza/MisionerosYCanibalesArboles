/**
 * PROBLEMA: Mover los misioneros y canibales de u
 * 
 */

import Estado from "./Estado";
import Arbol from "./Arbol/Arbol";
import Nodo from './Arbol/Nodo';
import console from "console";

var fs = require('fs');

class Problema {

    estadoInicial: Estado;
    estadoObjectivo: Estado;
    acciones: Function[];
    
    movimientos: String[] = [];
    estadosEncontrados: Estado[] = [];

    conjuntoDeEsatados: Arbol;

    

    constructor(estadoInicial: Estado, estadoObjectivo: Estado, acciones: Function[]){
        this.estadoInicial = estadoInicial;
        this.estadoObjectivo = estadoObjectivo;
        this.acciones = acciones;

        let nodoRaiz = new Nodo(estadoInicial);
        let nodoObjetivo = new Nodo(estadoObjectivo);
        
        let res: Nodo = this.bpi(nodoRaiz, nodoObjetivo);
        // console.log('========RESULTADO====');
        // console.log(res);
        // console.log('ENCONTRADOS');
        // console.log(this.estadosEncontrados.length);
        // this.estadosEncontrados.forEach((e) =>{
        //     console.log(e.toString());
        // });

        //this.imprimirArbol(nodoRaiz);
       

        for (let i = 1; i < this.estadosEncontrados.length; i++) {
            const estadoNuevo = this.estadosEncontrados[i];
            const estadoAnterior = this.estadosEncontrados[i-1];
            this.movimientos.push(estadoAnterior.cambioParaLlegar(estadoNuevo));
        }

        this.crearArchivo(nodoRaiz);


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

            nodo.hijos = [];
            estadosSiguientes.forEach((es) => { 
                nodo.anadirHijo(es);
            });

            for (let i = 0; i < nodo.hijos.length; i++){
                let hijo = nodo.hijos[i];
                let estadoEncontrado = this.estadosEncontrados.some(en => en.igual(hijo.estado));
                if(hijo.estado.esValido && !estadoEncontrado){
                    let resultado: Nodo =  this.bpl(hijo, objetivo, profundidad-1);
                    if(resultado){
                        return resultado;
                    }
                } else if(estadoEncontrado){
                    hijo.estado.duplicado = true;
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
        ${this.html(nodo)}

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