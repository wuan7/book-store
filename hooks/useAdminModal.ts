"use client";
import { useAtom } from "jotai";
import { createCategory, createProduct, createImage, createPost, createPostCategory } from "../atoms/adminAtom";

export const useAdminModal = () => {
  const [isOpenCreateCategory, setOpenCreateCategory] = useAtom(createCategory);
  const [isOpenCreateProduct, setOpenCreateProduct] = useAtom(createProduct);
  const [isOpenCreateImage, setOpenCreateImage] = useAtom(createImage);
  const [isOpenCreatePost, setOpenCreatePost] = useAtom(createPost);
  const [isOpenCreatePostCategory, setOpenCreatePostCategory] = useAtom(createPostCategory);

  const openCreateCategory = () => setOpenCreateCategory(true);
  const closeCreateCategory = () => setOpenCreateCategory(false);

  const openCreateProduct = () => setOpenCreateProduct(true);
  const closeCreateProduct = () => setOpenCreateProduct(false);

  const openCreateImage = () => setOpenCreateImage(true);
  const closeCreateImage = () => setOpenCreateImage(false);

  const openCreatePost = () => setOpenCreatePost(true);
  const closeCreatePost = () => setOpenCreatePost(false);

  const openCreatePostCategory = () => setOpenCreatePostCategory(true);
  const closeCreatePostCategory = () => setOpenCreatePostCategory(false);

  return {
    openCreateCategory,
    isOpenCreateCategory,
    closeCreateCategory,
    openCreateProduct,
    isOpenCreateProduct,
    closeCreateProduct,
    openCreateImage,
    isOpenCreateImage,
    closeCreateImage,
    openCreatePost,
    isOpenCreatePost,
    closeCreatePost,
    openCreatePostCategory,
    isOpenCreatePostCategory,
    closeCreatePostCategory
  };
};
