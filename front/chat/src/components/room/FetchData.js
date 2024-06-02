/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useSuspenseQuery } from "@tanstack/react-query";

const fetchData = async (roomId) => {
    const base = process.env.REACT_APP_BACK_API_BASE_URL;
    const res = await fetch(`${base}/room/talklog?roomid=${roomId}`);

    if (res.ok) {
        return res.json()
    }

    throw new Error()
}

export default function FetchData({roomId}) {

    const talkItem = css`
      display: block;
      font-size: 1.5rem;
      margin-bottom: 50px;
    `;

    const talkSpan = css`
      font-size: 1rem;
      margin-left: 15px;
    `;

    const { data } = useSuspenseQuery({
        queryKey: ['roomInfo'],
        queryFn: () => {
            return fetchData(roomId)
        },
        refetchOnWindowFocus: false
    });

    return (
        <>
         { data.logs?.map((item, index) => {
            return <li key={index} css={talkItem}>{item.username}<br /><span css={talkSpan}>{item.message}</span></li>
         })}
        </>
    );
}