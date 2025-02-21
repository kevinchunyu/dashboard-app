import express from 'express';
import fetch from 'node-fetch';

let router = express.Router();

router.get('/public-ipv4', async (req, res) => {
    // Azure IMDS endpoint for network interface data
    const metadataUrl = 'http://169.254.169.254/metadata/instance/network/interface?api-version=2021-02-01';

    try {
    const response = await fetch(metadataUrl, {
        headers: { Metadata: 'true' }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch metadata');
    }

    const metadata = await response.json();
    let publicIP = null;
    if (metadata.interface && metadata.interface.length > 0) {
        const ipAddresses = metadata.interface[0].ipv4?.ipAddress;
        if (ipAddresses && ipAddresses.length > 0) {
        publicIP = ipAddresses[0].publicIpAddress;
        }
    }

    if (publicIP) {
        res.send(publicIP);
    } else {
        res.status(404).send('Public IP address not found');
    }
    } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching public IP address');
    }
});

export default router;

// https://learn.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service?tabs=windows