"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
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
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerTerminalIcon,
  RoboticIcon,
  BookOpen02Icon,
  Settings05Icon,
  CropIcon,
  PieChartIcon,
  MapsIcon,
  ArrowRight01Icon,
  Home01Icon,
  Search01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
} from "recharts"

// ─── Chart Data ───────────────────────────────────────────────
const chartData = [
  { month: "Jan", revenue: 4500, users: 2400, sessions: 1800 },
  { month: "Feb", revenue: 5200, users: 2800, sessions: 2100 },
  { month: "Mar", revenue: 4800, users: 3200, sessions: 2400 },
  { month: "Apr", revenue: 6100, users: 3800, sessions: 2800 },
  { month: "May", revenue: 5900, users: 4200, sessions: 3200 },
  { month: "Jun", revenue: 7200, users: 4800, sessions: 3600 },
]

const barData = [
  { name: "Desktop", value: 4500 },
  { name: "Mobile", value: 3200 },
  { name: "Tablet", value: 1800 },
  { name: "Other", value: 900 },
]

const pieData = [
  { name: "Direct", value: 400 },
  { name: "Social", value: 300 },
  { name: "Organic", value: 200 },
  { name: "Referral", value: 100 },
]

const radarData = [
  { subject: "Speed", A: 120, B: 110, fullMark: 150 },
  { subject: "Reliability", A: 98, B: 130, fullMark: 150 },
  { subject: "Security", A: 86, B: 130, fullMark: 150 },
  { subject: "Scalability", A: 99, B: 100, fullMark: 150 },
  { subject: "Support", A: 85, B: 90, fullMark: 150 },
  { subject: "Features", A: 65, B: 85, fullMark: 150 },
]

const radialData = [
  { name: "Complete", value: 78, fill: "#DCF763" },
  { name: "In Progress", value: 52, fill: "#70D6FF" },
  { name: "Pending", value: 34, fill: "#ED254E" },
]

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const COLORS = [
  "#DCF763",
  "#70D6FF",
  "#ED254E",
  "#A0ACAD",
]

const tooltipStyle = {
  backgroundColor: "#132925",
  border: "1px solid #243F39",
  borderRadius: "0.5rem",
  color: "#E8EDEB",
}

// ─── Nav Data ─────────────────────────────────────────────────
const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatar.png",
  },
  topIcons: [
    {
      label: "Home",
      icon: Home01Icon,
      section: "home",
    },
    {
      label: "Search",
      icon: Search01Icon,
      section: "search",
    },
  ],
  navMain: [
    {
      title: "Playground",
      icon: ComputerTerminalIcon,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      icon: RoboticIcon,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      icon: BookOpen02Icon,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      icon: Settings05Icon,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: CropIcon },
    { name: "Sales & Marketing", url: "#", icon: PieChartIcon },
    { name: "Travel", url: "#", icon: MapsIcon },
  ],
  bottomIcons: [
    {
      label: "Notifications",
      icon: Notification03Icon,
      section: "notifications",
    },
    {
      label: "Settings",
      icon: Settings05Icon,
      section: "settings",
    },
  ],
}

