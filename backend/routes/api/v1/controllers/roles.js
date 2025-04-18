import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const acrName = process.env.ACR_NAME || 'labacrdevops';
    const registryUrl = `https://${acrName}.azurecr.io`;

    // Call Azure Instance Metadata Service to get the access token for ACR
    const response = await axios.get('http://169.254.169.254/metadata/identity/oauth2/token', {
      headers: {
        Metadata: 'true'
      },
      params: {
        resource: 'https://containerregistry.azure.net',
        'api-version': '2018-02-01'
      },
      timeout: 2000
    });

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_on;

    res.send({
      AccessToken: accessToken,
      expiresOn: expiresIn,
      UsageInstructions: {
        DockerLogin: `echo ${accessToken} | docker login ${registryUrl} -u 00000000-0000-0000-0000-000000000000 --password-stdin`,
        DockerPull: `docker pull ${registryUrl}/<image>:<tag>`,
        DockerPush: `docker push ${registryUrl}/<image>:<tag>`
      }
    });
  } catch (err) {
    console.error("Error retrieving token:", err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
