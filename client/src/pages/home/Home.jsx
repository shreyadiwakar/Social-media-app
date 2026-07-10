import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import { useContext } from "react";
import { SearchContext } from "../../context/searchContext";
import "./home.scss"

const Home = () => {
  const { searchQuery } = useContext(SearchContext);

  return (
    <div className="home">
      {searchQuery === "" && <Stories />}
      {searchQuery === "" && <Share />}
      <Posts />
    </div>
  )
}

export default Home