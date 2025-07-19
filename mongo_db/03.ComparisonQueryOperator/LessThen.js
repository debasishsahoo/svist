// field is less then a Specified Value
db.products.find({price:{$lt:799}})
   .projection({})
   .sort({})
   .limit(0)
   
//Query From Embedded Document
db.products.find({'spec.screen':{$lt:7}})
   .projection({})
   .sort({})
   .limit(0)
   
//Check if An Array Element less or Equal a Value  
db.products.find({'storage':{$lt:128}})
   .projection({})
   .sort({})
   .limit(0)   
   
//to Check if a Field less than a Date
db.products.find({ releaseDate:{$lt:new ISODate('2015-01-11')}}).projection({}).sort({}).limit(0);   
   
   
   
   
   
   
   
   