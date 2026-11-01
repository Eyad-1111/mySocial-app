import { ImagePlus, Send, X } from "lucide-react";
import React, { useState } from "react";
import { createPostComment } from "../../Services/comments.service";
import toast from "react-hot-toast";


function PostComment({ postId, getComments }: { postId: string; getComments: (postId: string) => void }) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function clearPreview() {
    setImage(null);
    setImagePreview(null);
   
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(content);
    setIsSubmitting(true);

    const formData = new FormData();

    try {
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await createPostComment(postId, formData);

      console.log(data);

      setContent("");
      setImage(null);
      setImagePreview(null);

      toast.success(data.message);
      getComments(postId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="mt-4 flex flex-col gap-2 pb-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2.5">
          <img
            alt="Your profile"
            className="size-8 shrink-0 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&h=96&q=80"
          />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
            <span className="sr-only">Write a comment</span>
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              id={`post-comment-${postId}`}
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />

            <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
              <span className="sr-only">Add an image</span>
              <input
                accept="image/*"
                className="sr-only"
                type="file"
                onChange={handleImage}
                disabled={isSubmitting}
              />
              <ImagePlus size={16} />
            </label>
            <button
              aria-label="Post comment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
              type="submit"
              disabled={isSubmitting || (!content.trim() && !image)}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>

      {imagePreview && (
        <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={clearPreview}
            className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
          >
            <X size={14} />
          </button>
          <img
            src={imagePreview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </>
  );
}

export default PostComment;
