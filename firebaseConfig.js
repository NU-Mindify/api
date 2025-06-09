const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "projectId": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": "0ae42fdb780858bf0962de02c6d0e0db552b19c7",
  "privateKey": process.env.FIREBASE_PRIVATE_KEY,
  "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": "115473611721433233451",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nu-mindify.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;