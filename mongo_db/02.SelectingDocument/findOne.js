// #Find One Return first inseeted Record
//db.books.findOne()

// #Custom Query
// const query={title:'Mongo'}
// db.books.findOne(query)

// #Get First Inserted Record From Product Collection
//db.products.findOne()

// #Get Custom Record From Product Collection
//db.products.findOne({_id:2})

//1: TRUE(SHOW)    
//0: FALSE(Not Show)

db.products.findOne({_id:5},{name:1})
db.products.findOne({_id:5},{name:1,price:1})
db.products.findOne({_id:5},{name:1,spec:1})
db.products.findOne({_id:5},{name:1,_id:0})

db.products.findOne({_id:5},{price:0,releaseDate:0})


