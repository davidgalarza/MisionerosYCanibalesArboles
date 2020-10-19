import { PosicionBote } from './utiliddades';

class Estado {
    orillaIzquierda: String[];
    orillaDerecha: String[];
    posicionBote: PosicionBote;

    

    constructor(orillaIzquierda: String[], orillaDerecha: String[], posicionBote: PosicionBote){
        this.orillaIzquierda = orillaIzquierda;
        this.orillaDerecha = orillaDerecha;
        this.posicionBote = posicionBote;
    }

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
    

    
}

export default Estado;