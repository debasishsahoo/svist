db.products.find({
  color: { $all: ["black", "white"] },
});

db.products.find({ $and: [{ color: "black" }, { color: "white" }] });
