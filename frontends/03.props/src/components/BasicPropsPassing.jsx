import React from 'react'
const cardStyle = {
    backgroundColor: '#f0f4f8',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '300px',
    margin: '1rem auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  const headingStyle = {
    color: '#2c5282',
    marginBottom: '0.5rem'
  };

  const textStyle = {
    color: '#4a5568',
    margin: '0.3rem 0'
  };
// Child component receiving props
const WelcomeMessage = (props) => {
  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Welcome, {props.name}!</h2>
      <p style={textStyle}>Age: {props.age}</p>
      <p style={textStyle}>Status: {props.age >= 18 ? 'Adult' : 'Minor'}</p>
    </div>
  );
};
const BasicPropsPassing = () => {
    return (
        <div>
     <WelcomeMessage name="Alice" age={25} />
      <WelcomeMessage name="Bob" age={30} />
      <WelcomeMessage name="Charlie" age={22} />
        </div>
    )
}

export default BasicPropsPassing
