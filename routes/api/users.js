const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => {
    res.json({message: "users work"})
})

router.post('/register', (req, res) => {
    const {name, email, password} = req.body

    User.findOne({
        email: email
    }).then(user => {
        if(user) {
            return res.status(400).json({email: "Email Already Exists"})
        } else {
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            })
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                avatar: avatar,
            })
           
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash)=> {
                    if(err) throw err
                    newUser.password = hash
                    newUser.save().then(user => res.json(user)).catch(err => console.log(err))
                })
            })
        }
    })

})

module.exports = router