const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');
const terms = require('../controllers/terms.controller')
const progress = require('../controllers/progress.controller')
const chats = require('../controllers/chats.controller')
const questions = require('../controllers/questions.controller')
const attempts = require('../controllers/attempts.controller')

const webusers = require('../controllers/web/webuser.controller')
const analytics = require('../controllers/web/analytics.controller')
const branches = require('../controllers/web/branches.controller')
const logs = require('../controllers/web/logs.controller')

const authenticate = require('../middleware/auth')

router.get('/', (req, res) => res.send(`
  <title>NU Mindify API</title>
  <h1>NU Mindify API</h1>
  <div>Example Usage: <a href="https://nu-mindify-api.vercel.app/api/getTerms">https://nu-mindify-api.vercel.app/api/getTerms</a></div>
  <style>*{text-align:center}</style>
  `))

router.get('/getUsers', authenticate, users.getUsers);
router.get('/getUser/:uid', users.getUser);
router.post('/createUser', users.createUser);
router.post('/updateUser', users.updateUser);

router.get('/getTerms', authenticate, terms.getTerms)
router.get('/getLimitedTerms/:start/:end', authenticate, terms.getLimitedTerms)
router.post('/addTerm', authenticate, terms.addTerm)
router.put('/updateTerm/:id', authenticate, terms.updateTerm)
router.put('/deleteTerm/:id', authenticate, terms.deleteTerm)

router.get('/getProgress/:id', progress.getUserProgress)
router.get('/getAllProgress', progress.getAllProgress)
router.post('/progressCategory', progress.progressCategory)

router.get('/getMessages/:id', chats.getMessages);
router.post('/sendMessage', chats.sendMessage)
router.post('/deleteAllMessages', chats.deleteAllMessages)

router.get('/getQuestions', authenticate, questions.getQuestions)
router.post('/addQuestion', authenticate, questions.addQuestion)
router.patch('/updateQuestion', authenticate, questions.updateQuestion)

router.get('/getLeaderboard', attempts.getLeaderboard)
router.post('/addAttempt', attempts.addAttempt)
router.get('/getTopLeaderboards', attempts.getTopLeaderboards);


// Web exclusive routes
router.get('/getWebUsers', webusers.getWebUsers);
router.get('/getWebUser/:uid', webusers.getWebUser);
router.get('/getWebUsers/:branch?', webusers.getUsersByBranch);
router.put('/updateWebUsers/:id', webusers.updateWebUsers);
router.post('/createWebUser', webusers.createWebUser);

router.get('/getAnalytics', analytics.getAnalytics);
router.get('/getUserAttempts', attempts.getUserAttempts);

//branches routes
router.get('/getBranches', branches.getBranches);
router.post('/addBranches', branches.addBranches);

//system logs routes
router.get('/getLogs', logs.getLogs);
router.post('/addLogs', logs.addLogs);

module.exports = router;