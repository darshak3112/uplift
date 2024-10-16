"use client";

import { useSearchParams } from "next/navigation";
import DefaultComponent from "@/components/dashBoard/default/Default";
import CreatorsList from "@/components/admin/dashboard/creators/CreatorsList";
import TestersList from "@/components/admin/dashboard/testers/TestersList";
import TasksList from "@/components/admin/dashboard/tasks/TasksList";
import TransactionList from "@/components/admin/dashboard/transactions/TransactionList";
import Tickets from "@/components/admin/dashboard/tickets/Tickets";
import Wallet from "@/components/admin/dashboard/wallet/Wallet";

const componentsMap = {
  "creators-admin": CreatorsList,
  "testers-admin": TestersList,
  "tasks-admin": TasksList,
  "transactions-admin": TransactionList,
  "tickets-admin": Tickets,
  "wallet-admin": Wallet,
};

export default function Dashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");

  let ComponentToRender = DefaultComponent;

  if (activeTab) {
    ComponentToRender = componentsMap[activeTab] || DefaultComponent;
  }

  return (
    <div className="w-full mx-2">
      <ComponentToRender />
    </div>
  );
}
