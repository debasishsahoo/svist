db.products
  .find({ price:{$nin:[699,799]}})  // Any of One
  .projection({})
  .sort({})
  .limit(0);

db.products
  .find({ color: { $nin: ['black','white'] } })
  .projection({})
  .sort({})
  .limit(0);

db.products
  .find({ color: { $nin: [/^o+/] } })
  .projection({})
  .sort({})
  .limit(0);


db.products.find({ color:{$nin:['purple','gold']}}).projection({}).sort({}).limit(0);


