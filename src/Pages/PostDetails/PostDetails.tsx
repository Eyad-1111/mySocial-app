import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { bookmarkPost, getSinglePost, likePost } from "../../Services/post.service";
import type { PostCardI, TopComment } from "../../types/postCard.types";
import { getPostComments } from "../../Services/comments.service";
import PostComment from "../../Components/PostCard/PostComment";
import { UserContext, type UserContextType } from "../../Components/Context/UserContext";
import toast from "react-hot-toast";

function PostDetails() {
  const { userDetails, getUserProfile }: UserContextType = useContext(UserContext)!;
  const [details, setDetails] = useState<PostCardI | null>(null);
  const [allComments, setAllComments] = useState<TopComment[]>([]);
  const [visibleComments, setVisibleComments] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const restOfComments = allComments.filter((Comment) => Comment._id !== details?.topComment?._id)


  const { id } = useParams();

  async function getPostDetails(postId: string) {
    try {
      const { data } = await getSinglePost(postId);
      const postData: PostCardI = data.data.post;
      setDetails(postData);
      setLikesCount(postData.likesCount || 0);
      if (userDetails?._id && postData.likes) {
        setLiked(postData.likes.includes(userDetails._id));
      }
      if (typeof postData.bookmarked === "boolean") {
        setBookmarked(postData.bookmarked);
      } else if (userDetails?.bookmarks) {
        setBookmarked(userDetails.bookmarks.includes(postData._id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userDetails?._id && details?.likes) {
      setLiked(details.likes.includes(userDetails._id));
    }
  }, [userDetails?._id, details?.likes]);

  useEffect(() => {
    if (details) {
      if (typeof details.bookmarked === "boolean") {
        setBookmarked(details.bookmarked);
      } else if (userDetails?.bookmarks && details._id) {
        setBookmarked(userDetails.bookmarks.includes(details._id));
      }
    }
  }, [details?.bookmarked, details?._id, userDetails?.bookmarks]);

  async function getComments(postId: string) {
    try {
      const { data } = await getPostComments(postId);
      setAllComments(data.data.comments || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (id) {
      getPostDetails(id);
      getComments(id);
    }
  }, [id]);

  async function handleLike() {
    if (!details) return;

    const prevLiked = liked;
    const prevCount = likesCount;

    const nextLiked = !liked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

    setLiked(nextLiked);
    setLikesCount(nextCount);

    try {
      await likePost(details._id);
    } catch (error) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.error("Failed to toggle like:", error);
    }
  }

  async function handleBookmark() {
    if (!details || isBookmarkLoading) return;
    const prevBookmarked = bookmarked;
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    setIsBookmarkLoading(true);

    try {
      const { data } = await bookmarkPost(details._id);
      if (data?.data && typeof data.data.bookmarked === "boolean") {
        setBookmarked(data.data.bookmarked);
      }
      toast.success(
        nextBookmarked ? "Post saved to bookmarks" : "Post removed from bookmarks"
      );
      getUserProfile?.();
    } catch (error) {
      setBookmarked(prevBookmarked);
      console.error("Failed to toggle bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsBookmarkLoading(false);
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: details?.user?.name || "Post",
          text: details?.body,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const isExpanded = allComments.length > 2 && visibleComments >= allComments.length;

  function handleMoreComments() {
    if (isExpanded) {
      setVisibleComments(2);
    } else {
      setVisibleComments((prev) => prev + 2);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-2xl px-4 sm:px-5">
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"
          to="/feed"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back to feed
        </Link>
      </div>

      {isLoading ? (
        <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex animate-pulse items-center gap-3">
            <div className="size-11 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>
          <div className="mt-4 h-64 w-full rounded-lg bg-gray-200" />
        </div>
      ) : details ? (
        <article className="mx-auto mb-6 mt-4 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Post Header */}
          <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <img
                className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                src={details.user?.photo}
                alt={details.user?.name}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {details.user?.name}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {details.user?.username}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <span>
                    {new Date(details.createdAt).toLocaleString("en-us", {
                      timeStyle: "short",
                      dateStyle: "full",
                    })}
                  </span>
                  <span aria-hidden="true">·</span>
                  <Globe2 aria-label="Public" size={13} />
                  <span>{details.privacy}</span>
                </div>
              </div>
            </div>
            <button
              aria-label={bookmarked ? "Unsave post" : "Save post"}
              title={bookmarked ? "Unsave post" : "Save post"}
              onClick={handleBookmark}
              disabled={isBookmarkLoading}
              className={`-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full transition ${
                bookmarked
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
              type="button"
            >
              <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </header>

          {/* Post Body */}
          <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
            <p>{details.body}</p>
          </div>

          {/* Post Image */}
          {details.image && (
            <img
              className="block max-h-[520px] w-full bg-gray-100 object-cover"
              src={details.image}
              alt={details.body || "Post image"}
            />
          )}

          {/* Counts */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
                <Heart aria-hidden="true" fill="currentColor" size={11} />
              </span>
              <span>{likesCount} likes</span>
            </div>
            <div className="flex gap-3">
              <span>{allComments.length || details.commentsCount} comments</span>
              <span>{details.sharesCount} shares</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mx-4 flex border-y border-gray-200 sm:mx-5">
            <button
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                liked ? "text-rose-600 font-semibold" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={handleLike}
              type="button"
              aria-label={
                liked
                  ? `Unlike post (${likesCount} likes)`
                  : `Like post (${likesCount} likes)`
              }
              aria-pressed={liked}
            >
              <Heart
                fill={liked ? "currentColor" : "none"}
                size={18}
                className={`transition-transform duration-200 ${
                  liked ? "scale-110 text-rose-600" : ""
                }`}
              />
              Like
            </button>
            <button
              className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              onClick={() =>
                document.getElementById(`post-comment-${details._id}`)?.focus()
              }
              type="button"
            >
              <MessageCircle size={18} />
              Comment
            </button>
            <button
              className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              onClick={handleShare}
              type="button"
            >
              <Share2 size={18} />
              {copied ? "Copied!" : "Share"}
            </button>
            <button
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition hover:bg-gray-50 ${
                bookmarked ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={handleBookmark}
              type="button"
              aria-label={bookmarked ? "Unsave post" : "Save post"}
            >
              <Bookmark fill={bookmarked ? "currentColor" : "none"} size={18} />
              {bookmarked ? "Saved" : "Save"}
            </button>
          </div>

          {/* Comments section */}
          <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
            <button
              className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
              type="button"
              onClick={handleMoreComments}
            >
              {isExpanded ? "Show less comments" : "Show more comments"}
              <ChevronDown
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                  }`}
                size={16}
              />
            </button>

            {allComments.length > 0 ? (
              allComments.slice(0, visibleComments).map((comment) => {
                return (
                  <React.Fragment key={comment._id}>
                    <div className="my-3 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <img
                          alt={comment.commentCreator?.name || "User"}
                          className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                          src={comment.commentCreator?.photo}
                        />
                        <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                          <div className="flex flex-wrap items-baseline gap-x-1.5">
                            <span className="text-xs font-semibold text-gray-900">
                              {comment.commentCreator?.name}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {comment.commentCreator?.username}
                            </span>
                          </div>
                          <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                            {comment.content}
                          </p>
                          {comment.image && (
                            <img
                              src={comment.image}
                              className="mt-2 h-20 w-20 rounded-lg object-cover"
                              alt="Comment attachment"
                            />
                          )}
                          <span className="mt-1 block text-[11px] text-gray-500">
                            {new Date(comment.createdAt).toLocaleString(
                              "en-us",
                              {
                                timeStyle: "short",
                                dateStyle: "full",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <>

                {details.topComment && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <img
                        alt={details.topComment.commentCreator?.name || "User"}
                        className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                        src={details.topComment.commentCreator?.photo}
                      />
                      <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                        <div className="flex flex-wrap items-baseline gap-x-1.5">
                          <span className="text-xs font-semibold text-gray-900">
                            {details.topComment.commentCreator?.name}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {details.topComment.commentCreator?.username}
                          </span>
                        </div>
                        <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                          {details.topComment.content}
                        </p>

                        {details.topComment.image && <>
                          <img src={details.topComment.image} className="w-20 h-20" alt="" />
                        </>}
                        <span className="mt-1 block text-[11px] text-gray-500">
                          {new Date(
                            details.topComment.createdAt
                          ).toLocaleString("en-us", {
                            timeStyle: "short",
                            dateStyle: "full",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {restOfComments && restOfComments.slice(0, visibleComments).map((comment) => {
                  return <React.Fragment key={comment._id}>
                    <div className="flex items-start gap-2" key={comment._id}>
                      <img className="h-8 w-8 rounded-full object-cover"
                        src={comment.commentCreator.photo}
                        alt=""
                      />
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        <div className="text-xs font-semibold text-gray-900" >

                          <p>{comment.commentCreator.name}</p>
                        </div>
                        <p className="text-sm text-gray-700 ">
                          {comment.content}
                        </p>

                      </div>
                    </div>
                  </React.Fragment>
                })}
              </>
            )}


            {/*form */}

            <PostComment postId={details._id} getComments={getComments} />

          </section>
        </article>
      ) : (
        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="text-gray-500">Post not found.</p>
          <Link to="/feed" className="mt-3 inline-block text-blue-600 hover:underline">
            Go back to feed
          </Link>
        </div>
      )}
    </div>
  );
}

export default PostDetails;
