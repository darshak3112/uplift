"use client";

import { useState } from "react";
import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
  HiMenu,
  HiX,
} from "react-icons/hi";

export function SideBarComponent() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

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
          className="h-scree"
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
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiChartPie} onClick={closeSidebar}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiViewBoards} onClick={closeSidebar}>
                Kanban
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiInbox} onClick={closeSidebar}>
                Inbox
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUser} onClick={closeSidebar}>
                Users
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                icon={HiShoppingBag}
                onClick={closeSidebar}
              >
                Products
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                icon={HiArrowSmRight}
                onClick={closeSidebar}
              >
                Sign In
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiTable} onClick={closeSidebar}>
                Sign Up
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiChartPie} onClick={closeSidebar}>
                Upgrade to Pro
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiViewBoards} onClick={closeSidebar}>
                Documentation
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={BiBuoy} onClick={closeSidebar}>
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
}
