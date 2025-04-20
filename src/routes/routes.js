const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');
const terms = require('../controllers/terms.controller')
const progress = require('../controllers/progress.controller')
const chats = require('../controllers/chats.controller')
const questions = require('../controllers/questions.controller')

const webusers = require('../controllers/web/webuser.controller')

router.get('/', (req, res) => res.send(`
  <title>NU Mindify API</title>
  <h1>NU Mindify API</h1>
  <div>Example Usage: <a href="https://nu-mindify-api.vercel.app/api/getTerms">https://nu-mindify-api.vercel.app/api/getTerms</a></div>
  <style>*{text-align:center}</style>
  `))

router.get('/getUsers', users.getUsers);
router.get('/getUser/:uid', users.getUser);
router.post('/createUser', users.createUser);
router.post('/updateUser', users.updateUser);

router.get('/getTerms', terms.getTerms)
router.post('/addTerm', terms.addTerm)
router.put('/updateTerm/:id', terms.updateTerm)

router.get('/getProgress/:id', progress.getUserProgress)
router.post('/progressCategory', progress.progressCategory)

router.get('/getMessages/:id', chats.getMessages);
router.post('/sendMessage', chats.sendMessage)

router.get('/getQuestions', questions.getQuestions)
router.post('/addQuestion', questions.addQuestion)
router.patch('/updateQuestion', questions.updateQuestion)

//web routes
router.get('/getWebUsers', webusers.getWebUsers);
router.get('/getWebUser/:uid', webusers.getWebUser);
router.put('/updateWebUsers/:id', webusers.updateWebUsers)

module.exports = router;