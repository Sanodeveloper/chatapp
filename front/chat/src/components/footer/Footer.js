/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const foot = css`
  display: flex;
  align-items: center;
  height: 300px;
  background-color: #333;
  padding: 0 30px;
`;

const logo = css`
  color: #fff;
`;

export default function Footer() {
    return (
        <>
        <footer css={foot}>
            <h2 css={logo}>ChatTier</h2>
        </footer>
        </>
    );
}