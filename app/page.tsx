"use client"

import { AccordionComponent } from "@/components/homepage/accordion-component";
import BlogSample from "@/components/homepage/blog-samples";
import HeroSection from "@/components/homepage/hero-section";
import MarketingCards from "@/components/homepage/marketing-cards";
import Pricing from "@/components/homepage/pricing";
import SideBySide from "@/components/homepage/side-by-side";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const router = useRouter()

  const { data: session, status, update } = useSession();
  if(session?.user) {
    router.push('/dashboard')
  } else {
    router.push('/sign-in')
  }

  return (
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <Skeleton className="w-full h-[20px] rounded-full" />
        <Skeleton className="w-full h-[10px] rounded-full my-2" />
        <Skeleton className="w-full h-[40px] rounded-full my-2" />
        <Skeleton className="w-full h-[15px] rounded-full my-2" />
        <Skeleton className="w-full h-[5px] rounded-full my-2" />
        <Skeleton className="w-full h-[40px] rounded-full my-2" />
        <Skeleton className="w-full h-[4px] rounded-full my-2" />
        <Skeleton className="w-full h-[15px] rounded-full my-2" />
        <Skeleton className="w-full h-[5px] rounded-full my-2" />
        <Skeleton className="w-full h-[60px] rounded-full my-2" />
        <Skeleton className="w-full h-[10px] rounded-full my-2" />
        <Skeleton className="w-full h-[15px] rounded-full my-2" />
        <Skeleton className="w-full h-[5px] rounded-full my-2" />
      </div>
  );
}
