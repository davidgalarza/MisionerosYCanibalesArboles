import Estado from "./Estado";
import { PosicionBote } from "./utiliddades";
import Problema from "./Problema";

let estadoInicial = new Estado(
    [], 
    ['M', 'M', 'M', 'C', 'C', 'C'], 
    PosicionBote.DERECHA); // Estado del nodo raiz

let estadoObjetivo = new Estado(
        ['C', 'C','C',  'M', 'M', 'M'], 
        [], 
        PosicionBote.IZQUIERDA); // Estado al que se quiere llegar


// let estadoInicial = new Estado(
//             [], 
//             ['M', 'M', 'M', 'C', 'C', 'C'], 
//             PosicionBote.DERECHA); // Estado del nodo raiz
        
// let estadoObjetivo = new Estado(
//                 ['C', 'C','C'], 
//                 ['M', 'M', 'M'], 
//                 PosicionBote.IZQUIERDA); // Estado al que se quiere llegar


function transportar2Misioneros(estadoOrigen: Estado): Estado{

    // Crear copias de las orillas
    let nuevaOrillaIzquierda = estadoOrigen.orillaIzquierda.map((e) => e);
    let nuevaOrillaDerecha = estadoOrigen.orillaDerecha.map((e) => e);
    let nuevaPosBote;

    if(estadoOrigen.posicionBote == PosicionBote.DERECHA){
        // Verificar si se puede ejecutar el movimiento
        if(estadoOrigen.orillaDerecha.filter(e => e == 'M').length < 2) return null;
        nuevaOrillaDerecha = quitarNElementos(nuevaOrillaDerecha, 'M', 2);
        nuevaOrillaIzquierda.push('M');
        nuevaOrillaIzquierda.push('M');
        nuevaPosBote = PosicionBote.IZQUIERDA; // Cambiar de orilla
    } else {
        if(estadoOrigen.orillaIzquierda.filter(e => e == 'M').length < 2) return null;
        nuevaOrillaIzquierda = quitarNElementos(nuevaOrillaIzquierda, 'M', 2);
        nuevaOrillaDerecha.push('M');
        nuevaOrillaDerecha.push('M');
        nuevaPosBote = PosicionBote.DERECHA;
    }

    // Retorna el estado modificado
    return new Estado(nuevaOrillaIzquierda, nuevaOrillaDerecha, nuevaPosBote);
}

function transportar2Canibales(estadoOrigen: Estado): Estado{

    let nuevaOrillaIzquierda = estadoOrigen.orillaIzquierda.map((e) => e);
    let nuevaOrillaDerecha = estadoOrigen.orillaDerecha.map((e) => e);
    let nuevaPosBote;
    if(estadoOrigen.posicionBote == PosicionBote.DERECHA){
        if(estadoOrigen.orillaDerecha.filter(e => e == 'C').length < 2) return null;
        nuevaOrillaDerecha = quitarNElementos(nuevaOrillaDerecha, 'C', 2);
        nuevaOrillaIzquierda.push('C');
        nuevaOrillaIzquierda.push('C');
        nuevaPosBote = PosicionBote.IZQUIERDA;
    } else {
        if(estadoOrigen.orillaIzquierda.filter(e => e == 'C').length < 2) return null;
        nuevaOrillaIzquierda = quitarNElementos(nuevaOrillaIzquierda, 'C', 2);
        nuevaOrillaDerecha.push('C');
        nuevaOrillaDerecha.push('C');
        nuevaPosBote = PosicionBote.DERECHA;
    }

    return new Estado(nuevaOrillaIzquierda, nuevaOrillaDerecha, nuevaPosBote);

}


