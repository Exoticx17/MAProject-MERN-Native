const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    hashtags: {
        type: Array,
    },
    commets: {
        type: Array,
    },
    likes: {
        type: Number,
    }
},{timestamps: true})

const Post = mongoose.model('Post', postSchema)
module.exports = Post;