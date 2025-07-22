import React from 'react'

const RenderingLists = () => {
const fruits = ['Apple', 'Banana', 'Orange', 'Grape'];
const users = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Moderator' }
];

const fruitList = (
  <ul>
    {fruits.map((fruit, index) => (
      <li key={index}>{fruit}</li>
    ))}
  </ul>
);

const userList = (
  <div className="user-list">
    {users.map(user => (
      <div key={user.id} className="user-card">
        <h3>{user.name}</h3>
        <span className={`role ${user.role.toLowerCase()}`}>
          {user.role}
        </span>
      </div>
    ))}
  </div>
);


    return (
        <div>
            <h1>Rendering Lists Example</h1>
            {fruitList}
            {userList}
        </div>
    )
}

export default RenderingLists
