import express from 'express';

let router = express.Router();

router.get('/url', async (req, res) => {
    try {
        res.send(`${process.env.AWS_ACCOUNT_ID}.dkr.ecr.${process.env.REGION}.amazonaws.com`);
    } catch (err) {
        res.status(500).send('Error fetching registry address');
    }
});

export default router;