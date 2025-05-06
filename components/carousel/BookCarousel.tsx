'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import BookCarouselThumbsButton from './BookCarouselThumbsButton'
import { ProductImage } from '../../lib/generated/prisma'
import { getImagesProductByBookId } from '../../actions/product'

type PropType = {
  options?: EmblaOptionsType
  bookId: string
}

const BookCarousel: React.FC<PropType> = ({  options, bookId }) => {
  const [bookImages, setBookImages] = useState<ProductImage[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  useEffect(() => {
    const fetchBookImages = async () => {
      try {
        const data = await getImagesProductByBookId(bookId)
        console.log("data", data)
        setBookImages(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchBookImages()
  }, [bookId])

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="flex flex-col gap-4 ">
      {/* Main carousel */}
      <div className="overflow-hidden " ref={emblaMainRef}>
        <div className="flex">
          {bookImages.map((image, index) => (
            <div key={image.id} className="flex-[0_0_100%] relative h-[400px]  overflow-hidden border">
              <Image
                src={image.imageUrl}
                alt={"image"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 700px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails - hidden on small screens */}
      <div className="hidden md:block overflow-hidden" ref={emblaThumbsRef}>
        <div className="flex space-x-2 mt-2">
          {bookImages.map((image, index) => (
            <BookCarouselThumbsButton
              key={image.id}
              index={index}
              imgUrl={image.imageUrl}
              selected={index === selectedIndex}
              onClick={() => onThumbClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookCarousel
