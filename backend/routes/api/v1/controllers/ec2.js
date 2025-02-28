import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const azureMetadataUrl = 'http://169.254.169.254/metadata/instance/network/interface?api-version=2021-02-01';

async function getPublicIP() {
  try {
    const response = await fetch(azureMetadataUrl, {
      headers: { Metadata: 'true' },
      timeout: 5000
    });

    if (response.ok) {
      const metadata = await response.json();
      const ipAddresses = metadata.interface?.[0]?.ipv4?.ipAddress;
      if (ipAddresses && ipAddresses.length > 0) {
        return ipAddresses[0].publicIpAddress;
      }
    }
  } catch (error) {
    console.log("Not running inside Azure VM, using external IP service...");
  }

  // fetch public IP using an external service (works locally)
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error("Failed to fetch public IP:", error);
    return null;
  }

  return null;
}

router.get('/public-ipv4', async (req, res) => {
  try {
    const publicIP = await getPublicIP();
    console.log(publicIP);

    if (publicIP) {
      res.send(publicIP);
    } else {
      res.status(404).send('Public IP address not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching public IP address');
  }
});

export default router;
