import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = ({ userId }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);

  const { isLoading, error, data: stories = [] } = useQuery({
    queryKey: ["stories", userId],
    queryFn: () =>
      makeRequest.get("/stories" + (userId ? "?userId=" + userId : "")).then((res) => res.data),
  });

  const filteredStories = userId
    ? stories.filter((s) => s.userId == userId)
    : stories;

  const addMutation = useMutation({
    mutationFn: (newStory) =>
      makeRequest.post("/stories", newStory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (storyId) => makeRequest.delete("/stories/" + storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleDelete = (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      deleteMutation.mutate(storyId);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await makeRequest.post("/upload", formData);
      const imgUrl = uploadRes.data;

      addMutation.mutate({
        img: imgUrl,
      });

    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const getImgPath = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : "/upload/" + img;
  };

  return (
    <div className="stories">

      {(!userId || userId == currentUser.id) && (
        <div className="story" style={{ minWidth: "150px", flexShrink: 0 }}>
          <img src={getImgPath(currentUser.profilePic)} alt="" />
          <span>{currentUser.name}</span>

          <input
            type="file"
            id="storyFile"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <label htmlFor="storyFile">
            <span className="uploadBtn">+</span>
          </label>

          {uploading && <span>Uploading...</span>}
        </div>
      )}

      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        "Loading..."
      ) : (
        filteredStories.map((story) => (
          <div
            className="story"
            key={story.id}
            style={{ minWidth: "150px", flexShrink: 0 }}
          >
            <img src={getImgPath(story.img)} alt="" />
            <span>{story.name}</span>
            {story.userId == currentUser.id && (
              <button className="deleteBtn" onClick={() => handleDelete(story.id)}>delete</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;