import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "../Admin.css";

// StarRating Component for displaying and updating ratings
function RatingComponent({ rating, onRatingChange }) {
  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => onRatingChange(index + 1)} // Update rating on star click
          style={{
            cursor: "pointer",
            color: index < rating ? "#FFD700" : "#ccc", // Gold for selected stars
            fontSize: "24px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function UpdateItem() {
  const [inputs, setInputs] = useState({});
  const [rating, setRating] = useState(0); // State for rating
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inventory/${id}`);
        setInputs(response.data.inven);
        setRating(response.data.inven.rating || 0); // Set initial rating if exists
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5001/inventory/${id}`, {
      date: String(inputs.date),
      word: String(inputs.word),
      definition: String(inputs.definition),
      username: String(inputs.username),
      rating: rating, // Include the updated rating in the request
    });
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the rating state when star is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest(); // Wait for the update to complete
    window.alert("Updated successfully!"); // Show success message
    navigate("/"); // Navigate back to the dashboard
  };

  return (
    <div>
      <div className="children_div_admin">
        <h1 className="topic_inventory">Update Definitions</h1>
        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            {/* Username field - readOnly */}
            <label className="form_box_item_lable">User's Name</label>
            <br />
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.username}
              name="username"
              readOnly
              style={{ width: "50%", height: "30px", fontSize: "16px" }}
            />
            <br />

            {/* Date field - readOnly */}
            <label className="form_box_item_lable">Date</label>
            <br />
            <input
              className="form_box_item_input"
              type="date"
              value={inputs.date}
              name="date"
              readOnly
              style={{ width: "50%", height: "30px", fontSize: "16px" }}
            />
            <br />

            {/* Word field */}
            <label className="form_box_item_lable">Word</label>
            <br />
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.word}
              onChange={handleChange}
              name="word"
              required
              style={{ width: "50%", height: "30px", fontSize: "16px" }}
            />
            <br />

            {/* Definition field */}
            <label className="form_box_item_lable">Definition</label>
            <br />
            <input
              className="form_box_item_input"
              type="text"
              value={inputs.definition}
              onChange={handleChange}
              name="definition"
              required
              style={{ width: "95%", height: "80px", fontSize: "16px" }}
            />
            <br />

            {/* Rating field */}
            <label className="form_box_item_lable">Rating</label>
            <br />
            <RatingComponent rating={rating} onRatingChange={handleRatingChange} />
            <br />

            <button type="submit" className="admin_form_cneter_btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateItem;
