const Validator = require('validator');
const isEmpty = require('./is-empty');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports =
    {
        validateChangePassword: async function validateChangePassword(data) {
            let errors = {};
            data.newPass = !isEmpty(data.newPass) ? data.newPass : '';
            data.confirmPass = !isEmpty(data.confirmPass) ? data.confirmPass : '';
            data.currentPass = !isEmpty(data.currentPass) ? data.currentPass : '';


            const user = await User.find({ email: req.body.email });
            const checkPassword = await bcrypt.compare(req.body.currentPass, user[0].password);
            if (checkPassword === false) {
                errors.currentPass = 'Check your password'
            }
            if (Validator.isEmpty(data.newPass)) {
                errors.newPass = 'New Password field is required';
            }
            if (Validator.isEmpty(data.currentPass)) {
                errors.currentPass = 'Old Password Field is required'
            }
            if (Validator.isEmpty(data.confirmPass)) {
                errors.confirmPass = 'Confirm Password field is required';
            }

            if (!Validator.isLength(data.newPass, { min: 8, max: 30 })) {
                errors.newPass = 'Password must be at least 8 characters and less than 30 characters';
            }

            if (Validator.isAlphanumeric(data.newPass)) {
                errors.newPass = 'Password must contain atleast one special characters';
            }

            if (data.newPass !== data.confirmPass) {
                errors.confirmPass = `Password doesn't match`
            }

            if (data.newPass === data.currentPass) {
                errors.identical = 'New Password is identical to Old password'
            }
            return {
                errors,
                isValid: isEmpty(errors),
            };
        }
    }
