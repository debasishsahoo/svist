db.products.find({
    $nor:[{price:899}]
})

db.products.find({
    $nor:[{price:899},{color:'gold'}]
})

db.products.find({})