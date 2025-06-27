import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let serviceAccount;

if (process.env.NODE_ENV === 'prod') {
  serviceAccount = JSON.parse(fs.readFileSync(path.resolve(process.env.FIREBASE_CONFIG_PATH!), 'utf8'));
} else {
  serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../configs/service_account.json'), 'utf8'));
}
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();
