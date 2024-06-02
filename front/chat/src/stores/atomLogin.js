import { selector } from "recoil";

export const loginSelector = selector({
    key: "isLoginSelector",
    get: async ({ get }) => {
        const base = process.env.REACT_APP_BACK_API_BASE_URL;
        const res = await fetch(`${base}/session`, {
            method: "GET",
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            return data.auth;
        }

        if (res.status === 403) {
            return false
        }

        throw new Error();
    }
})