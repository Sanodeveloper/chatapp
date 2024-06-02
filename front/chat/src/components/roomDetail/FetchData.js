/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchData = async (roomId) => {
    const base = process.env.REACT_APP_BACK_API_BASE_URL;
    const res = await fetch(`${base}/room/detail?roomid=${roomId}`);

    if (res.ok) {
        return res.json()
    }

    throw new Error()
}

export default function FetchData({roomId}) {

    const main = css`
        max-width: 1500px;
        margin: 0 auto;
        padding: 0 50px;
    `;

    const elem = css`
      margin-bottom: 40px;
    `;

    const h2 = css`
      font-size: 1.2rem;
      margin-bottom: 10px;
    `;

    const p = css`
      margin-left: 10px;
    `;

    const btnWrapper = css`
      display: flex;
      justify-content: space-between;
      margin-bottom: 100px;
      &::after {
        display: block;
        content: '';
      }
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

    const btn = css`
      background-color: #fff;
      display: inline-block;
      padding: 5px 35px;
      border: 1px solid #000;
      border-radius: 10px;
      &:hover {
        opacity: .7;
      }
  `;

    const { data } = useSuspenseQuery({
        queryKey: ['roomInfo'],
        queryFn: () => {
            return fetchData(roomId)
        },
        refetchOnWindowFocus: false
    });
    const path = "/room/" + String(data.roomid);

    return (
        <main css={main}>
            <div css={elem}>
                <h2 css={h2}>ルーム名</h2>
                <p css={p}>{data.roomname}</p>
            </div>
            <div css={elem}>
                <h2 css={h2}>人数</h2>
                <p css={p}>{data.people}人</p>
            </div>
            <div css={elem}>
                <h2 css={h2}>作者</h2>
                <p css={p}>{data.createdby}</p>
            </div>
            <div css={elem}>
                <h2 css={h2}>参加者</h2>
                <ul>
                    {data.member.map(value => {
                        return <li key={value}>{value}</li>
                    })}
                </ul>
            </div>
            <div css={elem}>
                <h2 css={h2}>パスワード有無</h2>
                <p css={p}>{data.needpass === "yes" ? "あり" : "なし"}</p>
            </div>
            <div css={elem}>
                <h2 css={h2}>説明</h2>
                <p css={p}>{data.description}</p>
            </div>
            <div css={btnWrapper}>
                <Link css={btn} to="/home">戻る</Link>
                <Link css={roomBtn} to={path}>参加</Link>
            </div>
        </main>
    );
}