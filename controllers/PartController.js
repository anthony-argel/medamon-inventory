const async = require('async');
const Manufacturer = require('../models/Manufacturer');
const Type = require('../models/Type');
const Part = require('../models/Part');

const { body,validationResult } = require('express-validator');

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
                partsCount[types[i].name] = {imgurl: types[i].imgurl,count:newCount, url:types[i].url, id:types[i]._id};
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
    async.parallel({
        part: function(callback) {
            Part
            .findById(req.params.id)
            .exec(callback);
        },
        manufacturers: function(callback) {
            Manufacturer
            .find()
            .exec(callback);
        },
        types: function(callback) {
            Type.find().exec(callback);
        }
    },
    (err, results) => {
        if(err) {return next(err);}
        res.render('part_form', {title:"Update Part", part: results.part, manufacturers: results.manufacturers, types: results.types});
    });
}

exports.part_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min:1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min:1}).escape(),
    body('price', 'Price must not be negative.').isFloat({min:0}).escape(),
    body('stock', 'Stock must not be negative.').isInt({min:0}).escape(),
    body('manufacturer', 'Manufacturer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('type', 'Type must not be empty').trim().isLength({min:1}).escape(),
    body('imgurl', 'A proper image URL is required.').isURL(),
    body('password', 'Input the correct password').equals(process.env.ADMINPASSWORD),
    (req, res, next) => {
        const errors = validationResult(req);

        let part = new Part({
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            type: req.body.type,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            imgurl:req.body.imgurl,
            _id: req.params.id
        });

        if(!errors.isEmpty()){
            async.parallel({
                part: function(callback) {
                    Part
                    .findById(req.params.id)
                    .exec(callback);
                },
                manufacturers: function(callback) {
                    Manufacturer
                    .find()
                    .exec(callback);
                },
                types: function(callback) {
                    Type.find().exec(callback);
                }
            },
            (err, results) => {
                if(err) {return next(err);}
                res.render('part_form', {title:"Update Part", part: results.part, manufacturers: results.manufacturers, types: results.types, errors:errors.array()});
            });
            return;
        }
        else {
            Part.findByIdAndUpdate(req.params.id, part, {}, function(err, thePart) {
                if(err) {return next(err);}
                res.redirect(thePart.url);
            })
        }
    }
];

exports.part_create_get = (req, res, next) => {
    async.parallel({
        manufacturers: function(callback) {
            Manufacturer.find().exec(callback);
        },
        types: function(callback) {
            Type.find().exec(callback);
        }
    },
    (err, results) => {
        if(err) {return next(err);}
        res.render('part_form', {title:"Add Part",manufacturers: results.manufacturers, types: results.types});
    });
};

exports.part_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({min:1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min:1}).escape(),
    body('price', 'Price must not be negative.').isFloat({min:0}).escape(),
    body('stock', 'Stock must not be negative.').isInt({min:0}).escape(),
    body('manufacturer', 'Manufacturer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('type', 'Type must not be empty').trim().isLength({min:1}).escape(),
    body('imgurl', 'A proper image URL is required.').isURL(),
    body('password', 'Input the correct password').equals(process.env.ADMINPASSWORD),
    (req, res, next) => {
        const errors = validationResult(req);

        let part = new Part({
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            type: req.body.type,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            imgurl: req.body.imgurl
        });

        if(!errors.isEmpty()){
            async.parallel({
                part: function(callback) {
                    Part
                    .findById(req.params.id)
                    .exec(callback);
                },
                manufacturers: function(callback) {
                    Manufacturer
                    .find()
                    .exec(callback);
                },
                types: function(callback) {
                    Type.find().exec(callback);
                }
            },
            (err, results) => {
                if(err) {return next(err);}
                res.render('part_form', {title:"Add Part", part: results.part, manufacturers: results.manufacturers, types: results.types, errors:errors.array()});
            });
            return;
        }
        else {
            // check if a part with that name and manufacturer already exists
            Part.findOne({'name': req.body.name, 'manufacturer':req.body.manufacturer})
            .exec((err, partFound) => {
                if(err) {return next(err);}

                if(partFound){
                    res.redirect(partFound.url);
                }
                else {
                    part.save(function (err) {
                        if (err) { return next(err); }
                           //successful - redirect to new book record.
                           res.redirect(part.url);
                    });
                }
            });
            
        }
    }
];

exports.part_delete_get = (req, res, next) => {
    Part.findById(req.params.id).exec((err, result)=> {
        if(err) {return next(err);}
        res.render('general_delete', {title:"Delete Part", data: result});  
    });
};

exports.part_delete_post = [
    body('password', 'Input the correct password').equals(process.env.ADMINPASSWORD),
    (req, res, next) => {
        Part.findById(req.params.id).exec((err, result)=> {
            if(err) {return next(err);}
            if(result !== undefined) {
                Part.findByIdAndRemove(req.params.id, function deletePart(err) {
                    if(err) {return next(err);}
                    res.redirect('/shop/parts');
                })
            }
        });
    }
];