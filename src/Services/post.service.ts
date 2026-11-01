import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getSinglePost(postId: string) {
  const data = await axios.get(
    `${BASE_URL}/posts/${postId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("userToken")} `,
      },
    },
  );

  return data;
}

export async function createPost(formData: FormData) {
  const data = await axios.post(
    `${BASE_URL}/posts`,
    formData,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")} `,
      },
    }
  );

  return data;
}

export async function updatePost(postId: string, formData: FormData) {
  const data = await axios.put(
    `${BASE_URL}/posts/${postId}`,
    formData,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")} `,
      },
    }
  );

  return data;
}

export async function deletePost(postId: string) {
  const data = await axios.delete(
    `${BASE_URL}/posts/${postId}`,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")} `,
      },
    }
  );

  return data;
}

export async function likePost(postId: string) {
  const data = await axios.put(
    `${BASE_URL}/posts/${postId}/like`,
    {},
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );

  return data;
}

export async function bookmarkPost(postId: string) {
  const data = await axios.put(
    `${BASE_URL}/posts/${postId}/bookmark`,
    {},
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );

  return data;
}

export async function getUserBookmarks(options?: { signal?: AbortSignal }) {
  const data = await axios.get(
    `${BASE_URL}/users/bookmarks`,
    {
      signal: options?.signal,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );

  return data;
}

export async function getUserPosts(userId: string, options?: { signal?: AbortSignal }) {
  const data = await axios.get(
    `${BASE_URL}/users/${userId}/posts`,
    {
      signal: options?.signal,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );

  return data;
}
