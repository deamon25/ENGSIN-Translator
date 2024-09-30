import React from 'react';

const StarRating = ({ rating }) => {
  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={{
            color: index < rating ? "#FFD700" : "#ccc", // Gold for filled stars, gray for empty stars
            cursor: "default",
            fontSize: "24px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;



