// ========================================
// JAVASCRIPT FUNDAMENTALS TUTORIAL
// Loops, Array Methods, and Modern Features
// ========================================

console.log("=== JAVASCRIPT FUNDAMENTALS TUTORIAL ===\n");

// Sample data for examples
const students = [
  { id: 1, name: "Alice", age: 20, grade: 85, subject: "Math" },
  { id: 2, name: "Bob", age: 19, grade: 92, subject: "Science" },
  { id: 3, name: "Charlie", age: 21, grade: 78, subject: "Math" },
  { id: 4, name: "Diana", age: 20, grade: 88, subject: "English" },
  { id: 5, name: "Eve", age: 22, grade: 95, subject: "Science" },
];

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const fruits = ["apple", "banana", "orange", "grape", "kiwi"];

// ========================================
// 1. ARROW FUNCTIONS (Starting with this as it's used throughout)
// ========================================

function arrowFunctionTutorial() {
  console.log("1. ARROW FUNCTIONS");
  console.log("==================");

  // Traditional function
  function traditionalAdd(a, b) {
    return a + b;
  }

  // Arrow function - basic syntax
  const arrowAdd = (a, b) => {
    return a + b;
  };

  // Arrow function - concise syntax (implicit return)
  const arrowAddShort = (a, b) => a + b;

  // Single parameter (parentheses optional)
  const square = (x) => x * x;

  // No parameters
  const greet = () => "Hello World!";

  console.log("Traditional function:", traditionalAdd(5, 3));
  console.log("Arrow function:", arrowAdd(5, 3));
  console.log("Arrow function (short):", arrowAddShort(5, 3));
  console.log("Single parameter:", square(4));
  console.log("No parameters:", greet());

  // Arrow functions with objects (need parentheses)
  const createStudent = (name, age) => ({ name, age });
  console.log("Creating object:", createStudent("John", 20));

  console.log("\n");
}

// ========================================
// 2. FOR IN LOOP
// ========================================

function forInLoopTutorial() {
  console.log("2. FOR IN LOOP");
  console.log("==============");

  const student = {
    name: "Alice",
    age: 20,
    grade: 85,
    subject: "Math",
  };

  console.log("Iterating over object properties:");
  for (const key in student) {
    console.log(`${key}: ${student[key]}`);
  }

  console.log("\nFor in with arrays (shows indices):");
  for (const index in fruits) {
    console.log(`Index ${index}: ${fruits[index]}`);
  }

  console.log("\nFor in with arrays of objects:");
  for (const index in students) {
    const student = students[index];
    console.log(`Student ${index}: ${student.name} (${student.age} years old)`);
  }

  console.log("\n");
}

// ========================================
// 3. FOR OF LOOP
// ========================================

function forOfLoopTutorial() {
  console.log("3. FOR OF LOOP");
  console.log("==============");

  console.log("Iterating over array values:");
  for (const fruit of fruits) {
    console.log(`Fruit: ${fruit}`);
  }

  console.log("\nFor of with numbers:");
  for (const num of numbers) {
    console.log(`Number: ${num}, Square: ${num * num}`);
  }

  console.log("\nFor of with objects in array:");
  for (const student of students) {
    console.log(
      `${student.name} scored ${student.grade} in ${student.subject}`
    );
  }

  console.log("\nFor of with strings:");
  const word = "JavaScript";
  for (const char of word) {
    console.log(`Character: ${char}`);
  }

  console.log("\n");
}

// ========================================
// 4. DESTRUCTURING
// ========================================

