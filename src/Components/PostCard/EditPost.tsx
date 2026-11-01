import { ImageIcon, Send, Smile, X } from 'lucide-react'
import { useState } from 'react';
import { updatePost } from '../../Services/post.service';
import toast from 'react-hot-toast';
import { Spinner } from '@heroui/react';

export default function EditPost(
    { postId, setShowEditPost , getPosts }: 
    { postId: string, setShowEditPost: (argo: boolean) => void , getPosts?: ()=>void }
) {

    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleClosePreview() {
        setImage(null);
        setImagePreview(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();

        try {
            formData.append("body", content);
            if (image) {
                formData.append("image", image);
            }
            const { data } = await updatePost(postId, formData);
            toast.success(data.message);
            setContent("");
            setImage(null);
            setImagePreview(null);

            console.log(data);
            setShowEditPost(false);
            getPosts?.();



        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="mx-auto mb-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5"
            >
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`What's on your mind, ?`}
                    rows={4}
                    className="w-full resize-none rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
                />
                {imagePreview && <>
                    <div className="relative mt-3 overflow-hidden rounded-xl">
                        <button
                            type="button"
                            aria-label="Remove image"

                            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-gray-700"
                        >
                            <X size={16} onClick={handleClosePreview} className="cursor-pointer" />
                        </button>
                        <img
                            src={imagePreview}
                            alt="Selected post image"
                            className="max-h-64 w-full object-cover"
                        />
                    </div>
                </>}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
                    <div className="flex flex-wrap items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900">
                            <ImageIcon
                                size={18} className="pointer-events-none text-emerald-500" />
                            Photo/video
                            <input
                                onChange={handleImage}
                                type="file"
                                accept="image/*,video/*"
                                className="sr-only"
                            />
                        </label>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            <Smile size={18} className="pointer-events-none text-amber-500" />
                            Feeling/activity
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowEditPost(false)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            Cancel

                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSubmitting? <Spinner/> : "Edit" }
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </form>



        </>
    )
}
