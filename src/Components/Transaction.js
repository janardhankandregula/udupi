import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  console.log(data);
  //   useEffect(() => {
  //     if (data) {
  //       console.log(data.message); // Log the message to the console
  //     }
  //   }, [data]);
  const homePageClick = () => {
    navigate("/");
  };
  return (
    <div>
      <div>
        <button
          className="bg-black text-white m-2 p-2 font-bold rounded-lg "
          onClick={() => homePageClick()}
        >
          Home
        </button>
      </div>
      <div className="m-2 p-2 flex">
        <h3 className="font-bold">Bill No:{data.number}</h3>
        <h3 className="font-bold">Total Idli:{data.Idli}</h3>
        <h3 className="font-bold">Total Sambar Idli:{data.SambarIdli}</h3>
        <h3 className="font-bold">Total vada:{data.vada}</h3>
        <h3 className="font-bold">Total Plain Dosa:{data.PlainDosa}</h3>
        <h3 className="font-bold">Total Onion Dosa:{data.OnionDosa}</h3>
        <h3 className="font-bold">Total Masala Dosa:{data.MasalaDosa}</h3>
        <h3 className="font-bold">Total Plain Rava:{data.PlainRava}</h3>

        <h3 className="font-bold">Total Onion Rava Dosa:{data.OnionRava}</h3>
        <h3 className="font-bold">Total Sambar Vada:{data.sambarVada}</h3>
        <h3 className="font-bold">Total sale:{data.TotalSales}</h3>
      </div>
    </div>
  );
};

export default Transaction;