function transportarMisioneroYCanibal(estadoOrigen: Estado): Estado{
    let nuevaOrillaIzquierda = estadoOrigen.orillaIzquierda.map((e) => e);
    let nuevaOrillaDerecha = estadoOrigen.orillaDerecha.map((e) => e);
    let nuevaPosBote;
    if(estadoOrigen.posicionBote == PosicionBote.DERECHA){
        if(!nuevaOrillaDerecha.some((e) => e== 'M') || !nuevaOrillaDerecha.some((e) => e== 'C')) return null;
        nuevaOrillaDerecha = quitarNElementos(nuevaOrillaDerecha, 'M', 1);
        nuevaOrillaDerecha = quitarNElementos(nuevaOrillaDerecha, 'C', 1);
        nuevaOrillaIzquierda.push('M');
        nuevaOrillaIzquierda.push('C');
        nuevaPosBote = PosicionBote.IZQUIERDA;
    } else {
        if(!nuevaOrillaIzquierda.some((e) => e== 'M') || !nuevaOrillaIzquierda.some((e) => e== 'C')) return null;
        nuevaOrillaIzquierda = quitarNElementos(nuevaOrillaIzquierda, 'M', 1);
        nuevaOrillaIzquierda = quitarNElementos(nuevaOrillaIzquierda, 'C', 1);
        nuevaOrillaDerecha.push('M');
        nuevaOrillaDerecha.push('C');
        nuevaPosBote = PosicionBote.DERECHA;
    }

    return new Estado(nuevaOrillaIzquierda, nuevaOrillaDerecha, nuevaPosBote);
}

function transportarMisionero(estadoOrigen: Estado): Estado{
    let nuevaOrillaIzquierda = estadoOrigen.orillaIzquierda.map((e) => e);
    let nuevaOrillaDerecha = estadoOrigen.orillaDerecha.map((e) => e);
    let nuevaPosBote;
    if(estadoOrigen.posicionBote == PosicionBote.DERECHA){
        if(!nuevaOrillaDerecha.some((e) => e == 'M')) return null;
        nuevaOrillaDerecha = quitarNElementos(nuevaOrillaDerecha, 'M', 1);
        nuevaOrillaIzquierda.push('M');
        nuevaPosBote = PosicionBote.IZQUIERDA;
    } else {
        if(!nuevaOrillaIzquierda.some((e) => e == 'M')) return null;
        nuevaOrillaIzquierda = quitarNElementos(nuevaOrillaIzquierda, 'M', 1);
        nuevaOrillaDerecha.push('M');
        nuevaPosBote = PosicionBote.DERECHA;
    }

    return new Estado(nuevaOrillaIzquierda, nuevaOrillaDerecha, nuevaPosBote);
}

function transportarCanibal(estadoOrigen: Estado): Estado{
    let nuevaOrillaIzquierda = estadoOrigen.orillaIzquierda.map((e) => e);
    let nuevaOrillaDerecha = estadoOrigen.orillaDerecha.map((e) => e);
    let nuevaPosBote;
    if(estadoOrigen.posicionBote == PosicionBote.DERECHA){
        if(!nuevaOrillaDerecha.some((e) => e == 'C')) return null;
        nuevaOrillaDerecha = quitarNElementos(nuevaOrillaDerecha, 'C', 1);
        nuevaOrillaIzquierda.push('C');
        nuevaPosBote = PosicionBote.IZQUIERDA;
    } else {
        if(!nuevaOrillaIzquierda.some((e) => e == 'C')) return null;
        nuevaOrillaIzquierda = quitarNElementos(nuevaOrillaIzquierda, 'C', 1);
        nuevaOrillaDerecha.push('C');
        nuevaPosBote = PosicionBote.DERECHA;
    }

    return new Estado(nuevaOrillaIzquierda, nuevaOrillaDerecha, nuevaPosBote);
}





// Acciones a ejecutar por nodo
let acciones = [
    transportar2Misioneros, 
    transportar2Canibales,
    transportarMisioneroYCanibal,
    transportarMisionero,
    transportarCanibal
]

// Quita N elementos de la lista pasada
function quitarNElementos(lista:String[], elemento: String, nElementos: number): String[]{
    let quitados: number = 0;
    
    return lista.filter(el => {
        
        if(el != elemento) return true;
        else {
            quitados++;
            return quitados > nElementos
        }
    });
}


// Crear un problema con el estado inicial, el estado objetivo y las acciones que modifican el estado
let problema = new Problema(estadoInicial, estadoObjetivo, acciones);
