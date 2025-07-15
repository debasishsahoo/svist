const router= require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.allUsers);
router.get('/:id', userController.singleUser);

router.post('/', (req, res) => {
  res.send('User route-POST with body: ' + JSON.stringify(req.body));
});
router.put('/:id', (req, res) => {
  res.send('User route-PUT for ID: ' + req.params.id +
     ' with body: ' + JSON.stringify(req.body));
});
router.delete('/:id', (req, res) => {
  res.send('User route-DELETE for ID: ' + req.params.id);
});
module.exports = router;