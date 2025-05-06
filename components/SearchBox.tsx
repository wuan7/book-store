"use client";
import React from 'react'
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { debounce } from "lodash";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import Link from "next/link";
import Image from 'next/image';
import { Product } from '../lib/generated/prisma';


const SearchBox = () => {
    const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search-books?q=${encodeURIComponent(searchTerm)}`);
      const data: Product[] = await res.json();
      setResults(data);
      setOpen(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setResults([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchResults, 300);

  useEffect(() => {
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative w-full md:w-2/3 md:mx-auto  px-1 py-2 ">
      <div className=" flex gap-x-2 items-center  px-2 py-1 lg:rounded-full shadow-md w-full ">
        <Search className=" text-sm p-1.5 rounded-full" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm sách..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(results.length > 0 || query.trim().length > 0)}
          className="flex-1  !ring-0 !outline-none !focus:ring-0 !focus:outline-none !border-none !shadow-none"
        />
      </div>

      {open && (
        <Command
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 p-2 w-full max-h-[200px] h-auto overflow-y-auto shadow-lg rounded-lg z-50"
        >
          <CommandList>
            <CommandGroup>
              {loading ? (
                <CommandItem disabled>Đang tìm kiếm...</CommandItem>
              ) : results.length > 0 ? (
                results.map((book) => (
                  <CommandItem key={book.id} onSelect={() => setOpen(false)}>
                    <Link href={`/books/${book.slug}`} className="w-full block">
                    <div className='flex gap-x-2'>
                    <Image src={book.imageUrl} alt={book.name} width={50} height={50} className="rounded-lg" />
                    <p className='line-clamp-2'>{book.name}</p>
                    </div>
                      
                    </Link>
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>Không tìm thấy sách nào</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  )
}

export default SearchBox