let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartSchema = new Schema({
    name: {type:String, required:true},
    manufacturer: {type:Schema.Types.ObjectId, ref:'Manufacturer', required:true},
    type: {type:Schema.Types.ObjectId, ref:'Type', required:true},
    price: {type:Number, required:true},
    description: {type:String, minlength:1, required:true},
    stock: {type:String, min:0, required:true}
});

PartSchema
.virtual('url')
.get(function() {
    return '/shop/part/' + this._id;
});

module.exports = mongoose.model('Part', PartSchema);