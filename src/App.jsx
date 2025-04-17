import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; 

import "./App.css";
import { callApi } from "./api";



const API_KEY = '42ec0b63067e4cc08f7ba5700bf3939d';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then(response => response.json())
      .then(data => {
        setIsLoggedIn(data.isAuthenticated);
        setLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false); 
      });
  }, []);

  if (loading) return <div className="loading-container">Loading...</div>;
 
  return (
    <Router>
      <div className="app-container">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/categories" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Categories /></ProtectedRoute>} />
            <Route path="/category/:categoryKey" element={<CategoryPage />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/contact" element={<Contact />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function ProtectedRoute({ isLoggedIn, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signup");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
}

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

 
  return (
    <header className="header">
      <nav className="navbar">
      <Link to="/" className="logo-container">
  <img src="/logo.jpg" className="logo-image" alt="Logo" />
  <h1 className="logo-text">NEWS AGGREGATOR</h1>
</Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li
            style={{
              cursor: 'pointer', 
              padding: '10px 15px',
              color: location.pathname === '/categories' ? 'yellow' : '#fff', 
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'yellow'}
            onMouseLeave={(e) => e.target.style.color = location.pathname === '/categories' ? 'yellow' : '#fff'}
            onClick={() => isLoggedIn ? navigate("/categories") : navigate("/signin")}
          >
            Services
          </li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <Link to="/signin"><button className="sign-in">Sign In</button></Link>
              <Link to="/signup"><button className="sign-up">Sign Up</button></Link>
            </>
          ) : (
            <button className="logout" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>
    </header>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} GLOBAL NEWS | All Rights Reserved</p>
    </footer>
  );
}




function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user"); 

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/categories"); 
    } else {
      navigate("/signup"); 
    }
  };

  return (
    <div className="home-bg">
      <div className="hero-section">
        <h2>Welcome to <span>GLOBAL NEWS</span></h2>
        <p>Did You Know What Happened?</p>
        <button className="cta-button small-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}


function SignIn({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || savedUser.email !== formData.email || savedUser.password !== formData.password) {
      setError("Invalid email or password!");
      return;
    }

    setSuccessMessage("Sign In Successful!");
    setIsLoggedIn(true);

    setTimeout(() => {
      navigate("/categories");
    }, 2000);
  };

  return (
    <div className="sign-in-bg">
      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit">Sign In</button>
        </form>
        <p><a href="#">Forgot Password?</a></p>
      </div>
    </div>
  );
}

function SignUp() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ email: formData.email, password: formData.password }));
    setSuccessMessage("Sign Up Successful!");
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  };

  return (
    <div className="sign-up-bg">
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="sign-in-redirect">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}


function Categories() {
  const categories = [
    { name: "World News", key: "general", image: "/world.jpg" },
    { name: "Technology", key: "technology", image: "/technology.jpg" },
    { name: "Sports", key: "sports", image: "/sports.jpg" },
    { name: "Entertainment", key: "entertainment", image: "/entertainment.jpg" },
    { name: "Health", key: "health", image: "/health.jpg" },
    { name: "Business", key: "business", image: "/business.jpg" },
    { name: "Science", key: "science", image: "/science.jpg" },
  ];

  return (
    <div className="categories-container">
      <h2>Select a News Category</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/category/${category.key}`}
            className={`category-box ${category.key}`}
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
function CategoryPage() {
  const { categoryKey } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryPadding = {
    sports: "100px",
    technology: "120px",
    entertainment: "80px",
    business: "90px",
  };

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=${categoryKey}&apiKey=${API_KEY}`
        );
        setNews(response.data.articles);
      } catch (error) {
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [categoryKey]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      className={`category-news-container ${categoryKey}`}
      
    >
      {news.length > 0 ? (
        news.map((article, index) => (
          <div key={index} className="news-item">
            <h3>{article.title}</h3>
            <img src={article.urlToImage} alt={article.title} />
            <p>{article.description}</p>
            <p className="news-date">{new Date(article.publishedAt).toLocaleString()}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
              Read More
            </a>
          </div>
        ))
      ) : (
        <p>No news available in this category.</p>
      )}
    </div>
  );
}



function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2>About Us</h2>
        <div className="about-text">
          <p>
            Welcome to GLOBAL NEWS, your one-stop source for the latest and greatest
            in world news. We aggregate news from a variety of trusted sources to
            provide you with the most comprehensive news experience.
          </p>
          <p>
            Our mission is to keep you informed about what's happening around the
            globe, whether it be in the realms of politics, technology,
            entertainment, or sports. Thank you for choosing us to stay updated!
          </p>
        </div>
      </div>
    </div>
  );
}


function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h2>Contact Us</h2>
        <p>
          We would love to hear from you! If you have any questions, feedback, or
          suggestions, feel free to reach out to us at:
        </p>
        <p>Email: contact@globalnews.com</p>
        <p>Phone: +1 (555) 123-4567</p>
      </div>

      <div className="social-icons">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={30} />
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={30} />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={30} />
        </a>
      </div>
    </div>
  );
}


function NavigationArrows() {
  const navigate = useNavigate();

  return (
    <div className="navigation-arrows">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} 
        className="nav-arrow-button"
        aria-label="Go Back"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Forward Button */}
      <button
        onClick={() => navigate(1)} 
        className="nav-arrow-button"
        aria-label="Go Forward"
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
}

export default App;
