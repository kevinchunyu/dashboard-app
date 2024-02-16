import express from 'express';
var router = express.Router();

import rolesRouter from './controllers/roles.js'
import ec2Router from './controllers/ec2.js'

router.use('/roles', rolesRouter);
router.use('/ec2', ec2Router);

export default router;