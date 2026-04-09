import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import dashboardPreview from "../assets/dashboard1.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">✦</span>
          TAIGA
        </div>

        <nav className="nav-links">
          <button onClick={() => navigate("/login")} className="nav-btn">
            Log in
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-left">
          <h1>
            Taiga:{" "}
            <span>
              The free and open-source project management tool
            </span>
          </h1>

          <p className="subtitle">
            For cross-functional agile teams to work effectively
          </p>

          <p className="description">
            A feature-rich software that offers a very simple start
            through its intuitive user interface.
          </p>

          <button
            className="primary-btn large"
            onClick={() => navigate("/register")}
          >
            Join now
          </button>

          <p className="small-text">
            Millions enjoy agile with Taiga already. Join them!
          </p>
        </div>

        <div className="hero-right">
          <img
            src={dashboardPreview}
            alt="Dashboard Preview"
          />
        </div>

      </section>

    </div>
  );
};

export default LandingPage;