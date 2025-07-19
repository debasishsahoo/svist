db.products
  .find({ price:{$in:[699,799]}})  // Any of One
  .projection({})
  .sort({})
  .limit(0);

db.products
  .find({ color: { $in: ['black','white'] } })
  .projection({})
  .sort({})
  .limit(0);

db.products
  .find({ color: { $in: [/^o+/] } })
  .projection({})
  .sort({})
  .limit(0);


db.products.find({ color:{$in:['purple','gold']}}).projection({}).sort({}).limit(0);


