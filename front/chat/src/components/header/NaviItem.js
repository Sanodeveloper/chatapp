/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginSelector } from "../../stores/atomLogin";

export default function NaviItem() {

    const listItem = css`
      list-style: none;
      margin-right: 40px;
    `;

    const link = css`
      &:hover {
          opacity: .7;
      }
    `;

    const roomBtn = css`
      background-color: #fff;
      padding: 5px 25px;
      color: orange;
      border: 1px solid orange;
      border-radius: 7px;
      &:hover {
        background-color: orange;
        color: #fff;
        border: none;
      }
    `

    const auth = useRecoilValue(loginSelector);

    return (
        <>
        { auth
                ?
                <>
                  <li css={listItem}><Link css={roomBtn} to="/createRoom" >ルーム作成</Link></li>
                </>
                :
                <>
                  <li css={listItem}><Link css={link} to="/signup" >Sign Up</Link></li>
                  <li css={listItem}><Link css={link} to="/login" >Login</Link></li>
                </>
              }
        </>
    );
}