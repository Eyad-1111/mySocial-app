import {
  Bookmark,
  ChevronDown,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import type { PostCardI, TopComment } from "../../types/postCard.types";
import { Link } from "react-router";
import React, { useContext, useEffect, useState } from "react";
import { getPostComments } from "../../Services/comments.service";
import axios from "axios";

import PostComment from "./PostComment";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { UserContext, type UserContextType } from "../Context/UserContext";
import EditPost from "./EditPost";
import toast from "react-hot-toast";
import { bookmarkPost, deletePost, likePost } from "../../Services/post.service";

export default function PostCard({ post, getPosts }: { post: PostCardI, getPosts?: () => void }) {
  const { userDetails, getUserProfile }: UserContextType = useContext(UserContext)!;
  const isPostLiked = Boolean(
    userDetails?._id && post.likes?.includes(userDetails._id)
  );
  const isPostBookmarked = Boolean(
    post.bookmarked || (userDetails?.bookmarks && userDetails.bookmarks.includes(post._id))
  );

  const [allComments, setAllComments] = useState<TopComment[]>([]);
  const [visibleComments, setVisibleComments] = useState(0);
  const [liked, setLiked] = useState<boolean>(isPostLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [bookmarked, setBookmarked] = useState<boolean>(isPostBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const topComment = post.topComment || (allComments.length > 0 ? allComments[0] : null);
  const [showEditPost, setShowEditPost] = useState<boolean>(false);
  const [showDeleteDialouge, setShowDeleteDialouge] = useState<boolean>(false);

  // Sync liked state when userDetails loads after page refresh
  useEffect(() => {
    if (userDetails?._id && post.likes) {
      setLiked(post.likes.includes(userDetails._id));
    }
  }, [userDetails?._id, post.likes]);

  useEffect(() => {
    if (post.likesCount !== undefined) {
      setLikesCount(post.likesCount);
    }
  }, [post.likesCount]);

  // Sync bookmarked state
  useEffect(() => {
    if (typeof post.bookmarked === "boolean") {
      setBookmarked(post.bookmarked);
    } else if (userDetails?.bookmarks) {
      setBookmarked(userDetails.bookmarks.includes(post._id));
    }
  }, [post.bookmarked, userDetails?.bookmarks, post._id]);

  const restOfComments = allComments.filter((comment) => comment._id !== topComment?._id);

  async function getComments(postId: string, options?: { signal?: AbortSignal }) {
    try {
      const { data } = await getPostComments(postId, options);
      setAllComments(data.data.comments || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    getComments(post._id, { signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [post._id]);

  async function handleLike() {
    const prevLiked = liked;
    const prevCount = likesCount;

    const nextLiked = !liked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

    // Optimistic UI update
    setLiked(nextLiked);
    setLikesCount(nextCount);

    try {
      await likePost(post._id);
    } catch (error) {
      // Revert if API call fails
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.error("Failed to toggle like:", error);
    }
  }

  async function handleBookmark() {
    if (isBookmarkLoading) return;
    const prevBookmarked = bookmarked;
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    setIsBookmarkLoading(true);

    try {
      const { data } = await bookmarkPost(post._id);
      if (data?.data && typeof data.data.bookmarked === "boolean") {
        setBookmarked(data.data.bookmarked);
      }
      toast.success(
        nextBookmarked ? "Post saved to bookmarks" : "Post removed from bookmarks"
      );
      getUserProfile?.();
      getPosts?.();
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
          title: post.user?.name || "Post",
          text: post.body,
          url: `${window.location.origin}/postDetails/${post._id}`,
        });
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/postDetails/${post._id}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const isExpanded = restOfComments.length > 0 && visibleComments >= restOfComments.length;

  function handleMoreComments() {
    if (isExpanded) {
      setVisibleComments(0);
    } else {
      setVisibleComments((prev) => prev + 2);
    }
  }

  async function deleteMyPost (postId : string) {
    try {
      const {data} = await deletePost (postId);
      console.log(data);
      toast.success(data.message)

      getPosts?.()
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <article className="mx-auto my-3 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Post creator, timestamp, and privacy */}
      <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
            src={post.user?.photo}
            alt={post.user?.name}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="truncate text-sm font-semibold text-gray-900">
                {post.user?.name}
              </span>
              <span className="truncate text-xs text-gray-500">
                {post.user?.username}
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
              <span>
                {new Date(post.createdAt).toLocaleString("en-us", {
                  timeStyle: "short",
                  dateStyle: "full",
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{post.privacy}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={bookmarked ? "Unsave post" : "Save post"}
            title={bookmarked ? "Unsave post" : "Save post"}
            disabled={isBookmarkLoading}
            className={`rounded-full p-2 transition ${
              bookmarked
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Bookmark
              size={18}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </button>

          <Dropdown>
            <Button
              aria-label="More post options"
              variant="ghost"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <MoreHorizontal size={21} />
            </Button>

            <Dropdown.Popover>
              <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                <Dropdown.Item
                  id="bookmark-Post"
                  textValue={bookmarked ? "Unsave Post" : "Save Post"}
                  onClick={handleBookmark}
                >
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Bookmark
                      size={16}
                      fill={bookmarked ? "currentColor" : "none"}
                      className={bookmarked ? "text-blue-600" : ""}
                    />
                    {bookmarked ? "Unsave Post" : "Save Post"}
                  </Label>
                </Dropdown.Item>

                {post.user?._id === userDetails?._id && (
                  <>
                    <Dropdown.Item onClick={() => setShowEditPost(true)} id="edit-Post" textValue="Edit Post">
                      <Label className="cursor-pointer">Edit Post</Label>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>setShowDeleteDialouge(true)} id="delete-Post" textValue="Delete Post" variant="danger">
                      <Label className="cursor-pointer">Delete Post</Label>
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </header>
      {/* delete dialouge */}
      <AlertDialog isOpen={showDeleteDialouge}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Delete Post permanently?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  This will permanently delete <strong>My Awesome Post</strong> and all of its
                  data. This action cannot be undone.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button onClick={()=>setShowDeleteDialouge(false)} slot="close" variant="tertiary">
                  Cancel
                </Button>
                <Button onClick={()=>deleteMyPost(post._id)} slot="close" variant="danger">
                  Delete Post
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      {/* edit form */}
      {showEditPost ? (

        <EditPost getPosts={getPosts} postId={post._id} setShowEditPost={setShowEditPost} />

      ) : <>
        <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
          <p>{post.body}</p>
        </div>

        {/* Post image */}
        {post.image && (
          <img
            className="block max-h-[520px] w-full bg-gray-100 object-cover"
            src={post.image}
            alt={post.body || "Post image"}
          />
        )}
      </>}


      {/* Post content */}


      {/* Reaction and comment counts */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
            <Heart aria-hidden="true" fill="currentColor" size={11} />
          </span>
          <span>{likesCount} likes</span>
        </div>
        <div className="flex gap-3">
          <span>{allComments.length || post.commentsCount} comments</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Like, comment, share actions, and View Details */}
      <div className="mx-4 flex items-center border-y border-gray-200 sm:mx-5">
        <button
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition hover:bg-gray-50 ${liked ? "text-rose-600 font-semibold" : "text-gray-600"
            }`}
          onClick={handleLike}
          type="button"
        >
          <Heart fill={liked ? "currentColor" : "none"} size={18} />
          Like
        </button>
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          onClick={() => document.getElementById(`post-comment-${post._id}`)?.focus()}
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

        <Link
          to={`/postDetails/${post._id}`}
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
        >
          View Details
        </Link>
      </div>

      {/* Comments section */}
      <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
        {restOfComments.length > 0 && (
          <button
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
            type="button"
            onClick={handleMoreComments}
          >
            {isExpanded ? "Show less comments" : "~ more comments"}
            <ChevronDown
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                }`}
              size={16}
            />
          </button>
        )}

        {/* Top comment */}
        {topComment && (
          <div className="flex items-start gap-2 my-2">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={topComment.commentCreator?.photo}
              alt={topComment.commentCreator?.name || "User"}
            />
            <div className="flex flex-1 items-start justify-between gap-2">
              <div className="rounded-2xl bg-gray-100 px-3 py-2">
                <div className="text-xs flex flex-col gap-1 font-semibold text-gray-900">
                  <h2 className="text-green-500 text-sm font-black">Top Comment</h2>
                  <p>{topComment.commentCreator?.name}</p>
                </div>
                <p className="text-sm text-gray-700">
                  {topComment.content}
                </p>
                {topComment.image && (
                  <img
                    src={topComment.image}
                    className="mt-2 h-20 w-20 rounded-lg object-cover"
                    alt="Comment attachment"
                  />
                )}
              </div>
              {post.topComment?.commentCreator._id == userDetails?._id ? <>

                <Dropdown>
                  <Button aria-label="Comment options" variant="ghost">
                    <MoreHorizontal size={21} />
                  </Button>
                  <Dropdown.Popover>
                    <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>

                      <Dropdown.Item id="edit-Comment" textValue="Edit Comment">
                        <Label>Edit Comment</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="delete-Comment" textValue="Delete Comment" variant="danger">
                        <Label>Delete Comment</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>

              </> : <Dropdown>
                <Button aria-label="Comment options" variant="ghost">
                  <MoreHorizontal size={21} />
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>


                    <Dropdown.Item id="delete-Comment" textValue="Delete Comment" variant="danger">
                      <Label>Delete Comment</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>}

            </div>
          </div>
        )}

        {/* Rest of comments */}
        {restOfComments &&
          restOfComments.slice(0, visibleComments).map((comment) => {
            return (
              <React.Fragment key={comment._id}>
                <div className="flex items-start gap-2 my-2" key={comment._id}>
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={comment.commentCreator?.photo}
                    alt={comment.commentCreator?.name || ""}
                  />
                  <div className="flex flex-1 items-start justify-between gap-2">
                    <div className="rounded-2xl bg-gray-100 px-3 py-2">
                      <div className="text-xs font-semibold text-gray-900">
                        <p>{comment.commentCreator?.name}</p>
                      </div>
                      <p className="text-sm text-gray-700">
                        {comment.content}
                      </p>
                      {comment.image && (
                        <img
                          src={comment.image}
                          className="mt-2 h-20 w-20 rounded-lg object-cover"
                          alt=""
                        />
                      )}
                    </div>
                    {comment.commentCreator._id == userDetails?._id ? <>
                      <Dropdown>
                        <Button aria-label="Comment options" variant="ghost">
                          <MoreHorizontal size={21} />
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>

                            <Dropdown.Item id="edit-Comment" textValue="Edit Comment">
                              <Label>Edit Comment</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="delete-Comment" textValue="Delete Comment" variant="danger">
                              <Label>Delete Comment</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </> : <Dropdown>
                      <Button aria-label="Comment options" variant="ghost">
                        <MoreHorizontal size={21} />
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>


                          <Dropdown.Item id="delete-Comment" textValue="Delete Comment" variant="danger">
                            <Label>Delete Comment</Label>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>}

                  </div>
                </div>
              </React.Fragment>
            );
          })}


        {/* Add a comment */}
        <PostComment postId={post._id} getComments={getComments} />
      </section>
    </article >
  );
}
