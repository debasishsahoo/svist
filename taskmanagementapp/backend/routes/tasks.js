const router = require("express").Router();
const taskController = require('../controllers/taskController');


router.get('/',taskController.getAllTask);
router.get('/:id',taskController.getSingleTask);
router.post('/',taskController.createTask);
router.put('/:id',taskController.updateTask);
router.put('/:id/toggle',taskController.toggleTask);
router.delete("/:id",taskController.deleteTask);
router.get('/stats',taskController.stats);
module.exports = router;