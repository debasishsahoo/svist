db.products.find({
    price: {
        $not: { $gt: 699 }
    }
})

db.products.find({
    price: {
        $lte: 699
    }
})

db.products.find({name:{$not:/^Smart/}})

db.products.find({name:{$not:/^x/}})