import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../Context/Status";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [, , , SetIsSideBar, Account, setAccount] = useContext(StatusContext);
  const [isOpen, setIsOpen] = useState({
    Ten: false,
    Password: false,
  });

  const [changeInfor, setChangeInfor] = useState({
    Ten: "",
    Password: "",
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

  useEffect(() => {
    setChangeInfor({ ...changeInfor, Ten: Account.Name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.Ten]);

  return (
    <div>
      <div class="pt-[120px] mb-10 flex justify-center items-center">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col">
            <div className="flex justify-stretch items-center bg-[#FFFCAA]">
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
          {Account.Type === "Normal" ? (
            <div className="flex justify-stretch items-center bg-[#FFFCAA]">
              <div>
                <p className="w-[120px] font-bold py-2 bg-[#FFF600] text-center">
                  Mật Khẩu
                </p>
              </div>
              <div>
                <p className="w-[700px] text-center py-2">**********</p>
              </div>
              <div>
                <button className="px-5 py-2 bg-[#3D3D3D] text-white">
                  Đổi
                </button>
              </div>
            </div>
          ) : (
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
          )}

          <div class="flex justify-center">
            <button
              type="button"
              onClick={SignOut}
              class="w-[15rem] h-[3rem]  text-white bg-[#E32727] rounded-3xl"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}