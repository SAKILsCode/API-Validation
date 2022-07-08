const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use([morgan('dev'), cors(), express.json()]);

app.get('/', (req, res) => {
  res.status(203).json({ message: 'OK' });
});

app.post('/', (req, res) => {
  res.status(203).json({ message: 'OK' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
