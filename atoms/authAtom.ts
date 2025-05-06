import { atom } from "jotai";
export const authModalAtom = atom<"login" | "register" | null>(null);