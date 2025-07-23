import React from 'react';
import './styles/product.css';
import user from './img/user.jpg'
import product1 from './img/headphone.jpg'
import product2 from './img/smwatch.png'

const ProductCard1 = (props) => {
  return (
    <div className="product-card">
      <img src={props.image} alt={props.title} />
      <h3>{props.title}</h3>
      <p className="price">${props.price}</p>
      <p className="description">{props.description}</p>
      <button onClick={() => props.onAddToCart(props.id)}>
        Add to Cart
      </button>
    </div>
  );
};
const ProductCard2 = ({ id, image, title, price, description, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p className="price">${price}</p>
      <p className="description">{description}</p>
      <button onClick={() => onAddToCart(id)}>
        Add to Cart
      </button>
    </div>
  );
};

const UserCard = ({
  name = "Anonymous",
  role = "User",
  avatar = "/default-avatar.png",
  isActive = false
}) => {
  return (
    <div className={`user-card ${isActive ? 'active' : 'inactive'}`}>
      <img src={avatar} alt={`${name} avatar`} />
      <h3>{name}</h3>
      <span className="role">{role}</span>
    </div>
  );
};






const DestructuringProps = () => {
   const handleAddToCart = (id) => {
    alert(`Product ${id} added to cart!`);
  };

  const sampleProduct = {
    id: 101,
    image: product1,
    title: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation.",
    onAddToCart: handleAddToCart
  };

  const anotherProduct = {
    id: 102,
    image: product2,
    title: "Smart Watch",
    price: 149.99,
    description: "Stylish smart watch with multiple health tracking features.",
    onAddToCart: handleAddToCart
  };

  const userInfo = {
    name: "Debasish Sahoo",
    role: "Admin",
    avatar: user,
    isActive: true
  };

  return (
    <div>
      <ProductCard1 {...sampleProduct} />
      <br />
      <ProductCard2 {...anotherProduct} />
      <br />
      <UserCard {...userInfo} />
    </div>
  );
}

export default DestructuringProps
