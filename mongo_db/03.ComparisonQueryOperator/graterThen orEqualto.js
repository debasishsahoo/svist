// field is Grater then a Specified Value
db.products.find({price:{$gte:799}})
   .projection({})
   .sort({})
   .limit(0)
   
//Query From Embedded Document
db.products.find({'spec.screen':{$gte:9.5}})
   .projection({})
   .sort({})
   .limit(0)
   
//Check if An Array Element grater then a Value  
db.products.find({'storage':{$gte:512}})
   .projection({})
   .sort({})
   .limit(0)   
   
//to Check if a Field grater than a Date
db.products.find({ releaseDate:{$gte:new ISODate('2020-01-11')}}).projection({}).sort({}).limit(0);   
   
   
   
   
   
   
   
   