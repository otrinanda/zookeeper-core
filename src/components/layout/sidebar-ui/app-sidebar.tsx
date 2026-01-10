"use client"

import * as React from "react"
import {
  IconLayoutDashboard,
  IconCat,
  IconGridDots,
  IconToolsKitchen2,
  IconBuilding,
  IconSettings,
  IconChartPie,
  IconMap,
  IconUsers
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/use-auth-store"

// Data Mockup untuk Unit (White Label)
const teamsData = [
  {
    name: "Safari Park Solo",
    logo: IconBuilding,
    plan: "Enterprise",
  },
  {
    name: "Mini Zoo Jogja",
    logo: IconBuilding,
    plan: "Basic",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  // Definisi Menu Navigasi ZooKeeper
  const navMainData = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
      isActive: true, // Default open
    },
    {
      title: "Manajemen Hewan",
      url: "#", // Parent tidak punya link langsung jika punya child
      icon: IconCat,
      items: [
        { title: "Daftar Hewan", url: "/animal" },
        { title: "Kategori & Spesies", url: "/animal/species" },
        { title: "Mutasi / Perpindahan", url: "/animal/mutation" },
      ],
    },
    {
      title: "Area & Kandang",
      url: "#",
      icon: IconGridDots,
      items: [
        { title: "Daftar Kandang", url: "/cage" },
        { title: "Peta Area", url: "/area" },
      ],
    },
    {
      title: "Pakan & Logistik",
      url: "#",
      icon: IconToolsKitchen2,
      items: [
        { title: "Stok Pakan", url: "/feed" },
        { title: "Jadwal Pemberian", url: "/feed/schedule" },
      ],
    },
  ]

  // Menu Sekunder (misal untuk Admin)
  const navSecondaryData = [
     {
        title: "Staff & Users",
        url: "/users",
        icon: IconUsers,
     },
     {
        title: "Laporan",
        url: "/reports",
        icon: IconChartPie,
     },
     {
        title: "Pengaturan",
        url: "/settings",
        icon: IconSettings,
     }
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      
      <SidebarContent>
        {/* Menu Utama */}
        <NavMain items={navMainData} />
        
        {/* Menu Sekunder (bisa pakai NavMain juga atau buat NavProjects terpisah) */}
        <NavMain items={navSecondaryData} /> 
      </SidebarContent>

      <SidebarFooter>
        {/* Pass data user dari Zustand Store */}
        <NavUser user={{
            name: user?.name || "Guest",
            email: user?.email || "guest@zoo.com",
            avatar: ""
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}