import { PosicionBote } from './utiliddades';

class Estado {

    orillaIzquierda: String[]; // Elementos orilla izquierda
    orillaDerecha: String[]; // Elementos orilla derecha
    posicionBote: PosicionBote;
    esValido:boolean; // vivo = true | muerto = false
    duplicado: boolean; // true si ya se encontro antes el estado

    
    // Crear un estado pasando condiciones
    constructor(orillaIzquierda: String[], orillaDerecha: String[], posicionBote: PosicionBote, duplicado: boolean = false){
        this.orillaIzquierda = orillaIzquierda;
        this.orillaDerecha = orillaDerecha;
        this.posicionBote = posicionBote;
        this.esValido = this.estadoValido(); 
        this.duplicado = duplicado; 
    }


    // Verfifica si continuan vivos misioneros
    estadoValido(): boolean {
        let numMiIz = this.orillaIzquierda.filter((e) => e == 'M').length;
        let numMiDe = this.orillaDerecha.filter((e) => e == 'M').length;
        let numCaIz = this.orillaIzquierda.filter((e) => e == 'C').length;
        let numCaDe = this.orillaDerecha.filter((e) => e == 'C').length;
        if(numMiIz == 0 )numMiIz = 5;
        if(numMiDe == 0 )numMiDe = 5;
        return numMiIz >= numCaIz && numMiDe >= numCaDe;
    }


    // Devuelve true si los estados son iguales
    igual(estado: Estado) : boolean {

        let numMiIz = this.orillaIzquierda.filter((e) => e == 'M').length;
        let numMiDe = this.orillaDerecha.filter((e) => e == 'M').length;
        let numCaIz = this.orillaIzquierda.filter((e) => e == 'C').length;
        let numCaDe = this.orillaDerecha.filter((e) => e == 'C').length;


        let numMiIzC = estado.orillaIzquierda.filter((e) => e == 'M').length;
        let numMiDeC = estado.orillaDerecha.filter((e) => e == 'M').length;
        let numCaIzC = estado.orillaIzquierda.filter((e) => e == 'C').length;
        let numCaDeC = estado.orillaDerecha.filter((e) => e == 'C').length;

        return numMiIz == numMiIzC 
                && numMiDe == numMiDeC
                &&numCaIz == numCaIzC
                && numCaDe == numCaDeC
                && this.posicionBote == estado.posicionBote;


    }

    // Pasa el estado a este formato 0M:0C - 3M:3C - BD
    public toString = () : string => {

        let numMiIz = this.orillaIzquierda.filter((e) => e == 'M').length;
        let numMiDe = this.orillaDerecha.filter((e) => e == 'M').length;
        let numCaIz = this.orillaIzquierda.filter((e) => e == 'C').length;
        let numCaDe = this.orillaDerecha.filter((e) => e == 'C').length;

        let posBote = this.posicionBote == PosicionBote.DERECHA ? 'D' : 'I';

        return `${numMiIz}M:${numCaIz}C - ${numMiDe}M:${numCaDe}C - B${posBote}`;
    }

    // Devuelve el string del movimiento a realizar para llegar al estado que se le pasa
    cambioParaLlegar(estado: Estado){
        let numMiDe = this.orillaDerecha.filter((e) => e == 'M').length;
        let numCaDe = this.orillaDerecha.filter((e) => e == 'C').length;

        let numMiDeC = estado.orillaDerecha.filter((e) => e == 'M').length;
        let numCaDeC = estado.orillaDerecha.filter((e) => e == 'C').length;

        let deltaMi = numMiDe - numMiDeC;
        let deltaCaniables = numCaDe - numCaDeC;

        deltaMi = Math.abs(deltaMi);
        deltaCaniables = Math.abs(deltaCaniables);
        let conector = deltaMi > 0 && deltaCaniables > 0 ? ' y ' : ' '; 

        let destino = estado.posicionBote == PosicionBote.DERECHA ? 'derecha' : 'izquierda';

        
        return `Mover${deltaMi ?  ' ' + deltaMi + ' misioneros': ''}${conector}${deltaCaniables ? deltaCaniables + ' canibales ': ' '}a la ${destino}`

    }
    
    
}

export default Estado;