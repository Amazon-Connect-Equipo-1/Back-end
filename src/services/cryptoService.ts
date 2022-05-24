import crypto from 'crypto';

class cryptoService{
    //Methods
    public hash(text:string){
        const hash = crypto.createHash('sha256').update(text).digest('hex');
        return hash;
    }
}

export default cryptoService;