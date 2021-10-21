const express = require('express');
const app = express();

app.listen(3000, (req, res) => console.log("Up at localhost:3000"));
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (req, res) => {
  console.log("Request received");
  console.log(req.body);
  res.json(weatherData);
});