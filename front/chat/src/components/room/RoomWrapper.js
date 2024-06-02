import { useParams } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Auth from "./Auth";
import Room from "./Room";

export default function RoomWrapper() {

  const { roomId } = useParams();
  const [needPass, setNeedPass] = useState(0);
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    const fetchData = async (roomId) => {
      const base = process.env.REACT_APP_BACK_API_BASE_URL;
      const res = await fetch(`${base}/room/need?roomid=${roomId}`, {
          method: "GET"
      });

      if (res.ok) {
          const data = await res.json();
          const needPass = data.needpass === 'yes' ? 1 : 2
          if (needPass === 2) {
            setAuth(true);
            setNeedPass(needPass);
          } else {
            setNeedPass(needPass)
          }
      } else {
        setNeedPass(0);
      }
    }

    fetchData(roomId)
  }, []);

  const onAuth = (isAuth) => {
    setNeedPass(2);
    setAuth(isAuth);
  }

    return (
        <>
        {needPass === 0 &&
        <p>読み込み中...</p>
        }
        {needPass === 1 &&
        <ErrorBoundary fallback={<p>認証中にエラーが発生しました。</p>}>
          <Auth roomId={roomId} onAuth={onAuth} />
        </ErrorBoundary>
        }
        {
          needPass !== 0 && isAuth === true &&
          <Suspense fallback={<p>データ取得中...</p>}>
            <ErrorBoundary fallback={<p>データ取得中にエラーが発生しました。もう一度入りなおしてください。</p>}>
              <Room roomId={roomId} />
            </ErrorBoundary>
          </Suspense>
        }
        </>
    );
}