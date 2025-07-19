// # To Find All Record
db.books.find({})  // {} is A blank Object

// # Custom Query
db.books.find({_id:10})


// # Complex Custom Query
const findQuery={categories:'Java'}
const showAttribute={title:1,isbn:1,_id:0}
//db.books.find(findQuery)
db.books.find(findQuery,showAttribute)
