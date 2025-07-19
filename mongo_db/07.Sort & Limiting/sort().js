db.products.find({ 'price': { $exists: 1 } }, { name: 1, price: 1 })

db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ price: 1 })
    .limit(0)

db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ price: -1 })
    .limit(0)

db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ name: 1 })
    .limit(0)

db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ name: -1 })
    .limit(0)


db.products.find({ price: { $exists: 1 } })
    .projection({ name: 1, price: 1 })
    .sort({ name: 1, price: 1 })
    .limit(0)

db.products.find({ price: { $exists: 1 } })
    .projection({ price: 1, name: 1 })
    .sort({ price: 1, name: 1 })
    .limit(0)


db.products.find({ price: { $exists: 1 } })
    .projection({ price: 1, name: 1 })
    .sort({ price: -1, name: 1 })
    .limit(0)


db.products.find({ releaseDate: { $exists: 1 }})
    .projection({name: 1,releaseDate:1 })
    .sort({releaseDate:1})
    .limit(0)

db.products.find({ releaseDate: { $exists: 1 }})
    .projection({name: 1,releaseDate:1 })
    .sort({releaseDate:-1})
    .limit(0)


db.products.find({})
    .projection({name: 1,spec:1 })
    .sort({'spec.ram':1})
    .limit(0)


