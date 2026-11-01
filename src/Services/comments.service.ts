import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getPostComments(postId: string, options?: { signal?: AbortSignal }) {
  const data = await axios.get(
    `${BASE_URL}/posts/${postId}/comments`,
    {
      signal: options?.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("userToken")} `,
      },
    }
  );

  return data;
}

export async function createPostComment(postId: string, formData: FormData) {
  const data = await axios.post(
    `${BASE_URL}/posts/${postId}/comments`,
    formData,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")} `,
      },
    }
  );

  return data;
}
