import React from "react";

const Intro = () => {
  const element = <h1>Hello, This is an Intro JSX!</h1>;
  const name = "Alice";
  const user = { firstName: "John", lastName: "Doe" };
  const greeting = <h1>Hello, {name}!</h1>;
  const cal=2+2-1*(4/2)+(4*5)-3;
  return (
    <div>
      {element}
      {2 + 2}
      {greeting}
      <br />
      <h3>Welcome, {user.firstName} {user.lastName}!</h3>
      <p>Calculation Result: {cal}</p>
    </div>
  );
};

export default Intro;
