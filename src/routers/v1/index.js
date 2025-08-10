const express = require('express');
const router = express.Router();

router.get('/info', (req, res) => {
    return res.json({ msg: "route working" });
});

module.exports = router;
