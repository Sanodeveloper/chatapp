/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userNameAtom, talkAtom, addTalkSelector } from "../../stores/atomTalk";
import io  from "socket.io-client";
import NaviItem from "./NaviItem";
import FetchData from "./FetchData";
import { ErrorBoundary } from "react-error-boundary";

export default function Room({roomId}) {

  const base = css`
    max-width: 1500px;
    margin: 0 auto;
    padding: 0 50px;
  `;

  const headinner = css`
    display: flex;
    height: 100px;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  `;

  const header = css`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    background-color: royalblue;
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

    const main = css`
      height: 100vh;
    `;

    const talk = css`
      height: 90%;
      overflow-y: scroll;
    `;

    const ul = css`
      padding: 150px 0;
    `;

    const talkItem = css`
      display: block;
      font-size: 1.5rem;
      margin-bottom: 50px;
    `;

    const talkSpan = css`
      font-size: 1rem;
      margin-left: 15px;
    `;

    const send = css`
      background-color: #393939;
      height: 10%;
      position: relative;
    `;

    const input = css`
      width: 50%;
      background-color: #fff;
      border: 1px solid #000;
      border-radius: 5px;
      padding: 5px 10px;
    `;

    const sendFlex = css`
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      transform: translateY(-50%);
      &::after {
        content: '';
        display: block;
      }
    `;

    const btn = css`
      border: 1px solid #000;
      border-radius: 5px;
      background-color: #fff;
      padding: 5px 20px;
    `;

    const overwrap = css`
      z-index: 2;
      background-color: rgb(0, 0, 0, 0.9);
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      padding-top: 100px;
    `;

    const joinwrap = css`
      text-align: center;
      max-width: 530px;
      margin: 0 auto;
      padding: 100px 100px;
      background-color: #fff;
      border-radius: 10px;

    `;

    const joinText = css`
      margin-bottom: 20px;
    `;

    const btnWrapper = css`
      display: flex;
      justify-content: space-between;
    `;

    const [join, setJoin] = useState(false);
    const [ userName, setUserName ] = useRecoilState(userNameAtom)

    const talkList = useRecoilValue(talkAtom);
    const addTalkList = useSetRecoilState(addTalkSelector);

    let socket = useRef(null);

    useEffect(() => {
      const domain = process.env.REACT_APP_SOCKET_API_DOMAIN;
      const port = process.env.REACT_APP_SOCKET_API_PORT;
      socket.current = io(`http://${domain}:${port}`, {reconnection: false});

      socket.current.on('connect', () => {
        console.log("Connected Correctlly");
      });

      socket.current.on('chatToClient', (jsonData) => {
        const data = JSON.parse(jsonData);
        addTalkList({ userName: data.username, message: data.message });
      });

    }, []);


    useEffect(()=>{
      const joinRoomHandler = () => {
        socket.current.emit('joinRoom', JSON.stringify({roomid: roomId}))
        setJoin(true);
      }

      const sendMessageHandler = () => {
        const message = document.getElementById('input').value;
        socket.current.emit('chatToServer', JSON.stringify({username: userName, message: message, roomid: roomId}));
      }

      const closeConnectionHandler = () => {
        socket.current.emit('closeConnection', JSON.stringify({roomid: roomId, username: userName}));
      }

      document.getElementById('join').addEventListener('click', joinRoomHandler);
      document.getElementById('btn').addEventListener('click', sendMessageHandler);
      document.getElementById('close').addEventListener('click', closeConnectionHandler);
      window.addEventListener('beforeunload', closeConnectionHandler);

      return () => {
        document.getElementById('join').removeEventListener('click', joinRoomHandler);
        document.getElementById('btn').removeEventListener('click', sendMessageHandler);
        document.getElementById('close').removeEventListener('click', closeConnectionHandler);
        window.removeEventListener('beforeunload', closeConnectionHandler)
      }
    }, [userName])

    const onSetName = (name) => {
      setUserName(name)
    }

    return (
        <>
        { !join &&
        <div css={overwrap}>
        <div css={joinwrap}>
          <p css={joinText}>参加するには下のボタンをクリック！</p>
          <div css={btnWrapper}>
            <button id="join" css={[btn, roomBtn]}>参加する</button>
            <Link css={btn} to="/home" reloadDocument>戻る</Link>
          </div>
        </div>
       </div>
        }
          <header css={header}>
            <div css={[base, headinner]}>
              <NaviItem roomId={roomId} onSetName={onSetName}/>
              <Link id="close" css={roomBtn} to="/home" reloadDocument>退出</Link>
            </div>
          </header>
          <main css={main}>
            <div css={[talk, base]}>
              <ul id="talk" css={ul}>
                <FetchData roomId={roomId} />
                { talkList.map((item, index) => {
                  return <li key={index} css={talkItem}>{item.username}<br /><span css={talkSpan}>{item.message}</span></li>
                })}
              </ul>
            </div>
            <div css={send}>
              <div css={[base, sendFlex]}>
                <input id="input" css={input} placeholder="メッセージを入力してください"></input>
                <button id="btn" css={btn}>送信</button>
              </div>
            </div>
          </main>
        </>
    );
}