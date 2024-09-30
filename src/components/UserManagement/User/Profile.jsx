import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"; // Library to decode JWT
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // To get the userId from the URL

const Profile = () => {
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

  if (loading) {
    return <div className="text-center text-lg font-semibold py-4 text-[#63b0c9]">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl mt-10 p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-[#63b0c9]">Profile</h1>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 shadow-inner grid gap-4">
        <div className="border border-[#63b0c9] p-4 bg-white rounded-md shadow-md">
          <p className="text-xl font-semibold text-gray-700">
            <strong className="text-[#63b0c9]">User ID:</strong> {userId}
          </p>
        </div>

        <div className="border border-[#63b0c9] p-4 bg-white rounded-md shadow-md">
          <p className="text-xl font-semibold text-gray-700">
            <strong className="text-[#63b0c9]">First Name:</strong> {user.firstName}
          </p>
        </div>

        <div className="border border-[#63b0c9] p-4 bg-white rounded-md shadow-md">
          <p className="text-xl font-semibold text-gray-700">
            <strong className="text-[#63b0c9]">Last Name:</strong> {user.lastName}
          </p>
        </div>

        <div className="border border-[#63b0c9] p-4 bg-white rounded-md shadow-md">
          <p className="text-xl font-semibold text-gray-700">
            <strong className="text-[#63b0c9]">Email:</strong> {user.email}
          </p>
        </div>
      </div>

      <Link 
  to="/recover" 
  className="grid w-full cursor-pointer select-none rounded-md border bg-[#63b0c9] py-1 px-1 text-center text-white shadow hover:bg-[#5296a7]">
  Forgot Password?
</Link>

    </div>
  );
};

export default Profile;
