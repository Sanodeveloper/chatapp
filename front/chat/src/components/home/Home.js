/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Search from "./Search";

export default function Home() {

  const margin = css`
    margin: 100px 0;
  `;

    return (
        <>
          <Header />
            <div css={margin}>
              <Search/>
            </div>
          <Footer />
        </>
    );
}