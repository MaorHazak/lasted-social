const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userInfo: {
        type: Object,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date()
    }
});

const Comments = mongoose.model('Comment', schema);

module.exports = Comments