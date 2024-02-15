import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import apiv1Router from './routes/api/v1/apiv1.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("../frontend/build"));
app.use(cors());

// Make sure that the client gets the latest version of resource
app.disable('etag');

app.use('/api/v1', apiv1Router);

export default app;
