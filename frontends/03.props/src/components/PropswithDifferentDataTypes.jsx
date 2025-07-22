const ProfileCard = () => {
  const userData = {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://example.com/avatar.jpg"
  };

  const hobbies = ["Reading", "Photography", "Hiking", "Cooking"];
  const isOnline = true;
  const lastLogin = new Date();

  return (
    <UserProfile
      user={userData}              // Object prop
      hobbies={hobbies}           // Array prop
      isOnline={isOnline}         // Boolean prop
      loginTime={lastLogin}       // Date prop
      profileViews={1250}         // Number prop
      onEditProfile={() => console.log('Edit clicked')} // Function prop
    />
  );
};

const UserProfile = (props) => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={props.user.avatar} alt={`${props.user.name} avatar`} />
        <div>
          <h2>{props.user.name}</h2>
          <p>{props.user.email}</p>
          <span className={`status ${props.isOnline ? 'online' : 'offline'}`}>
            {props.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="profile-stats">
        <p>Profile Views: {props.profileViews}</p>
        <p>Last Login: {props.loginTime.toLocaleDateString()}</p>
      </div>

      <div className="hobbies">
        <h3>Hobbies:</h3>
        <ul>
          {props.hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      </div>

      <button onClick={props.onEditProfile}>
        Edit Profile
      </button>
    </div>
  );
};


import './styles/user.css'

const PropswithDifferentDataTypes = () => {
    return (
        <div>
            <ProfileCard />
        </div>
    )
}

export default PropswithDifferentDataTypes
