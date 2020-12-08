const db = require('./db');

removeContent = (email) => {
  delete email.content;
  return email;
};
exports.getAll = async (req, res) => {
  const queryParam = req.query.mailbox;
  const result = await db.selectEmails(queryParam, req.query.from, req.user.id);
  if (result) {
    const mailboxes = [];
    for (const [key, value] of result) {
      // console.log(key,value);
      mailboxes.push({name: key, mail: value});
    }
    //?.map(removeContent)
    res.status(200).json(mailboxes);
  } else {
    res.status(404).send();
  }
};
exports.getById = async (req, res) => {
  const queryParam = req.params.id;
  const email = await db.selectEmail(queryParam);
  if (email) {
    // console.log(email);
    delete email.mailbox;
    res.status(200).json(email);
  } else {
    res.status(404).send();
  }
};
exports.createEmail = async (req, res) => {
  const acceptedKeys = ['to',
    'subject',
    'content'];
  const receivedKeys = Object.keys(req.body);
  let invalidKey= false;
  for (const key of receivedKeys) {
    if (acceptedKeys.findIndex((k) => k === key) ==-1) {
      invalidKey = true;
      break;
    }
  } if (invalidKey) {
    res.status(400).send();
  } else {
    const newEmail = {
      ...req.body, 'from': {'name': 'CSE183 Student',
        'email': 'cse183student@ucsc.edu'},
      'sent': new Date().toISOString(),
      'received': new Date().toISOString(),
    };
    const result = await db.insertEmail('sent', newEmail, req.user.id);
    console.log(result);
    res.status(201).json(result);
  }
};

exports.updateEmail = async(req,res)=>{
  const emailId = req.params.id;
  const email = req.body;
  console.log(emailId);
  console.log(email);
try{
  delete email.id;
  res.status(201).json(await db.updateEmail(emailId, email));
}catch(ex){
  console.log(ex);
  res.status(500).send();
}
}
exports.moveEmail = async (req, res) => {
  const emailId = req.params.id;
  const email = await db.selectEmail(emailId);
  if (email) {
    const mailBox = req.query.mailbox;
    if (mailBox === 'sent' && email.mailbox != mailBox) {
      res.status(409).send();
    } else {
      res.status(204).send(await db.moveEmail(email, mailBox));
    }
  } else {
    res.status(404).send();
  }
};
