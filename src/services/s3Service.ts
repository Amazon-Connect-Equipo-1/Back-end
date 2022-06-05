import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../config';
import AWS from 'aws-sdk';

class S3Service{
    //Attributes for connecting to S3
    private config: AWS.S3.ClientConfiguration;
    private s3Identity: AWS.S3;

    //Singleton
    private static instance: S3Service;

    //Getter
    public static getInstance(): S3Service{
        if(this.instance){
            return this.instance;
        }
        this.instance = new S3Service();
        return this.instance;
    }

    //Constructor
    private constructor(){
        this.config = {
            region: AWS_REGION,
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        }

        this.s3Identity = new AWS.S3(this.config);
    }

    //Methods
    public async putObject(bucket:string, key:string, body:any){
        var params = {
            Bucket: bucket,
            Key: key,
            Body: body
        };

        return await this.s3Identity.putObject(params).promise();
    }

    public async getObject(bucket:string, key:string){
        const params = {
            Bucket: bucket,
            Key: key
        };

        return await this.s3Identity.getObject(params).promise();
    }
}

export default S3Service;