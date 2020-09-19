import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
      <div>
        <p className="text-white text-2xl font-black">CRM-Clients</p>
      </div>

      <nav className="mt-5 list-none">
        <li
          className={`text-white mb-2 block p-2 ${
            pathname === "/" ? "bg-blue-800 p-3" : ""
          }`}
        >
          <Link href="/">Clients</Link>
        </li>
        <li
          className={`text-white mb-2 block p-2 ${
            pathname === "/orders" ? "bg-blue-800 p-3" : ""
          }`}
        >
          <Link href="/orders">Orders</Link>
        </li>
        <li
          className={`text-white mb-2 block p-2 ${
            pathname === "/products" ? "bg-blue-800 p-3" : ""
          }`}
        >
          <Link href="/products">Products</Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
