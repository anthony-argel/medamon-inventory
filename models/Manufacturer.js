let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
    name: {type:String, minlength:1, maxlength:25, required:true},
    ranking: {type:Number, min:1},
    foundingDate: {type:Date},
    description: {type:String, minlength:1, required:true}
});

ManufacturerSchema
.virtual('url')
.get(function() {
    return '/shop/manufacturer/' + this._id;
});


module.exports = mongoose.model('Manufacturer', ManufacturerSchema);