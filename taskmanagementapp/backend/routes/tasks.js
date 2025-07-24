const router = require("express").Router();
const taskController = require('../controllers/taskController');
const { ValidateTask } = require("../middleware/validation");


router.get('/',taskController.getAllTask);
router.get('/:id',taskController.getSingleTask);
router.post('/',ValidateTask,taskController.createTask);
router.put('/:id',ValidateTask,taskController.updateTask);
router.put('/:id/toggle',taskController.toggleTask);
router.delete("/:id",taskController.deleteTask);
router.get('/stats',taskController.stats);
module.exports = router;