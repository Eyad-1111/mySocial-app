import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useGet(apiLink: string) {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    if (!apiLink) return;

    const controller = new AbortController();

    async function getData() {
      try {
        const { data } = await axios.get(apiLink, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        setMyData(data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      }
    }

    getData();

    return () => {
      controller.abort();
    };
  }, [apiLink]);

  
  return myData;
}
