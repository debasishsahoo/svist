import React from 'react';

// Component with multiple elements and logic
const BlogPost = ({ title, author, date, content, tags }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  const getReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };
  return (
    <article className="blog-post">
      <header>
        <h1>{title}</h1>
        <div className="post-meta">
          <span className="author">By {author}</span>
          <span className="date">{formatDate(date)}</span>
          <span className="reading-time">
            {getReadingTime(content)} min read
          </span>
        </div>
      </header>
      <div className="post-content">
        <p>{content}</p>
      </div>
      <footer>
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
};

// Component composition example
const BlogList = () => {
  const posts = [
    {
      id: 1,
      title: "Getting Started with React",
      author: "Jane Doe",
      date: "2024-01-15",
      content: "React is a powerful library for building user interfaces...",
      tags: ["react", "javascript", "frontend"]
    },
    {
      id: 2,
      title: "Understanding JSX",
      author: "John Smith",
      date: "2024-01-20",
      content: "JSX is a syntax extension that allows you to write HTML-like code...",
      tags: ["jsx", "react", "tutorial"]
    }
  ];
  return (
    <div className="blog-list">
      <h2>Latest Blog Posts</h2>
      {posts.map(post => (
        <BlogPost
          key={post.id}
          title={post.title}
          author={post.author}
          date={post.date}
          content={post.content}
          tags={post.tags}
        />
      ))}
    </div>
  );
};
import './styles/blog.css';
const ComplexFunctionalComponent = () => {
    return (
        <div>
            <h1>Complex Functional Component Example</h1>
            <p>This component demonstrates a complex functional component with multiple elements and logic.</p>
            <BlogList />
        </div>
    )
}

export default ComplexFunctionalComponent

