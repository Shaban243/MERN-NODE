import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client } from "@aws-sdk/client-s3";
export declare const cognito: CognitoIdentityProviderClient;
export declare const s3: S3Client;
export declare const S3_BUCKET_NAME: string;
export declare const cognito_user_pool_id: string;
export declare const cognito_client_id: string;
