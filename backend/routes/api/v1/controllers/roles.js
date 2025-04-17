import express from 'express';
import { DefaultAzureCredential } from '@azure/identity';
import { ContainerRegistryManagementClient } from '@azure/arm-containerregistry';
import { ResourceManagementClient } from '@azure/arm-resources';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Get required environment variables
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || '8fa24a70-a4ea-4c31-868a-f91dbef91879';
    const acrName = process.env.ACR_NAME || 'labacrdevops';
    const resourceGroup = process.env.AZURE_RESOURCE_GROUP || 'lab_rg';

    if (!subscriptionId) {
      throw new Error("AZURE_SUBSCRIPTION_ID environment variable is not set.");
    }

    let acrResourceGroup = resourceGroup;
    
    const credential = new DefaultAzureCredential();
    
    // If resource group wasn't provided, look it up
    if (!acrResourceGroup) {
      try {
        const resourceClient = new ResourceManagementClient(credential, subscriptionId);
        const resources = await resourceClient.resources.list({
          filter: `resourceType eq 'Microsoft.ContainerRegistry/registries' and name eq '${acrName}'`
        });
        const registry = resources.find(r => r.name.toLowerCase() === acrName.toLowerCase());
        if (!registry) {
          throw new Error(`Registry '${acrName}' not found in subscription '${subscriptionId}'`);
        }

        // Extract resource group from resource ID
        const idParts = registry.id.split('/');
        const rgIndex = idParts.findIndex(p => p.toLowerCase() === 'resourcegroups');
        acrResourceGroup = idParts[rgIndex + 1];
        console.log(`Found registry in resource group: ${acrResourceGroup}`);
      } catch (error) {
        console.error("Error finding registry resource group:", error);
        throw new Error(`Could not determine resource group for ACR: ${error.message}`);
      }
    }

    const registryClient = new ContainerRegistryManagementClient(credential, subscriptionId);

    const credentialsResult = await registryClient.registries.listCredentials(
      acrResourceGroup,
      acrName
    );

    const username = credentialsResult.username;
    const password = credentialsResult.passwords[0].value;

    // 12hrs for now
    const expiresOn = new Date(Date.now() + 43200 * 1000).toISOString();

    const credentials = {
      AccessToken: password,
      Username: username,
      ExpiresOn: expiresOn,
      RegistryName: acrName,
      UsageInstructions: {
        DockerLogin: `docker login ${acrName}.azurecr.io --username ${username} --password "${password}"`,
        DockerPull: `docker pull ${acrName}.azurecr.io/repository-name:tag`,
        DockerPush: `docker push ${acrName}.azurecr.io/your-name/image-name:tag`
      }
    };
    res.send(credentials);
  } catch (err) {
    console.error("Error generating ACR credentials:", err);
    res.status(500).send({ error: err.message });
  }
});

export default router;