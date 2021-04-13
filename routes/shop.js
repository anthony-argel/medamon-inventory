let express = require('express');
let router = express.Router();

// /part/create/id
// /part/id
// /part/update/id
// /part/delete/id

const part_controller = require('../controllers/PartController');
const type_controller = require('../controllers/TypeController');

// PARTS
// catalog
router.get('/', part_controller.parts_count_by_type);
// all parts
router.get('/parts', part_controller.parts_list);
//create
router.get('/part/create', part_controller.part_create_get);
router.post('/part/create', part_controller.part_create_post);
// update
router.get('/part/update/:id', part_controller.part_update_get);
router.post('/part/update/:id', part_controller.part_update_post);
// delete
// read
router.get('/part/:id', part_controller.part_info);
// Type
router.get('/parts/type/:id', part_controller.parts_by_type);

// TYPE
router.get('/types', type_controller.types_list);
// create
router.get('/type/create', type_controller.type_create_get);
router.post('/type/create', type_controller.type_create_post);
// update
router.get('/type/update/:id', type_controller.type_update_get);
router.post('/type/update/:id', type_controller.type_update_post);
// delete
router.get('/type/delete/:id', type_controller.type_delete_get);
router.post('/type/delete/:id', type_controller.type_delete_post);
// read
router.get('/type/:id', type_controller.type_info);
module.exports = router;