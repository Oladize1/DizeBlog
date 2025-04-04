import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique:true,
        minLength: 6
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        enum: ['user', 'author'],
        default: "user"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }]
})

export const User = mongoose.model('User', userSchema)