"use client";
import React from "react";
import { useAdminModal } from "../../../../hooks/useAdminModal";
import { Button } from "../../../../components/ui/button";
const ProductPage = () => {
  const { openCreateProduct } = useAdminModal();
  return (
    <div className="m-4">
      <Button onClick={openCreateProduct}>Tạo sách</Button>
    </div>
  );
};

export default ProductPage;
