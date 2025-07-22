import React, { useState, useEffect } from "react";

const LifecycleExample = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // Equivalent to componentDidMount
  useEffect(() => {
    console.log("Component mounted");
    document.title = "React App";

    // Cleanup function (equivalent to componentWillUnmount)
    return () => {
      console.log("Component will unmount");
    };
  }, []); // Empty dependency array means this runs once on mount

  // Equivalent to componentDidUpdate for count changes
  useEffect(() => {
    console.log("Count updated:", count);
    if (count > 0) {
      document.title = `Count: ${count}`;
    }
  }, [count]); // Runs when count changes

  // Effect for name changes
  useEffect(() => {
    console.log("Name updated:", name);
  }, [name]); // Runs when name changes

  return (
    <div>
      <h2>Lifecycle Example</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
};

const FunctionalComponentLifecycle = () => {
    return (
        <div>
            <LifecycleExample />
        </div>
    )
}

export default FunctionalComponentLifecycle

