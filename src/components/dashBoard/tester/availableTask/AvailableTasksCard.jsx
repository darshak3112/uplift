import { Button, Card } from "flowbite-react";

export default function AvailableTasksCard() {
  return (
    <Card className="max-w-sm">
      <h5 className="text-xl font-bold tracking-tight text-gray-900">
        Noteworthy technology acquisitions 2021
      </h5>
      <p className="font-normal text-gray-700">
        Here are the biggest enterprise technology acquisitions of 2021 so far,
        in reverse chronological order.
      </p>
      <Button color={"blue"}>Apply</Button>
    </Card>
  );
}
