// routes/acrToken.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { DefaultAzureCredential } from '@azure/identity';

const router = express.Router();
router.use(cors());
router.use(express.json());

const subscriptionId    = process.env.AZURE_SUBSCRIPTION_ID || '8fa24a70-a4ea-4c31-868a-f91dbef91879';
const resourceGroupName = 'lab_rg';
const registryName      = 'labacrdevops';
const tokenName         = 'StudentToken';
const apiVersion        = '2023-01-01-preview';

async function getArmToken() {
  const cred = new DefaultAzureCredential();
  const { token } = await cred.getToken('https://management.azure.com/.default');
  return token;
}

router.post('/acr-token', async (req, res) => {
  try {
    // 1) ARM token via MSI/SPN/CLI creds
    const armToken = await getArmToken();

    // 2) Build the correct URL (under "registries")
    const url =
      `https://management.azure.com/subscriptions/${subscriptionId}` +
      `/resourceGroups/${resourceGroupName}` +
      `/providers/Microsoft.ContainerRegistry/registries/${registryName}` +
      `/generateCredentials?api-version=${apiVersion}`;

    // 3) The only required body is the full resource ID of your token
    const tokenId =
      `/subscriptions/${subscriptionId}` +
      `/resourceGroups/${resourceGroupName}` +
      `/providers/Microsoft.ContainerRegistry/registries/${registryName}` +
      `/tokens/${tokenName}`;

    // 4) Call GenerateCredentials
    const { data } = await axios.post(
      url,
      { tokenId },
      {
        headers: {
          Authorization: `Bearer ${armToken}`,
          'Content-Type':  'application/json'
        }
      }
    );
    // 5) Pull out username & password
    const username = data.username;
    const password = data.passwords[0].value;

    // 6) Return what your frontend needs
    const registryUrl = `${registryName}.azurecr.io`;
    res.json({
      tokenName,
      credentials: { username, password },
      registry:    registryUrl,
      accessLevel: 'Push, Pull, and Metadata Read',
      usageInstructions: {
        login: `docker login ${registryUrl} --username ${username} --password ${password}`,
        pull:  `docker pull ${registryUrl}/<repo>:<tag>`,
        push:  `docker push ${registryUrl}/<repo>:<tag>`
      }
    });
  } catch (err) {
    console.error('GenerateCredentials failed:', {
      status: err.response?.status,
      data:   err.response?.data
    });
    res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data || err.message });
  }
});

export default router;
