"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconCat,
  IconHome,
  IconMeat,
  IconClipboardList,
  IconPackage,
  IconBuilding,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { ROLE_CODES } from "@/lib/permissions";

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
];

// Interface untuk menu item dengan permission
interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: { title: string; url: string; allowedRoles?: string[] }[];
  allowedRoles?: string[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { canAccessMenu } = usePermissions();

  // Definisi Menu Navigasi ZooKeeper dengan Role Permission
  const allNavMainData: MenuItem[] = [
    // ==================== DASHBOARD ====================
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
      allowedRoles: [
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.MANAGER,
        ROLE_CODES.KURATOR,
        ROLE_CODES.HEAD_KEEPER,
        ROLE_CODES.KEEPER,
        ROLE_CODES.KESEHATAN,
        ROLE_CODES.ANIMAL_REGISTER,
        ROLE_CODES.STORE_MASTER,
        ROLE_CODES.VIEW,
      ],
    },

    // ==================== MODUL SATWA ====================
    {
      title: "Manajemen Satwa",
      url: "#",
      icon: IconCat,
      items: [
        {
          title: "Satwa Hidup",
          url: "/animal",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Mutasi Satwa",
          url: "/mutation",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Satwa Sakit",
          url: "/sick",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Satwa Mati",
          url: "/dead",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
      ],
    },

    // ==================== KANDANG ====================
    {
      title: "Kandang",
      url: "/cage",
      icon: IconHome,
      allowedRoles: [
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.HEAD_KEEPER,
        ROLE_CODES.KESEHATAN,
        ROLE_CODES.KURATOR,
        ROLE_CODES.MANAGER,
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.VIEW,
      ],
    },

    // ==================== PAKAN ====================
    {
      title: "Pakan",
      url: "/feed",
      icon: IconMeat,
      allowedRoles: [
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.HEAD_KEEPER,
        ROLE_CODES.KEEPER,
        ROLE_CODES.KESEHATAN,
        ROLE_CODES.KURATOR,
        ROLE_CODES.MANAGER,
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.VIEW,
      ],
    },

    // ==================== TUGAS KEEPER ====================
    {
      title: "Tugas Keeper",
      url: "/task",
      icon: IconClipboardList,
      allowedRoles: [
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.HEAD_KEEPER,
        ROLE_CODES.KEEPER,
        ROLE_CODES.KURATOR,
        ROLE_CODES.MANAGER,
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.VIEW,
      ],
    },

    // ==================== INVENTARIS ====================
    {
      title: "Stok Barang",
      url: "/stock",
      icon: IconPackage,
      allowedRoles: [
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.MANAGER,
        ROLE_CODES.STORE_MASTER,
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.VIEW,
      ],
    },

    // ==================== MASTER DATA ====================
    {
      title: "Master Data",
      url: "#",
      icon: IconLayoutDashboard,
      items: [
        {
          title: "Area Unit",
          url: "/master-data/unit-area",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Area Zona",
          url: "/master-data/zone-area",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Family",
          url: "/master-data/family",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Kategori Pakan",
          url: "/master-data/feed-category",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Jenis Kandang",
          url: "/master-data/cage-model",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Tipe Kandang",
          url: "/master-data/cage-type",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Jenis Pakan",
          url: "/master-data/feed-type",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Mix Pakan",
          url: "/master-data/mix-feed",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Spesies",
          url: "/master-data/species",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
        {
          title: "Satuan",
          url: "/master-data/unit",
          allowedRoles: [
            ROLE_CODES.ANIMAL_REGISTER,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.HEAD_KEEPER,
            ROLE_CODES.KESEHATAN,
            ROLE_CODES.KURATOR,
            ROLE_CODES.MANAGER,
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.VIEW,
          ],
        },
      ],
    },
  ];

  // Filter menu berdasarkan permission user
  const filterMenuByPermission = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems
      .map((menu) => {
        // Jika menu punya children, filter children-nya
        if (menu.items) {
          const filteredChildren = menu.items.filter((child) => {
            // Jika tidak ada allowedRoles, berarti semua bisa akses
            if (!child.allowedRoles || child.allowedRoles.length === 0) {
              return true;
            }
            return canAccessMenu(child.url);
          });

          // Jika setelah filter tidak ada children yang tersisa, hide parent
          if (filteredChildren.length === 0) {
            return null;
          }

          return {
            ...menu,
            items: filteredChildren,
          };
        }

        // Menu tanpa children
        if (!menu.allowedRoles || menu.allowedRoles.length === 0) {
          return menu;
        }

        return canAccessMenu(menu.url) ? menu : null;
      })
      .filter((menu): menu is MenuItem => menu !== null);
  };

  const navMainData = filterMenuByPermission(allNavMainData);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>

      <SidebarContent>
        {/* Menu Utama */}
        <NavMain items={navMainData} />
      </SidebarContent>

      <SidebarFooter>
        {/* Pass data user dari Zustand Store */}
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "guest@zoo.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
