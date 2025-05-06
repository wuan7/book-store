"use client";
import { useAtom } from "jotai";
import { authModalAtom } from "../atoms/authAtom";

export const useAuthModal = () => {
  const [authModal, setAuthModal] = useAtom(authModalAtom);

  const openLogin = () => setAuthModal("login");
  const openRegister = () => setAuthModal("register");
  const closeModal = () => setAuthModal(null);

  return { authModal, openLogin, openRegister, closeModal };
};
