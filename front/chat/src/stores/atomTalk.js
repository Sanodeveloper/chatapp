import { selector, atom, atomFamily } from "recoil";

export const userNameAtom = atom({
    key: "userNameAtom",
    default: ""
});

export const talkAtom = atom({
    key: "talkAtom",
    default: []
});

const talksAtom  = atomFamily({
    key: "talksAtom",
    default: null
});

export const addTalkSelector = selector({
    key: "addTalkSelector",
    get: ({ get }) => {
    },
    set: ({set}, {userName, message}) => {
        set(talkAtom, items => [...items, {username: userName, message: message}]);
    }
});

export const addTalksSelector = selector({
    key: "addTalksSelector",
    get: ({ get }) => {
    },
    set: ({set}, {talks}) => {
        set(talkAtom, items => [...items, ...talks]);
    }
});