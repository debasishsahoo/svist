import React from "react";
import Intro from "./components/Intro";
import AdvancedIntro01 from "./components/AdvancedIntro01";
import AdvancedIntro02 from "./components/AdvancedIntro02";
import AdvancedIntro03 from "./components/AdvancedIntro03";
import AdvancedIntro04 from "./components/AdvancedIntro04"; // Assuming you have a CSS file for styling
import AdvancedRender from "./components/AdvancedRender";
function App() {
  return (
    <div>
      <h1>Welcome to JSX </h1>
      {/* <AdvancedIntro04 /> */}
      <AdvancedRender />
      <br />
      {/* <AdvancedIntro03 />
      <br /> */}
      {/* <AdvancedIntro02/> */}
      {/* <AdvancedIntro01 /> */}
      {/* <Intro/> */}
    </div>
  );
}

export default App;
