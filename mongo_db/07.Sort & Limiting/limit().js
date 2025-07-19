
db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ price: 1 })
    .limit(3)

db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ price: 1 })
    .skip(1)
    .limit(2)
