const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    admin:
    {
        is_admin: {
            type: Boolean,
            default: false
        },
        is_techinical: {
            type: Boolean,
            default: false
        }
    },
    isactive: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
        default: false
    },
    passwordResetExpires: {
        type: Date
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = User = mongoose.model('users', UserSchema)