import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import { SearchContext } from "../../context/searchContext";

const Posts = ({ userId }) => {
  const { searchQuery } = useContext(SearchContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId],

    queryFn: async () => {
      const res = await makeRequest.get("/posts", {
        params: userId ? { userId } : {},
      });
      return res.data;
    },
  });

  const filteredPosts = searchQuery
    ? data?.filter((post) => 
        (post.desc && post.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.name && post.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : data;

  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        "Loading..."
      ) : filteredPosts?.length ? (
        filteredPosts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        "No posts found"
      )}
    </div>
  );
};

export default Posts;