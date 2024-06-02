/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

import NaviItem from "./NaviItem";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export default function Header() {
  const base = css`
    max-width: 1500px;
    margin: 0 auto;
    padding: 0 50px;
 `;

const head = css`
  display: flex;
  height: 100px;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
`;

const navi = css`
  padding: 0;
  display: flex;
`;



const h1 = css`
  font-size: 1.5rem;
`;

    return (
        <>
        <header css={[head, base]}>
            <h1 css={h1}><Link to="/home">ChatTier</Link></h1>
            <ul css={navi}>
              <Suspense>
                <ErrorBoundary fallback={<span>Error logging</span>}>
                  <NaviItem />
                </ErrorBoundary>
              </Suspense>
            </ul>
        </header>
        </>
    );
}