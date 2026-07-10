import React, { useState, useContext } from "react";
import "./explore.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { SearchContext } from "../../context/searchContext";

const getImgPath = (img, isCover = false) => {
  if (!img) {
    return isCover 
      ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300' fill='%235271ff'><rect width='800' height='300'/></svg>"
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='%23e2e8f0'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>";
  }
  return img.startsWith("http") ? img : "/upload/" + img;
};

const Explore = () => {
  const { searchQuery } = useContext(SearchContext);
  const [activeTab, setActiveTab] = useState("all"); // "all", "followers", "following"

  const { isLoading: loadingUsers, error: errorUsers, data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => makeRequest.get("/users").then((res) => res.data),
  });

  const { isLoading: loadingFollowers, error: errorFollowers, data: followers } = useQuery({
    queryKey: ["followers"],
    queryFn: () => makeRequest.get("/relationships/followers").then((res) => res.data),
  });

  const { isLoading: loadingFollowing, error: errorFollowing, data: following } = useQuery({
    queryKey: ["following"],
    queryFn: () => makeRequest.get("/relationships/following").then((res) => res.data),
  });

  // Decide which list to display
  const getActiveData = () => {
    if (activeTab === "followers") return followers;
    if (activeTab === "following") return following;
    return allUsers;
  };

  const activeData = getActiveData();
  const isLoading = loadingUsers || loadingFollowers || loadingFollowing;
  const hasError = errorUsers || errorFollowers || errorFollowing;

  const filteredUsers = activeData?.filter((user) => {
    const term = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.city && user.city.toLowerCase().includes(term))
    );
  });

  return (
    <div className="explore">
      <div className="exploreContainer">
        <h1>Find People</h1>

        <div className="tabs">
          <button 
            className={activeTab === "all" ? "activeTab" : ""} 
            onClick={() => setActiveTab("all")}
          >
            All Users
          </button>
          <button 
            className={activeTab === "followers" ? "activeTab" : ""} 
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
          <button 
            className={activeTab === "following" ? "activeTab" : ""} 
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>
        


        {isLoading ? (
          "Loading..."
        ) : hasError ? (
          "Something went wrong!"
        ) : (
          <div className="userGrid">
            {filteredUsers?.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", color: "gray", padding: "20px" }}>
                No users found.
              </div>
            ) : (
              filteredUsers?.map((user) => (
                <div className="userCard" key={user.id}>
                  <div className="avatarContainer">
                    <img src={getImgPath(user.profilePic)} alt="" />
                  </div>
                  <div className="userInfo">
                    <span className="name">{user.name || "User"}</span>
                    <span className="username">@{user.username}</span>
                    {user.city && <span className="city">{user.city}</span>}
                  </div>
                  <Link to={`/profile/${user.id}`} style={{ width: "100%", textDecoration: "none" }}>
                    <button>View Profile</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
