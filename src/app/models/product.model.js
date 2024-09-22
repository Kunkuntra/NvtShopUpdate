const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const product = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    productType: { type: String, enum:['Furnitures', 'Foods', 'Other'] },
    brand: { type: String },
    currentPrice: { type: Number, required: true },
    oldPrice: { type: Number },
    origin: { type: String },
    remaining: { type: Number },
    slug: { type: String, slug: 'name', unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

product.plugin(mongooseDelete, 
    { 
        deletedAt : true,
        overrideMethods: true,
    });

module.exports = mongoose.model('product', product);
