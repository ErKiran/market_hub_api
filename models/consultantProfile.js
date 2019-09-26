const mongoose = require('mongoose');
const ConsultantSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String
    },
    serviceProvided: {
        type: String,
    },
    aboutMe: {
        type: String,
    },
    videoLink: {
        type: String
    },
    images: [
        {
            type: String
        }
    ],
    links: [{
        name: {
            type: String
        },
        url: {
            type: String
        }
    }
    ],
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = Consultant = mongoose.model('consultant_profile', ConsultantSchema)