import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";

import FetchData from "./FetchData";

import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function RoomDetail() {
    const params = useParams();
    const query = new QueryClient();

    return (
        <>
        <Header />
        <Suspense fallback={<p>テータを取得中...</p>}>
            <ErrorBoundary fallback={<p>データ取得中にエラーが発生しました。</p>}>
                <QueryClientProvider client={query}>
                    <FetchData roomId={params.roomId}/>
                </QueryClientProvider>
            </ErrorBoundary>
        </Suspense>
        <Footer />
        </>
    );
}