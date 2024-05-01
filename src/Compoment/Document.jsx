import React, { useContext, useEffect } from "react";
import { StatusContext } from "../Context/Status";

export default function Document() {
  const [, , , SetIsSideBar] = useContext(StatusContext)
  useEffect(() => {
    SetIsSideBar({ Sidebar: true, Footer: true });
  }, [SetIsSideBar]);
  return (
    <div className=" flex flex-col pt-[100px]">
      <div className="flex flex-col bg-yellow-400 w-[720px] rounded-r-full">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-5 ">
          Tạo và Tổ Chức Ghi Chú
        </p>
      </div>
      <div className="flex flex-col bg-zinc-400  rounded-lg p-[50px] m-10  ">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-[15px] text-center   ">
          Tạo ghi chú mới với một cú nhấp chuột và tổ chức chúng vào các danh
          mục hoặc nhãn để dễ dàng tìm kiếm và quản lý.
        </p>
      </div>
      <div className="flex flex-col bg-yellow-400 w-[720px] rounded-r-full">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-5 ">
          Ghi Chú Mọi Lúc, Mọi Nơi
        </p>
      </div>
      <div className="flex flex-col bg-zinc-400  rounded-lg p-[50px] m-10  ">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-[15px] text-center   ">
          Truy cập và sửa đổi ghi chú của bạn từ bất kỳ thiết bị nào có kết nối
          internet, giúp bạn tiếp tục công việc mọi lúc, mọi nơi.
        </p>
      </div>
      <div className="flex flex-col bg-yellow-400 w-[720px] rounded-r-full">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-5 ">
          Bảo Mật Thông Tin
        </p>
      </div>
      <div className="flex flex-col bg-zinc-400  rounded-lg p-[50px] m-10  ">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-[15px] text-center   ">
          Bảo vệ thông tin cá nhân và quan trọng bằng cách sử dụng tính năng bảo
          mật và đăng nhập bảo vệ.
        </p>
      </div>

      <div className="flex flex-col bg-yellow-400 w-[720px] rounded-r-full">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-5 ">
          Đồng Bộ Hóa Dữ Liệu
        </p>
      </div>
      <div className="flex flex-col bg-zinc-400  rounded-lg p-[50px] m-10  ">
        <p className="  text-black rounded-3xl pt-3 pb-3 pl-5 pr-[15px] text-center   ">
          Đồng bộ hóa dữ liệu của bạn trên nhiều thiết bị để bạn luôn có thể
          truy cập và cập nhật thông tin mới nhất.
        </p>
      </div>
    </div>
  );
}