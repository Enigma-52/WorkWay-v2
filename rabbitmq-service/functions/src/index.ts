import { https } from 'firebase-functions';
import app from './app.js';

export const appFunction = https.onRequest(app);