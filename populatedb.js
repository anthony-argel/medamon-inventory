#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Manufacturer = require('./models/Manufacturer');
var Part = require('./models/Part')
var Type = require('./models/Type')

var mongoose = require('mongoose');
const { syncIndexes } = require('./models/Type');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let manufacturers = [];
let parts = [];
let types = [];

function createManufacturer(name, ranking, foundingDate, description, cb) {
    let manufacturerDetails = {
        name: name,
        ranking: ranking,
        foundingDate: foundingDate,
        description: description
    };

    let manufacturer = new Manufacturer(manufacturerDetails);

    manufacturer.save(function(err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New manufacturer: " + manufacturer);
        manufacturers.push(manufacturer);
        cb(null, manufacturer);
    });
}

function createType(name, description, cb) {
    let typeDetails = {
        name: name,
        description: description
    };

    let type = new Type(typeDetails);

    type.save(function(err){
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New type: " + type);
        types.push(type);
        cb(null, type);
    });
}

function createPart(name, manufacturer, type, price, description, stock, cb) {
    partDetails = {
        name: name,
        manufacturer: manufacturer,
        type: type,
        price: price,
        description: description,
        stock: stock
    };

    let part = new Part(partDetails);

    part.save(function(err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New part: " + part);
        parts.push(part);
        cb(null, part);
    })
}

function createTypes(cb) {
    async.series([
        function(callback) {
            createType('AI Logic Chip', 'A chip you install in your medamon. Determines the behavior of your medamon.', callback);
        },
        function(callback) {
            createType('Head Gear', "Place over your medamon's head. All our suppliers provide shield type head gear.", callback);
        },
        function(callback) {
            createType('Armor', "Place over your medamon's torso. All our suppliers provide defense against piercing.", callback);
        },
        function(callback) {
            createType('Left Arm Gear', "Place over your medamon's left arm. Due to Rosenthal's Law left arm equipment are all defensive in nature.", callback);
        },
        function(callback) {
            createType('Right Arm Gear', "Place over your medamon's right arm. Due to Rosenthal's Law right arm equipment are all offensive in nature.", callback);
        },
        function(callback) {
            createType('Left Leg Gear', "Place over your medamon's left leg.", callback);
        },
        function(callback) {
            createType('Right Leg Gear', "Place over your medamon's left leg.", callback);
        }
    ], 
    cb);
}

function createManufacturers(cb) {
    async.series([
        function(callback) {
            createManufacturer("Vandale Industries", 4, "1989-07-05", "To your opponents dismay, you're wearing Vandale, the new and the hip, have your enemies saying oh frick.", callback);
        },
        function(callback) {
            createManufacturer("Tiny Tuny's", 2, "1995-02-15", "For agile medamon builds, come check out our products.", callback)
        },
        function(callback) {
            createManufacturer("M+P", 3, "1960-06-19", "The longest running medamon manufacturers in the world. Our equipment is guaranteed to last a lifetime.", callback);
        }, 
        function(callback) {
            createManufacturer("Knight's Cradle", 1, "6969-06-09", "Functionality is meaningless without fashion. Win your monbattles with style. The proud sponsor of Phyllis, the current Medamon champion.", callback);
        }
    ],
    cb);
}

function createParts(cb) {
    async.parallel([
        function(callback) {
            createPart("Stoic Angel", manufacturers[3], types[0], 4500.00, "A replica based on the current champion's Medamon. Note: The chip Phyllis uses in Angel is an original AI chip. It was created by an unknown third party. Our replica is based on Phyllis' feedback and not the actual AI chip itself.",3, callback);
        },
        function(callback) {
            createPart("Angel's Helm", manufacturers[3], types[1], 2599.99, "A replica of Angel's signature helmet.", 4,  callback);
        },
        function(callback) {
            createPart("Angel's Torso", manufacturers[3], types[2], 5000.00, "A replica of Angel's torso. The only Medamon part that Phyllis did not switch out for any match during this season.", 2, callback);
        },
        function(callback) {
            createPart("Twilight Pariah", manufacturers[3], types[3], 2000.00, "A replica of Angel's signature defensive gear. A lightweight shield.", 5, callback);
        },
        function(callback) {
            createPart("Saint's Cross", manufacturers[3], types[4], 2000.00, "A replica of Angel's signature weapon. A blindingly bright white sword.", 5, callback);
        },
        function(callback) {
            createPart("Angel's Left Leg", manufacturers[3], types[5], 2000.00, "A replica of Angel's most common left leg.", 5, callback);
        },
        function(callback) {
            createPart("Angel's Right Leg", manufacturers[3], types[6], 2000.00, "A replica of Angel's most common right leg.", 5, callback);
        },
        function(callback) {
            createPart("Lisa II", manufacturers[2], types[0], 50.00, "A well-balanced chip. You will get a little bit of everyting that a Medamon needs.", 10, callback);
        },
        function(callback) {
            createPart("Jyre 2960", manufacturers[2], types[0], 75.00, "A chip that emphasizes speed and defense. Recommended for enthusiast speed builds.", 20, callback);
        },
        function(callback) {
            createPart("kGear x69", manufacturers[2], types[1], 50.00, "A bulky but dependable helmet.", 20, callback);
        },
        function(callback) {
            createPart("kTorso x69", manufacturers[2], types[2], 50.00, "A bulky but dependable torso.", 16, callback);
        },
        function(callback) {
            createPart("kShield T20", manufacturers[2], types[3], 50.00, "A large black shield.", 17, callback);
        },
        function(callback) {
            createPart("Shinji's Regret", manufacturers[1], types[4], 20.00, "Shoot white acide that erodes an enemies armor. May cause instability depending on the logic chip installed.", 30, callback);
        },
        function(callback) {
            createPart("Vibriz", manufacturers[1], types[4], 20.00, "A vibrating sword. Works well against thin shields.", 20, callback);
        },
        function(callback) {
            createPart("Chain Spandex (L)", manufacturers[0], types[5], 5.00, "Comfy and clean.", 40, callback);
        },
        function(callback) {
            createPart("Chain Spandex (R)", manufacturers[0], types[6], 5.00, "Comfy and clean.", 35, callback);
        }
    ],
    cb);
}

async.series([
    createTypes,
    createManufacturers,
    createParts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Parts: '+ parts);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




