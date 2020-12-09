const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const mail = require('./mail');
const auth = require('./auth');
auth.getPasswordHash();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);



// Your routes go here
app.post('/auth', auth.authenticate);
app.get('/v0/mail',auth.check, mail.getAll);
app.get('/v0/mail/:id',auth.check, mail.getById);
app.post('/v0/mail',auth.check, mail.createEmail);
app.put('/v0/mail/update/:id',auth.check, mail.updateEmail);
app.put('/v0/mail/:id',auth.check, mail.moveEmail);

// app.patch('/v0/mail/:id',cors({
//   "origin": "http://localhost:3000", "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", "preflightContinue": true, "optionsSuccessStatus": 204
// }),auth.check, mail.updateEmail);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
