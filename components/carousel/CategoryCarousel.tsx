import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Category } from "../../lib/generated/prisma";
import { getCategories } from "../../actions/category";
import Link from "next/link";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [emblaRef] = useEmblaCarousel();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      <div className="bg-white dark:bg-[#0f0f0f] dark:shadow-sm dark:shadow-white/10 space-y-2">
        <h1 className="font-bold  p-3">Khám phá theo danh mục</h1>

        <div className="overflow-hidden p-5" ref={emblaRef}>
          <div className="flex gap-x-10 select-none">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <div className="w-36 h-full  flex flex-col items-center shrink-0">
                  <div className="relative w-32 h-32 rounded-full border">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h1 className="font-semibold text-sm mt-2 truncate capitalize">
                    {category.name}
                  </h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryCarousel;
