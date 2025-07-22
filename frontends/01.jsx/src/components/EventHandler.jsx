import React from "react";

const EventHandler = () => {
  const handleClick = (message) => {
    alert(message);
  };

  const handleInputChange = (event) => {
    console.log("Input value:", event.target.value);
  };

  const interactiveElements = (
    <div>
      <button onClick={() => handleClick("Button clicked!")}>Click Me</button>
      <br/>
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      <button onClick={() => console.log("Direct function call")}>
        Console Log
      </button>
    </div>
  );

  return <>{interactiveElements}</>;
};

export default EventHandler;
