/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchData = async (roomname) => {
    const base = process.env.REACT_APP_BACK_API_BASE_URL;
    const res = await fetch(`${base}/room/search?roomname=${roomname}`);

    if (res.ok) {
        return res.json()
    }

    throw new Error()
}

export default function FetchData({ roomname }) {

    const ul = css`
    width: 60%;
    margin: 0 auto;
    margin-top: 40px;
    text-align: left;
  `;

  const listItem = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #bbb;
    padding: 15px 0;
    &:first-of-type {
      border-top: 1px solid #bbb;
    }
  `;

  const opt = css`
    font-size: .8rem;
    color: #555;
  `;

  const listSpan = css`
    display: block;
    margin-right: 15px;
  `;

  const roomBtn = css`
      background-color: orange;
      padding: 5px 25px;
      color: #fff;
      border: 1px solid orange;
      border-radius: 7px;
      &:hover {
        background-color: #fff;
        color: orange;
      }
    `;

    const [roomArray, setRoomArray] = useState([])

    const { data } = useSuspenseQuery({
        queryKey: ['userInfo'],
        queryFn: () => {
            return fetchData(roomname)
        },
    });

    data.roominfo.forEach(elem => {
        roomArray.push(elem)
    });

    return (
        <ul css={ul}>
        { roomArray.map((value, index) => {
          const shortDescription = value.description.substring(0, 10);
          const title = value.roomname.substring(0, 10)
          const needPass = value.needpass === "yes" ? "あり" : "なし";
          const path = "/home/room/detail/" + value.roomid;
          return <li key={index} css={listItem}>
                <span css={listSpan}><span css={opt}>ルーム名 : </span>{ title }...</span>
                <span css={listSpan}><span css={opt}>説明 : </span>{ shortDescription }...</span>
                <span css={listSpan}><span css={opt}>パスワード有無 : </span>{ needPass }</span>
                <span css={listSpan}><span css={opt}>作者 : </span>{ value.createdby }</span>
                <span css={listSpan}><span css={opt}>人数 : </span>{ value.people }</span>
                <Link css={roomBtn} to={path}>参加</Link>
                </li>
        })}
        </ul>
    );
}