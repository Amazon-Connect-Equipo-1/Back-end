import crypto from 'crypto';
import { HASH_ALGORITHM } from '../config';

class cryptoService{
    //Attributes
    private algorithm = HASH_ALGORITHM;

    //Methods
    public hash(text:string){
        const hash = crypto.createHash(this.algorithm).update(text).digest('hex');
        return hash;
    }
}

export default cryptoService;