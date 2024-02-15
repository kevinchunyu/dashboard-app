import express from 'express';
var router = express.Router();

import rolesRouter from './controllers/roles.js'

router.use('/roles', rolesRouter);

export default router;