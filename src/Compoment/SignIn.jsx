import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../Context/Status";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const [, , , SetIsSideBar] = useContext(StatusContext);
  const [codeUser, setCodeUser] = useState([]);
  const [inforUser, setInforUser] = useState([]);
  const [forgetPassword, setForgetPassword] = useState({
    Page: false,
    PageCode: false,
    PageChange: false,
    code: "",
    codeConfirm: "",
    Email: "",
    NewPass: "",
    ConfirmPass: "",
  });
  const [InputForm, setInputForm] = useState({
    Email: "",
    Password: "",
  });
  const [WrongInput, setWrongInput] = useState({
    Email: true,
    Password: true,
    Code: true,
  });
  const [buttonWait, setButtonWait] = useState(false);

  const ChangeInput = (e) => {
    const { name, value } = e.target;
    setInputForm({ ...InputForm, [name]: value });
  };

  useEffect(() => {
    SetIsSideBar({ Sidebar: false, Footer: true });
  }, [SetIsSideBar]);

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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setCodeUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (codeUser.access_token) {
      axios
        .get(
          "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" +
            codeUser.access_token,
          {
            headers: {
              Authorization: "Bearer " + codeUser.access_token,
              Accept: "application/json",
            },
          }
        )
        .then((rs) => {
          setInforUser(rs.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [codeUser]);

  useEffect(() => {
    if (inforUser.id) {
      axios
        .post("http://localhost:9000/Account/CheckEmail", {
          Email: inforUser.email,
        })
        .then((rs1) => {
          if (rs1.data.Status === "Success") {
            axios
              .post("http://localhost:9000/Account/SignUp", {
                Email: inforUser.email,
                Name: inforUser.name,
                Password: inforUser.id,
                Type: "Google"
              })
              .then((rs2) => {
                window.localStorage.setItem("Email", inforUser.email);
                window.localStorage.setItem("TokenPs", rs2.data.Password);
                navigate("/");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            axios
              .post("http://localhost:9000/Account/GetTrueAccount", {
                Email: inforUser.email,
              })
              .then((rs3) => {
                window.localStorage.setItem("Email", rs3.data.Email);
                window.localStorage.setItem("TokenPs", rs3.data.Password);
                navigate("/");
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inforUser]);

  const ChangeFG = (e) => {
    const { name, value } = e.target;
    setForgetPassword({ ...forgetPassword, [name]: value });
  };

  const HandleCheckEmail = (e) => {
    e.preventDefault();
    setButtonWait(true);
    axios
      .post("http://localhost:9000/Account/CheckEmail", {
        Email: forgetPassword.Email,
      })
      .then((rs) => {
        if (rs.data.Status === "Fauld") {
          axios
            .post("http://localhost:9000/Account/SendCode", {
              Email: forgetPassword.Email,
            })
            .then((rs1) => {
              setForgetPassword({
                ...forgetPassword,
                PageCode: true,
                codeConfirm: rs1.data.Code,
              });
              setButtonWait(false);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setWrongInput({ ...WrongInput, Email: false });
          setButtonWait(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleCheckCode = (e) => {
    e.preventDefault();
    if (forgetPassword.code === forgetPassword.codeConfirm.toString()) {
      setForgetPassword({ ...forgetPassword, PageChange: true });
      setWrongInput({ ...InputForm, Code: true });
    } else {
      setWrongInput({ ...InputForm, Code: false });
    }
  };

  const HandleChangePass = (e) => {
    e.preventDefault();
    console.log(forgetPassword.ConfirmPass === forgetPassword.NewPass);
    if (forgetPassword.ConfirmPass === forgetPassword.NewPass) {
      axios
        .post("http://localhost:9000/Account/ChangePassword", {
          Email: forgetPassword.Email,
          Password: forgetPassword.NewPass,
        })
        .then(() => {
          axios
            .post("http://localhost:9000/Account/SignIn", {
              Email: forgetPassword.Email,
              Password: forgetPassword.NewPass,
            })
            .then((rs3) => {
              window.localStorage.setItem("Email", rs3.data.Email);
              window.localStorage.setItem("TokenPs", rs3.data.Password);
              navigate("/");
            })
            .catch((err) => {
              console.log(err);
            });
        });
    } else {
      setWrongInput({ ...WrongInput, Password: true });
    }
  };

  const ChangePage = (value) => {
    setForgetPassword({ ...forgetPassword, Page: value });
    setWrongInput({
      Email: true,
      Password: true,
      Code: true,
    });
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setButtonWait(false)
  //   },1000)
  // },[buttonWait])

  return (
    <div>
      <div className="flex ">
        <div className="overflow-hidden h-[702px]">
          <img src="./Image/SignInBR.png" className="w-[960px]" alt="" />
        </div>
        <div className="w-[569px] h-[702px] gap-5 flex justify-center items-center flex-col bg-[#efee9b] -mr-[1000px]">
          {forgetPassword.Page ? (
            <>
              <div>
                <h1 className="font-bold text-[50px]">Quên mật khẩu</h1>
              </div>
              <div>
                <form
                  onSubmit={HandleCheckEmail}
                  className="flex flex-col gap-2"
                >
                  <div>
                    {forgetPassword.PageCode ? (
                      <input
                        type="email"
                        value={forgetPassword.Email}
                        onChange={ChangeFG}
                        readOnly
                        name="Email"
                        className="shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 opacity-80 cursor-default duration-200 ease-in"
                        placeholder="Email..."
                      ></input>
                    ) : (
                      <input
                        value={forgetPassword.Email}
                        onChange={ChangeFG}
                        name="Email"
                        type="email"
                        className={
                          WrongInput.Email
                            ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 duration-200 ease-in"
                            : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500 duration-200 ease-in"
                        }
                        placeholder="Email..."
                      ></input>
                    )}
                  </div>
                  {forgetPassword.PageCode ? (
                    <></>
                  ) : (
                    <div>
                      <button
                        disabled={buttonWait}
                        type="submit"
                        className={
                          buttonWait
                            ? "w-full border-2 border-amber-400 rounded-full font-bold py-2 px-4 duration-200 ease-in bg-white "
                            : "w-full bg-amber-400 border-2 border-amber-400 rounded-full text-white font-bold py-2 px-4 duration-200 ease-in hover:bg-white hover:text-amber-400"
                        }
                      >
                        {buttonWait ? (
                          <span className="loader"></span>
                        ) : (
                          "Xác Nhận"
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
              {forgetPassword.PageCode ? (
                <div>
                  <form
                    onSubmit={HandleCheckCode}
                    className="flex flex-col gap-2"
                  >
                    <div>
                      {forgetPassword.PageChange ? (
                        <input
                          name="code"
                          onChange={ChangeFG}
                          value={forgetPassword.code}
                          readOnly
                          maxLength={6}
                          className="shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 opacity-80 cursor-default duration-200 ease-in"
                          placeholder="Nhập mã..."
                        ></input>
                      ) : (
                        <input
                          name="code"
                          onChange={ChangeFG}
                          value={forgetPassword.code}
                          maxLength={6}
                          className={
                            WrongInput.Code
                              ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 duration-200 ease-in"
                              : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500 duration-200 ease-in"
                          }
                          placeholder="Nhập mã..."
                        ></input>
                      )}
                    </div>
                    {forgetPassword.PageChange ? (
                      <></>
                    ) : (
                      <div>
                        <button
                          type="submit"
                          className="w-full bg-amber-400 border-2 border-amber-400 rounded-full text-white font-bold py-2 px-4 duration-200 ease-in hover:bg-white hover:text-amber-400"
                        >
                          Xác Nhận
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                <></>
              )}
              {forgetPassword.PageChange ? (
                <div>
                  <form
                    onSubmit={HandleChangePass}
                    className="flex flex-col gap-2"
                  >
                    <div>
                      <input
                        type="password"
                        name="NewPass"
                        minLength={5}
                        onChange={ChangeFG}
                        className={
                          WrongInput.Password
                            ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500 duration-200 ease-in"
                            : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 duration-200 ease-in"
                        }
                        placeholder="Mật khẩu..."
                      ></input>
                    </div>
                    <div>
                      <input
                        type="password"
                        name="ConfirmPass"
                        onChange={ChangeFG}
                        minLength={5}
                        className="shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 duration-200 ease-in"
                        placeholder="Xác nhận mật khẩu..."
                      ></input>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full bg-amber-400 border-2 border-amber-400 rounded-full text-white font-bold py-2 px-4 duration-200 ease-in hover:bg-white hover:text-amber-400"
                      >
                        Xác Nhận
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <></>
              )}
              <div>
                <button onClick={() => ChangePage(false)}>
                  <img
                    className="w-[70px] p-5 bg-white rounded-xl duration-200 ease-in hover:rounded-3xl"
                    src="./Icon/arrow-left-solid.svg"
                    alt=""
                  ></img>
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[50px] items-center font-bold mb-4">
                Đăng nhập
              </h1>
              <form onSubmit={HandleSignIn}>
                <div className="mb-4">
                  <input
                    type="email"
                    name="Email"
                    onChange={ChangeInput}
                    className={
                      WrongInput.Email
                        ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5"
                        : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500"
                    }
                    placeholder="Email "
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    name="Password"
                    onChange={ChangeInput}
                    className={
                      WrongInput.Password
                        ? "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5"
                        : "shadow-sm outline-none w-[300px] pl-5 rounded-3xl p-2.5 border-2 border-red-500"
                    }
                    placeholder="Mật khẩu..."
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
                <br />
                <button
                  onClick={() => ChangePage(true)}
                  className="duration-100 ease-in hover:text-sky-500"
                >
                  Quên mật khẩu?
                </button>
              </p>

              <button
                className="px-4 py-2 bg-white rounded-2xl text-red-500 border-2 border-white hover:text-white hover:bg-red-400 duration-300 ease-linear"
                onClick={() => loginGoogle()}
              >
                Đăng nhập với Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}