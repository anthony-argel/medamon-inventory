let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
    name: {type:String, minlength:1, maxlength:25, required:true},
    description: {type:String, minlength:1, required:true},
    imgurl: {type:String, minlength:1, required: true}
});

ManufacturerSchema
.virtual('url')
.get(function() {
    return '/shop/manufacturer/' + this._id;
});

ManufacturerSchema
.virtual('update')
.get(function() {
    return '/shop/manufacturer/update/' + this._id;
});

ManufacturerSchema
.virtual('delete')
.get(function() {
    return '/shop/manufacturer/delete/' + this._id;
}); 

module.exports = mongoose.model('Manufacturer', ManufacturerSchema);