function destructuringTutorial() {
  console.log("4. DESTRUCTURING");
  console.log("================");

  // Array destructuring
  console.log("Array Destructuring:");
  const [first, second, third] = fruits;
  console.log(`First: ${first}, Second: ${second}, Third: ${third}`);

  // Skip elements
  const [, , thirdFruit] = fruits;
  console.log(`Third fruit only: ${thirdFruit}`);

  // Rest operator
  const [firstFruit, ...restFruits] = fruits;
  console.log(`First: ${firstFruit}, Rest:`, restFruits);

  // Object destructuring
  console.log("\nObject Destructuring:");
  const { name, age, grade } = students[0];
  console.log(`Name: ${name}, Age: ${age}, Grade: ${grade}`);

  // Renaming variables
  const { name: studentName, grade: studentGrade } = students[1];
  console.log(`Student: ${studentName}, Grade: ${studentGrade}`);

  // Default values
  const { name: n, age: a, country = "Unknown" } = students[0];
  console.log(`Name: ${n}, Age: ${a}, Country: ${country}`);

  // Nested destructuring
  const person = {
    name: "John",
    address: {
      street: "123 Main St",
      city: "New York",
    },
  };

  const {
    name: personName,
    address: { city },
  } = person;
  console.log(`Person: ${personName}, City: ${city}`);

  console.log("\n");
}

// ========================================
// 5. ITERATORS
// ========================================

function iteratorTutorial() {
  console.log("5. ITERATORS");
  console.log("============");

  // Array iterator
  console.log("Array Iterator:");
  const fruitIterator = fruits[Symbol.iterator]();
  console.log("Next:", fruitIterator.next());
  console.log("Next:", fruitIterator.next());
  console.log("Next:", fruitIterator.next());

  // Manual iteration
  console.log("\nManual iteration:");
  const numberIterator = numbers[Symbol.iterator]();
  let result = numberIterator.next();
  while (!result.done) {
    console.log(`Value: ${result.value}`);
    result = numberIterator.next();
    if (result.value > 5) break; // Stop after 5
  }

  // Custom iterator
  console.log("\nCustom Iterator:");
  const customIterable = {
    data: [1, 2, 3, 4, 5],
    [Symbol.iterator]() {
      let index = 0;
      return {
        next: () => {
          if (index < this.data.length) {
            return { value: this.data[index++] * 2, done: false };
          } else {
            return { done: true };
          }
        },
      };
    },
  };

  for (const value of customIterable) {
    console.log(`Custom value: ${value}`);
  }

  console.log("\n");
}

// ========================================
// 6. FOREACH LOOP
// ========================================

function forEachTutorial() {
  console.log("6. FOREACH LOOP");
  console.log("===============");

  console.log("Basic forEach:");
  fruits.forEach((fruit) => {
    console.log(`Fruit: ${fruit}`);
  });

  console.log("\nforEach with index:");
  fruits.forEach((fruit, index) => {
    console.log(`${index + 1}. ${fruit}`);
  });

  console.log("\nforEach with objects:");
  students.forEach((student) => {
    console.log(`${student.name} (${student.age}) - Grade: ${student.grade}`);
  });

  console.log("\nforEach with destructuring:");
  students.forEach(({ name, age, grade }) => {
    console.log(`${name}, age ${age}, scored ${grade}`);
  });

  console.log("\nforEach vs traditional for loop:");
  console.log("Traditional for:");
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 5) {
      console.log(`Found: ${numbers[i]}`);
      break; // Can use break/continue
    }
  }

  console.log("forEach (cannot break):");
  numbers.forEach((num) => {
    if (num > 5) {
      console.log(`Found: ${num}`);
      return; // Only skips current iteration
    }
  });

  console.log("\n");
}

// ========================================
// 7. MAP METHOD
// ========================================

