use ssadb

db.products.find({}})

db.products.insertOne({ "_id": 8, "name": "xReader_2", "price": "999", "spec": { "ram": 64, "screen": 6.7, "cpu": 3.66 }, "color": ["black", "white"], "storage": [128] })

db.products.find({ price: { $type: "string" } })

db.products.find({ price: { $type: 2 } })

db.products.find({ price: { $type: "number" } })

db.products.find({ price: { $type: "array" } })
db.products.find({ price: { $type: 4 } })

db.products.find({ price: { $type:["number","string"] } })


