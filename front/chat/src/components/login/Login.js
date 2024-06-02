/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Footer from "../footer/Footer";
import Header from "../header/Header";
import FetchData from "./FetchData";

export default function Login() {

    const form = css`
      max-width: 600px;
      margin: 0 auto;
      padding: 100px 40px 200px 40px;
    `;

    const formElem = css`
      margin-bottom: 40px;
    `;

    const formBtn = css`
      text-align: center;
    `;

    const label = css`
      display: block;
      margin-bottom: 5px;
    `;

    const input = css`
      width: 100%;
      padding: 5px 10px;
      border: 1px solid #000;
      border-radius: 10px;
    `;

    const btn = css`
    background-color: #fff;
    display: inline-block;
    margin-top: 60px;
    padding: 5px 35px;
    border: 1px solid #000;
    border-radius: 10px;
    &:hover {
      opacity: .7;
    }
  `;

  const { register, handleSubmit } = useForm();

  const [ data, setData ] = useState({
    name: "",
    password: ""
  });

  const [ isSend, setSend ] = useState(false);

  const sendData = (newData) => {
    setData({...newData})
    setSend(true);
  }

    return (
        <>
          <Header />
          <form css={form} onSubmit={handleSubmit(sendData)} noValidate>
            <div css={formElem}>
                <label css={label} htmlFor="name">名前</label>
                <input id="name" css={input} placeholder="名前を入力してください" {...register("name")}/>
            </div>
            <div css={formElem}>
                <label css={label} htmlFor="passwd">パスワード</label>
                <input type="password" id="passwd" css={input} placeholder="パスワードを入力してください" {...register("password")}/>
            </div>
            { isSend &&
              <Suspense fallback={<p>送信中...</p>}>
                <ErrorBoundary fallback={<p>送信中にエラーが発生しました。5分後にもう一度お願いします</p>}>
                  <FetchData newData={data} />
                </ErrorBoundary>
              </Suspense>
            }
            <div css={formBtn}>
                <button type="submit" css={btn}>Login</button>
            </div>
          </form>
          <Footer />
        </>
    );
}