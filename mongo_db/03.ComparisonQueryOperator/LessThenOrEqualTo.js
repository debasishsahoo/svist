//$lte less then or Equal to Operator
db.products.find({price:{$lte:799}})
   .projection({})
   .sort({})
   .limit(0)
   
//Query From Embedded Document
db.products
  .find({ "spec.ram": { $lte: 8 } })
  .projection({})
  .sort({})
  .limit(0);
  
//Check if An Array Element Less then or Equal a Value
db.products.find({ storage:{$lte:64}}).projection({}).sort({}).limit(0);


//to Check if a Field less then or Equals a Date
db.products.find({ releaseDate:{$lte:new ISODate('2015-01-01')}}).projection({}).sort({}).limit(0);