function mapTutorial() {
  console.log("7. MAP METHOD");
  console.log("=============");

  console.log("Basic map - transform numbers:");
  const doubled = numbers.map((num) => num * 2);
  console.log("Original:", numbers);
  console.log("Doubled:", doubled);

  console.log("\nMap with strings:");
  const uppercased = fruits.map((fruit) => fruit.toUpperCase());
  console.log("Original:", fruits);
  console.log("Uppercased:", uppercased);

  console.log("\nMap with objects - extract properties:");
  const studentNames = students.map((student) => student.name);
  console.log("Student names:", studentNames);

  console.log("\nMap with objects - transform:");
  const studentInfo = students.map((student) => ({
    name: student.name,
    status: student.grade >= 85 ? "Excellent" : "Good",
  }));
  console.log("Student status:", studentInfo);

  console.log("\nMap with destructuring:");
  const grades = students.map(({ name, grade }) => `${name}: ${grade}`);
  console.log("Grades:", grades);

  console.log("\nChaining map operations:");
  const processedNumbers = numbers
    .map((num) => num * 2)
    .map((num) => num + 1)
    .map((num) => `Number: ${num}`);
  console.log("Chained operations:", processedNumbers);

  console.log("\n");
}

// ========================================
// 8. FILTER METHOD
// ========================================

function filterTutorial() {
  console.log("8. FILTER METHOD");
  console.log("================");

  console.log("Basic filter - even numbers:");
  const evenNumbers = numbers.filter((num) => num % 2 === 0);
  console.log("Original:", numbers);
  console.log("Even numbers:", evenNumbers);

  console.log("\nFilter strings by length:");
  const longFruits = fruits.filter((fruit) => fruit.length > 5);
  console.log("Original:", fruits);
  console.log("Long fruits:", longFruits);

  console.log("\nFilter objects:");
  const highGradeStudents = students.filter((student) => student.grade >= 85);
  console.log("High grade students:");
  highGradeStudents.forEach((student) => {
    console.log(`  ${student.name}: ${student.grade}`);
  });

  console.log("\nFilter with destructuring:");
  const mathStudents = students.filter(({ subject }) => subject === "Math");
  console.log(
    "Math students:",
    mathStudents.map((s) => s.name)
  );

  console.log("\nMultiple conditions:");
  const youngHighAchievers = students.filter(
    (student) => student.age <= 20 && student.grade >= 85
  );
  console.log(
    "Young high achievers:",
    youngHighAchievers.map((s) => s.name)
  );

  console.log("\nChaining filter and map:");
  const excellentStudentNames = students
    .filter((student) => student.grade >= 90)
    .map((student) => student.name.toUpperCase());
  console.log("Excellent students:", excellentStudentNames);

  console.log("\n");
}

// ========================================
// 9. COMBINING ALL CONCEPTS
// ========================================

function combinedExamples() {
  console.log("9. COMBINING ALL CONCEPTS");
  console.log("=========================");

  console.log("Example 1: Processing student data");

  // Using destructuring in forEach
  students.forEach(({ name, grade, subject }) => {
    console.log(`${name} scored ${grade} in ${subject}`);
  });

  console.log("\nExample 2: Complex data transformation");

  // Chain multiple operations
  const processedData = students
    .filter(({ grade }) => grade >= 85) // High achievers
    .map(({ name, age, grade, subject }) => ({
      name: name.toUpperCase(),
      info: `${age} years old`,
      performance: grade >= 90 ? "Excellent" : "Good",
      subject,
    }))
    .filter(({ subject }) => subject !== "English"); // Exclude English

  console.log("Processed data:", processedData);

  console.log("\nExample 3: Using for...of with destructuring");

  for (const { name, grade, subject } of students) {
    if (grade >= 85) {
      console.log(`⭐ ${name} excels in ${subject} with ${grade}`);
    }
  }

  console.log("\nExample 4: Advanced array operations");

  // Group students by subject using reduce (bonus!)
  const groupedBySubject = students.reduce((acc, student) => {
    const { subject } = student;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(student.name);
    return acc;
  }, {});

  console.log("Grouped by subject:");
  for (const [subject, names] of Object.entries(groupedBySubject)) {
    console.log(`${subject}: ${names.join(", ")}`);
  }

  console.log("\n");
}

// ========================================
// 10. PERFORMANCE AND BEST PRACTICES
// ========================================

