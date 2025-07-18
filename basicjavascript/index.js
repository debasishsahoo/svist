// console.log("Step 1");
// console.log("Step 2");

// console.log("Start");
// setTimeout(() => {
//   console.log("Async operation done!");
// }, 0);
// console.log("End");

// console.log("Step 3");
// console.log("Step 4");



//  async function fetchData() {
//   const response = await  fetch('https://jsonplaceholder.typicode.com/todos/1');
//   const data =   await response.json();
//   console.log(data);
// }
// fetchData();



// async function fetchData() {
//   try {
//     const response = await fetch(
//       "https://jsonplaceholder.typicode.com/todos/1"
//     );
//     if (!response.ok) throw new Error('Network error');
//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//   }
// }
// fetchData();





// function fetchData(){
// fetch("https://jsonplaceholder.typicode.com/todos/1")
//   .then(response => {
//     if (!response.ok) throw new Error('Network error');
//     return response.json();
//   })
//   .then(data => console.log(data))
//   .catch(error => console.error("Error fetching data:", error.message));
// }

// fetchData();


// try {
//   const result = 10 / 0;
//   console.log(result); // No error (Infinity)

//   const invalidFunc = nonExistentFunction(); // Throws ReferenceError



// } catch (error) {
//   console.error("Error caught:", error.message); // "nonExistentFunction is not defined"
// } finally {
//   console.log("This always runs.");
// }


// function divide(a, b) {
//   try {
//     if (b === 0) throw new Error("Division by zero!");
//     return a / b;
//   } catch (error) {
//     return error.message;
//   }
// }

// console.log(divide(10, 2)); //Output-5
// console.log(divide(10, 0)); //

// try {
//   try {
//     nonExistentFunction(); // Throws ReferenceError
//   } catch (innerError) {
//     console.error("Inner catch:", innerError.message);
//     throw new Error("Rethrown error!"); // Re-throw to outer catch
//   }
// } catch (outerError) {
//   console.error("Outer catch:", outerError.message);
// }

const fruits = ["A", "B", "C"];

fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`);
});
// Output:
// 0: A
// 1: B
// 2: C



const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(num => num % 2 === 0);

console.log(evens);

const person = { name: "Alice", age: 25 };

for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
const fruits2 = ["A", "B", "C"];

for (const fruit of fruits2) {
  console.log(fruit);
}



const [a, b, c] = [1, 2, 3];
console.log(a, b, c);
