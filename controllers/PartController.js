const async = require('async');
const Manufacturer = require('../models/Manufacturer');
const Type = require('../models/Type');
const Part = require('../models/Part');



exports.parts_list = (req, res, next) => {
    async.parallel({
        parts: function(callback) {
            Part
            .find()
            .exec(callback);    
        },
        types: function(callback) {
            Type.find()
            .exec(callback);
        }
    },
    function(err, results) {
        if(err) {return next(err);}
        res.render('parts_list', {parts:results.parts, types: results.types, allSelected: true});
    });
};

exports.part_info = (req, res, next) => {
    Part
    .findById(req.params.id)
    .populate('type')
    .populate('manufacturer')
    .exec((err, result) => {
        if(typeof result === 'undefined') {
            res.redirect('/shop/parts');
            return;
        }
        if(err) {return next(err);}
        res.render('part_info', {part_data: result});
    });
};

exports.parts_count_by_type = (req, res, next) => {
    let partsCount = {count: 0};
    let totalParts = 0;
    Type.find()
    .exec((err, types) => {
        if(err) {return next(err);}
        for(let i = 0; i < types.length; i++) {
            Part
            .countDocuments({type:types[i]._id})
            .exec((err, newCount) => {
                if(err) {return next(err);}
                totalParts += newCount;
                partsCount[types[i].name] = {count:newCount, url:types[i].url, id:types[i]._id};
                partsCount.count++;
                if(partsCount.count === types.length) {
                    res.render('catalog', {title: 'Current Inventory', partsCount: partsCount, totalParts: totalParts});
                }
            });
        }
    });    
}

exports.parts_by_type = (req, res, next) => {
    async.parallel({
        parts: function(callback) {
            Part
            .find({type: req.params.id})
            .populate('type')
            .populate('manufacturer')
            .exec(callback);
        },
        types: function(callback) {
            Type.find().exec(callback);
        }
    },
    function(err, results) {
        if(err) {return next(err);}
        // check for 404s here.
        res.render('parts_list', {parts:results.parts, types: results.types});
    });
};

exports.part_update_get = (req, res, next) => {
    res.render('part-form');
};