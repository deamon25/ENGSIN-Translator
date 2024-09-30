import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import StarRating from "../StarRating"; 

const URL = "http://localhost:5001/inventory";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function DashBoard() {
  const [inven, setInven] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => {
      console.log(data.inven); // Log the fetched inventory to check ratings
      setInven(data.inven);
    });
  }, []);

  const history = useNavigate();
  const deleteHandler = async (_id) => {
    const confirmed = window.confirm("Are you sure you want to delete this Details?");

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Details deleted successfully!");
        await fetchHandler().then((data) => setInven(data.inven)); // Refetch data after deletion
      } catch (error) {
        console.error("Error deleting details:", error);
      }
    }
  };

  const ComponentsRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    DocumentTitle: "Details Report",
    onafterprint: () => alert("Details Report Successfully Downloaded!"),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.inven.filter((inven) =>
        Object.values(inven).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setInven(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  return (
    <div>
      {/* Top section with inline CSS for the button */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px", marginBottom: "20px" }}>
        <Link to="/userdetailsdash">
          <button
            style={{
              backgroundColor: "#63b0c9",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Go to Details Page
          </button>
        </Link>
      </div>

      <div className="children_div_admin">
        <div className="tbl_con_admin" ref={ComponentsRef}>
          <h1 className="topic_inventory">
            Added Definitions <span className="sub_topic_inventory"></span>
          </h1>

          <table className="table_details_admin">
            <thead>
              <tr className="admin_tbl_tr">
                <th className="admin_tbl_th" >User's Name</th>
                <th className="admin_tbl_th">Date</th>
                <th className="admin_tbl_th">Word</th>
                <th className="admin_tbl_th">Definitions</th>
                <th className="admin_tbl_th">Rating</th> 
                <th className="admin_tbl_th">Action</th>
              </tr>
            </thead>
            {noResults ? (
              <div>
                <br />
                <h1 className="con_topic">
                  No <span className="clo_us"> Found</span>
                </h1>
              </div>
            ) : (
              <tbody>
                {inven.map((item, index) => (
                  <tr className="admin_tbl_tr" key={index}>
                    <td className="admin_tbl_td">{item.username}</td>
                    <td className="admin_tbl_td">{item.date}</td>
                    <td className="admin_tbl_td">{item.word}</td>
                    <td className="admin_tbl_td">{item.definition}</td>
                    <td className="admin_tbl_td">
                      <StarRating rating={item.rating || 0} /> {/* Use a default rating of 0 if undefined */}
                    </td>
                    <td className="admin_tbl_td">
                      <button onClick={() => deleteHandler(item._id)} className="btn_dash_admin_dlt">
                        Delete
                      </button>
                      <br /><br />
                      <Link to={`/updateitem/${item._id}`} className="btn_dash_admin">
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
