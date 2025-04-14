import express from 'express';

let router = express.Router();

router.get('/url', async (req, res) => {
  try {
    // Use the ACR name environment variable.
    /// test envs : ${process.env.ACR_NAME}.azurecr.io
    /// test locally: labacrdevops.azurecr.io
    let acr_name = process.env.ACR_NAME || 'labacrdevops';
    // If the ACR name is not set, return an error.
    if (!acr_name) {
      return res.status(400).send('ACR name is not set');
    }
    res.send(`${acr_name}.azurecr.io`);
  } catch (err) {
    res.status(500).send('Error fetching registry address');
  }
});

export default router;


// azure container registry
// https://learn.microsoft.com/en-us/azure/container-registry/container-registry-private-link