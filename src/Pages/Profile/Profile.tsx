import { useContext, useEffect, useState } from "react";
import { Bookmark, ImageIcon, Mail, Sparkles } from "lucide-react";
import { UserContext, type UserContextType } from "../../Components/Context/UserContext";
import { getUserBookmarks, getUserPosts } from "../../Services/post.service";
import type { PostCardI } from "../../types/postCard.types";
import PostCard from "../../Components/PostCard/PostCard";
import PostSkeleton from "../../Components/PostCard/PostSkeleton";
import axios from "axios";

function Profile() {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const { userDetails, getUserProfile }: UserContextType = useContext(UserContext)!;

  const [myPosts, setMyPosts] = useState<PostCardI[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostCardI[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState<boolean>(true);

  async function fetchMyPosts(options?: { signal?: AbortSignal }) {
    if (!userDetails?._id) return;
    setIsLoadingPosts(true);
    try {
      const { data } = await getUserPosts(userDetails._id, options);
      setMyPosts(data?.data?.posts || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to load user posts:", error);
      }
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function fetchSavedPosts(options?: { signal?: AbortSignal }) {
    setIsLoadingSaved(true);
    try {
      const { data } = await getUserBookmarks(options);
      setSavedPosts(data?.data?.bookmarks || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to load bookmarks:", error);
      }
    } finally {
      setIsLoadingSaved(false);
    }
  }

  // Load both on mount
  useEffect(() => {
    const controller = new AbortController();
    if (userDetails?._id) {
      fetchMyPosts({ signal: controller.signal });
      fetchSavedPosts({ signal: controller.signal });
    }
    return () => {
      controller.abort();
    };
  }, [userDetails?._id]);

  // Refresh active tab data when tab changes
  useEffect(() => {
    if (activeTab === "saved") {
      fetchSavedPosts();
    } else if (activeTab === "posts" && userDetails?._id) {
      fetchMyPosts();
    }
  }, [activeTab]);

  return (
    <>
      {userDetails && (
        <main className="min-h-screen bg-sec py-6">
          <div className="container mx-auto max-w-6xl px-4">
            <section className="relative">
              <div className="h-36 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-700 sm:h-44" />

              <div className="relative mx-2 -mt-16 rounded-3xl bg-white p-5 shadow-sm sm:mx-4 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={userDetails.photo}
                      alt={userDetails.name}
                      className="size-24 shrink-0 rounded-full object-cover ring-4 ring-white sm:size-28"
                    />
                    <div>
                      <h1 className="text-2xl font-bold capitalize text-gray-900">
                        {userDetails.name}
                      </h1>
                      <p className="text-sm text-gray-500">{userDetails.username}</p>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                        <Sparkles size={12} />
                        Route Posts member
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 lg:min-w-80">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                      <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                        Followers
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {userDetails.followersCount}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                      <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                        Following
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {userDetails.followingCount}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                      <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                        Bookmarks
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {userDetails.bookmarksCount ?? savedPosts.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h2 className="text-sm font-semibold text-gray-900">About</h2>
                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      {userDetails.email}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <Sparkles size={16} className="text-gray-400" />
                      Active on Route Posts
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                        My Posts
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {myPosts.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                        Saved Posts
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {savedPosts.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("posts")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition cursor-pointer ${
                    activeTab === "posts"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <ImageIcon size={16} />
                  My Posts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition cursor-pointer ${
                    activeTab === "saved"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Bookmark size={16} />
                  Saved
                </button>
              </div>
              <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                {activeTab === "posts" ? myPosts.length : savedPosts.length}
              </span>
            </section>

            <section className="mt-3">
              {activeTab === "posts" ? (
                isLoadingPosts ? (
                  <PostSkeleton />
                ) : myPosts.length > 0 ? (
                  <div className="space-y-4">
                    {myPosts.map((post) => (
                      <PostCard key={post._id} post={post} getPosts={fetchMyPosts} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm">
                    <ImageIcon className="mx-auto mb-2 text-gray-300" size={32} />
                    You have not posted yet.
                  </div>
                )
              ) : isLoadingSaved ? (
                <PostSkeleton />
              ) : savedPosts.length > 0 ? (
                <div className="space-y-4">
                  {savedPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      getPosts={() => {
                        fetchSavedPosts();
                        getUserProfile?.();
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm">
                  <Bookmark className="mx-auto mb-2 text-gray-300" size={32} />
                  You have no saved posts yet.
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </>
  );
}

export default Profile;
