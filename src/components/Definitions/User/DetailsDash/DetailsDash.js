import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Admin/Admin.css";
import "../User.css";

// Star component for the rating system
const Star = ({ filled, onClick }) => (
  <span
    onClick={onClick}
    style={{
      cursor: "pointer",
      color: filled ? "#FFD700" : "#ccc", // Gold for filled, gray for unfilled
      fontSize: "24px", // Size of the stars
    }}
  >
    ★
  </span>
);

const URL = "http://localhost:5000/inventory";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function DetailsDash() {
  const [inven, setInven] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => setInven(data.inven));
  }, []);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.inven.filter((item) =>
        item.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setInven(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  const handleAddItem = () => {
    navigate("/additem");
  };

  const handleRating = (index, rating) => {
    const updatedInven = [...inven];
    updatedInven[index].rating = rating; // Set the rating for the item
    setInven(updatedInven);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* Search Input */}
      <div className="search-container" style={{ marginBottom: "30px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search for a word"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "12px 15px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "80%",
            maxWidth: "700px",
            marginRight: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#63b0c9",
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#63b0c9")}
        >
          Search
        </button>
      </div>

      {/* Add Item Button */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={handleAddItem}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#63b0c9",
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#63b0c9")}
        >
          Add Definition
        </button>
      </div>

      {/* Display Table */}
      <div>
        {noResults ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 className="con_topic">
              No <span className="clo_us">Results Found</span>
            </h1>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr style={{ backgroundColor: "#588BAE", color: "#fff", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "15px", border: "1px solid #ddd" }}>Word</th>
                <th style={{ padding: "15px", border: "1px solid #ddd" }}>Definition</th>
                <th style={{ padding: "15px", border: "1px solid #ddd" }}>Info</th>
                <th style={{ padding: "15px", border: "1px solid #ddd" }}>Ratings</th>
              </tr>
            </thead>
            <tbody>
              {inven.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd", transition: "background-color 0.3s" }}>
                  <td style={{ padding: "15px", backgroundColor: "#f9f9f9", cursor: "pointer" }}>
                    <b>{item.word}</b>
                  </td>
                  <td style={{ padding: "15px", backgroundColor: "#eaf3f7" }}>
                    {item.definition}
                  </td>
                  <td style={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                    <p><b>Username:</b> {item.username}</p>
                    <p><b>Date:</b> {item.date}</p>
                  </td>
                  <td style={{ padding: "15px", backgroundColor: "#eaf3f7" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        filled={item.rating >= star}
                        onClick={() => handleRating(index, star)}
                      />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Section */}
      <footer style={{ marginTop: "30px", textAlign: "center", fontSize: "14px", color: "#777" }}>
        <p>© {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DetailsDash;
