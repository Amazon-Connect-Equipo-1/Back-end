import { Json } from 'aws-sdk/clients/robomaker';
import crypto from 'crypto';
import { CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY } from '../config';

class cryptoService{
    //Attributes
    private algorithm = CRYPTO_ALGORITHM;
    private secretKey = CRYPTO_SECRET_KEY;
    private iV = crypto.randomBytes(16);

    //Methods
    public encrypt(text:string){
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey!), this.iV);
        const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: this.iV.toString('hex'),
            content: encryptedText.toString('hex')
        }
    }

    public dencrypt(hash:any):string{
        const content = Buffer.from(hash.content, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey!), Buffer.from(hash.iv, 'hex'));
        const decryptedText = Buffer.concat([decipher.update(content), decipher.final()]);

        return decryptedText.toString();
    }
}

export default cryptoService;