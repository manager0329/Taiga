import "./Styles/Profile.css";
import { useAuth } from "../auth/AuthContext";


const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-card">
        <div className="avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <span className="role">{user.role || "User"}</span>
      </div>
    </div>
  );
};

export default Profile;