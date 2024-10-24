import React, { useEffect, useState, useRef } from "react";
import {
  idli,
  sambar_idli,
  vada,
  plainDosa,
  onionDosa,
  masalaDosa,
  plainRava,
  onionRava,
  sambarVada,
} from "./constants/img";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import BillComponent from "./BillComponent";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const [itemList, setItemList] = useState([]);
  const [netAmount, setNetAmount] = useState(0);
  const [billNumber, setBillNumber] = useState(0);
  const [isChutneyChecked, setIsChutneyChecked] = useState(false);
  const [isSambarChecked, setIsSambarChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [changeCaluclator, setChangeCal] = useState(true);
  const [itemTitle, setItemTitle] = useState(true);
  const [qtyCount, setQtyCount] = useState(1);
  const [clickedItems, setClickedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [demonitization, setdemonitization] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [income, setIncome] = useState(0);
  const [idliCount, setIdliCount] = useState(0);
  const [samabrIdliCount, setSambarIdliCount] = useState(0);
  const [vadaCount, setVadaCount] = useState(0);
  const [plainDosaCount, setPlainDosaCount] = useState(0);
  const [onlionDosaCount, setOnionDosaCount] = useState(0);
  const [masalaDosaCount, setmasalaDosaCount] = useState(0);
  const [plainRavaCount, setplainRavaCount] = useState(0);
  const [onionRavaCount, setonionRavaCount] = useState(0);
  const [sambarVadaCount, setSambarVadaCount] = useState(0);
  const [transaction, setTransaction] = useState(0);

  //console.log(transaction);

  const totals = itemList.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {});

  const totalIdli = totals.idli || 0;
  const totalSambarIdli = totals["sambar idli"] || 0;
  const totalVada = totals["vada"] || 0;
  const totalPlainDosa = totals["plain Dosa"] || 0;

  const totalOnlionDosa = totals["Onion Dosa"] || 0;
  const totalMasalaDosa = totals["Masala Dosa"] || 0;
  const totalPlainRava = totals["Plain Rava"] || 0;
  const totalOnionRava = totals["Onion Rava"] || 0;
  const totalSambarVada = totals["Sambar Vada"] || 0;

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    // calculateDenominations(moneyChange);
  };

  const moneyChange = inputValue - netAmount;

  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString();

  const formattedTime = todayDate.toLocaleTimeString();

  const handleButtonClick = (itemName, price) => {
    if (!clickedItems[itemName]) {
      const newItem = {
        name: itemName,
        price: price,
        quantity: 1,
      };
      setItemList((prevList) => [...prevList, newItem]);
      setClickedItems((prev) => ({ ...prev, [itemName]: true }));
      setQuantities((prev) => ({ ...prev, [itemName]: 1 }));
    }
  };

  const incrementQuantity = (itemName) => {
    setItemList((prevList) =>
      prevList.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setQuantities((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
  };

  const decrementQuantity = (itemName) => {
    setItemList((prevList) => {
      const updatedList = prevList.map((item) =>
        item.name === itemName && item.quantity > 1 // Prevent going below 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      // Remove items with quantity of 0
      return updatedList.filter((item) => item.quantity > 0);
    });

    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 1) - 1, 0), // Update quantities
    }));
  };
  const printClick = () => {
    setItemList([]);

    setIsChutneyChecked(false);
    setIsSambarChecked(false);
    setInputValue("");
    setItemTitle(true);
    setQtyCount(1);
    setClickedItems({});
    updateBillNumber(
      billNumber + 1,
      income + netAmount,
      idliCount + totalIdli,
      samabrIdliCount + totalSambarIdli,
      vadaCount + totalVada,
      plainDosaCount + totalPlainDosa,
      masalaDosaCount + totalMasalaDosa,

      onlionDosaCount + totalOnlionDosa,
      plainRavaCount + totalPlainRava,
      onionRavaCount + totalOnionRava,
      sambarVadaCount + totalSambarVada
    );
  };
  const handleChutneyCheckbox = () => {
    setIsChutneyChecked(!isChutneyChecked);
  };
  const handleSambarCheckbox = () => {
    setIsSambarChecked(!isSambarChecked);
  };

  const changeCal = () => {
    setChangeCal(!changeCaluclator);
    //calculateDenominations(moneyChange);
  };

  const deleteItem = (itemName) => {
    setItemList((prevList) =>
      prevList.filter((item) => item.name !== itemName)
    );
    setClickedItems((prev) => ({ ...prev, [itemName]: false }));
  };

  const calculateDenominations = (total) => {
    let fiveHundred = 0;
    let twoHundred = 0;
    let hundred = 0;
    let fifty = 0;
    let twenty = 0;
    let tens = 0;
    let fives = 0;
    let twos = 0;
    let ones = 0;

    if (total >= 500) {
      fiveHundred = Math.floor(total / 500);
      total %= 500; // Update total to the remainder
    }
    if (total >= 200) {
      twoHundred = Math.floor(total / 200);
      total %= 200; // Update total to the remainder
    }

    if (total >= 100) {
      hundred = Math.floor(total / 100);
      total %= 100; // Update total to the remainder
    }

    if (total >= 50) {
      fifty = Math.floor(total / 50);
      total %= 50; // Update total to the remainder
    }

    if (total >= 20) {
      twenty = Math.floor(total / 20);
      total %= 20; // Update total to the remainder
    }

    if (total >= 10) {
      tens = Math.floor(total / 10);
      total %= 10; // Update total to the remainder
    }

    if (total >= 5) {
      fives = Math.floor(total / 5);
      total %= 5; // Update total to the remainder
    }
    if (total >= 2) {
      twos = Math.floor(total / 2);
      total %= 2; // Update total to the remainder
    }
    if (total >= 1) {
      ones = Math.floor(total / 1);
      total %= 1; // Update total to the remainder
    }

    let output = [];

    if (fiveHundred > 0)
      output.push(
        <span className="text-blue-500">500 rs = {fiveHundred}</span>
      );
    if (twoHundred > 0)
      output.push(
        <span className="text-green-500">200 rs = {twoHundred}</span>
      );
    if (hundred > 0)
      output.push(<span className="text-red-500">100 rs = {hundred}</span>);
    if (fifty > 0)
      output.push(<span className="text-yellow-500">50 rs = {fifty}</span>);
    if (twenty > 0)
      output.push(<span className="text-purple-500">20 rs = {twenty}</span>);
    if (tens > 0)
      output.push(<span className="text-pink-500">10 rs = {tens}</span>);
    if (fives > 0)
      output.push(<span className="text-indigo-500">5 rs = {fives}</span>);
    if (twos > 0)
      output.push(<span className="text-gray-500">2 rs = {twos}</span>);
    if (ones > 0)
      output.push(<span className="text-teal-500">1 rs = {ones}</span>);

    setdemonitization(
      output.length > 0
        ? output.reduce((prev, curr) => [prev, ", ", curr])
        : [<span key="none">No denominations</span>]
    );
  };
  // calculateDenominations(moneyChange);

  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (buttonRef.current) {
        buttonRef.current.style.backgroundColor = getRandomColor();
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    if (itemList.length > 0) {
      const total = itemList.reduce((accumulator, item) => {
        return accumulator + item.price * item.quantity;
      }, 0);
      let additionalCharges = 0;
      if (isChutneyChecked) additionalCharges += 10;
      if (isSambarChecked) additionalCharges += 10;
      setNetAmount(total + additionalCharges);
    } else {
      setNetAmount(0);
    }
    inputValue.length > 0 && calculateDenominations(moneyChange);
  }, [
    itemList,
    isChutneyChecked,
    isSambarChecked,
    changeCaluclator,
    demonitization,
    inputValue,
    moneyChange,
    lastUpdated,
    billNumber,
    income,
  ]);
  useEffect(() => {
    const fetchBillNumber = async () => {
      const docRef = doc(db, "bills", "currentBill");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTransaction(data);
        // console.log(data);
        setBillNumber(data.number);
        setIdliCount(data.Idli);
        setSambarIdliCount(data.SambarIdli);
        setVadaCount(data.vada);
        setPlainDosaCount(data.PlainDosa);
        setOnionDosaCount(data.OnionDosa);
        setmasalaDosaCount(data.MasalaDosa);
        setplainRavaCount(data.PlainRava);
        setonionRavaCount(data.OnionRava);
        setSambarVadaCount(data.sambarVada);
        setIncome(data.TotalSales);
        // setLastUpdated(
        //   data.lastUpdated ? data.lastUpdated.toDate() : new Date()
        // );
      } else {
        setBillNumber(0);
        setIncome(0);
        const currentDate = new Date();
        setLastUpdated(currentDate);
        await setDoc(docRef, {
          number: 0,
          lastUpdated: currentDate,

          TotalSales: 0,
        });
      }
    };

    fetchBillNumber();
  }, []);

  const updateBillNumber = async (
    newNumber,
    newIncome,
    newIdli,
    newSambarIdli,
    newVada,
    newPlainDosa,
    newOnionDosa,
    newMasalaDosa,
    newPlainRava,
    newOnionRava,
    newSambarVada
  ) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY

    // Check if the date has changed
    if (
      lastUpdated &&
      lastUpdated.toDateString() !== currentDate.toDateString()
    ) {
      newNumber = 0;
      //newIncome = 0; // Reset bill number if date has changed
    }

    setBillNumber(newNumber);
    setLastUpdated(currentDate);
    setIncome(newIncome);
    setIdliCount(newIdli);
    setSambarIdliCount(newSambarIdli);
    setVadaCount(newVada);
    setPlainDosaCount(newPlainDosa);
    setOnionDosaCount(newOnionDosa);
    setmasalaDosaCount(newMasalaDosa);
    setplainRavaCount(newPlainRava);
    setonionRavaCount(newOnionRava);
    setSambarVadaCount(newSambarVada);

    // Update Firestore
    await setDoc(doc(db, "bills", "currentBill"), {
      number: newNumber,
      lastUpdated: formattedDate,
      TotalSales: newIncome,

      Idli: newIdli,
      SambarIdli: newSambarIdli,
      vada: newVada,
      PlainDosa: newPlainDosa,
      OnionDosa: newOnionDosa,
      MasalaDosa: newMasalaDosa,
      PlainRava: newPlainRava,
      OnionRava: newOnionRava,
      sambarVada: newSambarVada,
    });
  };
  const handleTransaction = () => {
    navigate(`/Transaction`, { state: transaction });
  };

  return (
    <div className="flex items-center">
      <div className="grid grid-cols-3">
        <div className=" text-black p-2 rounded-3xl relative">
          <button label="idli">
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={idli}
              alt="error"
              onClick={() => handleButtonClick("idli", 25)}
            />
            {clickedItems["idli"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("idli")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["idli"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("idli")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["idli"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("idli")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">Idli - 25/-</h3>
          )}
        </div>

        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={sambar_idli}
              alt="error"
              onClick={() => handleButtonClick("sambar idli", 30)}
            />
            {clickedItems["sambar idli"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("sambar idli")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["sambar idli"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("sambar idli")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["sambar idli"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("sambar idli")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              Sambar Idli- 30/-
            </h3>
          )}
        </div>

        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={vada}
              alt="error"
              onClick={() => handleButtonClick("vada", 25)}
            />
            {clickedItems["vada"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("vada")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["vada"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("vada")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["vada"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("vada")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">vada- 25/-</h3>
          )}
        </div>
        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={plainDosa}
              alt="error"
              onClick={() => handleButtonClick("plain Dosa", 40)}
            />
            {clickedItems["plain Dosa"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("plain Dosa")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["plain Dosa"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("plain Dosa")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["plain Dosa"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("plain Dosa")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              Plain Dosa- 40/-
            </h3>
          )}
        </div>
        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={onionDosa}
              alt="error"
              onClick={() => handleButtonClick("Onion Dosa", 55)}
            />
            {clickedItems["Onion Dosa"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("Onion Dosa")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["Onion Dosa"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("Onion Dosa")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["Onion Dosa"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("Onion Dosa")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              Onion Dosa- 55/-
            </h3>
          )}
        </div>
        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={masalaDosa}
              alt="error"
              onClick={() => handleButtonClick("Masala Dosa", 55)}
            />
            {clickedItems["Masala Dosa"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("Masala Dosa")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["Masala Dosa"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("Masala Dosa")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["Masala Dosa"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("Masala Dosa")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              Masala Dosa- 55/-
            </h3>
          )}
        </div>
        <div className=" text-black p-2  rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={plainRava}
              alt="error"
              onClick={() => handleButtonClick("Plain Rava", 50, qtyCount)}
            />
            {clickedItems["Plain Rava"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("Plain Rava")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["Plain Rava"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("Plain Rava")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["Plain Rava"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("Plain Rava")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              Plain Rava- 50/-
            </h3>
          )}
        </div>
        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={onionRava}
              alt="error"
              onClick={() => handleButtonClick("Onion Rava", 60)}
            />
            {clickedItems["Onion Rava"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("Onion Rava")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["Onion Rava"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("Onion Rava")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["Onion Rava"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("Onion Rava")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              Onion Rava- 60/-
            </h3>
          )}
        </div>
        <div className=" text-black p-2 rounded relative">
          <button>
            <img
              className="rounded-2xl transition-transform duration-300 transform hover:scale-105 h-[150px] w-[200px]"
              src={sambarVada}
              alt="error"
              onClick={() => handleButtonClick("Sambar Vada", 35)}
            />
            {clickedItems["Sambar Vada"] && (
              <button
                className="absolute top-2 right-4 font-bold bg-red-600 text-white px-2 py-1 m-1 rounded-md"
                onClick={() => deleteItem("Sambar Vada")}
              >
                X
              </button>
            )}
          </button>
          {clickedItems["Sambar Vada"] ? (
            <div>
              <div className="flex ml-10">
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => decrementQuantity("Sambar Vada")}
                >
                  -
                </button>
                <h3 className="m-2 p-2">{quantities["Sambar Vada"] || 1}</h3>
                <button
                  className="m-2 px-2 bg-gray-600 text-white rounded-lg"
                  onClick={() => incrementQuantity("Sambar Vada")}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <h3 className="mt-2 text-center font-bold text-2xl">
              sambar Vada- 35/-
            </h3>
          )}
        </div>
      </div>
      <div className="bg-gray-50 p-2 ml-[100px]">
        <div className="flex flex-col items-center">
          <h1 className="text-black font-bold text-2xl">Udipi hotel</h1>
          <h1 className="text-black font-bold text-2xl">ఉడుపి హోటల్</h1>
          <div className="w-[400px] border-b border-gray-300 mb-4 pt-4"></div>
        </div>
        <div>
          <h3 className="ml-[150px]">Main Road</h3>
          <h3 className="ml-[120px]">Visakhapatnam-531114</h3>
        </div>
        <div>
          <button
            className="bg-black text-white p-2 mt-5 rounded-xl hover:bg-gray-400 ml-32"
            ref={buttonRef}
            onClick={() => handleTransaction()}
          >
            My Transactions
          </button>
        </div>
        <div>
          <h2 className="font-bold text-xl mt-10">TakeAway</h2>
          <div className="flex justify-between">
            <h2 className="font-bold text-lg">Bill No: {billNumber}</h2>
            <h2 className="font-bold">Dt:{formattedDate}</h2>
          </div>
        </div>
        <div className="border border-black">
          <div className="border-b border-black">
            <h3 className="font-bold p-2">Name:</h3>
          </div>
          <div className="font-bold flex justify-between border-b border-black p-2">
            <h3>SM</h3>
            <h3>Qty</h3>
            <h3>Rate</h3>
            <h3>Amount</h3>
          </div>
          <div className="font-bold p-2">
            {itemList.length === 0 ? (
              <h3 className="ml-[90px] text-red-500">
                Please select items from menu
              </h3>
            ) : (
              itemList.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <h3>{item.name}</h3>
                  <h3 className="pr-[80px]">X {item.quantity}</h3>
                  <h3 className="pr-[100px]">{item.price}</h3>
                  <h3>{item.price * item.quantity}</h3>
                </div>
              ))
            )}
            {itemList.length > 0 && (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isChutneyChecked} // Bind the checked state to the checkbox
                    onChange={handleChutneyCheckbox} // Handle changes
                  />
                  {/* <div class="w-3 h-3 border-2 border-gray-300 rounded mr-2 peer-checked:bg-green-500 peer-checked:border-green-500 transition"></div> */}
                  Extra chutney
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={isSambarChecked} // Bind the checked state to the checkbox
                    onChange={handleSambarCheckbox} // Handle changes
                  />
                  Extra Sambar
                </label>
              </div>
            )}
          </div>

          <div className="font-bold flex justify-between border-t border-black">
            <div>
              <h3 className="p-2">Net Amount</h3>
            </div>
            <div className="border-r border-black mr-20"></div>
            <div>
              <h3 className="p-2 text-3xl">{netAmount}.00/-</h3>
            </div>
          </div>
        </div>
        <div className="border-b border-black p-2">
          <h3 className="font-bold">Time: {formattedTime}</h3>
          <p>Goods once sold cannot be taken back</p>
          <p>Check the item before leving the counter</p>
        </div>
        <div>
          <p className="ml-24 p-2">Thank You Visit Again</p>
        </div>
        <div className="ml-28 p-2">
          {itemList.length > 0 && (
            <button
              className="text-white bg-gray-800 hover:bg-black px-8 py-2 rounded-lg text-2xl font-bold"
              onClick={() => printClick()}
            >
              Print
            </button>
          )}
          {itemList.length > 0 && (
            <div className="p-2 ml-[200px]">
              <button
                className="bg-black text-white w-[100px] py-2 rounded-lg cursor-pointer"
                onClick={changeCal}
              >
                {changeCaluclator ? "open Cal" : "close Cal"}
              </button>
            </div>
          )}
        </div>
        {itemList.length > 0 &&
          (changeCaluclator ? null : (
            <div className="flex relative bottom-[60px]">
              <div>
                <input
                  type="input"
                  placeholder="0"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-20 m-1 p-1"
                ></input>
              </div>
              <div className="m-1 p-1">-</div>
              <div className="m-1 p-1">{netAmount}</div>
              <div className="m-1 p-1">=</div>
              <div className="m-1 p-1 text-green-600 font-bold">
                {moneyChange} Return
              </div>
            </div>
          ))}
        {inputValue !== "" && !changeCaluclator && (
          <div>
            <h3 className="ml-5">{demonitization}</h3>
          </div>
        )}
      </div>
      {/* <BillComponent /> */}
    </div>
  );
};

export default Body;
