"use client"

import * as React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerTerminalIcon, RoboticIcon, BookOpen02Icon, Settings05Icon, CropIcon, PieChartIcon, MapsIcon, UnfoldMoreIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar, Legend, ScatterChart, Scatter, ZAxis, ComposedChart } from "recharts"

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
  { name: "Complete", value: 78, fill: "var(--chart-1)" },
  { name: "In Progress", value: 52, fill: "var(--chart-2)" },
  { name: "Pending", value: 34, fill: "var(--chart-3)" },
]

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]

const tooltipStyle = {
  backgroundColor: 'oklch(0.216 0.006 56.043)',
  border: '1px solid oklch(0.3 0.01 56)',
  borderRadius: '0.5rem',
  color: 'oklch(0.985 0.001 106.423)'
}

function SidebarIconContent() {
  const { state, setOpen } = useSidebar()
  const [activeItem, setActiveItem] = React.useState<string | null>(null)
  const itemRefs = React.useRef<Record<string, HTMLLIElement | null>>({})

  const handleIconClick = (title: string) => {
    if (state === "collapsed") {
      setOpen(true)
      setActiveItem(title)
    }
  }

  React.useEffect(() => {
    if (state === "expanded" && activeItem && itemRefs.current[activeItem]) {
      itemRefs.current[activeItem]?.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveItem(null)
    }
  }, [state, activeItem])

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: (
          <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />
        ),
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: (
          <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />
        ),
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: (
          <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />
        ),
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: (
          <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
        ),
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: (
          <HugeiconsIcon icon={CropIcon} strokeWidth={2} />
        ),
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: (
          <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />
        ),
      },
      {
        name: "Travel",
        url: "#",
        icon: (
          <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />
        ),
      },
    ],
  }

  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  >
                    <Button size="icon-sm" asChild className="size-8">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                        >
                          <rect width="256" height="256" fill="none"></rect>
                          <line
                            x1="208"
                            y1="128"
                            x2="128"
                            y2="208"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                          ></line>
                          <line
                            x1="192"
                            y1="40"
                            x2="40"
                            y2="192"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                          ></line>
                        </svg>
                      </span>
                    </Button>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {activeTeam.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeTeam.plan}
                      </span>
                    </div>
                    <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Teams</DropdownMenuLabel>
                    {data.teams.map((team) => (
                      <DropdownMenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                      >
                        {team.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive || activeItem === item.title}
                  className="group/collapsible"
                >
                  <SidebarMenuItem ref={(el) => { itemRefs.current[item.title] = el }}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      onClick={() => handleIconClick(item.title)}
                    >
                      <CollapsibleTrigger>
                        {item.icon}
                        <span>{item.title}</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="ml-auto transition-transform duration-100 group-data-open/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      {item.name}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
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
                        src={data.user.avatar || "/placeholder.svg"}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
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
                              src={data.user.avatar || "/placeholder.svg"}
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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 overflow-auto">
          <ResizablePanelGroup direction="vertical" className="min-h-[200vh]">
            {/* Row 1: Area Chart + Line Chart */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Area Chart</CardTitle>
                      <CardDescription className="text-stone-400">Revenue with gradient fill</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 56)" />
                          <XAxis dataKey="month" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.3 0.01 56 / 30%)' }} />
                          <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Line Chart</CardTitle>
                      <CardDescription className="text-stone-400">Multi-series comparison</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 56)" />
                          <XAxis dataKey="month" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'oklch(0.5 0.01 56)' }} />
                          <Line type="monotone" dataKey="users" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                          <Line type="monotone" dataKey="sessions" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: 'var(--chart-2)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Row 2: Bar Chart (Vertical) + Bar Chart (Horizontal) */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Bar Chart</CardTitle>
                      <CardDescription className="text-stone-400">Grouped vertical bars</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 56)" />
                          <XAxis dataKey="month" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.3 0.01 56 / 30%)' }} />
                          <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="users" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="sessions" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Horizontal Bar Chart</CardTitle>
                      <CardDescription className="text-stone-400">Traffic by device type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 56)" horizontal={false} />
                          <XAxis type="number" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} width={60} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.3 0.01 56 / 30%)' }} />
                          <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Row 3: Pie Chart + Radar Chart */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Pie Chart</CardTitle>
                      <CardDescription className="text-stone-400">Traffic source distribution</CardDescription>
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
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={{ stroke: 'oklch(0.6 0.01 56)' }}
                          >
                            {pieData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Radar Chart</CardTitle>
                      <CardDescription className="text-stone-400">Performance comparison</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="oklch(0.3 0.01 56)" />
                          <PolarAngleAxis dataKey="subject" stroke="oklch(0.6 0.01 56)" fontSize={11} />
                          <PolarRadiusAxis stroke="oklch(0.4 0.01 56)" fontSize={10} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Radar name="Product A" dataKey="A" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                          <Radar name="Product B" dataKey="B" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Row 4: Radial Bar + Scatter + Composed */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={33} minSize={20}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Radial Bar Chart</CardTitle>
                      <CardDescription className="text-stone-400">Task completion status</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                          <RadialBar background={{ fill: 'oklch(0.25 0.01 56)' }} dataKey="value" cornerRadius={4} />
                          <Legend iconSize={10} layout="vertical" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', color: 'oklch(0.6 0.01 56)' }} />
                          <Tooltip contentStyle={tooltipStyle} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={33} minSize={20}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Scatter Chart</CardTitle>
                      <CardDescription className="text-stone-400">Data point distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 56)" />
                          <XAxis type="number" dataKey="x" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis type="number" dataKey="y" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <ZAxis type="number" dataKey="z" range={[60, 400]} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: 'oklch(0.5 0.01 56)' }} />
                          <Scatter data={scatterData} fill="var(--chart-1)" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={34} minSize={20}>
                  <Card className="h-full border-stone-800 bg-stone-900/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium text-stone-100">Composed Chart</CardTitle>
                      <CardDescription className="text-stone-400">Mixed chart types</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 56)" />
                          <XAxis dataKey="month" stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="oklch(0.6 0.01 56)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.3 0.01 56 / 30%)' }} />
                          <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="users" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: 'var(--chart-2)', r: 4 }} />
                          <Area type="monotone" dataKey="sessions" fill="var(--chart-3)" stroke="var(--chart-3)" fillOpacity={0.2} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </>
  )
}

export function SidebarIconExample() {
  return (
    <SidebarProvider>
      <SidebarIconContent />
    </SidebarProvider>
  )
}
