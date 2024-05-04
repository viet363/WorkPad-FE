import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../Context/Status";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Account() {
  const [, , , SetIsSideBar, Account, setAccount, ChangeAccount] =
    useContext(StatusContext);
  const [isOpen, setIsOpen] = useState({
    Ten: false,
    Password: false,
  });

  const [changeInfor, setChangeInfor] = useState({
    Ten: "",
    Password: "",
    NewPassword: "",
    ConfirmPass: "",
  });

  const [statusPass, setStatusPass] = useState({
    NewPassword: true,
    OldPassword: true,
  });

  const [isWait, setIsWait] = useState({
    Wait: false,
    Status: false,
    Open: false,
  });

  useEffect(() => {
    SetIsSideBar({ Sidebar: true, Footer: true });
  }, [SetIsSideBar]);

  const ChangeOpen = (name, value) => {
    setIsOpen({ ...isOpen, [name]: value });
  };

  const ChangeSave = (e) => {
    const { name, value } = e.target;
    setChangeInfor({ ...changeInfor, [name]: value });
  };

  const navigate = useNavigate();

  const SignOut = async (e) => {
    e.preventDefault();
    window.localStorage.setItem("Email", "");
    window.localStorage.setItem("TokenPs", "");
    setAccount("");
    navigate("/");
  };

  const HandleChangeName = (e) => {
    e.preventDefault();
    if (changeInfor.Ten === Account.Name) {
      ChangeOpen("Ten", false);
    } else {
      axios
        .post("http://localhost:9000/Account/ChangeName", {
          _id: Account._id,
          Ten: changeInfor.Ten,
        })
        .then((rs) => {
          if (rs.data.Status === "Success") {
            ChangeOpen("Ten", false);
            ChangeAccount();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const HandleChangePass = (e) => {
    e.preventDefault();
    setIsWait({ Open: true, Wait: false, Status: false })
    if (changeInfor.NewPassword === changeInfor.ConfirmPass) {
      axios
        .post("http://localhost:9000/Account/ChangePassword", {
          _id: Account._id,
          Password: changeInfor.NewPassword,
          OldPassword: changeInfor.Password,
        })
        .then((rs) => {
          if (rs.data.Status === "Success") {
            setChangeInfor({
              ...changeInfor,
              NewPassword: "",
              Password: "",
              ConfirmPass: "",
            });
            window.localStorage.setItem("TokenPs", rs.data.Password);
            setIsWait({ Open: true, Wait: false, Status: true })
          } else {
            setStatusPass({ ...statusPass, OldPassword: false });
            setIsWait({ Wait: false, Status: false, Open: false })
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setStatusPass({ ...statusPass, NewPassword: false });
      setIsWait({ Wait: false, Status: false, Open: false })
    }
  };

  useEffect(() => {
    if (isWait.Open) {
      setIsWait({ Wait: true, Open: true, Status: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWait.Open])

  useEffect(() => {
    if (isWait.Status) {
      setTimeout(() => {
        setIsWait({ Wait: false, Status: false, Open: false })
        ChangeOpen("Password", false)
      }, 1500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWait.Status])

  useEffect(() => {
    setTimeout(() => {
      setStatusPass({ OldPassword: true, NewPassword: true });
    }, 3000);
  }, [statusPass.NewPassword, statusPass.OldPassword]);

  useEffect(() => {
    setChangeInfor({ ...changeInfor, Ten: Account.Name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.Ten]);

  return (
    <div>
      <div class="pt-[120px] mb-10 flex justify-center items-center">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col">
            <div className="flex justify-between items-center bg-[#FFFCAA]">
              <div>
                <p className="w-[120px] py-2 bg-[#FFF600] text-center font-bold">
                  Name
                </p>
              </div>
              <div>
                <p className="w-[700px] text-center py-2">{Account.Name}</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => ChangeOpen("Ten", !isOpen.Ten)}
                  className="px-5 py-2 bg-[#3D3D3D] text-white"
                >
                  {isOpen.Ten ? "Hủy" : "Đổi"}
                </button>
              </div>
            </div>
            <div>
              <form
                onSubmit={HandleChangeName}
                className={
                  isOpen.Ten
                    ? "w-full bg-slate-300 overflow-hidden h-[150px] rounded-b-xl duration-300 ease-linear"
                    : "w-full bg-slate-300 overflow-hidden h-0 duration-300 ease-in"
                }
              >
                <div className="flex flex-col justify-center items-center gap-5 py-3">
                  <div>
                    <input
                      className="w-[700px] py-2 px-3 outline-none rounded-xl"
                      value={changeInfor.Ten}
                      name="Ten"
                      onChange={ChangeSave}
                    ></input>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-white border-2 border-white text-slate-500 rounded-3xl px-4 py-1 duration-200 ease-linear hover:bg-slate-500 hover:text-white "
                    >
                      Xác Nhận
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex justify-stretch items-center bg-[#FFFCAA]">
            <div>
              <p className="w-[120px] font-bold py-2 bg-[#FFF600] text-center">
                Email
              </p>
            </div>
            <div>
              <p className="w-[700px] text-center py-2">{Account.Email}</p>
            </div>
          </div>
          {Account.Type === "Google" ? (
            <>
              <div className="flex justify-center items-center gap-10 border-2 border-red-300 text-red-400 p-2">
                <div>
                  <svg
                    className="w-[30px] fill-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                </div>
                <div>
                  <p>Đây là Google Account</p>
                </div>
              </div>
            </>
          ) : (
            <div className="relative">
              <div className="flex justify-between items-center bg-[#FFFCAA]">
                <div>
                  <p className="w-[120px] font-bold py-2 bg-[#FFF600] text-center">
                    Mật Khẩu
                  </p>
                </div>
                <div>
                  <p className="w-[700px] text-center py-2">**********</p>
                </div>
                <div>
                  <button
                    onClick={() => ChangeOpen("Password", !isOpen.Password)}
                    className="px-5 py-2 bg-[#3D3D3D] text-white"
                  >
                    {isOpen.Password ? "Hủy" : "Đổi"}
                  </button>
                </div>
              </div>
              <div>
                <form
                  onSubmit={HandleChangePass}
                  className={
                    isOpen.Password
                      ? "flex flex-col items-center justify-center w-full gap-4 py-4 h-[300px] bg-slate-300 overflow-hidden rounded-b-xl duration-300 ease-linear"
                      : "flex flex-col items-center justify-center w-full gap-4 py-0 h-0 bg-slate-300 overflow-hidden rounded-b-xl duration-300 ease-linear"
                  }
                >
                  <div>
                    <input
                      className={
                        statusPass.OldPassword
                          ? "w-[700px] py-2 px-3 outline-none rounded-xl border-white border-2 duration-200 ease-linear"
                          : "w-[700px] py-2 px-3 outline-none rounded-xl border-red-400 border-2 duration-200 ease-linear"
                      }
                      placeholder="Mật khẩu cũ..."
                      name="Password"
                      value={changeInfor.Password}
                      onChange={ChangeSave}
                      type="Password"
                    ></input>
                  </div>
                  <div>
                    <input
                      minLength={5}
                      className="w-[700px] py-2 px-3 outline-none rounded-xl "
                      placeholder="Mật khẩu mới..."
                      name="NewPassword"
                      value={changeInfor.NewPassword}
                      onChange={ChangeSave}
                      type="Password"
                    ></input>
                  </div>
                  <div>
                    <input
                      minLength={5}
                      className={
                        statusPass.NewPassword
                          ? "w-[700px] py-2 px-3 outline-none rounded-xl border-white border-2 duration-200 ease-linear"
                          : "w-[700px] py-2 px-3 outline-none rounded-xl border-red-400 border-2 duration-200 ease-linear"
                      }
                      placeholder="Xác nhận mật khẩu..."
                      name="ConfirmPass"
                      value={changeInfor.ConfirmPass}
                      onChange={ChangeSave}
                      type="Password"
                    ></input>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-white border-2 border-white text-slate-500 rounded-3xl px-4 py-1 duration-200 ease-linear hover:bg-slate-500 hover:text-white "
                    >
                      Xác Nhận
                    </button>
                  </div>
                </form>
              </div>
              {isWait.Open ? (
                <div className="absolute top-0 w-full h-full bg-[rgba(255,255,255,0.6)] flex justify-center items-center">
                  {isWait.Wait ? <div className="loader"></div> : <></>}
                  <div>
                    <svg
                      className={
                        isWait.Status
                          ? "w-[70px] fill-green-500 opacity-100 duration-300 ease-in"
                          : "w-[70px] fill-green-500 opacity-0 duration-300 ease-in"
                      }
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}

          <div class="flex justify-center">
            <button
              type="button"
              onClick={SignOut}
              class="w-[15rem] h-[3rem]  text-white bg-[#E32727] rounded-3xl duration-200 border-[#E32727] border-2 ease-linear hover:text-[#E32727] hover:bg-white"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}