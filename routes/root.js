const express = require('express');
const router = express.Router();
const path = require('path');

// we are using regular expression
router.get('^/$|index(.html)?', (req, res) => {

    res.sendFile(path.join(__dirname,'..','views','index.html'));
});

module.exports = router;