const router = require("express").Router();


router.get('/');
router.get('/:id');
router.post('/');
router.put('/:id');
router.put('/:id/toggle');
router.delete("/:id");
router.get('/stats');
module.exports = router;