import { useSearchParams } from "next/navigation";
import HistoryUser from "../../shared/history/History";
import AnalyticsData from "./AnalyticsData";
import { useEffect } from "react";

export default function Analytics() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(()=>{}, [type]);

  return <div>{type ? <AnalyticsData /> : <HistoryUser />}</div>;
}
