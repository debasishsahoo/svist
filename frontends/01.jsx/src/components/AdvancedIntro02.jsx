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
    <div class="user-card">
      <img src={user.img} alt="User Avatar" class="user-avatar" />
      <div class="user-info">
        <h2 class="user-name">{user.name}</h2>
        <p class="user-title">{user.title}</p>
        <p class="user-location">{user.location}</p>
      </div>
      <div class="user-actions">
        <button class="message-btn">Message</button>
        <a href="#" class="profile-link">
          View Profile
        </a>
      </div>
    </div>
  );
};

export default AdvancedIntro02;
