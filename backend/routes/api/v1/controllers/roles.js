import express from 'express';
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

const REGION = "us-west-1";
export const client = new STSClient({ region: REGION });

let router = express.Router();

router.get('/', async (req,res) => {
    try {
        const command = new AssumeRoleCommand({
          RoleArn: `arn:aws:iam::${process.env.AWS_ID}:role/student`,
          RoleSessionName: "session1",
          DurationSeconds: 900,
        });

        const response = await client.send(command);
        let credentials = {
            AccessKeyID: response.Credentials.AccessKeyId,
            SecretAccessKey: response.Credentials.SecretAccessKey,
            SessionToken: response.Credentials.SessionToken
        }
        res.send(credentials);
      } catch (err) {
        console.error(err);
      }
    
})

export default router;