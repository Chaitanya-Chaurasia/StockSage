"use client";
import { Github, Search, Home } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/stock?name=${searchTerm}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80 dark:bg-background/80 supports-[backdrop-filter]:bg-background/60 flex items-center justify-center gap-2 p-4 shadow-md rounded-lg">
      <div className="flex items-end w-full gap-4">
        <h1 className="text-2xl font-bold tracking-tighter">stocksage</h1>
      </div>

      <div className="flex items-center w-full justify-center max-w-md">
        <Input
          type="search"
          placeholder="Search for Tesla or AAPL"
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="ml-2" onClick={handleSearch}>
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>

      <Button size="icon" variant="ghost" aria-label="Home">
        <Home className="h-5 w-5" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="GitHub">
        <Github />
      </Button>
    </nav>
  );
};

export default Navbar;
