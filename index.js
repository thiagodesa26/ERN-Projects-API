const express = require('express');

const app = express();

app.get('/teste', (res, req) => {
  return res.json({working: true})
});

app.listen(3334);