/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const fetchData = async (roomId) => {
    const base = process.env.REACT_APP_BACK_API_BASE_URL;
    const res = await fetch(`${base}/room/info?roomid=${roomId}`, {
        credentials: 'include'
    });

    if (res.ok) {
        return res.json()
    }

    throw new Error()
}

export default function NaviItem({roomId, onSetName}) {

    const navi = css`
        display: flex;
        max-width: 1200px;
    `;

    const listItem = css`
        margin-right: 20px;
    `;

    const listSpan = css`
        font-size: 1.5rem;
    `;

    const nameSpan = css`
        margin-right: 10px;
    `;

    const overwrap = css`
        max-width: 60%;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        &::-webkit-scrollbar {
            height: 10px;
            background-color: #fff;
            border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #333;
            border-radius: 5px;
        }
    `;

    const { data } = useSuspenseQuery({
        queryKey: ['Login'],
        queryFn: () => {
            return fetchData(roomId)
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        onSetName(data.username);
    }, []);

    return (
        <>
        <ul css={navi}>
          <li css={listItem}>ルーム名 : <span css={listSpan}>{data.roomname}</span></li>
          <li css={[listItem, overwrap]}>
            メンバー :
            <span css={listSpan}>
              {data.member?.map((memberName, index) => {
                return <span key={index} css={nameSpan}>{memberName}</span>
              })}
            </span>
          </li>
        </ul>
        </>
    );
}