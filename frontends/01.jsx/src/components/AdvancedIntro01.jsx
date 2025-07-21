import React from "react";

const AdvancedIntro01 = () => {
  const name = "Alice";
  const age = 25;
  const isStudent = true;
  const userInfo = (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Birth Year: {2024 - age}</p>
      <p>Status: {isStudent ? "Student" : "Professional"}</p>
    </div>
  );
  return (
    <div>
      <h1>Welcome to the Advanced Intro!</h1>
      {userInfo}
    </div>
  );
};

export default AdvancedIntro01;
