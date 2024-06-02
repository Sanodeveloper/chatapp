/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Footer from "../footer/Footer";
import Header from "../header/Header";
import FetchData from "./FetchData";

export default function CreateRoom() {


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

    const formFlex = css`
      display: flex;
      justify-content: space-around;
    `;

    const label = css`
      display: block;
      margin-bottom: 10px;
    `;

    const input = css`
      width: 100%;
      padding: 5px 10px;
      border: 1px solid #000;
      border-radius: 5px;
    `;

    const radio = css`
      border: 1px solid #000;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      cursor: pointer;
      -webkit-appearance: auto;
      appearance: auto;
      margin-right: 5px;
    `;

    const marginLeft = css`
      margin-left: 10px;
    `;

    const textarea = css`
      height: 100px;
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
      padding: 5px 35px;
      border: 1px solid #000;
      border-radius: 10px;
      &:hover {
        opacity: .7;
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

    const err = css`
      color: red;
      margin-top: 10px;
    `;

    const errList = css`
      display: inline-block;
      margin-top: 10px;
      list-style-type: disc;
    `;

    const { register, handleSubmit, formState: { errors } } = useForm({
      mode: "onSubmit",
      reValidateMode: "onSubmit"
    });

    const [needPass, setNeedPass] = useState(false);

    const onRadioChange = (e) => {
      setNeedPass(e.target.value === "yes" ? true : false);
    }

    const [ data, setData ] = useState({
      roomname: "",
      needpass: "",
      password: "",
      description: ""
    });

    const [isSend, setSend] = useState(false);

    const onSendData = (newData) => {
      setData({...newData})
      setSend(true);
    }
    return (
        <>
          <Header />
          <form css={form} onSubmit={handleSubmit(onSendData)} noValidate>
            <div css={formElem}>
                <label css={label} htmlFor="roomName"><span css={required}>必須</span>ルーム名 <span css={opt}>- 20文字以内で入力してください</span></label>
                <input id="roomName" css={input} placeholder="ルーム名を入力してください"
                {...register("roomname", {
                    required: "名前は必須です",
                    maxLength: {
                        value: 20,
                        message: "名前は20文字以内で入力してください"
                    }
                })}
                />
                <p css={err}>{errors.roomname?.message}</p>
            </div>
            <div css={formElem}>
                <label css={label} htmlFor="needpass"><span css={required}>必須</span>パスワード有無</label>
                <label>
                  <input css={radio} type="radio" value="yes" onClick={onRadioChange}
                  {...register("needpass", {
                    required: "どちらか選択してください"
                  })}/>あり
                </label>
                <label css={marginLeft}>
                  <input css={radio} type="radio" value="no" onClick={onRadioChange}
                  {...register("needpass", {
                    required: "どちらか選択してください"
                  })}/>なし
                </label>
                <p css={err}>{errors.needpass?.message}</p>
            </div>
            { needPass &&
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
            }
            <div css={formElem}>
                <label css={label} htmlFor="description">説明</label>
                <textarea id="description" css={[input, textarea]} placeholder="この部屋の説明や順守すべきルールを記入してください。
                                                                     「誰でも歓迎！」や「気楽に話しませんか？」でも大丈夫です"
                {...register("description")}/>
            </div>
            <div css={formCenter}>
            { isSend &&
                <Suspense fallback={<p css={formElem} >送信中...</p>}>
                  <ErrorBoundary fallback={<div css={formElem}>
                                            <p>送信中にエラーが発生しました。5分後にもう一度お願いします。また以下を満たしているかご確認ください</p>
                                            <ul css={errList}>
                                              <li>ログインしているかどうか</li>
                                            </ul>
                                           </div>}>
                      <FetchData newData={data}/>
                  </ErrorBoundary>
                </Suspense>
              }
            </div>
            <div css={formFlex}>
                <Link css={btn} to="/home">戻る</Link>
                <button type="submit" css={roomBtn}>ルーム作成</button>
            </div>
          </form>
          <Footer />
        </>
    );
}