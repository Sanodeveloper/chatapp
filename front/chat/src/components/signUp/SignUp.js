/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";


import Footer from "../footer/Footer";
import Header from "../header/Header";
import FetchData from "./FetchData";

export default function SignUp() {

    const form = css`
      max-width: 600px;
      margin: 0 auto;
      padding: 100px 40px 200px 40px;
    `;

    const formElem = css`
      margin-bottom: 40px;
    `;

    const formCenter = css`
      text-align: center;
    `;

    const label = css`
      display: block;
      margin-bottom: 10px;
    `;

    const input = css`
      width: 100%;
      padding: 5px 10px;
      border: 1px solid #000;
      border-radius: 10px;
    `;

    const ul = css`
      margin-bottom: 10px;
      margin-left: 20px;
    `;

    const opt = css`
      font-size: 14px;
      color: #999;
      margin-bottom: 5px;
    `;

    const required = css`
      background-color: orange;
      color: #fff;
      padding: 2px 5px;
      margin-right: 5px;
      border-radius: 5px;
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

  const err = css`
    color: red;
    margin-top: 5px;
  `;

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const [ data, setData ] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [isSend, setSend] = useState(false);
  const [isError, setError] = useState("");

  const onSendData = (newData) => {
    setData({...newData})
    setSend(true);
  }

  const onClose = () => {
    setSend(false)
  }

  const onErr = () => {
    setError("その名前は使われています。")
    setSend(false)
  }

    return (
        <>
          <Header />
          <form css={form} onSubmit={handleSubmit(onSendData)} noValidate>
            <div css={formElem}>
                <label css={label} htmlFor="name"><span css={required}>必須</span>名前 <span css={opt}>- 20文字以内で入力してください</span></label>
                <input id="name" css={input} placeholder="名前を入力してください"
                {...register("name", {
                    required: "名前は必須です",
                    maxLength: {
                        value: 20,
                        message: "名前は20文字以内で入力してください"
                    }
                })}
                />
                <p css={err}>{errors.name?.message}</p>
            </div>
            <div css={formElem}>
                <label css={label} htmlFor="email"><span css={required}>必須</span>メールアドレス</label>
                <input id="email" css={input} placeholder="メールアドレスを入力してください"
                {...register("email", {
                    required: "メールアドレスは必須です",
                    pattern: {
                        value: /([a-z\d+\-.]+)@([a-z\d-]+(?:\.[a-z]+)*)/i,
                        message: "メールアドレスの形式が不正です"
                    }
                })}
                />
                <p css={err}>{errors.email?.message}</p>
            </div>
            <div css={formElem}>
                <label css={label} htmlFor="passwd"><span css={required}>必須</span>パスワード<span css={opt}>- 10文字以上で入力してください</span></label>
                <ul css={ul}>
                    <li css={opt}>少なくとも1つ大文字を使う</li>
                    <li css={opt}>少なくとも1つ数字を使う</li>
                    <li css={opt}>空白は使わない</li>
                </ul>
                <input id="passwd" type="password" css={input} placeholder="パスワードを入力してください"
                {...register("password", {
                    required: "パスワードは必須です",
                    minLength: {
                        value: 10,
                        message: "10文字以上で入力してください"
                    },
                    pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d).*/,
                        message: "少なくとも1つは大文字と数字を使ってください"
                    },
                    validate: {
                      empty: (value, formValues) => {
                        if (value.includes(" ")) {
                          return "空白が含まれています"
                        } else {
                          return true;
                        }
                      }
                    }
                })}
                />
                <p css={err}>{errors.password?.message}</p>
            </div>
            <div css={formCenter}>
              { isSend &&
                <Suspense fallback={<p>送信中...</p>}>
                  <ErrorBoundary fallback={<p>送信中にエラーが発生しました。5分後にもう一度お願いします。</p>}>
                    <FetchData newData={data} onClose={onClose} onErr={onErr}/>
                  </ErrorBoundary>
                </Suspense>
              }
              { isError }
            </div>
            <div css={formCenter}>
                <button type="submit" css={btn}>SignUp</button>
            </div>
          </form>
          <Footer />
        </>
    );
}