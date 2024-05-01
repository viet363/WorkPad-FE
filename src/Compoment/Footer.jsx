import React from 'react'

export default function Footer() {
  return (
    <div className='flex flex-wrap bg-zinc-500 text-white items-center justify-between pl-[20%] pr-[20%] pt-[25px] pb-[25px]'>
      <div className='text-center'>
        <h1 className='text-[40px] text-yellow-400'>WorkPad</h1>
        <br />
        <p>Được phát triển bởi nhóm 8</p>
        <p>Môn Mã Nguồn Mở</p>
      </div>
      <div className='text-center'>
        <h2 className='text-[30px]'>Thành Viên</h2>
        <p>Phan Tân Phước - 1050080070</p>
        <p>Lê Quốc Việt - 1050080083</p>
        <p>Bùi Thị Thùy Dương - 1050080045</p>
        <p>Trầm Xuân Trọng - 1050080081</p>
      </div>
    </div>
  )
}