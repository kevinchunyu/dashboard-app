// routes/acrCliTokenFixed.js
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import util from 'util';

const router = express.Router();
router.use(cors());
router.use(express.json());

const execAsync = util.promisify(exec);

const resourceGroup = 'lab_rg';
const registryName  = 'labacrdevops';
const scopeMapName  = 'StudentScopeMap';
const tokenName     = 'MyFixedToken';

async function runAz(cmd) {
  const full = `az ${cmd} --resource-group ${resourceGroup} --output json`;
  const { stdout, stderr } = await execAsync(full);
  if (stderr) console.warn(stderr);
  return JSON.parse(stdout);
}

router.post('/acr-token', async (req, res) => {
  try {
    await runAz(
      `acr token create --registry ${registryName}` +
      ` --name ${tokenName}` +
      ` --scope-map ${scopeMapName}`
    );

    const creds = await runAz(
      `acr token credential generate --registry ${registryName}` +
      ` --name ${tokenName}`
    );

    const password = creds.passwords[0].value;

    const registryUrl = `${registryName}.azurecr.io`;
    const usageInstructions = {
      login:      `docker login ${registryUrl} --username ${creds.username} --password ${password}`,
      pull:       `docker pull ${registryUrl}/[repository]:[tag]`,
      push:       `docker push ${registryUrl}/[repository]:[tag]`,
    };

    res.json({
      tokenName,
      credentials: { username: creds.username, password },
      registry:    registryUrl,
      accessLevel: 'Push, Pull, and Metadata Read',
      usageInstructions
    });
  } catch (err) {
    console.error('ACR CLI token error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
