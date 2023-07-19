import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Contexts/authContext";
import Login from "../Login";
import { Link } from "react-router-dom";
import Author from "./Pages/Author/Author";
import Category from "./Pages/Category/Category";
import { BsBook, BsPerson } from "react-icons/bs";
import { BiCategory, BiLogOut } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import Book from "./Pages/Book/Book";
import Report from "./Pages/Report";
import Profile from "./Pages/Profile";
import { SiMyspace } from "react-icons/si";

function AdminPage() {
  const { user, logout } = useContext(AuthContext);
  const [page, setPage] = useState("");

  const pages = {
    author: <Author />,
    book: <Book />,
    category: <Category />,
    report: <Report />,
    profile: <Profile />,
  };

  useEffect(() => {
    if (user?.role === "Admin") {
      setPage("author");
    } else {
      setPage("profile");
    }
  }, [user.role]);

  const handleLogout = () => {
    logout();
    window.location.pathname = "/admin/login";
  };

  const active = (current) =>
    page === current ? "bg-gray-500" : "hover:bg-gray-500";

  return (
    <div className="bg-white">
      <aside className="bg-gray-800 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
        <div className="relative border-b border-white/20">
          <p className="flex text-white items-center gap-8 py-6 m-4 px-8 text-xl">
            Library Admin
          </p>
        </div>
        <div className="m-4 text-white">
          <ul className="my-10 ml-8 flex flex-col gap-7 text-lg">
            {user?.role === "Admin" ? (
              <>
                <li>
                  <Link
                    onClick={() => setPage("author")}
                    className={`flex p-2 pl-5 rounded-full mr-5 ${active(
                      "author"
                    )}`}
                  >
                    <SiMyspace className="mt-1 mr-4" />
                    Authors
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setPage("book")}
                    className={`flex p-2 pl-5 rounded-full mr-5 ${active(
                      "book"
                    )}`}
                  >
                    <BsBook className="mt-1 mr-4" />
                    Books
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setPage("category")}
                    className={`flex p-2 pl-5 rounded-full mr-5 ${active(
                      "category"
                    )}`}
                  >
                    <BiCategory className="mt-1 mr-4" />
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setPage("report")}
                    className={`flex p-2 pl-5 rounded-full mr-5 ${active(
                      "report"
                    )}`}
                  >
                    <TbReportSearch className="mt-1 mr-4" />
                    Reports
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => setPage("profile")}
                    className={`flex p-2 pl-5 rounded-full mr-5 ${active(
                      "profile"
                    )}`}
                  >
                    <BsPerson className="mt-1 mr-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setPage("book")}
                    className={`flex p-2 pl-5 rounded-full mr-5 ${active(
                      "book"
                    )}`}
                  >
                    <BsBook className="mt-1 mr-4" />
                    Books
                  </Link>
                </li>
              </>
            )}
            <li className="absolute bottom-5 bg-red-500 rounded-full w-[150px]">
              <button onClick={() => handleLogout()} className="flex p-1">
                <BiLogOut className="mt-1 mr-5 ml-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>
      {pages[page]}
    </div>
  );
}

export default AdminPage;
