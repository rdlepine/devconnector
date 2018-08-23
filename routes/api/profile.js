const express = require('express')
const router = express.Router()

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req, res) => {
    res.json({message: "profile work"})
})

router.post("/test", (req, res) => {
    res.json({message: "posts profile work"})
})

module.exports = router