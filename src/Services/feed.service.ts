import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getUserFeed(options?: { signal?: AbortSignal }) {
    const data = await axios.get(
        `${BASE_URL}/posts/?limit=30`,
        {
            signal: options?.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")} `
            },
        },
    );

    return data;
}