function bestPractices() {
  console.log("10. PERFORMANCE & BEST PRACTICES");
  console.log("=================================");

  console.log("When to use each method:");
  console.log(
    "• forEach: When you need to perform side effects (logging, DOM manipulation)"
  );
  console.log(
    "• map: When you need to transform data (always returns new array)"
  );
  console.log(
    "• filter: When you need to select specific items (always returns new array)"
  );
  console.log("• for...of: When you need to iterate and might break early");
  console.log("• for...in: When you need to iterate over object properties");

  console.log("\nPerformance comparison:");

  const largeArray = Array.from({ length: 1000000 }, (_, i) => i);

  // Traditional for loop
  console.time("Traditional for loop");
  let sum1 = 0;
  for (let i = 0; i < largeArray.length; i++) {
    sum1 += largeArray[i];
  }
  console.timeEnd("Traditional for loop");

  // for...of loop
  console.time("for...of loop");
  let sum2 = 0;
  for (const num of largeArray) {
    sum2 += num;
  }
  console.timeEnd("for...of loop");

  // forEach
  console.time("forEach");
  let sum3 = 0;
  largeArray.forEach((num) => {
    sum3 += num;
  });
  console.timeEnd("forEach");

  console.log("All sums equal?", sum1 === sum2 && sum2 === sum3);

  console.log("\nBest practices:");
  console.log("• Use const/let instead of var");
  console.log("• Prefer arrow functions for short operations");
  console.log("• Use destructuring for cleaner code");
  console.log("• Chain array methods for functional programming style");
  console.log("• Consider performance for large datasets");

  console.log("\n");
}

// ========================================
// 11. COMMON MISTAKES AND SOLUTIONS
// ========================================

function commonMistakes() {
  console.log("11. COMMON MISTAKES & SOLUTIONS");
  console.log("===============================");

  console.log("Mistake 1: Modifying original array in map");
  const originalStudents = [...students]; // Copy for demo

  // WRONG - modifying original objects
  const wrongWay = originalStudents.map((student) => {
    student.grade = student.grade + 5; // Modifies original!
    return student;
  });

  // RIGHT - creating new objects
  const rightWay = students.map((student) => ({
    ...student,
    grade: student.grade + 5,
  }));

  console.log(
    "Original array was modified:",
    originalStudents[0].grade !== students[0].grade
  );

  console.log("\nMistake 2: Using map when forEach is needed");

  // WRONG - using map for side effects
  const unused = students.map((student) => {
    console.log(student.name); // Side effect
    return student; // Unnecessary return
  });

  // RIGHT - using forEach for side effects
  students.forEach((student) => {
    console.log(student.name);
  });

  console.log("\nMistake 3: Not understanding arrow function returns");

  // WRONG - missing return statement
  const wrongGrades = students.map((student) => {
    student.grade * 2; // Missing return!
  });
  console.log("Wrong grades (undefined):", wrongGrades);

  // RIGHT - explicit return or implicit return
  const rightGrades = students.map((student) => student.grade * 2);
  console.log("Right grades:", rightGrades);

  console.log("\n");
}

// ========================================
// MAIN EXECUTION
// ========================================

function runTutorial() {
  arrowFunctionTutorial();
  forInLoopTutorial();
  forOfLoopTutorial();
  destructuringTutorial();
  iteratorTutorial();
  forEachTutorial();
  mapTutorial();
  filterTutorial();
  combinedExamples();
  bestPractices();
  commonMistakes();

  console.log("=== TUTORIAL COMPLETE ===");
  console.log("\nKey Takeaways:");
  console.log("• Arrow functions provide concise syntax");
  console.log("• for...in iterates over object properties");
  console.log("• for...of iterates over iterable values");
  console.log("• Destructuring extracts values from arrays/objects");
  console.log("• Iterators provide low-level iteration control");
  console.log("• forEach is for side effects, map for transformation");
  console.log("• filter selects elements based on conditions");
  console.log("• Combine these concepts for powerful data processing");
}

// Run the tutorial
runTutorial();
