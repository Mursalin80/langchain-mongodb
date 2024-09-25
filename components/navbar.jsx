"use client";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="p-1 bg-[#00684A] w-full text-gray-300">
      <ol className="p-0 m-[10px] list-none">
        <img src="/mongoDB.svg" width={"1%"} className="inline ml-4" />
        <li className="inline ml-[5rem]">
          <Link href="/">Home</Link>
        </li>
        <li className="inline ml-8">
          <Link href="/ask">QnA</Link>
        </li>
        <li className="inline m-8">
          <Link href="/teach">Train</Link>
        </li>
      </ol>
    </nav>
  );
};

export default NavBar;
