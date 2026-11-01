import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getMyProfile() {
    const data = await axios.get(
        `${BASE_URL}/users/profile-data`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization" :`Bearer ${localStorage.getItem("userToken")} `
            },
        },
    );

    return data ;
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
