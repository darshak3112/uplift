"use client";

import AppliedTask from "@/components/dashBoard/tester/appliedTask/AppliedTask";
import AvailableTask from "@/components/dashBoard/tester/availableTask/AvailableTask";
import Default from "@/components/dashBoard/creator/analytics/Analytics";
import History from "@/components/dashBoard/history/History";
import OnGoingTask from "@/components/dashBoard/onGoingTask/OnGoingTask";
import Profile from "@/components/dashBoard/profile/Profile";
import ResultCreator from "@/components/dashBoard/creator/resultCreator/ResultCreator";
import ResultTester from "@/components/dashBoard/tester/resultTester/ResultTester";
import TicketGeneration from "@/components/dashBoard/ticketGeneration/TicketGeneration";
import Wallet from "@/components/dashBoard/wallet/Wallet";
import Analytics from "@/components/dashBoard/creator/analytics/Analytics";

import { useSearchParams } from "next/navigation";
import AddTask from "@/components/dashBoard/creator/addTask/AddTask";
import DefaultComponent from "@/components/dashBoard/default/Default";
import SurveysResponse from "@/components/dashBoard/tester/response/surveys/SurveysResponse";

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
  surveys: SurveysResponse,
};

export default function Dashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type");

  let ComponentToRender = DefaultComponent;

  if (taskId && type) {
    ComponentToRender = componentsMap[type] || DefaultComponent;
  } else if (activeTab) {
    ComponentToRender = componentsMap[activeTab] || DefaultComponent;
  }

  return (
    <div>
      <ComponentToRender />
    </div>
  );
}
