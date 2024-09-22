const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const user = new Schema({
    name: {
    type: String,
    required: true,
    },

    image: {
    type: String,
    default:'1710476484981.jpg',
    },

    email: {
    type: String,
    required: true,
    unique: [true, "This email is already exist"],
    minlength:3,
    maxlength:50
    },

    phonenumber: {
    type: Number,
    minlength: 8,
    maxlength:13,
    default:'',
    },

    address: {
    type: String,
    default:'',
    },

    password: {
    type: String,
    required: true,
    minlength: 6,
    },

    admin:{
    type:Boolean,
    default:false
    },

    updated: Date,

    created: {
    type: Date,
    default: Date.now,
    },

    token:{
    type:String,
    default:'',
    }
},{timestamps: true});

user.plugin(mongooseDelete, 
    { 
        deletedAt : true,
        overrideMethods: true,
    });

module.exports = mongoose.model('user', user);
