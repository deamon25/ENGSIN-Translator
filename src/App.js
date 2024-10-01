import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Additem from "./components/Definitions/Admin/AddItem/Additem";
import DashBoard from "./components/Definitions/Admin/DashBoard/DashBoard";
import UpdateItem from "./components/Definitions/Admin/UpdateItem/UpdateItem";
import DetailsDash from "./components/Definitions/User/DetailsDash/DetailsDash";
import './components/Translator/trans.css';
import Translator from './components/Translator/Translator';
import AdminDash from './components/UserManagement/Admin/AdminDash';
import Profile from './components/UserManagement/User/Profile';
import Recovery from './components/UserManagement/User/Recovery';
import Reset from './components/UserManagement/User/Reset';
import User_login from './components/UserManagement/User/User_login';
import User_signup from './components/UserManagement/User/User_signup';
import Usermanage from './components/UserManagement/User/Usermanage';
import TranslationHistory from './components/History/History';


function App() {
  return (
    <Router>
    <div className="container">

      <Routes>
      <Route path="/" element={<Translator />} />
      <Route path="/update-item" element={<UpdateItem />} />
     

         <Route path="/login" element={<User_login />} /> {/* New route for user login */}
          <Route path="/signup" element={<User_signup />} /> {/* New route for user signup */}
          <Route path="/reset/:token" element={<Reset/>} /> 
          <Route path="/recover" element={<Recovery/>} />
          <Route path="/profile" element={<Profile/>} />
          
          <Route path="/history" element={<TranslationHistory/>} />


          <Route path="/admindash" element={<AdminDash />} />
          <Route path="/usermanage" element={<><AdminDash /> <Usermanage/></>} />
          <Route path="/profile/:id" element={<Profile />} /> {/* Admin can view any user’s profile */}


      </Routes>
    </div>
    </Router>
  );
}

export default App;
