import React, { useState } from "react";

export default function Modal({label, close, children}) {
  
  return (
    <>
       
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none w"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-[500px]">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {label}
                  </h3>
                </div>
                <div className="relative p-6 flex-auto w-[500px]">
                    {children}
                    <button onClick={() => {
                        close()
                    }} className='mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
        </>
    </>
  );
}