"use client";
import React from 'react'
import { useAdminModal } from "../../../../hooks/useAdminModal";
import { Button } from "../../../../components/ui/button";
const CategoryPage = () => {
    const { openCreateCategory } = useAdminModal();
  return (
    <div className="m-4">
      <Button onClick={openCreateCategory}>Tạo Danh mục</Button>
    </div>
  )
}

export default CategoryPage