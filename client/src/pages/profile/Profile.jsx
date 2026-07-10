import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import Stories from "../../components/stories/Stories";

const getImgPath = (img, isCover = false) => {
  if (!img) {
    return isCover 
      ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300' fill='%235271ff'><rect width='800' height='300'/></svg>"
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='%23e2e8f0'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>";
  }
  return img.startsWith("http") ? img : "/upload/" + img;
};

const getWebsiteUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : "http://" + url;
};

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const { isLoading: rIsLoading, data: relationshipData = [] } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserId=" + userId)
        .then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };
  console.log("relationshipData", relationshipData);

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">

            
            <img
              src={
                getImgPath(data.coverPic, true)
              }
              alt=""
              className="cover"
            />

            <img
              src={
                getImgPath(data.profilePic, false)
              }
              alt=""
              className="profilePic"
            />
          </div>

          <div className="profileContainer">
            <div className="uInfo">
              <span>{data.name}</span>
              <div className="uInfoContainer">

                  <div className="info">
                    {data.city && (
                      <div className="item">
                        <PlaceIcon />
                        <span>{data.city}</span>
                      </div>
                    )}
                    {data.website && (
                      <div className="item">
                        <a 
                          href={getWebsiteUrl(data.website)}
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: "inherit" }}
                        >
                          <LanguageIcon />
                        </a>
                      </div>
                    )}
                    {data.email && (
                      <div className="item">
                        <EmailOutlinedIcon />
                        <span>{data.email}</span>
                      </div>
                    )}
                  </div>

                  {rIsLoading ? (
                    "loading"
                  ) : userId == currentUser.id ? (
                    <button onClick={() => setOpenUpdate(true)}>
                      update
                    </button>
                  ) : (
                    <button onClick={handleFollow}>
                      {relationshipData.includes(currentUser.id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
              </div>
              
            </div>

            <Stories userId={userId} />
            <Posts userId={userId} />
          </div>
        </>
      )}

      {openUpdate && (
        <Update setOpenUpdate={setOpenUpdate} user={data} />
      )}
    </div>
  );
};

export default Profile;