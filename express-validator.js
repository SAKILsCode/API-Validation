const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();
app.use([morgan('dev'), cors(), express.json()]);

const reqBodyValidator = [
  body('name')
    .trim()
    .isString()
    .withMessage('name must be a valid string')
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage('name length must be between 5-30 chars'),

  body('email')
    .normalizeEmail({ all_lowercase: true })
    .isEmail()
    .withMessage('please provide a valid email')
    .custom((value) => {
      if (value === 'sakil@gmail.com') {
        throw new Error('email already in use');
      }
      return true;
    }),

  body('password')
    .isString()
    .withMessage('password must be a valid string')
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage('password length must be between 8-30 chars')
    .bail()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g
    )
    .withMessage(
      'password must contain uppercase, lowercase, digit and special chars'
    ),

  body('confirmPassword')
    .isString()
    .withMessage('password must be a valid string')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password does not match');
      }
      return true;
    }),

  body('bio')
    .optional()
    .isString()
    .withMessage('bio must be a valid string')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 20, max: 300 })
    .withMessage('bio must be between 20-300 chars'),

  body('addresses')
    .optional()
    .custom((v) => {
      if (!Array.isArray(v)) {
        throw new Error('addresses must be an array of address');
      }
      return true;
    }),

  body('addresses.*.postcode')
    .isNumeric()
    .withMessage('postcode must be numeric')
    .toInt(),

  body('skills')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .withMessage('skills must be a comma separated string')
    .customSanitizer((value) => {
      return value.split('.').map((item) => item.trim());
    }),
];

// Handle registration
app.post('/', reqBodyValidator, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()); // errors.array() returns an array & errors.mapped() returns an object.
  }

  console.log('Request Body:');
  console.log(req.body);
  res.status(201).json({ message: 'OK' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});

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
