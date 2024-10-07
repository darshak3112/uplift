"use client";

import AppliedTask from "@/components/dashBoard/tester/appliedTask/AppliedTask";
import AvailableTask from "@/components/dashBoard/tester/availableTask/AvailableTask";
import Default from "@/components/dashBoard/creator/analytics/Analytics";
import OnGoingTask from "@/components/dashBoard/shared/onGoingTask/OnGoingTask";
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
import HistoryUser from "@/components/dashBoard/shared/history/History";
import YouTubeResponse from "@/components/dashBoard/tester/response/youtube/YouTubeResponse";
import ApproveDisapprove from "@/components/dashBoard/creator/creatorTask/appTesting/ApproveDisapprove";
import AppResponse from "@/components/dashBoard/tester/response/app/AppResponse";
import AppTaskReviews from "@/components/dashBoard/creator/review/AppTaskReviews";

const componentsMap = {
  "available-task": AvailableTask,
  "applied-task": AppliedTask,
  "result-tester": ResultTester,
  "add-task": AddTask,
  "ongoing-task": OnGoingTask,
  "review-creator": ResultCreator,
  history: HistoryUser,
  analytics: Analytics,
  wallet: Wallet,
  ticket: TicketGeneration,
  profile: Profile,
  SurveyTask: SurveysResponse,
  YoutubeTask: YouTubeResponse,
  AppTask: AppTaskReviews,
  AppliedList: ApproveDisapprove,
  AppTaskReview: AppResponse,
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
    <div className="w-full mx-2">
      <ComponentToRender />
    </div>
  );
}
