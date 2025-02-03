"use client";

import { ReactNode } from "react"
import { useSession, signOut } from "next-auth/react";
import DashboardSideBar from "./_components/dashboard-side-bar"
import DashboardTopNav from "./_components/dashbord-top-nav"
// import { isAuthorized } from "@/utils/data/user/isAuthorized"
// import { redirect } from "next/dist/server/api-utils"
// import { currentUser } from "@clerk/nextjs/server"
import config from "@/config";
import { getSession } from "@/lib";

export default function DashboardLayout({ children }: { children: ReactNode }) {

  let user;
  const { data: session, status, update } = useSession();

  if(config?.auth?.enabled) {
    // user = await currentUser()
  } else if(config?.authCustom?.enabled) {
    user = getSession();
  } else if(config?.authNextAuth?.enabled) {
    user = session?.user;
  }
  // const { authorized, message } = await isAuthorized(user?.id!)
  // if (!authorized) {
  //   console.log('authorized check fired')
  // }
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <DashboardSideBar />
      <DashboardTopNav >
        <main className="flex flex-col gap-4 p-4 lg:gap-6">
          {children}
        </main>
      </DashboardTopNav>
    </div>
  )
}
