let express = require('express');
let router = express.Router();

// /part/create/id
// /part/id
// /part/update/id
// /part/delete/id

const part_controller = require('../controllers/PartController');
const type_controller = require('../controllers/TypeController');

router.get('/', part_controller.parts_count_by_type);
router.get('/parts', part_controller.parts_list);
router.get('/part/update/:id', function(req, res) {
    res.send('kappa');
});
router.get('/part/:id', part_controller.part_info);






// Type
router.get('/parts/type/:id', part_controller.parts_by_type);


module.exports = router;