//Both Price and color Return True if any one is retrurn false the No data wil be Found
db.products.find({ $and: [{ price: 899 }, { color: { $in: ['gold'] } }] })

db.products.find({ $and: [{ price: 699 }, { price: { $exists: true } }] })