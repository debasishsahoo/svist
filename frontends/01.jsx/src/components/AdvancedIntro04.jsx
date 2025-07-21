import React from "react";
import "../styles/s2.css";
//internal css
const styleObj = {
  backgroundColor: "lightblue",
  padding: "20px",
  borderRadius: "5px",
  fontSize: "16px",
};
const AdvancedIntro04 = () => {
  // Inline styles using objects
  const styledElement = <div style={styleObj}>Styled content</div>;

  const isActive = false;
  const conditionalStyling = (
    <button
    //external css
      className={`btn ${isActive ? "btn-active" : "btn-inactive"}`}
      // Inline styles based on condition
      // This will apply a different opacity based on the isActive state
      style={{
        opacity: isActive ? 1 : 0.5,
      }}
    >
      {isActive ? "Active" : "Inactive"}
    </button>
  );

  return (
    <>
      <div>{styledElement}</div>
      <br />
      {conditionalStyling}
    </>
  );
};

export default AdvancedIntro04;
