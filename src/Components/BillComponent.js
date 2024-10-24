import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust the path as necessary
import { doc, getDoc, setDoc } from "firebase/firestore";

const BillComponent = () => {
  const [billNumber, setBillNumber] = useState(0);

  // Fetch the bill number from Firestore
  useEffect(() => {
    const fetchBillNumber = async () => {
      const docRef = doc(db, "bills", "currentBill");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBillNumber(docSnap.data().number);
      } else {
        setBillNumber(0); // Default value if not set
      }
    };

    fetchBillNumber();
  }, []);

  // Function to update the bill number in Firestore
  const updateBillNumber = async (newNumber) => {
    setBillNumber(newNumber);
    await setDoc(doc(db, "bills", "currentBill"), { number: newNumber });
  };

  // Function to increment the bill number
  const incrementBill = () => {
    updateBillNumber(billNumber + 1);
  };

  return (
    <div>
      <h1>Bill Number: {billNumber}</h1>
      <button onClick={incrementBill}>Increment Bill</button>
      <button onClick={() => updateBillNumber(0)}>Reset Bill</button>
    </div>
  );
};

export default BillComponent;
