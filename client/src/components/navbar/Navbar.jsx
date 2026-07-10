import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { SearchContext } from "../../context/searchContext";

const getImgPath = (img, isCover = false) => {
  if (!img) {
    return isCover
      ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300' fill='%235271ff'><rect width='800' height='300'/></svg>"
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='%23e2e8f0'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>";
  }
  return img.startsWith("http") ? img : "/upload/" + img;
};

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuOpen && !e.target.closest(".user")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [userMenuOpen]);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>PostHub</span>
        </Link>
        <a href={`/`} style={{ textDecoration: "none", color: "inherit" }}>
          <HomeOutlinedIcon />

        </a>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          <SearchOutlinedIcon />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="right">
        <div className="user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <img
            src={getImgPath(currentUser.profilePic)}
            alt=""
          />
          <span>{currentUser.name}</span>

          {userMenuOpen && (
            <div className="userMenu">
              <Link to={`/profile/${currentUser.id}`}>
                Profile
              </Link>
              <span className="logoutItem" onClick={logout}>
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
