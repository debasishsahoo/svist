//$ne not Equal to Operator
db.products
  .find({ price: { $ne: 899 } })
  .projection({ name: 1, price: 1 })
  .sort({})
  .limit(0);

//Query From Embedded Document
db.products
  .find({ "spec.ram": { $ne: 4 } })
  .projection({})
  .sort({})
  .limit(0);


//Check if An Array Element Equal a Value
db.products.find({ color:{$ne:'purple'}}).projection({}).sort({}).limit(0);

//to Check if a Field Equals a Date
db.products.find({ releaseDate:{$ne:new ISODate('2011-05-14')}}).projection({}).sort({}).limit(0);