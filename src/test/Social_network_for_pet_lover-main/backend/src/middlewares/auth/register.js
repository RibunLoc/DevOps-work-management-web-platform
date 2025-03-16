const User = require('../../models/User')
const connectToDb = require('../../config/database/db')

const validate = (req, res, next) => {
    console.log(req)
    const [email, password] = req.body
    console.log(email)
    const errors = [];

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // console.log(email)
    // console.log(password.value)
    if (!email.value || !emailRegex.test(email.value)) {
        errors.push('Invalid email format.');
    }

    // Password validation
    if (!password.value || password.value.length < 8) {
        errors.push('Password must be at least 8 characters long.');
    }

    // Phone validation
    // const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    // if (!phone || !phoneRegex.test(phone)) {
    //     errors.push('Invalid phone number format.');
    // }

    // Check for errors
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    return next()
}

async function checkDuplicate(req, res, next) {
    await connectToDb()
    const [email] = req.body
    const duplicateEmail = await User.findOne({ email: email.value })

    if(duplicateEmail) {
        return res.status(409).json({
            message: 'existed email'
        })
    }

    return next()
}

module.exports = {validate, checkDuplicate}
