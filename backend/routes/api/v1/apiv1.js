import express from 'express';
var router = express.Router();

import rolesRouter from './controllers/roles.js'
import ec2Router from './controllers/ec2.js'
import ecrRouter from './controllers/ecr.js'

router.use('/roles', rolesRouter);
router.use('/ec2', ec2Router);
router.use('/ecr', ecrRouter);

export default router;