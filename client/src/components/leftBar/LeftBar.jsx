import { Link } from "react-router-dom";
import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Gallery from "../../assets/8.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const getImgPath = (img, isCover = false) => {
  if (!img) {
    return isCover 
      ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300' fill='%235271ff'><rect width='800' height='300'/></svg>"
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='%23e2e8f0'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>";
  }
  return img.startsWith("http") ? img : "/upload/" + img;
};

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={getImgPath(currentUser.profilePic)}
                alt=""
              />
              <span>{currentUser.name}</span>
            </Link>
          </div>
          <div className="item">
            <Link to={`/`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={Gallery} alt="" />
              <span>Posts</span>
            </Link>
          </div>
          <div className="item">
            <Link to={`/explore`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={Friends} alt="" />
              <span>Find People</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
