const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const order = new Schema({
    userId: String,
    data: String,
    shippingAddress: String,
    totalCost: Number,
    status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered', 'Cancel'], default: 'Pending' }
},{timestamps: true});

module.exports = mongoose.model('order', order);
