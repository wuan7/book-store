'use client'

import { useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { cn } from '../../../../lib/utils'

type Props = {
  description: string
}

export default function ProductDescription({ description }: Props) {
  const [showFull, setShowFull] = useState(false)

  const toggleShow = () => setShowFull((prev) => !prev)

  return (
    <div className="relative bg-white dark:bg-[#0f0f0f] p-4 rounded-xl shadow-sm dark:shadow-white/10">
      <h1 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Mô tả sản phẩm
      </h1>

      <div
        className={cn(
          'relative text-sm text-gray-700 dark:text-gray-300 transition-all duration-300',
          !showFull && 'max-h-[6.5rem] overflow-hidden'
        )}
      >
        <p>{description}</p>

        {!showFull && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-[#0f0f0f] to-transparent pointer-events-none" />
        )}
      </div>

      <div className="flex justify-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleShow}
          className="text-blue-600 hover:underline dark:text-blue-400 z-10"
        >
          {showFull ? 'Thu gọn' : 'Xem thêm'}
        </Button>
      </div>
    </div>
  )
}
