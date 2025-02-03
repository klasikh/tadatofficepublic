"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import config from '@/config'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"


export function NavUser({
  user,
}: {
  user: {
    first_name: string
    email: string
    picture: string
  }
}) {

    const router = useRouter()
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user?.picture} alt={user?.first_name} />
                            <AvatarFallback className="rounded-lg">{user?.first_name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user?.first_name}</span>
                            <span className="truncate text-xs">{user?.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user?.picture} alt={user?.first_name} />
                            <AvatarFallback className="rounded-lg">{user?.first_name.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user?.first_name}</span>
                            <span className="truncate text-xs">{user?.email}</span>
                            </div>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Sparkles />
                            Upgrade to Pro
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <BadgeCheck />
                            Profil
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                            <CreditCard />
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell />
                            Notifications
                        </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                        { config?.authNextAuth?.enabled &&
                                (
                                    <button 
                                        className="flex items-center gap-3.5 text-red text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                        onClick={() => {signOut({ redirect: true }), router.push("/");}}
                                    >
                                        <LogOut />
                                        Se déconnecter
                                    </button>
                                )
                            }
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
