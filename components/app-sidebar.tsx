"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { HugeiconsIcon } from "@hugeicons/react";
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import {
  BookOpen,
  Bot,
  PieChart,
  SquareTerminal,
  Activity,
  User,
  LayoutDashboard,
  Map,
  Trophy,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useStore } from "@/hooks/use-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useStore();
  const { state, toggleSidebar } = useSidebar();

  const handleContainerClick = (e: React.MouseEvent) => {
    // If clicking an interactive element (link, button, input), do nothing (let it behave normally)
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, [role='button']")) {
      return;
    }

    // Otherwise, toggle the sidebar
    toggleSidebar();
  };

  const data = {
    user: {
      name: "Trader 0x",
      email: "0x@polymarket.whales",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Platform",
        items: [
          {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
            isActive: pathname === "/",
          },
          {
            title: "Markets",
            url: "/markets",
            icon: BookOpen,
            isActive: pathname.startsWith("/markets"),
          },
          {
            title: "Rewards",
            url: "/rewards",
            icon: BookOpen,
            isActive: pathname.startsWith("/rewards"),
          },
          {
            title: "LeaderBoard",
            url: "/leaderboard",
            icon: BookOpen,
            isActive: pathname.startsWith("/leaderboard"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        {...props}
        className="border-r border-sidebar-border bg-sidebar cursor-pointer"
        onClick={handleContainerClick}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
              >
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Activity className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Notable Dough
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {data.navMain.map((group) => (
              <React.Fragment key={group.title}>
                <SidebarMenuItem>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                    {group.title}
                  </div>
                </SidebarMenuItem>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      tooltip={item.title}
                      className="hover:bg-transparent active:bg-transparent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground transition-colors"
                    >
                      <Link
                        href={item.url}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarSeparator className="my-2" />
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* Integrated Chevron Toggle */}
          <div className="flex w-full items-center justify-center py-2">
            {state === "expanded" ? (
              <ChevronsLeft className="size-4 text-muted-foreground" />
            ) : (
              <ChevronsRight className="size-4 text-muted-foreground" />
            )}
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  >
                    <Avatar>
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs text-green-500 font-mono">
                        ${user.balance.toLocaleString()}
                      </span>
                    </div>
                    <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <Item size="xs">
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage
                              src={data.user.avatar}
                              alt={data.user.name}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{data.user.name}</ItemTitle>
                          <ItemDescription> {data.user.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
