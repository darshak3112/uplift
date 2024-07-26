"use client";

import AddTask from "@/components/dashBoard/addTask/AddTask";
import AppliedTask from "@/components/dashBoard/appliedTask/AppliedTask";
import AvailableTask from "@/components/dashBoard/availableTask/AvailableTask";
import Default from "@/components/dashBoard/analytics/Analytics";
import History from "@/components/dashBoard/history/History";
import OnGoingTask from "@/components/dashBoard/onGoingTask/OnGoingTask";
import Profile from "@/components/dashBoard/profile/Profile";
import ResultCreator from "@/components/dashBoard/resultCreator/ResultCreator";
import ResultTester from "@/components/dashBoard/resultTester/ResultTester";
import TicketGeneration from "@/components/dashBoard/ticketGeneration/TicketGeneration";
import Wallet from "@/components/dashBoard/wallet/Wallet";
import Analytics from "@/components/dashBoard/analytics/Analytics";
import DefaultComponent from "@/components/dashBoard/default/Default";
import { useSearchParams } from "next/navigation";

const componentsMap = {
  "available-task": AvailableTask,
  "applied-task": AppliedTask,
  "result-tester": ResultTester,
  "add-task": AddTask,
  "ongoing-task": OnGoingTask,
  "result-creator": ResultCreator,
  analytics: Analytics,
  history: History,
  wallet: Wallet,
  ticket: TicketGeneration,
  profile: Profile,
};

export default function Dashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const ActiveComponent = componentsMap[activeTab] || DefaultComponent;
  return (
    <div>
      <ActiveComponent />
    </div>
  );
}
