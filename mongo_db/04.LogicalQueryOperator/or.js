//Any one  Price  Return True if any one is retrurn false the no effect will be there
db.products.find({ $or: [{ price: 699 }, { price: 899 }] })

db.products.find({ price: { $in: [799, 899] } })

db.products.find({
    $or: [
        { price: { $lt: 699 } },
        { price: { $gt: 799 } },
    ]
})
