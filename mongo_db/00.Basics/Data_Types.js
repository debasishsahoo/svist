// Data types

const Books = [
  { isbn: null }, //Null
  { best_seller: true }, //bool
  { price: 9.95, pages: 851 }, //4 Bit Number
  { year: NumberInt("2024"), words: NumberInt("95403") }, //8 Bit Number
  { title: "MongoDB Tutorial" }, //String
  { updated_at: new Date() }, //Date
  { pattern: "/d+'" }, //REGEX
  { reviews: ["dev", 3.4, "ani", 3.6] }, //Array
  {
    author: {
      first_name: "Debasish", //Embedded Document
      last_name: "Sahoo",
    },
  }
];
