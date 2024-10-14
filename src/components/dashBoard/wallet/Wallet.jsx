"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Table, Modal, Label, TextInput } from "flowbite-react";
import { FaWallet, FaArrowUp, FaArrowDown, FaHistory } from "react-icons/fa";
import { createRazorpayOrder, processWithdrawal } from "@/_lib/razorpayOrder";

export default function Wallet() {
  const [balance, setBalance] = useState(10000);
  const [transactions, setTransactions] = useState([
    { id: 1, type: "credit", amount: 5000, date: "2024-09-15" },
    { id: 2, type: "debit", amount: 2000, date: "2024-09-14" },
    { id: 3, type: "credit", amount: 7000, date: "2024-09-13" },
  ]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddFunds = async () => {
    try {
      const amount = 1000 * 100; // Amount in paise (e.g., 1000 INR)
      const order = await createRazorpayOrder(amount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Add Funds to Wallet",
        order_id: order.id,
        handler: function (response) {
          console.log(response);
          updateBalanceAndTransactions(amount / 100, "credit");
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid withdrawal amount");
      }

      if (amount > balance) {
        throw new Error("Insufficient balance");
      }

      const result = await processWithdrawal(amount * 100, "user_id_here");
      if (result.success) {
        updateBalanceAndTransactions(amount, "debit");
        setShowWithdrawModal(false);
        setWithdrawAmount("");
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert(error.message);
    }
  };

  const updateBalanceAndTransactions = (amount, type) => {
    setBalance((prevBalance) =>
      type === "credit" ? prevBalance + amount : prevBalance - amount
    );
    setTransactions((prevTransactions) => [
      {
        id: Date.now(),
        type: type,
        amount: amount,
        date: new Date().toISOString().split("T")[0],
      },
      ...prevTransactions,
    ]);
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="flex items-center mb-8 text-3xl font-bold text-gray-800">
        <FaWallet className="mr-3 text-blue-500" /> My Wallet
      </h1>

      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        <Card className="p-6 transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Available Balance
          </h2>
          <p className="text-4xl font-bold text-green-600">
            ₹{balance.toFixed(2)}
          </p>

          <div className="flex mt-6 space-x-4">
            <Button
              className="flex-grow text-white transition-all bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
              onClick={handleAddFunds}
            >
              <FaArrowUp className="mr-2" /> Add Funds
            </Button>
            <Button
              className="flex-grow text-white transition-all bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500"
              onClick={() => setShowWithdrawModal(true)}
            >
              <FaArrowDown className="mr-2" /> Withdraw
            </Button>
          </div>
        </Card>

        <Card className="p-6 transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-700">
            <FaHistory className="mr-2 text-blue-500" /> Recent Transactions
          </h2>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {transactions.map((transaction) => (
                <Table.Row
                  key={transaction.id}
                  className="bg-white hover:bg-gray-50 dark:bg-gray-800"
                >
                  <Table.Cell className="text-gray-600">
                    {transaction.date}
                  </Table.Cell>
                  <Table.Cell>
                    {transaction.type === "credit" ? (
                      <span className="flex items-center text-green-600">
                        <FaArrowUp className="mr-1" /> Credit
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <FaArrowDown className="mr-1" /> Debit
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-gray-800">
                    ₹{transaction.amount.toFixed(2)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>

      <Modal
        show={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      >
        <Modal.Header>Withdraw Funds</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Enter withdrawal amount
            </h3>
            <div>
              <div className="block mb-2">
                <Label htmlFor="withdrawAmount" value="Amount (₹)" />
              </div>
              <TextInput
                id="withdrawAmount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
          <Button color="gray" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
