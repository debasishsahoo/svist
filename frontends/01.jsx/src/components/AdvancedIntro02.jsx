import React from "react";

import "../styles/s1.css"; // Assuming you have a CSS file for styling

const AdvancedIntro02 = () => {
  // Object properties
  const user = {
    name: "John Doe",
    title: "Software Engineer",
    location: "San Francisco, CA",
    img: "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
  };

  return (
    <div className="user-card">
      <img src={user.img} alt="User Avatar" className="user-avatar" />
      <div className="user-info">
        <h2 className="user-name">{user.name}</h2>
        <p className="user-title">{user.title}</p>
        <p className="user-location">{user.location}</p>
      </div>
      <div className="user-actions">
        <button className="message-btn">Message</button>
        <a href="#" className="profile-link">
          View Profile
        </a>
      </div>
    </div>
  );
};

export default AdvancedIntro02;
