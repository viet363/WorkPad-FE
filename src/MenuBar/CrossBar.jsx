import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StatusContext } from "../Context/Status";

export default function CrossBar() {
  const [, , , , Account] = useContext(StatusContext);
  return (
    <div className="flex justify-between items-center bg-zinc-700 text-white h-[70px] pl-[20%] pr-[20%]">
      <div>
        <Link
          className="text-yellow-400 font-bold border-t-2 border-b-2 border-yellow-400 hover:pt-2 hover:pb-2 duration-200 ease-out"
          to="/"
        >
          WORK PAD
        </Link>
      </div>
      <div className="flex gap-14 items-center justify-center h-[70px]">
        <div>
          <Link
            className="hover:text-yellow-400 duration-200 ease-linear p-2"
            to="/"
          >
            Home
          </Link>
        </div>
        <div>
          <Link
            className="hover:text-yellow-400 duration-200 ease-linear p-2"
            to="/Document"
          >
            Document
          </Link>
        </div>
        {Account.Email ? (
          <div>
            <Link
              className="hover:text-yellow-400 duration-200 ease-linear p-2"
              to="/Account"
            >
              <img className="w-[40px] duration-200 ease-linear hover:bg-yellow-400 rounded-full" src="./Icon/circle-user-solid.svg" alt=""></img>
            </Link>
          </div>
        ) : (
          <div>
            <Link
              className="hover:text-yellow-400 duration-200 ease-linear p-2"
              to="/SignIn"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}