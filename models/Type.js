let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const TypeSchema = new Schema({
    name: {type:String, minlength:1, required:true},
    description: {type:String, minlength:1, required:true}
});

TypeSchema
.virtual('url')
.get(function() {
    return '/shop/type/' + this._id;
});

TypeSchema
.virtual('all_parts_url')
.get(function() {
    return '/shop/parts/type/' + this._id;
});

TypeSchema
.virtual('update')
.get(function() {
    return '/shop/type/update/' + this._id;
});

TypeSchema
.virtual('delete')
.get(function() {
    return '/shop/type/delete/' + this._id;
});

module.exports = mongoose.model('Type', TypeSchema);