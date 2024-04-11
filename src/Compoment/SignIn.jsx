import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../Context/Status";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const [, , , SetIsSideBar] = useContext(StatusContext);
  const [InputForm, setInputForm] = useState({
    Email: "",
    Password: "",
  });
  const [WrongInput, setWrongInput] = useState({
    Email: true,
    Password: true,
  });

  const ChangeInput = (e) => {
    const { name, value } = e.target;
    setInputForm({ ...InputForm, [name]: value });
  };

  useEffect(() => {
    SetIsSideBar({Sidebar: false, Footer: true});
  },[SetIsSideBar]);

  const navigate = useNavigate();

  const HandleSignIn = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:9000/Account/SignIn", {
        Email: InputForm.Email,
        Password: InputForm.Password,
      })
      .then((rs) => {
        if (rs.data.Status === "Wrong Email") {
          setWrongInput({ ...WrongInput, Email: false });
        } else if (rs.data.Status === "Wrong Password") {
          setWrongInput({ ...WrongInput, Password: false });
        } else {
          window.localStorage.setItem("Email", rs.data.Email);
          window.localStorage.setItem("TokenPs", rs.data.Password);
          navigate("/");
        }
      }).catch(err => {
        console.log(err)
      });
  };

  return (
    <div>
      <div className="flex ">
        <div className="overflow-hidden h-[702px]">
          <img src="./Image/SignInBR.png" className="w-[960px]" alt="" />
        </div>
        <div className="w-[558px] h-[702px] gap-5 flex justify-center items-center flex-col bg-[#efee9b] -mr-[1000px]">
          <h1 className="text-[50px] items-center font-bold mb-4  ">
            Đăng nhập
          </h1>
          <form onSubmit={HandleSignIn}>
            <div className="mb-4">
              <input
                type="email"
                name="Email"
                onChange={ChangeInput}
                className={WrongInput.Email ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5" : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500"}
                placeholder="Email "
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="Password"
                onChange={ChangeInput}
                className={WrongInput.Password ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5" : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500"}
                placeholder="Mật khẩu "
              />
            </div>

            <div className="flex w-full items-center justify-center">
              <div>
                <button
                  type="submit"
                  className="bg-amber-400 border-2 border-amber-400 rounded-full text-white font-bold py-2 px-4 duration-200 ease-in hover:bg-white hover:text-amber-400"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </form>
          <p className="text-center font-bold">
            Chưa có tài khoản? <br></br>
            <Link
              to="/SignUp"
              className="duration-100 ease-in hover:text-sky-500"
            >
              Tạo tài khoản
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}