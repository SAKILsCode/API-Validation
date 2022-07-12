const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Joi = require('joi');

const app = express();
app.use([morgan('dev'), cors(), express.json()]);

// post schema
const schema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    'string.base': 'name must be a valid string',
    'string.min': 'min length is 3',
    'string.max': 'max length is 30',
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'info'] },
    })
    .normalize()
    .custom((value) => {
      if (value === 'sakil@gmail.com') {
        throw new Error('email already exist');
      }
      return value;
    })
    .required()
    .messages({
      'any.custom': 'email already in use',
    }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        '^.*(?=.{8,})((?=.*[!@#$%^&*()-_=+{};:,<.>]){1})(?=.*d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$'
      )
    )
    .required(),

  confirmPassword: Joi.ref('password'),

  bio: Joi.string().trim().min(20).max(300),

  addresses: Joi.array().items(
    Joi.object({
      city: Joi.string(),
      postcode: Joi.number(),
    })
  ),

  skills: Joi.string()
    .trim()
    .custom((value) => {
      return value.split(',').map((item) => item.trim());
    }),
});

// Handle registration
app.post('/', (req, res) => {
  const result = schema.validate(req.body, { abortEarly: false });
  if (result.error) {
    console.log(result.error.details);

    const errors = result.error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});

    return res.status(400).json(errors);
  }
  console.log(result.value);
  res.status(201).json({ message: 'OK' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});

// Demo Request body
// const reqBody = {
//   name: 'MD Sakil', // required
//   email: 'sakil@gmail.com', // required
//   password: 'pass123', // required
//   confirmPassword: 'pass123', // required
//   bio: 'Backend Developer',
//   addresses: [
//     {
//       city: 'Bhanga',
//       postCode: 7830
//     },
//     {
//       city: 'Faridpur',
//       postCode: 7800
//     },
//   ],
//   skills: 'Javascript, Typescript, React, Node'
// };
