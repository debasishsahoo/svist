// field is Grater then a Specified Value
db.products.find({price:{$gt:699}})
   .projection({})
   .sort({})
   .limit(0)
   
//Query From Embedded Document
db.products.find({'spec.screen':{$gt:7}})
   .projection({})
   .sort({})
   .limit(0)
   
//Check if An Array Element grater then a Value  
db.products.find({'storage':{$gt:128}})
   .projection({})
   .sort({})
   .limit(0)   
   
//to Check if a Field grater than a Date
db.products.find({ releaseDate:{$gt:new ISODate('2015-01-11')}}).projection({}).sort({}).limit(0);   
   
   
   
   
   
   
   
   