"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognito_client_id = exports.cognito_user_pool_id = exports.S3_BUCKET_NAME = exports.s3 = exports.cognito = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();
exports.cognito = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
exports.s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
exports.S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
exports.cognito_user_pool_id = process.env.COGNITO_USER_POOL_ID;
exports.cognito_client_id = process.env.COGNITO_CLIENT_ID;
//# sourceMappingURL=aws.config.js.map