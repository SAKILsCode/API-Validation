const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Ajv = require('ajv/dist/jtd');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const app = express();
app.use([morgan('dev'), cors(), express.json()]);

// handle registration
app.post('/', (req, res) => {
  const validate = ajv.compile(require('./registration.jtd.json'));
  const valid = validate(req.body);

  if (!valid) {
    console.log(validate.errors);

    const errors = validate.errors.reduce((acc, cur) => {
      if (cur.instancePath === '') {
        acc[cur.params.missingProperty] = cur.message;
      } else {
        const name = cur.instancePath.split('/')[3];
        acc[name] = `${name} ${cur.message}`;
      }
      console.log(cur.instancePath.split('/')[3]);
      return acc;
    }, {});

    return res.status(400).json(errors);
  }
  res.status(203).json({ message: 'OK' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});

// Demo user
const reqBody = {
  name: 'MD Sakil', // required
  email: 'sakil@gmail.com', // required
  password: 'pass123', // required
  confirmPassword: 'pass123', // required
  bio: 'Backend Developer',
  addresses: [
    {
      city: 'Bhanga',
      postCode: 7830,
    },
    {
      city: 'Faridpur',
      postCode: 7800,
    },
  ],
  skills: 'Javascript, Typescript, React, Node',
};
