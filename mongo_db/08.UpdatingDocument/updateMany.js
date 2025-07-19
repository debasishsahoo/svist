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
db.products.updateMany({ price: 899 }, { $set: { price: 1 } });
db.products.find({}, { name: 1, price: 1 });

//update Embedded Doc
db.products.find({ price: { $gt: 700 } });
db.products.updateMany(
  { price: { $gt: 700 } },
  {
    $set: {
      "spec.ram": 32,
      "spec.screen": 9.8,
      "spec.cpu": 5.66,
    },
  }
);

//Array Update
db.products.updateMany(
  { _id: { $in: [1, 2, 3] } },
  { $set: { "storage.0": 16, "storage.1": 32, "storage.2": 64 } }
);
