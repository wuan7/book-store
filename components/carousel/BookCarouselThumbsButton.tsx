import React from 'react'
import Image from 'next/image'

type Props = {
  selected: boolean
  index: number
  imgUrl: string
  onClick: () => void
}

const BookCarouselThumbsButton = ({ selected, imgUrl, index, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-16 h-20 rounded-md overflow-hidden border-2 ${
        selected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <Image
        src={imgUrl}
        alt={`Thumbnail ${index + 1}`}
        width={64}
        height={80}
        className="w-full h-full object-cover"
      />
    </button>
  )
}

export default BookCarouselThumbsButton
