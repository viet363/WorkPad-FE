import React, { useContext, useEffect } from "react";
import { StatusContext } from "../Context/Status";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [, , ,SetIsSideBar, Account, setAccount] = useContext(StatusContext);
  useEffect(() => {
    SetIsSideBar({Sidebar: true, Footer: true});
  },[SetIsSideBar]);

  const navigate = useNavigate();

  const SignOut = async (e) => {
    e.preventDefault();
    window.localStorage.setItem("Email", "")
    window.localStorage.setItem("TokenPs", "")
    setAccount("")
    navigate("/")
  }

  return (
    <div>
      <div class="pt-[120px] mb-10 flex justify-center items-center">
        <div className="flex flex-col gap-10">
          <div className="flex justify-stretch items-center bg-[#FFFCAA]">
            <div>
              <p className="w-[120px] py-2 bg-[#FFF600] text-center font-bold">Name</p>
            </div>
            <div>
              <p className="w-[700px] text-center py-2">{Account.Name}</p>
            </div>
            <div>
              <button className="px-5 py-2 bg-[#3D3D3D] text-white">Đổi</button>
            </div>
          </div>
          <div className="flex justify-stretch items-center bg-[#FFFCAA]">
            <div>
              <p className="w-[120px] font-bold py-2 bg-[#FFF600] text-center">Email</p>
            </div>
            <div>
              <p className="w-[700px] text-center py-2">{Account.Email}</p>
            </div>
          </div>
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
              <button className="px-5 py-2 bg-[#3D3D3D] text-white">Đổi</button>
            </div>
          </div>

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