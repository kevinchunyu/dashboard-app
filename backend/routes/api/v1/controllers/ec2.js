import express from 'express';
import fetch from 'node-fetch';

let router = express.Router();

router.get('/public-ipv4', async (req, res) => {
    const metadataUrl = 'http://169.254.169.254/latest/meta-data/public-ipv4';

    try {
        const response = await fetch(metadataUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch public IP');
        }
        const publicIP = await response.text();
        res.send(publicIP);
    } catch (err) {
        res.status(500).send('Error fetching public IP address');
    }
});

export default router;