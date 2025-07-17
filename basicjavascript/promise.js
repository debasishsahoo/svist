function traditionalPromise() {
  console.log("1. Traditional Promise Example:");

  // Creating a promise that resolves after 2 seconds
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise resolved successfully!");
    }, 2000);
  });
  // Using .then() to handle the promise
  myPromise.then((result) => {
    console.log("Result:", result);
  });

  console.log("This runs immediately (non-blocking)\n");
}
traditionalPromise()


async function asyncAwaitExample() {
  console.log("2. Async/Await Example:");

  // Creating the same promise
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Async/Await result!");
    }, 2000);
  });

  // Using await to wait for the promise
  const result = await myPromise;
  console.log("Result:", result);
  console.log("This runs after the promise resolves\n");
}

asyncAwaitExample()