// ─── Icon Rail Button ─────────────────────────────────────────
function RailButton({
  icon,
  label,
  isActive,
  onClick,
  showTooltip = true,
}: {
  icon: typeof Home01Icon
  label: string
  isActive?: boolean
  onClick?: () => void
  showTooltip?: boolean
}) {
  const btn = (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center size-9 rounded-md transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        isActive && "text-foreground bg-accent"
      )}
      aria-label={label}
    >
      <HugeiconsIcon icon={icon} strokeWidth={1.8} className="size-[18px]" />
    </button>
  )

  if (!showTooltip) return btn

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {btn}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Sidebar Panel ────────────────────────────────────────────
function SidebarPanel({
  open,
  onClose,
  activeSection,
}: {
  open: boolean
  onClose: () => void
  activeSection: string | null
}) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({
    Playground: true,
  })

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  // When a nav item is opened via icon click, expand it
  React.useEffect(() => {
    if (activeSection) {
      const navItem = navData.navMain.find(
        (item) => item.title.toLowerCase() === activeSection
      )
      if (navItem) {
        setExpandedItems((prev) => ({ ...prev, [navItem.title]: true }))
      }
    }
  }, [activeSection])

  return (
    <div
      ref={panelRef}
      className={cn(
        "h-full border-r border-border bg-background",
        "flex flex-col shrink-0 overflow-hidden",
        "transition-[width,opacity] duration-200 ease-out",
        open ? "w-64 opacity-100" : "w-0 opacity-0 border-r-0 pointer-events-none"
      )}
    >
      {/* Inner wrapper to prevent content from shrinking */}
      <div className="flex flex-col h-full min-w-[16rem]">
        {/* Panel Header */}
        <div className="flex items-center h-12 px-4 border-b border-border shrink-0">
          <span className="text-sm font-medium text-foreground">
            {activeSection
              ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
              : "Navigation"}
          </span>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Platform section */}
          <div className="px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Platform
            </span>
          </div>
          {navData.navMain.map((item) => (
            <div key={item.title}>
              <button
                onClick={() => toggleItem(item.title)}
                className={cn(
                  "flex items-center w-full gap-2 px-3 py-1.5 text-sm",
                  "text-foreground/80 hover:text-foreground hover:bg-accent",
                  "transition-colors"
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={1.8}
                  className="size-4 shrink-0"
                />
                <span className="flex-1 text-left truncate">{item.title}</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className={cn(
                    "size-3.5 transition-transform duration-150",
                    expandedItems[item.title] && "rotate-90"
                  )}
                />
              </button>
              {expandedItems[item.title] && (
                <div className="ml-5 border-l border-border">
                  {item.items?.map((subItem) => (
                    <a
                      key={subItem.title}
                      href={subItem.url}
                      className="flex items-center px-4 py-1 text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Projects section */}
          <div className="mt-4 px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Projects
            </span>
          </div>
          {navData.projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
            >
              <HugeiconsIcon
                icon={project.icon}
                strokeWidth={1.8}
                className="size-4 shrink-0"
              />
              <span className="truncate">{project.name}</span>
            </a>
          ))}
        </div>

        {/* Panel Footer */}
        <div className="border-t border-border p-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent transition-colors">
                <Avatar className="size-7">
                  <AvatarImage
                    src={navData.user.avatar || "/placeholder.svg"}
                    alt={navData.user.name}
                  />
                  <AvatarFallback className="text-xs">CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {navData.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {navData.user.email}
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
                          src={navData.user.avatar || "/placeholder.svg"}
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
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export function SidebarIconExample() {
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const keepOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const scheduleClose = () => {
    if (dropdownOpen) return
    closeTimeoutRef.current = setTimeout(() => {
      setPanelOpen(false)
      setActiveSection(null)
    }, 150)
  }

  const handleIconClick = (section: string) => {
    setActiveSection(section)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setActiveSection(null)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-background">
        {/* Combined hover zone: rail + panel */}
        <div
          className="fixed top-0 left-0 z-50 flex h-full"
          onMouseEnter={() => { keepOpen(); setPanelOpen(true); }}
          onMouseLeave={scheduleClose}
        >
          {/* Icon Rail */}
          <div
            className="flex h-full w-12 flex-col items-center border-r border-border bg-background shrink-0"
          >
            {/* Top icons */}
            <div className="flex flex-col items-center gap-1 pt-3">
              {navData.topIcons.map((item) => (
                <RailButton
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  isActive={panelOpen && activeSection === item.section}
                  onClick={() => handleIconClick(item.section)}
                  showTooltip={!panelOpen}
                />
              ))}
            </div>

            {/* Separator */}
            <div className="mx-auto my-2 h-px w-6 bg-border" />

            {/* Nav icons */}
            <div className="flex flex-col items-center gap-1">
              {navData.navMain.map((item) => (
                <RailButton
                  key={item.title}
                  icon={item.icon}
                  label={item.title}
                  isActive={panelOpen && activeSection === item.title.toLowerCase()}
                  onClick={() => handleIconClick(item.title.toLowerCase())}
                  showTooltip={!panelOpen}
                />
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom icons */}
            <div className="flex flex-col items-center gap-1 pb-2">
              {navData.bottomIcons.map((item) => (
                <RailButton
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  isActive={panelOpen && activeSection === item.section}
                  onClick={() => handleIconClick(item.section)}
                  showTooltip={!panelOpen}
                />
              ))}
            </div>

            {/* User avatar */}
            <div className="pb-3">
              <DropdownMenu onOpenChange={(open) => { setDropdownOpen(open); }}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center size-9 rounded-md transition-colors hover:bg-accent"
                    aria-label="User menu"
                  >
                    <Avatar className="size-7">
                      <AvatarImage
                        src={navData.user.avatar || "/placeholder.svg"}
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
                              src={navData.user.avatar || "/placeholder.svg"}
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
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Overlay Sidebar Panel - inside the same hover zone */}
          <SidebarPanel
            open={panelOpen}
            onClose={closePanel}
            activeSection={activeSection}
          />
        </div>

        {/* Main Content - offset by icon rail width */}
        <main className="ml-12 flex-1 overflow-auto">
          <div className="flex flex-col p-4">
            <ResizablePanelGroup
              direction="vertical"
              className="min-h-[200vh]"
            >
              {/* Row 1: Area + Line */}
              <ResizablePanel defaultSize={25} minSize={15}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Area Chart
                        </CardTitle>
                        <CardDescription>Revenue with gradient fill</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#DCF763"
                                  stopOpacity={0.4}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#DCF763"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#243F39"
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(v) => `$${v}`}
                            />
                            <RechartsTooltip
                              contentStyle={tooltipStyle}
                              cursor={{ fill: "#1E3B3580" }}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#DCF763"
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Line Chart
                        </CardTitle>
                        <CardDescription>Multi-series comparison</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#243F39"
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip
                              contentStyle={tooltipStyle}
                              cursor={{ stroke: "#3A5C54" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#DCF763"
                              strokeWidth={2}
                              dot={{
                                fill: "#DCF763",
                                strokeWidth: 0,
                                r: 4,
                              }}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="sessions"
                              stroke="#70D6FF"
                              strokeWidth={2}
                              dot={{
                                fill: "#70D6FF",
                                r: 4,
                              }}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* Row 2: Vertical Bar + Horizontal Bar */}
              <ResizablePanel defaultSize={25} minSize={15}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Bar Chart
                        </CardTitle>
                        <CardDescription>Grouped vertical bars</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#243F39"
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip
                              contentStyle={tooltipStyle}
                              cursor={{ fill: "#1E3B3580" }}
                            />
                            <Bar
                              dataKey="revenue"
                              fill="#DCF763"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="users"
                              fill="#70D6FF"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="sessions"
                              fill="#ED254E"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Horizontal Bar Chart
                        </CardTitle>
                        <CardDescription>Traffic by device type</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} layout="vertical">
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#243F39"
                              horizontal={false}
                            />
                            <XAxis
                              type="number"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              dataKey="name"
                              type="category"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              width={60}
                            />
                            <RechartsTooltip contentStyle={tooltipStyle} />
                            <Bar
                              dataKey="value"
                              fill="#DCF763"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* Row 3: Pie + Radar */}
              <ResizablePanel defaultSize={25} minSize={15}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Pie Chart
                        </CardTitle>
                        <CardDescription>
                          Traffic source distribution
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              labelLine={{ stroke: "#7A9A91" }}
                            >
                              {pieData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={tooltipStyle} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Radar Chart
                        </CardTitle>
                        <CardDescription>Performance comparison</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#243F39" />
                            <PolarAngleAxis
                              dataKey="subject"
                              stroke="#7A9A91"
                              fontSize={11}
                            />
                            <PolarRadiusAxis
                              stroke="#2D4F48"
                              fontSize={10}
                            />
                            <RechartsTooltip contentStyle={tooltipStyle} />
                            <Radar
                              name="Product A"
                              dataKey="A"
                              stroke="#DCF763"
                              fill="#DCF763"
                              fillOpacity={0.3}
                            />
                            <Radar
                              name="Product B"
                              dataKey="B"
                              stroke="#70D6FF"
                              fill="#70D6FF"
                              fillOpacity={0.3}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* Row 4: Radial + Scatter + Composed */}
              <ResizablePanel defaultSize={25} minSize={15}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={33} minSize={20}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Radial Bar Chart
                        </CardTitle>
                        <CardDescription>Task completion status</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="30%"
                            outerRadius="90%"
                            data={radialData}
                            startAngle={180}
                            endAngle={0}
                          >
                            <RadialBar
                              background={{ fill: "#1E3B35" }}
                              dataKey="value"
                              cornerRadius={4}
                            />
                            <Legend
                              iconSize={10}
                              layout="vertical"
                              verticalAlign="bottom"
                              wrapperStyle={{
                                fontSize: "12px",
                                color: "#7A9A91",
                              }}
                            />
                            <RechartsTooltip contentStyle={tooltipStyle} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={33} minSize={20}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Scatter Chart
                        </CardTitle>
                        <CardDescription>
                          Data point distribution
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#243F39"
                            />
                            <XAxis
                              type="number"
                              dataKey="x"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              type="number"
                              dataKey="y"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <ZAxis type="number" dataKey="z" range={[60, 400]} />
                            <RechartsTooltip
                              contentStyle={tooltipStyle}
                              cursor={{
                                strokeDasharray: "3 3",
                                stroke: "#3A5C54",
                              }}
                            />
                            <Scatter
                              data={scatterData}
                              fill="#DCF763"
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={34} minSize={20}>
                    <Card className="h-full border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          Composed Chart
                        </CardTitle>
                        <CardDescription>Mixed chart types</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-5rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#243F39"
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#7A9A91"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip
                              contentStyle={tooltipStyle}
                              cursor={{ fill: "#1E3B3580" }}
                            />
                            <Bar
                              dataKey="revenue"
                              fill="#DCF763"
                              radius={[4, 4, 0, 0]}
                            />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#DCF763"
                              strokeWidth={2}
                              dot={{
                                fill: "#DCF763",
                                r: 4,
                              }}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Area
                              type="monotone"
                              dataKey="sessions"
                              fill="#ED254E"
                              stroke="#ED254E"
                              fillOpacity={0.2}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
