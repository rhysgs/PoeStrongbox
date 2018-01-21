const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jade = require('jade');

const root = path.join(process.cwd(), 'client_src', 'app');

router.get('/*', (req, res) => {  
  var filePath = `${root}${req.url}.jade`;
  fs.exists(filePath, (exists) => {
    if (!exists) {
      return res.status(404).end();
    }
    res.send(jade.renderFile(filePath));
  });
});

module.exports = router;