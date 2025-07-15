const router= require('express').Router();

router.get('/', (req, res) => {
  res.send('User route-GET');
});
router.get('/:id', (req, res) => {
  res.send('User route-GET for ID: ' + req.params.id);
});
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