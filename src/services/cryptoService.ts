/*
connectService.ts
Authors:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 18/05/2022
Last modification date: 20/05/2022

Program that handles the encryption services used in the system
*/

//Libraries that will be used
import { HASH_ALGORITHM } from '../config';
import crypto from 'crypto';

class cryptoService{
    //Attributes
    private algorithm = HASH_ALGORITHM;

    //Methods
    public hash(text:string){
        /*
        Method that hashes a string using the algorithm defined by the system

        Parameters:
        text - string to be hashed
        Returns:
        hash - text variable hashed
        */
        const hash = crypto.createHash(this.algorithm).update(text).digest('hex');
        return hash;
    }
}

export default cryptoService;