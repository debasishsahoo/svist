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

function fetchData(){
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => {
    if (!response.ok) throw new Error('Network error');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching data:", error.message));
}

fetchData();












