import express from 'express';
var router = express.Router();

import rolesRouter from './controllers/roles.js'
import ec2Router from './controllers/ip.js'
import ecrRouter from './controllers/ecr.js'

router.use('/roles', rolesRouter);
router.use('/ip', ec2Router);
router.use('/ecr', ecrRouter);

export default router;