import express from 'express';
import { DefaultAzureCredential } from '@azure/identity';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Ensure the ACR name is set in your environment variables.
    const registryName = process.env.ACR_NAME; 
    if (!registryName) {
      throw new Error("ACR_NAME environment variable is not set.");
    }
    // Define the scope for the ACR. The scope for ACR is the registry login server with the .default suffix.
    const scope = `https://${registryName}.azurecr.io/.default`;

    // Use DefaultAzureCredential to acquire an access token.
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken(scope);

    // Prepare the response. Azure AD tokens have an access token and an expiry timestamp.
    const credentials = {
      accessToken: tokenResponse.token,
      expiresOn: tokenResponse.expiresOnTimestamp
    };

    res.send(credentials);
  } catch (err) {
    console.error("Error acquiring token:", err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
