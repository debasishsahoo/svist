db.products.insertMany([
    {
        _id: 1,
        name: "xPhone",
        price: 799,
        releaseDate: ISODate("2011-05-14"),
        spec: { ram: 4, screen: 6.5, cpu: 2.66 },
        color: ["white", "black"],
        storage: [64, 128, 256],
    },
    {
        _id: 2,
        name: "xTablet",
        price: 899,
        releaseDate: ISODate("2011-09-01"),
        spec: { ram: 16, screen: 9.5, cpu: 3.66 },
        color: ["white", "black", "purple"],
        storage: [128, 256, 512],
    },
    {
        _id: 3,
        name: "SmartTablet",
        price: 899,
        releaseDate: ISODate("2015-01-14"),
        spec: { ram: 12, screen: 9.7, cpu: 3.66 },
        color: ["blue"],
        storage: [16, 64, 128],
    },
    {
        _id: 4,
        name: "SmartPad",
        price: 699,
        releaseDate: ISODate("2020-05-14"),
        spec: { ram: 8, screen: 9.7, cpu: 1.66 },
        color: ["white", "orange", "gold", "gray"],
        storage: [128, 256, 1024],
    },
    {
        _id: 5,
        name: "SmartPhone",
        price: 599,
        releaseDate: ISODate("2022-09-14"),
        spec: { ram: 4, screen: 5.7, cpu: 1.66 },
        color: ["white", "orange", "gold", "gray"],
        storage: [128, 256],
    },
]);


db.products.updateOne({_id:1},{$mul:{price:2}}) //multiply with Current Value
db.products.updateOne({_id:1},{$mul:{price:0.2,"spec.ram":2,"storage.1":2}})
db.products.find({_id:1})
   .projection({name:1,price:1,spec:1,storage:1})
   .sort({})
   .limit(0)
   

   
   
   
   
   
   