"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiChartPie, HiMenu, HiX } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FaTasks, FaHistory } from "react-icons/fa";
import { IoWallet, IoTicket } from "react-icons/io5";
import { useAppSelector } from "@/_lib/store/hooks";
import Link from "next/link";

export function SideBarComponent() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const tempRole = useAppSelector((state) => state.userInfo.role);
  const [role, setRole] = useState(tempRole);

  useEffect(() => {
    setRole(tempRole), [];
  });

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const taskItems =
    role === "tester"
      ? [
          {
            href: "/dashboard?activeTab=available-task",
            label: "Available Task",
          },
          { href: "/dashboard?activeTab=applied-task", label: "Applied Task" },
          { href: "/dashboard?activeTab=result-tester", label: "Result" },
        ]
      : role === "creator"
      ? [
          { href: "/dashboard?activeTab=add-task", label: "Add Task" },
          { href: "/dashboard?activeTab=ongoing-task", label: "On-going Task" },
          { href: "/dashboard?activeTab=result-creator", label: "Result" },
        ]
      : [];

  const sidebarGroups = [
    {
      items: [
        ...(role === "creator"
          ? [
              {
                href: "/dashboard?activeTab=analytics",
                label: "Analytics",
                icon: HiChartPie,
              },
            ]
          : []),
        {
          collapse: true,
          icon: FaTasks,
          label: "Tasks",
          items: taskItems,
        },
        {
          href: "/dashboard?activeTab=history",
          label: "History",
          icon: FaHistory,
        },
      ],
    },
    {
      items: [
        {
          href: "/dashboard?activeTab=wallet",
          label: "Wallet",
          icon: IoWallet,
        },
        {
          href: "/dashboard?activeTab=ticket",
          label: "Ticket Generation",
          icon: IoTicket,
        },
        {
          href: "/dashboard?activeTab=profile",
          label: "Manage Profile",
          icon: CgProfile,
        },
      ],
    },
  ];

  return (
    <>
      <button
        className="p-2 m-2 text-white bg-blue-500 rounded max-w-fit md:hidden"
        onClick={toggleSidebar}
      >
        <HiMenu size={24} />
      </button>
      <div
        className={`fixed inset-0 z-40 md:relative ${
          isSidebarVisible ? "block" : "hidden"
        } md:block`}
      >
        <Sidebar
          className="h-screen"
          aria-label="Sidebar with content separator example"
        >
          <div className="flex justify-end p-2 md:hidden">
            <button
              onClick={closeSidebar}
              className="text-gray-600 hover:text-gray-800"
            >
              <HiX size={24} />
            </button>
          </div>
          <Sidebar.Items>
            {sidebarGroups.map((group, groupIndex) => (
              <Sidebar.ItemGroup key={groupIndex}>
                {group.items.map((item, itemIndex) =>
                  item.collapse ? (
                    <Sidebar.Collapse
                      key={itemIndex}
                      icon={item.icon}
                      label={item.label}
                    >
                      {item.items.map((subItem, subIndex) => (
                        <Sidebar.Item
                          as={Link}
                          href={subItem.href}
                          key={subIndex}
                          onClick={closeSidebar}
                        >
                          {subItem.label}
                        </Sidebar.Item>
                      ))}
                    </Sidebar.Collapse>
                  ) : (
                    <Sidebar.Item
                      as={Link}
                      href={item.href}
                      key={itemIndex}
                      icon={item.icon}
                      onClick={closeSidebar}
                    >
                      {item.label}
                    </Sidebar.Item>
                  )
                )}
              </Sidebar.ItemGroup>
            ))}
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
}
