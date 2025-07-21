import React from "react";
import Intro from "./components/Intro";
import AdvancedIntro01 from "./components/AdvancedIntro01";
import AdvancedIntro02 from "./components/AdvancedIntro02"; // Assuming you have a CSS file for styling

function App() {
  return (
    <div>
      <h1>Welcome to JSX </h1>
      <AdvancedIntro02/>
      {/* <AdvancedIntro01 /> */}
      {/* <Intro/> */}
    </div>
  );
}

export default App;
