const router = require("express").Router();
const taskController = require('../controllers/taskController');
const { validateTask } = require("../middleware/validation");


router.get('/',taskController.getAllTask);
router.get('/:id',taskController.getSingleTask);
router.post('/',validateTask,taskController.createTask);
router.put('/:id',validateTask,taskController.updateTask);
router.put('/:id/toggle',taskController.toggleTask);
router.delete("/:id",taskController.deleteTask);
router.get('/stats',taskController.stats);
module.exports = router;