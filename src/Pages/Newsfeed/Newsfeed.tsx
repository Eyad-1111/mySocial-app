import Sidebar from "../../Components/Sidebar/Sidebar";
import PostCard from "../../Components/PostCard/PostCard";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import { getUserFeed } from "../../Services/feed.service";
import React from "react";
import type { PostCardI } from "../../types/postCard.types";
import PostSkeleton from "../../Components/PostCard/PostSkeleton";
import CreatePost from "../../Components/PostCard/CreatePost";
import { useQuery } from "@tanstack/react-query";


function Newsfeed() {

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['getFeed'],
    queryFn: () => getUserFeed(),
    select: (data) => data.data.posts as PostCardI[] ,
    enabled:true 
  })
console.log(data);


  // const posts :PostCardI[] = data?.data.posts;

  // const [posts, setPosts] = useState<PostCardI[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // async function getAllPosts() {
  //   try {
  //     const { data } = await getUserFeed();
  //     setPosts(data.data.posts);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log(error.response?.data.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <Sidebar />
        </div>

        <div className="col-span-7">
          <div className="text-center">
            <h2 className="text-green-400">isLoading {isLoading + ""}</h2>
            <h2>isFetching {isFetching + ""}</h2>
          </div>
          <CreatePost />
          {isError ? <p className="text-red-800 text-center">{error.message}</p> : isLoading ?
            <PostSkeleton />
            :
            data?.map((post) => {
              return (
                <React.Fragment key={post._id}>
                  <PostCard post={post} />
                </React.Fragment>
              );
            })
          }
        </div>

        <div className="col-span-3">
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
}

export default Newsfeed;
