import { useEffect, useState } from "react";
import { likePost } from "../../Services/post.service";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  onLikeChange?: (isLiked: boolean, count: number) => void;
  className?: string;
}

export default function LikeButton({
  postId,
  initialLikes = 0,
  initialLiked = false,
  onLikeChange,
  className = "",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize state when props update (e.g., after page refresh when user profile loads)
  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes]);

  async function handleToggleLike() {
    if (isLoading) return;

    // Save previous state for rollback on error
    const prevLiked = isLiked;
    const prevCount = likesCount;

    // Optimistic UI update
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    setIsLoading(true);

    try {
      // Call PUT https://route-posts.routemisr.com/posts/${postId}/like
      await likePost(postId);
      onLikeChange?.(nextLiked, nextCount);
    } catch (error) {
      // Revert state if the request fails
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      disabled={isLoading}
      aria-label={isLiked ? `Unlike post (${likesCount} likes)` : `Like post (${likesCount} likes)`}
      aria-pressed={isLiked}
      className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
        isLiked
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400"
          : "bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
      } ${className}`}
    >
      {/* Heart Icon (SVG - Zero dependencies) */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`size-5 transition-transform duration-200 ease-out group-active:scale-125 ${
          isLiked ? "scale-110 text-rose-500" : "text-gray-500 group-hover:text-rose-500"
        }`}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>

      {/* Likes Count */}
      <span className="tabular-nums">{likesCount}</span>
    </button>
  );
}

