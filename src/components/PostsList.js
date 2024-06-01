import React, { useEffect, useState } from "react";
import DailyPost from "./main/DailyPost";
import HistoryPost from "./main/HistoryPost";

function PostsList() {
  const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:3001/post")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network Error!");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => setPosts(data))
  //     .catch((error) => console.error("Error fetching posts:", error));
  // }, []);

  return (
    <div className="post-list">
      {/* {posts.map((post) => {
        if (post.type === "history") {
          return <HistoryPost key={post.id} data={post} />;
        } else {
          return <DailyPost key={post.id} data={post} />;
        }
      })} */}
    </div>
  );
}

export default PostsList;
