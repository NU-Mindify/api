// middleware/auth.js
const admin = require('../../firebaseConfig'); // Assuming you exported the admin object

const authenticate = async (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No ID token found in Authorization header');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add the decoded token (containing user info) to the request object
    return next();
  } catch (err) {
    console.error('Error while verifying ID token:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticate;