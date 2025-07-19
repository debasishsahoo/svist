#Return All Fields in Matching Document
const query={price:899}
db.products.find(query)
#Return Specified Fields including the _id Fields
db.products.find({},{
    name:1,
    price:1
})
#Return Specified Fields but suppress the _id Fields
db.products.find({},{
    name:1,
    price:1,
    _id:0
})
#Return all Fields but except the some Fields
db.products.find({_id:1},{
    releaseDate:0,
    spec:0,
    storage:0
})
#Return Fields in embedded Document
db.products.find({ _id: 1 }, {
    'name': 1,
    'price': 1,
    'spec.screen': 1
})
     or
db.products.find({ _id: 1 }, {
    name: 1,
    price: 1,
    spec: {screen:1}
})





