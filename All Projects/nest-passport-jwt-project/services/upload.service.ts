import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { s3 } from "config/aws.config";

@Injectable()
export class UploadService   {

    async uploadFile(file: Express.Multer.File) : Promise<string> {
        
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read" as ObjectCannedACL,
            
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    
    }
}
