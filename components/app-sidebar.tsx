"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Search01Icon,
  Notification03Icon,
  Settings05Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import {
  Activity,
  LayoutDashboard,
  Dices,
  ChartNetwork,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ─── Rail Button Component ─────────────────────────────────────
function RailButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  href,
  showTooltip = true,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  showTooltip?: boolean;
}) {
  const buttonClasses = cn(
    "flex items-center justify-center size-9 rounded-md transition-colors",
    "text-muted-foreground hover:text-foreground hover:bg-accent",
    isActive && "text-foreground bg-accent"
  );

  const content = href ? (
    <Link href={href} className={buttonClasses} aria-label={label}>
      <Icon className="size-[18px]" />
    </Link>
  ) : (
    <button onClick={onClick} className={buttonClasses} aria-label={label}>
      <Icon className="size-[18px]" />
    </button>
  );

  if (!showTooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Sidebar Panel Component ───────────────────────────────────
function SidebarPanel({
  open,
  activeSection,
  navData,
  pathname,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  activeSection: string | null;
  navData: typeof defaultNavData;
  pathname: string;
  onLogout: () => void;
}) {
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({
    Platform: true,
  });

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  React.useEffect(() => {
    if (activeSection) {
      const navItem = navData.navMain.find(
        (item) => item.title.toLowerCase() === activeSection
      );
      if (navItem) {
        setExpandedItems((prev) => ({ ...prev, [navItem.title]: true }));
      }
    }
  }, [activeSection, navData.navMain]);

  return (
    <div
      className={cn(
        "h-full border-r border-border bg-sidebar",
        "flex flex-col shrink-0 overflow-hidden",
        "transition-[width,opacity] duration-200 ease-out",
        open ? "w-64 opacity-100" : "w-0 opacity-0 border-r-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col h-full min-w-[16rem]">
        {/* Panel Header */}
        <div className="flex items-center h-12 px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Activity className="size-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Notable Dough
            </span>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {navData.navMain.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleItem(group.title)}
                className={cn(
                  "flex items-center w-full gap-2 px-3 py-1.5 text-xs",
                  "text-muted-foreground/70 uppercase tracking-wider font-medium",
                  "transition-colors hover:text-foreground"
                )}
              >
                <span className="flex-1 text-left">{group.title}</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className={cn(
                    "size-3.5 transition-transform duration-150",
                    expandedItems[group.title] && "rotate-90"
                  )}
                />
              </button>
              {expandedItems[group.title] && (
                <div className="ml-2 border-l border-border">
                  {group.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2 px-4 py-1.5 text-sm",
                        "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                        item.isActive(pathname) && "text-foreground bg-accent font-medium"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Panel Footer - User */}
        <div className="border-t border-border p-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent transition-colors">
                <Avatar className="size-7">
                  <AvatarImage
                    src=""
                    alt={navData.user.name}
                  />
                  <AvatarFallback className="text-xs">CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {navData.user.name}
                  </p>
                  <p className="text-xs text-green-500 font-mono truncate">
                    ${navData.user.balance?.toLocaleString()}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <Item size="xs">
                    <ItemMedia>
                      <Avatar className="size-7">
                        <AvatarImage
                          src={navData.user.avatar}
                          alt={navData.user.name}
                        />
                        <AvatarFallback className="text-xs">CN</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{navData.user.name}</ItemTitle>
                      <ItemDescription>{navData.user.email}</ItemDescription>
                    </ItemContent>
                  </Item>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem><Link href="/profile">Account</Link></DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// ─── Default Navigation Data ───────────────────────────────────
const defaultNavData = {
  user: {
    name: "Trader 0x",
    email: "0x@polymarket.whales",
    avatar: "/avatar.png",
    balance: "500",
  },
  topIcons: [
    { label: "Home", icon: Home01Icon, section: "home", href: "/" },
    { label: "Search", icon: Search01Icon, section: "search" },
  ],
  navMain: [
    {
      title: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          isActive: (pathname: string) => pathname === "/",
        },
        {
          title: "Markets",
          url: "/markets",
          icon: Dices,
          isActive: (pathname: string) => pathname.startsWith("/markets"),
        },
        {
          title: "LeaderBoard",
          url: "/leaderboard",
          icon: ChartNetwork,
          isActive: (pathname: string) => pathname.startsWith("/leaderboard"),
        },
      ],
    },
  ],
  bottomIcons: [
    { label: "Notifications", icon: Notification03Icon, section: "notifications" },
    { label: "Settings", icon: Settings05Icon, section: "settings" },
  ],
};

// ─── Main AppSidebar Component ─────────────────────────────────
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const authLogout = useAuthStore((s) => s.logout);
  const authUser = useAuthStore((s) => s.user);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const navData = {
    ...defaultNavData,
    user: {
      ...defaultNavData.user,
      name: authUser?.name ?? defaultNavData.user.name,
      email: authUser?.email ?? defaultNavData.user.email,
      avatar: authUser?.avatar ?? defaultNavData.user.avatar,
    },
  };

  const handleLogout = async () => {
    await authLogout();
    router.replace("/login");
  };

  const keepOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    if (dropdownOpen) return;
    closeTimeoutRef.current = setTimeout(() => {
      setPanelOpen(false);
      setActiveSection(null);
    }, 150);
  };

  const handleIconClick = (section: string) => {
    setActiveSection(section);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setActiveSection(null);
  };

  // Check which nav item is active for the rail icons
  const getActiveNavItem = () => {
    for (const group of navData.navMain) {
      for (const item of group.items) {
        if (item.isActive(pathname)) {
          return item.title.toLowerCase();
        }
      }
    }
    return null;
  };

  const activeNavItem = getActiveNavItem();

  return (
    <TooltipProvider>
      {/* Combined hover zone: rail + panel */}
      <div
        className="fixed top-0 left-0 z-50 flex h-full"
        onMouseEnter={() => {
          keepOpen();
          setPanelOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        {/* Icon Rail */}
        <div className="flex h-full w-12 flex-col items-center border-r border-border bg-sidebar shrink-0">
          {/* Logo */}
          <div className="flex items-center justify-center h-12 w-full">
            <Link href="/" className="flex items-center justify-center size-9 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors">
              <Activity className="size-5 text-primary" />
            </Link>
          </div>

          {/* Separator */}
          <div className="mx-auto my-2 h-px w-6 bg-border" />

          {/* Nav icons */}
          <div className="flex flex-col items-center gap-1">
            {navData.navMain.flatMap((group) =>
              group.items.map((item) => (
                <RailButton
                  key={item.title}
                  icon={item.icon}
                  label={item.title}
                  isActive={item.isActive(pathname)}
                  href={item.url}
                  showTooltip={!panelOpen}
                />
              ))
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom icons */}
          <div className="flex flex-col items-center gap-1 pb-2">
            {navData.bottomIcons.map((item) => (
              <RailButton
                key={item.label}
                icon={(props) => (
                  <HugeiconsIcon icon={item.icon} strokeWidth={1.8} {...props} />
                )}
                label={item.label}
                isActive={panelOpen && activeSection === item.section}
                onClick={() => handleIconClick(item.section)}
                showTooltip={!panelOpen}
              />
            ))}
          </div>

          {/* User avatar */}
          <div className="pb-3">
            <DropdownMenu onOpenChange={(open) => setDropdownOpen(open)}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center size-9 rounded-md transition-colors hover:bg-accent"
                  aria-label="User menu"
                >
                  <Avatar className="size-7">
                    <AvatarImage
                      src={navData.user.avatar}
                      alt={navData.user.name}
                    />
                    <AvatarFallback className="text-[10px]">CN</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <Item size="xs">
                      <ItemMedia>
                        <Avatar className="size-7">
                          <AvatarImage
                            src={navData.user.avatar}
                            alt={navData.user.name}
                          />
                          <AvatarFallback className="text-xs">CN</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{navData.user.name}</ItemTitle>
                        <ItemDescription>
                          <span className="text-green-500 font-mono">
                            ${navData.user.balance?.toLocaleString()}
                          </span>
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem><Link href="/profile">Account</Link></DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Expandable Sidebar Panel */}
        <SidebarPanel
          open={panelOpen}
          onClose={closePanel}
          activeSection={activeSection}
          navData={navData}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </div>
    </TooltipProvider>
  );
}

// Export a wrapper that provides main content offset
export function AppSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="ml-12 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
