import React from 'react';
import { Card, Button, Table } from 'flowbite-react';
import { FaWallet, FaArrowUp, FaArrowDown, FaHistory } from 'react-icons/fa';

export default function Wallet() {
  const balance = 10000;
  const transactions = [
    { id: 1, type: 'credit', amount: 5000, date: '2024-09-15' },
    { id: 2, type: 'debit', amount: 2000, date: '2024-09-14' },
    { id: 3, type: 'credit', amount: 7000, date: '2024-09-13' },
  ];

  return (
    <div className="container p-4 mx-auto">
      {/* Wallet Heading */}
      <h1 className="flex items-center mb-8 text-3xl font-bold text-gray-800">
        <FaWallet className="mr-3 text-blue-500" /> My Wallet
      </h1>

      {/* Balance Card */}
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        <Card className="p-6 transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Available Balance</h2>
          <p className="text-4xl font-bold text-green-600">₹{balance.toFixed(2)}</p>

          {/* Buttons for Add Funds / Withdraw */}
          <div className="flex mt-6 space-x-4">
            <Button className="flex-grow text-white transition-all bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500">
              <FaArrowUp className="mr-2" /> Add Funds
            </Button>
            <Button className="flex-grow text-white transition-all bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500">
              <FaArrowDown className="mr-2" /> Withdraw
            </Button>
          </div>
        </Card>

        {/* Recent Transactions */}
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
                <Table.Row key={transaction.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800">
                  <Table.Cell className="text-gray-600">{transaction.date}</Table.Cell>
                  <Table.Cell>
                    {transaction.type === 'credit' ? (
                      <span className="flex items-center text-green-600">
                        <FaArrowUp className="mr-1" /> Credit
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <FaArrowDown className="mr-1" /> Debit
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-gray-800">₹{transaction.amount.toFixed(2)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>
    </div>
  );
}
