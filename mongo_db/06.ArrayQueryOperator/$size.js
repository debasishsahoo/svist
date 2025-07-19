db.products.find({})

db.products.find({color:{$size:2}})

db.products.find({$or: [{ color: { $size: 1 } }, { color: { $size: 2 } }]}})
db.products.find({$nor: [{ color: { $size: 1 } }, { color: { $size: 2 } }]}})

