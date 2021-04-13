let Manufacturer = require('../models/Manufacturer');
let Part = require('../models/Part');
const { body,validationResult } = require('express-validator');
const async = require('async');

exports.manufacturer_info = (req, res, next) => {
    Manufacturer
    .findById(req.params.id)
    .exec((err, result) => {
        if(err) {return next(err);}

        res.render('general_info', {data: result, datatype: "manufacturer"});
    });
}

exports.manufacturer_update_get = (req, res, next) => {
    Manufacturer
    .findById(req.params.id)
    .exec((err, results) => {
        if(err) {return next(err);}

        res.render('general_form', {title:"Update Manufacturer", data: results}); 
    });
};

exports.manufacturer_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty.').trim().isLength({min:1}).escape(),
    body('imgurl', 'Imgurl must not be empty').trim().isLength({min:1}),
    (req, res, next) => {
        const errors = validationResult(req);
        let manufacturer = new Manufacturer({
            name: req.body.name,
            description: req.body.description,
            imgurl: req.body.imgurl,
            _id: req.params.id 
        });

        if(!errors.isEmpty()) {
            Manufacturer.findById(req.params.id).exec((err, results)=> {
                if(err) {return next(err);}
                res.render('general_form', {title:"Update Manufacturer", data:results, errors:errors.array()});
            })
        }
        else {
            Manufacturer.findByIdAndUpdate(req.params.id, manufacturer, {}, function(err, theManufacturer) {
                if(err) {return next(err);}
                res.redirect(theManufacturer.url);
            })
        }
    }
];

exports.manufacturer_delete_get = (req, res, next) => {
    async.parallel({
        part: function(callback) {
            Part.find({manufacturer: req.params.id}).exec(callback);
        },
        manufacturer: function(callback) {
            Manufacturer.findById(req.params.id).exec(callback);     
        }
    },
    (err, result) => {
        if(err) {return next(err);}
        res.render('general_delete', {title:'Delete Manufacturer', data:result.manufacturer, part: result.part});
    });
};

exports.manufacturer_delete_post = (req, res, next) => {
    async.parallel({
        Manufacturer: function(callback) {
            Manufacturer.findById(req.params.id).exec(callback);
        },
        parts: function(callback) {
            Part.find({Manufacturer:req.params.id}).exec(callback);
        }
    },
    (err, results) => {
        if(err) {return next(err);}

        if(results.parts.length >0) {
            res.render('Manufacturer_delete', {title:'Delete Manufacturer', Manufacturer:result.Manufacturer, part: result.part});
        }
        else {
            Manufacturer.findByIdAndRemove(req.params.id, function deleteManufacturer(err) {
                if(err) {return next(err);}
                res.redirect('/shop/Manufacturers'); 
            });
        }    
    });
};



exports.manufacturer_list = (req, res, next) => {
    Manufacturer.find().exec((err, result)=> {
        if(err) {return next(err);}
        res.render('general_list', {title:"Manufacturers", data:result});
    })
};

exports.manufacturer_create_get = (req, res, next) => {
    res.render('general_form', {title: "Add Manufacturer"});
}

exports.manufacturer_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty.').trim().isLength({min:1}).escape(),
    body('imgurl', 'Imgurl must not be empty').trim().isLength({min:1}),
   (req, res, next) => {
       const errors = validationResult(req);

       let manufacturer = new Manufacturer({
           name: req.body.name,
           description: req.body.description,
           imgurl: req.body.imgurl
       })
       if(!errors.isEmpty()) {
        res.render('general_form', {title:"Add Manufacturer", errors:errors.array()});
       }
       else {
           Manufacturer.findOne({'name':req.body.name})
           .exec((err, manufacturerFound) => {
               if(err) {return next(err);}

               if(manufacturerFound) {
                   res.redirect(manufacturerFound.url);
               } 
               else {
                   manufacturer.save(function(err) {
                       if(err) {return next(err);}
                       res.redirect(manufacturer.url); 
                   }); 
               }
           });
       } 
   }
];