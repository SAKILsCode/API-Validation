const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const validator = require('validator');

const app = express();
app.use([morgan('dev'), cors(), express.json()]);

const people = {
  mdsakil: {
    firstName: 'MD',
    lastName: 'Sakil',
    email: 'sakil@gmail.com',
  },
  sakilhasan: {
    firstName: 'Sakil',
    lastName: 'Hasan',
    email: 'sakilhasan@gmail.com',
  },
};

app.get('/', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'username query parameter missing',
    });
  }
  res.status(200).json(people[username.toLocaleLowerCase()]);
});

app.post('/', (req, res) => {
  const { name, username, email } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'name is missing',
    });
  }

  if (!username) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'username is missing',
    });
  }

  if (!email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'email is missing',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'invalid email',
    });
  }

  const names = name.split(' ');
  const firstName = names[0];
  const lastName = names[1] || '';
  people[username.toString()] = {
    firstName,
    lastName,
    email,
  };
  res.status(203).json(people[username.toString()]);
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
