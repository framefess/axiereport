var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const fetch = require('node-fetch');
const Scholar = require('../models/scholar')
const Account = require('../models/account')
/* GET home page. */
router.get('/', async function (req, res, next) {
  let session = req.session;
  console.log(session);
  if (session.user) {
    await Scholar.find({ account: session.user }, (err, user) => {
      res.render('index', { title: 'Axie report', page: 'index', scholar: user });
    })
  } else {
    res.render('./login/index', { title: 'Axie report', page: 'login' });
  }
});


router.post(`/addscholar`, async (req, res) => {
  const payload = req.body
  let session = req.session;
  console.log(payload);
  const skymavis = await (await fetch('https://api.lunaciarover.com/stats/' + payload.eth_address)).json()
  console.log(skymavis);
  console.log(session.user);
  let data = {
    account: session.user,
    ...payload,
    ...skymavis,
  };
  const scholar = new Scholar(data)
  await scholar.save((err, createdUser) => {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send(createdUser)
  })
  console.log("addscholar done");
  // res.send("succes")
})

router.get('/login', function (req, res, next) {
  res.render('/login/index', { title: 'login' });
});
router.post('/login', async (req, res, next) => {
  const payload = req.body
  console.log(payload);
  await Account.find({ id: payload.id, password: payload.password }, (err, user) => {
    console.log(user[0]);
    if (err) { res.status(500).send(err) }
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' })
    } else if (user) {
      if (!user[0].password === req.body.password) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' })
      } else {
        let sess = req.session
        sess.user = user[0].id
        sess._id = user[0]._id
        res.status(200).send(user.id + ' ' + user._id)
        console.log(user[0].id + ' ' + user[0]._id);
      }
    }
  })

  // res.status(201).end()
});
router.get('/session', (request, response) => {
  let sess = request.session
  console.log(sess)
  response.status(200).send('id = ' + sess.user + '  ' + '_id = ' + sess._id)
})

router.post('/addaccount', async (req, res) => {
  const payload = req.body
  console.log(req.body);
  const account = new Account(payload)
  await account.save((err, createdUser) => {
    if (err) {
      res.status(500).send(err)
    }
    res.status(201).send(createdUser)
  })
  console.log("addaccount done");
  // res.send("succes")
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/delscholar/:id', async (req, res) => {
  const { id } = req.params
  await Scholar.findByIdAndDelete(id)
  res.status(200).end()
})
module.exports = router;
