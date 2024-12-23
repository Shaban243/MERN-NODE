import * as AWS from 'aws-sdk';

export const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION, 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
});
