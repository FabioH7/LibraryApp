import React from "react";
import Book from "./Book/Book";
import { useContext } from "react";
import { AuthContext } from "../../../Contexts/authContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="flex flex-col space-y-10">
      <div className="ml-80">
        <div className="my-3 p-4  mr-5 grid gap-7 relative rounded-xl bg-white text-gray-700 shadow-lg border border-gray-100 overflow-hidden">
          <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
            <p className="text-xl">My Profile</p>
          </div>
          <div className="flex flex-col text-xl ml-6 items-center">
            <p>
              <span>Username:</span> {user.username}
            </p>
            <p>
              <span>since:</span> {user.createdAt}
            </p>
            <span>{user.bio}</span>
          </div>
        </div>
      </div>
      <Book profileview />
    </div>
  );
}
