/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary";

import FetchData from "./FetchData";


export default function Search() {

    const input = css`
    width: 50%;
    padding: 5px 10px;
    border: 1px solid #000;
    border-radius: 10px;
    text-align: left;
    &::placeholder {
      text-align: left;
    }
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

  const form = css`
    min-height: 400px;
    text-align: center;
  `;

  const margin = css`
    margin-top: 25px;
  `;

  const query = new QueryClient();

  const [ roomname, setRoomName ] = useState("");
  const [ isSend, setSend ] = useState(false);

  const onSearch = (e) => {
    setSend(false);
    setRoomName(e.target.value)
  }

  const onClick = (e) => {
    e.preventDefault();
    setSend(true);
  }


    return  (
        <>
        <form css={form} noValidate>
            <div>
              <input css={input} type="text" name="roomname" placeholder="ルーム名を入力してください" onChange={onSearch}/>
            </div>
            <button css={btn} onClick={onClick}>検索</button>
            { isSend &&
             <Suspense fallback={<p css={margin}>検索中...</p>}>
              <ErrorBoundary fallback={<p css={margin}>検索中にエラーが発生しました。</p>}>
                <QueryClientProvider client={query}>
                  <FetchData roomname={roomname}/>
                </QueryClientProvider>
              </ErrorBoundary>
            </Suspense>
            }
          </form>
        </>
    );
}