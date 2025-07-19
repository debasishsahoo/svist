db.products.find({})

db.products.find({
    price:{$exists:true}
})

db.products.find({
    price:{$exists:true,$gt:699}
})

db.products.find({
    price:{$exists:false}
})