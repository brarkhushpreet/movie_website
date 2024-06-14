import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeToggler } from "./ThemeToggler";
import SearchInput from "./SearchInput";
import GenreDropdown from "./GenreDropdown";

const Header = () => {
  return (
    <header className="fixed w-full z-20 top-0 flex items-center justify-between p-5 bg-gradient-to-t from-gray-200/0 via-gray-900/25 to-gray-900 ">
      <Link href="/" className="mr-5 ">
        <Image
          src="/logo.png"
          width={120}
          height={100}
          alt="Disney Logo"
          className={"cursor-pointer invert"}
        />
      </Link>
      <div className="flex space-x-2">
        <GenreDropdown/>
        <SearchInput/>
        <ThemeToggler />
      </div>
    </header>
  );
};

export default Header;
