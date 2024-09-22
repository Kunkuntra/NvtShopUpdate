const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const comment = new Schema({
    userId: {
        type: String,
        required: true,
        },

    productId: {
        type: String,
        },
    
    content: {
        type: String,
        default: '',
    }
},{timestamps: true});

comment.plugin(mongooseDelete, 
    { 
        deletedAt : true,
        overrideMethods: true,
    });

module.exports = mongoose.model('comment', comment);
