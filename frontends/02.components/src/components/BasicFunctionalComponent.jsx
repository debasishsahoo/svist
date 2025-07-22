import React from "react";

// Simple functional component
function Welcome() {
  return <h1>Welcome to our website!</h1>;
}

// Arrow function component
const Greeting = () => {
  return <h2>Hello, there!</h2>;
};

// Component with implicit return
const SimpleButton = () => <button>Click me</button>;

// Component with parameters (props)
function UserGreeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Modern destructured props
const ProductCard = ({ title, price, description }) => {
  return (
    <div className="product-card">
      <h3>{title}</h3>
      <p className="price">${price}</p>
      <p className="description">{description}</p>
    </div>
  );
};
 import "./styles/product.css"; // Importing CSS styles

const BasicFunctionalComponent = () => {
  return (
    <div>
      <h1>Basic Functional Component</h1>
      <Welcome />
      <br />
      <Greeting />
      <br />
      <SimpleButton />
      <br />
      <UserGreeting name="Debasish" />
      <br />
      <ProductCard
        title="Sample Product"
        price="29.99"
        description="This is a great product."
      />
    </div>
  );
};

export default BasicFunctionalComponent;
