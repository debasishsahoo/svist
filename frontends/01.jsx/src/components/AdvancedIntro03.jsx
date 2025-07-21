import React from "react";

const AdvancedIntro03 = () => {
  //This won't work - multiple root elements
  //const badExample = (
  //<h1>Title</h1>
  //<p>Description</p>
  //);

  //wrapped in a parent div
  const goodExample = (
    <div>
      <h1>Title</h1>
      <p>Description</p>
    </div>
  );

//Alternative - using React Fragment
const fragmentExample = (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);
//Alternative - using React.Fragment explicitly
const explicitFragment = (
  <React.Fragment>
    <h1>Title</h1>
    <p>Description</p>
  </React.Fragment>
);


  return (
    <div>
      <h1>JSX Must Return a Single Parent Element</h1>
      {goodExample}
      <br/>
      {fragmentExample}
      <br/>
        {explicitFragment}
    </div>
  );
};

export default AdvancedIntro03;
