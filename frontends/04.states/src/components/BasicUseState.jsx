import React,{useState} from 'react'
const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
};
// Text input with state
const NameInput = () => {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
      <p>Your name has {name.length} characters</p>
    </div>
  );
};

// Boolean state for toggles
const ToggleVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>
      {isVisible && (
        <div className="content">
          <p>This content can be toggled!</p>
        </div>
      )}
    </div>
  );
};




const BasicUseState = () => {
    return (
        <div>
            <Counter/>
            <br/>
            <NameInput/>
            <br/>
            <ToggleVisibility/>
        </div>
    )
}

export default BasicUseState
