const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: false
    },
    password : {
        type : String,
        required: true
    },
	question : {
        type : String,
        required: true
    },
	answer : {
        type : String,
        required: true
    },
                              
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User