import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { StatusContext } from "../Context/Status";
export default function PageMain() {
  const [ , , , SetIsSideBar] = useContext(StatusContext)
  useEffect(() => {
    SetIsSideBar({Sidebar: true, Footer: true});
  },[SetIsSideBar]);
  return (
    <div className="flex flex-col pt-[100px]">
      <div className="flex flex-row-reverse justify-between flex-wrap gap-[70px]">
        <div className="w-[500px] h-[300px] gap-5 flex justify-center items-center flex-col bg-yellow-200 rounded-tl-3xl rounded-bl-3xl">
          <div>
            <p>Dùng thử WorkPad </p>
          </div>
          <div>
            <Link
              to="/NoteEdit"
              className="bg-zinc-800 text-white rounded-3xl pt-3 pb-3 pl-5 pr-5 hover:bg-white hover:text-yellow-600 duration-200 ease-linear"
            >
              Tại Đây
            </Link>
          </div>
        </div>
        <div className="w-[900px] h-[300px] text-center bg-zinc-300 p-[20px] ml-[30px] rounded-3xl">
          <h1 className="text-[40px]">WorkPad</h1>
          <br></br>
          <p>
            WorkPad được tạo ra với mục đích giúp bạn ghi lại những suy nghĩ, ý
            tưởng và công việc hàng ngày một cách thuận tiện và linh hoạt. Tận
            dụng giao diện đơn giản và thân thiện, bạn có thể truy cập và sử
            dụng trang web từ bất kỳ thiết bị nào có kết nối internet, giúp bạn
            tiếp tục làm việc và sắp xếp công việc mọi lúc, mọi nơi.
          </p>
        </div>
      </div>
      <div className="w-full h-[4px] bg-zinc-800 mt-[30px] mb-[30px] "></div>
      <div>
        <div className="bg-zinc-500 ml-10 rounded-l-full pt-[10px] pb-[10px] flex items-center justify-end">
          <div>
            <img
              src="./Icon/pen-solid.svg"
              className="w-[50px] h-[50px] mr-[60px]"
              alt=""
            ></img>
          </div>
          <div className="bg-white p-5 rounded-l-full">
            <p className="w-[1300px] text-center">
              Hổ Trợ đầy đủ công cụ của trình soạn thảo cơ bản. Tạo các ghi chú
              và ý tưởng mới chỉ trong vài giây, không cần đăng nhập hoặc tạo
              tài khoản nếu không sử dụng lâu dài.
            </p>
          </div>
        </div>
      </div>
      <br />
      <div>
        <div className="bg-zinc-500 rounded-r-full pt-[10px] pb-[10px] flex items-center justify-end flex-row-reverse mr-10">
          <div>
            <img
              src="./Icon/github.svg"
              className="w-[80px] h-[80px] ml-7"
              alt=""
            ></img>
          </div>
          <div className="bg-white p-5 rounded-r-full ">
            <p className="w-[1300px] text-center">
              Đây là một WorkPad mã nguồn mở được áp dụng giấy phép MIT và bạn
              có thể truy cập nguồn của chúng tôi tại:{" "}
              <a
                href="https://github.com/viet363/WorkPad-FE"
              >
                https://github.com/viet363/WorkPad-FE
              </a>
            </p>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}