/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

const onChangeAuth = async ( password, roomId ) => {
  const base = process.env.REACT_APP_BACK_API_BASE_URL;
  const data = await fetch(`${base}/room/auth`, {
        method: "POST",
        body: JSON.stringify({
            roomid: roomId,
            password: password
        }),
        headers: {
            "Content-type": "application/json; charaset=UTF-8"
        }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 403) {
        return false
      } else {
        throw new Error()
      }
    })
    .then(data => data)
    .catch(() => {
      throw new Error()
    })

    return data.auth;
}

export default function Auth({roomId, onAuth }) {
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

    const input = css`
      width: 100%;
      padding: 5px 10px;
      border: 1px solid #000;
      border-radius: 5px;
    `;

    const btnWrapper = css`
      display: flex;
      justify-content: space-between;
    `;

    const btn = css`
      background-color: #fff;
      display: inline-block;
      margin-top: 40px;
      padding: 5px 25px;
      border: 1px solid #000;
      border-radius: 10px;
      &:hover {
        opacity: .7;
      }
    `;

    const center = css`
      text-align: center;
      margin-top: 10px;
    `;

    const err = css`
      text-align: center;
      color: red;
      margin-top:10px;
    `;

    const [ password, setPasswd ] = useState("");
    const [ ispending, setPending ] = useState(false);
    const [ isError, setError ] = useState("");

    const onClick = async () => {
      setPending(true)
      const isAuth = await onChangeAuth(password, roomId);
      setPending(false);
      if (isAuth) {
        onAuth(isAuth);
      } else {
        setError("パスワードが違います。");
      }
    }

    const onChange = (e) => {
      setPasswd(e.target.value);
    }

    return (
        <>
          <div css={backwrapper}>
            <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            >
              <div css={pop}>
                  <h2 css={title}>パスワードを入力してください</h2>
                  <input css={input} onChange={onChange}/>
                  { ispending &&
                      <p css={center}>検証中です...</p>
                  }
                  { <p css={err}>{ isError }</p> }
                  <div css={btnWrapper}>
                    <Link css={[btn]} to="/home">戻る</Link>
                    <button css={btn} onClick={onClick}>検証する</button>
                  </div>
              </div>
           </motion.div>
         </div>
        </>
    );
}