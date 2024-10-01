import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"; // Library to decode JWT
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import "../Admin.css";

function Additem() {
  const { userId: paramUserId } = useParams(); // Get userId from the URL if passed
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getCookie(name) {
    return Cookies.get(name);
  }

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    if (paramUserId) {
      // Admin is viewing someone else's profile
      setUserId(paramUserId);
      fetchUserData(paramUserId);
    } else {
      // Regular user viewing their own profile
      const jwtToken = getCookie('jwt');
      if (!jwtToken) {
        setError("Token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(jwtToken);
        const user_id = decodedToken.id;
        setUserId(user_id);
        fetchUserData(user_id);
      } catch (e) {
        setError("Invalid token");
        setLoading(false);
      }
    }
  }, [paramUserId]);

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    date: "",
    word: "",
    definition: "",
    username: "",
  });

  const [errors, setErrors] = useState({});
  const [today, setToday] = useState("");

  // Get today's date in YYYY-MM-DD format
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    setToday(`${year}-${month}-${day}`);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "username":
        if (/[^a-zA-Z\s]/.test(value)) {
          error = "This field cannot contain numbers.";
        }
        break;
      case "date":
        const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
        if (!datePattern.test(value)) {
          error = "Please enter a valid date (YYYY-MM-DD).";
        } else if (value !== today) {
          error = "You can only select today's date.";
        }
        break;
      case "word":
        if (/[^a-zA-Z0-9\s]/.test(value)) {
          error = "This field can only contain letters and numbers.";
        }
        break;
      case "definition":
        if (/[^a-zA-Z0-9\s]/.test(value)) {
          error = "This field can only contain letters, numbers, and spaces.";
        }
        break;
      default:
        break;
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for any errors before submission
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    console.log(inputs);
    await sendRequest();
    window.alert("Added successfully!");
    navigate("/");
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/inventory", {
      date: inputs.date,
      word: inputs.word,
      definition: inputs.definition,
      username: inputs.username,
    });
  };

  // Add a loading state to show a loading message while fetching user data
  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="children_div_admin">
        <h1 className="topic_inventory">
          Add Definitions <span className="sub_topic_inventory"> </span>
        </h1>

        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <label className="form_box_item_lable">User's Name</label>
            <br />
            <input
              className="form_box_item_input"
              type="text"
              value={user ? user.firstName : ""} // Ensure user is not null
              onChange={handleChange}
              name="username"
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <br />

            <label className="form_box_item_lable">Date</label>
            <br />
            <input
              style={{ width: "50%", height: "30px", fontSize: "16px" }}
              className="form_box_item_input"
              type="date"
              value={inputs.date}
              onChange={handleChange}
              name="date"
              required
              min={today}  // Limits date to only today
              max={today}  // Limits date to only today
            />
            {errors.date && <p className="error">{errors.date}</p>}
            <br />

            <label className="form_box_item_lable">Word</label>
            <br />
            <input
              style={{ width: "50%", height: "30px", fontSize: "16px" }}
              className="form_box_item_input"
              type="text"
              value={inputs.word}
              onChange={handleChange}
              name="word"
              required
            />
            {errors.word && <p className="error">{errors.word}</p>}
            <br />

            <label className="form_box_item_lable">Definition</label>
            <br />
            <input
              style={{ width: "95%", height: "80px", fontSize: "16px" }}
              className="form_box_item_input"
              type="text"
              value={inputs.definition}
              onChange={handleChange}
              name="definition"
              required
            />
            {errors.definition && <p className="error">{errors.definition}</p>}
            <br />

            <button type="submit" className="admin_form_cneter_btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Additem;
