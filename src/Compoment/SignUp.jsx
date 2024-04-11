import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../Context/Status";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const [, , , SetIsSideBar] = useContext(StatusContext);
  const [UserForm, setUserForm] = useState({
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [InputWrong, setInputWrong] = useState({
    Email: true,
    ConfirmPassword: true,
  });

  const ChangeInput = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...UserForm, [name]: value });
  };

  useEffect(() => {
    SetIsSideBar({Sidebar: false, Footer: true});
  },[SetIsSideBar]);

  const navigate = useNavigate();

  const HandleSignUp = (e) => {
    e.preventDefault();
    if (UserForm.Password === UserForm.ConfirmPassword) {
      axios
        .post("http://localhost:9000/Account/CheckEmail", {
          Email: UserForm.Email,
        })
        .then((rs1) => {
          if (rs1.data.Status === "Success") {
            axios
              .post("http://localhost:9000/Account/SignUp", {
                Email: UserForm.Email,
                Password: UserForm.Password,
                Name: UserForm.Email
              })
              .then((rs2) => {
                window.localStorage.setItem("Email", UserForm.Email)
                window.localStorage.setItem("TokenPs", rs2.data.Password)
                navigate("/");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setInputWrong({ ...InputWrong, Email: false });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setInputWrong({ ...InputWrong, ConfirmPassword: false });
    }
  };

  return (
    <div>
      <div className="flex ">
        <div className="overflow-hidden h-[702px]">
          <img src="./Image/SignInBR.png" className="w-[960px]" alt="" />
        </div>
        <div className="w-[558px] h-[702px] gap-5 flex justify-center items-center flex-col bg-[#efee9b] -mr-[1000px]">
          <h1 className="text-[50px] items-center font-bold mb-4">Đăng ký</h1>
          <form onSubmit={HandleSignUp}>
            <div className="mb-4">
              <input
                type="email"
                name="Email"
                onChange={ChangeInput}
                className={InputWrong.Email ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5" : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500"}
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="Password"
                onChange={ChangeInput}
                minLength={5}
                className="shadow-sm outline-none pl-5 rounded-3xl w-full p-2.5"
                placeholder="Mật khẩu"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="ConfirmPassword"
                onChange={ChangeInput}
                minLength={5}
                className={InputWrong.ConfirmPassword ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5" : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500"}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            <div className="text-center flex justify-center">
              <button
                type="submit"
                className="bg-amber-400 border-2 border-amber-400 rounded-full text-white font-bold py-2 px-4 duration-200 ease-in hover:bg-white hover:text-amber-400"
              >
                Xác nhận
              </button>
            </div>
          </form>
          <p className="text-center font-bold">
            Đã có tài khoản? <br></br>
            <Link
              to="/SignIn"
              className="duration-100 ease-in hover:text-sky-500"
            >
              Hãy đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}