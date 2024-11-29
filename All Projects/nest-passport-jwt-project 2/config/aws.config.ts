import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();


export const cognito = new CognitoIdentityProviderClient({

  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  
});


export const s3 = new S3Client({

  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

});


export const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const cognito_user_pool_id = process.env.COGNITO_USER_POOL_ID;
export const cognito_client_id = process.env.COGNITO_CLIENT_ID;
