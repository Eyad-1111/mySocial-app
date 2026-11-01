import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import PostCard from "../../Components/PostCard/PostCard";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import { getUserFeed } from "../../Services/feed.service";
import type { PostCardI } from "../../types/postCard.types";
import PostSkeleton from "../../Components/PostCard/PostSkeleton";
import CreatePost from "../../Components/PostCard/CreatePost";
import axios from "axios";

export default function Home() {
  const [allPosts, setAllPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function getPosts(options?: { signal?: AbortSignal }) {
    setIsLoading(true);
    try {
      const { data } = await getUserFeed(options);
      setAllPosts(data.data.posts);
    } catch (error) {
      if (!axios.isCancel(error) && axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    getPosts({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main>
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-2">
            {/* side bar */}
            <Sidebar />
          </div>
          <div className="col-span-7">
            {/* component */}
            <CreatePost getPosts={getPosts} />

            {isLoading ? (
              <PostSkeleton />
            ) : (
              allPosts.map((post) => {
                return (
                  <React.Fragment key={post._id}>
                    <PostCard post={post} getPosts={getPosts} />
                  </React.Fragment>
                );
              })
            )}
          </div>
          <div className="col-span-3">
            <SuggestedFriends />
          </div>
        </div>
      </div>
    </main>
  );
}

