import express from 'express';

let router = express.Router();

router.get('/url', async (req, res) => {
  try {
    // Use the ACR name environment variable.
    res.send(`${process.env.ACR_NAME}.azurecr.io`);
  } catch (err) {
    res.status(500).send('Error fetching registry address');
  }
});

export default router;


// azure container registry
// https://learn.microsoft.com/en-us/azure/container-registry/container-registry-private-link