



//$eq Equal to Operator
db.products
  .find({ price: { $eq: 899 } })
  .projection({ name: 1, price: 1 })
  .sort({})
  .limit(0);
//Both Can Work and Write
db.products
  .find({ price: 899 })
  .projection({ name: 1, price: 1 })
  .sort({})
  .limit(0);

//Query From Embedded Document
db.products
  .find({ "spec.ram": { $eq: 4 } })
  .projection({})
  .sort({})
  .limit(0);

//Both Can Work and Write
db.products.find({ "spec.ram": 4 }).projection({}).sort({}).limit(0);


//Check if An Array Element Equal a Value
db.products.find({ color:{$eq:'purple'}}).projection({}).sort({}).limit(0);
db.products.find({ color:'purple'}).projection({}).sort({}).limit(0)


//to Check if a Field Equals a Date
db.products.find({ releaseDate:{$eq:new ISODate('2011-05-14')}}).projection({}).sort({}).limit(0);