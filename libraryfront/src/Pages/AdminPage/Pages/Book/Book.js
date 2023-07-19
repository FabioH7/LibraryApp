import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCreate from "./Components/BookCreate";
import Modal from "../../Components/Modal";
import SingleBook from "./Components/SingleBook";
import Paginate from "../../Components/Paginate";
import Swal from "sweetalert2";

export default function Book({ profileview, authorBooks }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4);
  const [books, setBooks] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [categories, setCategories] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(books);

  const getData = async () => {
    await axios.get("http://localhost:5142/api/User").then((response) => {
      setAuthors(response.data.filter((u) => u.role !== "Admin"));
    });
    await axios.get("http://localhost:5142/api/Book").then((response) => {
      setBooks(response.data);
    });
    await axios.get("http://localhost:5142/api/Category").then((response) => {
      setCategories(response.data);
    });
  };
  let currentBooks = [];
  if (books) {
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  }
  const handleCreate = async (id) => {
    const newBook = await axios.get(`http://localhost:5142/api/Book/${id}`);
    console.log(newBook.data.imageUrl);
    setBooks([...books, newBook.data]);
  };

  const handleClose = () => {
    setCreateModal(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");
    const response = await axios
      .delete(`http://localhost:5142/api/Book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          RefreshToken: refreshToken,
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Book deleted Succesfully!",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.title,
        });
      });
    setBooks(books.filter((a) => a.id !== id));
  };

  const handleUpdate = async (b) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");
    const response = await axios.get(`http://localhost:5142/api/Book/${b.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        RefreshToken: refreshToken,
      },
    });
    console.log("response", response);

    setBooks([...books.filter((bk) => bk.id !== b.id), response.data]);
  };
  return (
    <div className="ml-80">
      <div className="my-3 p-4 mr-5 grid gap-7 relative rounded-xl bg-white text-gray-700 shadow-lg border border-gray-100 overflow-hidden">
        <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
          {profileview ? (
            <p className="text-xl">All Books</p>
          ) : (
            <>
              <p className="text-xl">Books Management</p>
              {createModal ? (
                <Modal label={"Create Books"} close={handleClose}>
                  <BookCreate
                    authors={authors}
                    categories={categories}
                    handleCreate={handleCreate}
                  />
                </Modal>
              ) : null}
              <button
                className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setCreateModal(true)}
              >
                Create Book
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col items-center ">
          <div className="grid grid-cols-2 gap-10">
            {books &&
              currentBooks.map((book) => (
                <SingleBook
                  book={book}
                  Delete={handleDelete}
                  handleUpdate={handleUpdate}
                />
              ))}
          </div>
          {books && (
            <Paginate
              itemsPerPage={booksPerPage}
              totalPosts={books.length}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
