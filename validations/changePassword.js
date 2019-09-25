const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports =
    {
        validateChangePassword: function validateChangePassword(data) {
            let errors = {};
            data.newPass = !isEmpty(data.newPass) ? data.newPass : '';
            data.confirmPass = !isEmpty(data.confirmPass) ? data.confirmPass : '';
            data.oldPass = !isEmpty(data.oldPass) ? data.oldPass : '';

            if (Validator.isEmpty(data.newPass)) {
                errors.newPass = 'New Password field is required';
            }
            if (Validator.isEmpty(data.oldPass)) {
                errors.oldPass = 'Old Password Field is required'
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

            if (data.newPass === data.oldPass) {
                errors.identical = 'New Password is identical to Old password'
            }
            return {
                errors,
                isValid: isEmpty(errors),
            };
        }
    }
