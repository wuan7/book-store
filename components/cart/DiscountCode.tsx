'use client'

import React, { useState } from 'react'

const DiscountCode = () => {
  const [code, setCode] = useState('')

  const applyCode = () => {
    if (code === 'GIAM15K') {
      alert('Đã áp dụng mã giảm giá!')
    } else {
      alert('Mã không hợp lệ!')
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm space-y-2">
      <p className="font-semibold text-sm">Mã giảm giá</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Nhập mã..."
        />
        <button onClick={applyCode} className="bg-green-500 text-white px-4 rounded">
          Áp dụng
        </button>
      </div>
    </div>
  )
}

export default DiscountCode
