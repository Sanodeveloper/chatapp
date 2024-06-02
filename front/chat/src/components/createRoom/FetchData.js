/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { motion } from "framer-motion";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchData = async (data) => {
    const base = process.env.REACT_APP_BACK_API_BASE_URL;
    const res = await fetch(`${base}/room/create`, {
        method: "POST",
        body: JSON.stringify({
            ...data
        }),
        headers: {
            "Content-type": "application/json; charaset=UTF-8"
        },
        credentials: 'include'
    });

    if (res.ok && res.status !== 204) {
        return res.json()
    }

    throw new Error()
}


export default function FetchData({newData}) {

    const backwrapper = css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.7);
      padding-top: 100px;
    `;

    const pop = css`
      max-width: 550px;
      margin: 0 auto;
      padding: 30px 100px;
      background-color: #fff;
      border-radius: 10px;
    `;

    const title = css`
      margin-bottom: 40px;
      font-size: 1.5rem;
    `;

    const para = css`
      margin-bottom: 20px;
    `;

    const btnWrapper = css`
      display: flex;
      justify-content: space-between;
    `;

    const btn = css`
      background-color: #fff;
      display: inline-block;
      margin-top: 60px;
      padding: 5px 25px;
      border: 1px solid #000;
      border-radius: 10px;
      &:hover {
        opacity: .7;
      }
    `;

    const roomBtn = css`
      background-color: #fff;
      color: orange;
      border: 1px solid orange;
      &:hover {
        background-color: orange;
        color: #fff;
        border: none;
      }
    `;

    const check = css`
      color: #7cfc00;
      position: absolute;
      margin-left: -35px;
      margin-top: 3px;
      width: 26px;
      height: 14px;
      border-bottom: solid 2px currentColor;
      border-left: solid 2px currentColor;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
    `;

    const { data } = useSuspenseQuery({
        queryKey: ['roomInfo'],
        queryFn: () => {
            return fetchData(newData)
        },
    });

    const path = "/room/" + String(data.roomid);

    return (
        <>
          <div css={backwrapper}>
            <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            >
                <div css={pop}>
                    <h2 css={title}><span css={check}></span>ルーム作成が完了いたしました !</h2>
                    <p css={para}>下のボタンからトークルームに入って会話を楽しみましょう！</p>
                    <div css={btnWrapper}>
                    <Link css={[btn, roomBtn]} to={path}>ルームに入る</Link>
                    <Link css={btn} to="/home">戻る</Link>
                    </div>
                </div>
            </motion.div>
          </div>
        </>
    );
}