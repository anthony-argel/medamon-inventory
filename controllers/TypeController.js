let Type = require('../models/Type');
let Part = require('../models/Part');
const { body,validationResult } = require('express-validator');
const async = require('async');

exports.type_info = (req, res, next) => {
    Type
    .findById(req.params.id)
    .exec((err, result) => {
        if(err) {return next(err);}

        res.render('general_info', {data: result, datatype:"type"});
    });
}

exports.type_update_get = (req, res, next) => {
    Type
    .findById(req.params.id)
    .exec((err, results) => {
        if(err) {return next(err);}

        res.render('type_form', {title:"Update Type", type: results});
    });
};

exports.type_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty.').trim().isLength({min:1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        let type = new Type({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if(!errors.isEmpty()) {
            Type.findById(req.params.id).exec((err, results)=> {
                if(err) {return next(err);}
                res.render('type_form', {title:"Update Type", type:results, errors:errors.array()});
            })
        }
        else {
            Type.findByIdAndUpdate(req.params.id, type, {}, function(err, theType) {
                if(err) {return next(err);}
                res.redirect(theType.url);
            })
        }
    }
];

exports.type_delete_get = (req, res, next) => {
    async.parallel({
        part: function(callback) {
            Part.find({type: req.params.id}).exec(callback);
        },
        type: function(callback) {
            Type.findById(req.params.id).exec(callback);     
        }      
    },
    (err, result) => {
        if(err) {return next(err);}
        res.render('general_delete', {title:'Delete Type', data:result.type, part: result.part});
    });
};

exports.type_delete_post = (req, res, next) => {
    async.parallel({
        type: function(callback) {
            Type.findById(req.params.id).exec(callback);
        },
        parts: function(callback) {
            Part.find({type:req.params.id}).exec(callback);
        }
    },
    (err, results) => {
        if(err) {return next(err);}

        if(results.parts.length >0) {
            res.render('general_delete', {title:'Delete Type', data:result.type, part: result.part});
        }
        else {
            Type.findByIdAndRemove(req.params.id, function deleteType(err) {
                if(err) {return next(err);}
                res.redirect('/shop/types');
            });
        }
    });
};

exports.type_create_get = (req, res, next) => {
    res.render('general_form');
}

exports.type_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty.').trim().isLength({min:1}).escape(),
   (req, res, next) => {
       const errors = validationResult(req);

       let type = new Type({
           name: req.body.name,
           description: req.body.description
       })
       if(!errors.isEmpty()) {
        res.render('type_form', {title:"Add Type", errors:errors.array()});
       }
       else {
           Type.findOne({'name':req.body.name})
           .exec((err, typeFound) => {
               if(err) {return next(err);}

               if(typeFound) {
                   res.redirect(typeFound.url);
               }
               else {
                   type.save(function(err) {
                       if(err) {return next(err);}
                       res.redirect(type.url);
                   });
               }
           });
       }
   }
];

exports.types_list = (req, res, next) => {
    Type.find().exec((err, result)=> {
        if(err) {return next(err);}
        res.render('general_list', {data :result});
    })
};