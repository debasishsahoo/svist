// ========================================
// ASYNC/AWAIT TUTORIAL FOR BEGINNERS
// ========================================

console.log("=== ASYNC/AWAIT TUTORIAL ===\n");

// ========================================
// 1. BASIC PROMISE EXAMPLE (Traditional Way)
// ========================================

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

// ========================================
// 2. SAME EXAMPLE WITH ASYNC/AWAIT
// ========================================

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

// ========================================
// 3. SIMULATING API CALLS
// ========================================

// Simulating different API calls with different delays
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
        });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "First Post", content: "Hello World!" },
        { id: 2, title: "Second Post", content: "Learning async/await!" },
      ]);
    }, 1500);
  });
}

// ========================================
// 4. SEQUENTIAL ASYNC OPERATIONS
// ========================================

async function sequentialExample() {
  console.log("3. Sequential Async Operations:");

  try {
    console.log("Fetching user data...");
    const user = await fetchUserData(1);
    console.log("User:", user);

    console.log("Fetching user posts...");
    const posts = await fetchUserPosts(user.id);
    console.log("Posts:", posts);

    console.log("All data fetched successfully!\n");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ========================================
// 5. PARALLEL ASYNC OPERATIONS
// ========================================

async function parallelExample() {
  console.log("4. Parallel Async Operations:");

  try {
    console.log("Fetching user data and posts simultaneously...");

    // Start both operations at the same time
    const userPromise = fetchUserData(2);
    const postsPromise = fetchUserPosts(2);

    // Wait for both to complete
    const [user, posts] = await Promise.all([userPromise, postsPromise]);

    console.log("User:", user);
    console.log("Posts:", posts);
    console.log("Both operations completed in parallel!\n");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ========================================
// 6. ERROR HANDLING WITH ASYNC/AWAIT
// ========================================

async function errorHandlingExample() {
  console.log("5. Error Handling Example:");

  try {
    // This will cause an error (invalid user ID)
    const user = await fetchUserData(-1);
    console.log("User:", user);
  } catch (error) {
    console.log("Caught error:", error.message);
  }

  console.log("Program continues after error handling\n");
}

// ========================================
// 7. MULTIPLE ASYNC OPERATIONS WITH DIFFERENT PATTERNS
// ========================================

async function multipleOperationsExample() {
  console.log("6. Multiple Async Operations:");

  try {
    // Sequential operations (one after another)
    console.log("Sequential approach:");
    const start1 = Date.now();
    const user1 = await fetchUserData(3);
    const posts1 = await fetchUserPosts(3);
    const end1 = Date.now();
    console.log(`Sequential time: ${end1 - start1}ms`);

    // Parallel operations (at the same time)
    console.log("Parallel approach:");
    const start2 = Date.now();
    const [user2, posts2] = await Promise.all([
      fetchUserData(4),
      fetchUserPosts(4),
    ]);
    const end2 = Date.now();
    console.log(`Parallel time: ${end2 - start2}ms`);

    console.log("Parallel is faster!\n");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ========================================
// 8. REAL-WORLD EXAMPLE: PROCESSING MULTIPLE USERS
// ========================================

async function processMultipleUsers() {
  console.log("7. Processing Multiple Users:");

  const userIds = [1, 2, 3];

  try {
    // Process users in parallel
    const userPromises = userIds.map((id) => fetchUserData(id));
    const users = await Promise.all(userPromises);

    console.log("All users processed:");
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email})`);
    });

    console.log("Finished processing all users\n");
  } catch (error) {
    console.error("Error processing users:", error.message);
  }
}

// ========================================
// 9. ASYNC FUNCTION VARIATIONS
// ========================================

// Regular async function
async function regularAsync() {
  return "Regular async function";
}

// Async arrow function
const arrowAsync = async () => {
  return "Arrow async function";
};

// Async method in object
const myObject = {
  async myMethod() {
    return "Object method async";
  },
};

async function functionVariationsExample() {
  console.log("8. Different Async Function Types:");

  const result1 = await regularAsync();
  console.log(result1);

  const result2 = await arrowAsync();
  console.log(result2);

  const result3 = await myObject.myMethod();
  console.log(result3);

  console.log();
}

// ========================================
// 10. COMMON MISTAKES TO AVOID
// ========================================

async function commonMistakesExample() {
  console.log("9. Common Mistakes to Avoid:");

  // MISTAKE 1: Forgetting to use await
  console.log("Mistake 1 - Forgetting await:");
  const promise = fetchUserData(5); // Missing await!
  console.log("This will show a Promise object:", promise);

  // CORRECT WAY:
  const user = await fetchUserData(5);
  console.log("This shows the actual user data:", user);

  // MISTAKE 2: Using await in a non-async function
  // This would cause an error:
  // function nonAsyncFunction() {
  //     const result = await fetchUserData(1); // Error!
  // }

  console.log("Always use await inside async functions!\n");
}

// ========================================
// MAIN EXECUTION FUNCTION
// ========================================

async function runTutorial() {
  console.log("Starting Async/Await Tutorial...\n");

  // Run traditional promise example
  traditionalPromise();

  // Wait a bit, then run async examples
  setTimeout(async () => {
    await asyncAwaitExample();
    await sequentialExample();
    await parallelExample();
    await errorHandlingExample();
    await multipleOperationsExample();
    await processMultipleUsers();
    await functionVariationsExample();
    await commonMistakesExample();

    console.log("=== TUTORIAL COMPLETE ===");
    console.log("Key takeaways:");
    console.log("• async/await makes asynchronous code look synchronous");
    console.log("• Always use 'await' with promises inside async functions");
    console.log("• Use try/catch for error handling");
    console.log("• Use Promise.all() for parallel operations");
    console.log("• Sequential operations are slower than parallel ones");
  }, 3000);
}

// ========================================
// RUN THE TUTORIAL
// ========================================

runTutorial();
