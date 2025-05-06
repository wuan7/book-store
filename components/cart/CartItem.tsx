'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { Checkbox } from '../../components/ui/checkbox'
import { Button } from '../../components/ui/button'

type Props = {
  item: {
    id: string
    name: string
    image: string
    price: number
    originalPrice?: number
    quantity: number
    selected: boolean
  }
}

const CartItem = ({ item }: Props) => {
  const [quantity, setQuantity] = useState(item.quantity)
  const [selected, setSelected] = useState(item.selected)

  const handleQuantity = (type: 'inc' | 'dec') => {
    const newQty = type === 'inc' ? quantity + 1 : Math.max(1, quantity - 1)
    setQuantity(newQty)
    toast.success('Đã cập nhật số lượng')
  }

  const handleDelete = () => {
    toast.info('Đã xoá sản phẩm')
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-md shadow-sm">
      <Checkbox checked={selected} onCheckedChange={() => setSelected(!selected)} />
      <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-red-500 font-semibold">{item.price.toLocaleString()}₫</p>
          {item.originalPrice && (
            <p className="line-through text-sm text-gray-400">{item.originalPrice.toLocaleString()}₫</p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button size="icon" variant="outline" onClick={() => handleQuantity('dec')}>-</Button>
          <span>{quantity}</span>
          <Button size="icon" variant="outline" onClick={() => handleQuantity('inc')}>+</Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{(item.price * quantity).toLocaleString()}₫</p>
        <Button variant="ghost" size="sm" className="text-red-500 mt-1" onClick={handleDelete}>
          Xoá
        </Button>
      </div>
    </div>
  )
}

export default CartItem
