import React, { useState, useEffect } from "react";
import "./ProductDetails.css"; // Import the CSS file

const ProductDetails = ({ product }) => {
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [comment, setComment] = useState(""); // State for the comment
  const [comments, setComments] = useState([]); // State to store all comments

  useEffect(() => {
    // Fetch comments from local storage when component mounts
    const storedComments = localStorage.getItem(`product_${product.id}_comments`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [product.id]);

  const toggleOriginalImage = () => {
    setShowOriginalImage(prevState => !prevState);
  };

  const closeOriginalImage = () => {
    setShowOriginalImage(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value); // Update comment state as user types
  };

  const handleCommentSubmit = () => {
    if (comment.trim() !== "") { // Check if comment is not empty
      const newComment = {
        text: comment,
        user: "Anonymous", // You can modify this to include user info if needed
        timestamp: new Date().toISOString() // Add timestamp to the comment
      };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments); // Update local state with new comment
      localStorage.setItem(`product_${product.id}_comments`, JSON.stringify(updatedComments)); // Save comments to local storage
      setComment(""); // Clear comment input field after submission
    }
  };

  return (
    <div className="product-details">
      <h2>{product.title}</h2>
      <img
        src={`http://localhost:8000/storage/product/image/${product.image}`}
        alt={product.title}
        className="product-image"
        onClick={toggleOriginalImage}
      />
      {/* Message to click the photo for full size */}

      <div className="line"></div> {/* Add this line */}

      <p>Description: {product.description}</p>

      {/* Original Image Overlay */}
      {showOriginalImage && (
        <div className="original-image-overlay" onClick={closeOriginalImage}>
          <img
            src={`http://localhost:8000/storage/product/image/${product.image}`}
            alt={product.title}
            className="original-image"
          />
          <span className="close" onClick={closeOriginalImage}>&times;</span>
        </div>
      )}

      {/* Comment Section */}
      <div className="comment-section">
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.text}</p>
              <p className="comment-info">Commented by {comment.user} on {new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
        {/* Comment Input */}
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button onClick={handleCommentSubmit} className="comment-submit-btn">Comment</button>
      </div>
    </div>
  );
};

export default ProductDetails;
