import { SideBarComponent } from "@/components/shared/sideBar/SideBar";

export default function Dashboard() {
  return (
    <section className="flex flex-col md:flex-row md:gap-2">
      <SideBarComponent className="my-3" />
      dashboard
    </section>
  );
}
