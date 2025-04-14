import express from 'express';
import { DefaultAzureCredential } from '@azure/identity';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Ensure the Azure subscription ID is set in your environment variables.
    // process.env.AZURE_SUBSCRIPTION_ID
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    if (!subscriptionId) {
      throw new Error("AZURE_SUBSCRIPTION_ID environment variable is not set.");
    }

    // Define the scope for Azure authentication (e.g., Azure Management API)
    const scope = `https://management.azure.com/.default`;

    // Use DefaultAzureCredential to acquire an access token
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken(scope);

    let credentials = {
      AccessToken: tokenResponse.token,
      ExpiresOn: new Date(tokenResponse.expiresOnTimestamp).toISOString()
    };

    res.send(credentials);
  } catch (err) {
    console.error("Error acquiring Azure token:", err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
