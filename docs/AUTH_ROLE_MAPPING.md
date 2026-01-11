# Sistem Autentikasi & Role - ZooKeeper Core

**Focus:** Authentication Architecture, API Flow, and Protection Layers

---

## 📊 Ringkasan Mapping Lengkap

### 1. API Endpoints untuk Autentikasi & Role

| Endpoint | Method | Purpose | Response Structure | Auth Required |
|----------|--------|---------|-------------------|---------------|
| `/login` | POST | Login user & dapat token | `{ data: { token: string } }` | ❌ |
| `/user/profile` | GET | Get user profile + roles | `{ data: { status, message, data: User } }` (Nested!) | ✅ |
| `/logout` | POST | Logout user (optional) | `{ message: "success" }` | ✅ |

**⚠️ Important**: 
- `/login` hanya return **TOKEN**
- `/user/profile` return **USER DATA + ROLES** (nested: `response.data.data`)

### 2. Data Structure Role

```typescript
interface Role {
  id: number;
  role_code: string;        // "super-admin", "keeper", "store-master", etc
  role_name: string;        // "Super Admin", "Keeper", "Store Master", etc
  description: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface User {
  id?: string;
  name: string;
  email: string;
  no_identity?: string;
  links?: string[];
  bio?: string;
  photo_profile?: string | null;
  role_user: Role[];           // Main roles
  sub_role_user?: Role[];      // Secondary roles
  unit_ids?: number[];
}
```

---

## 🎭 Available Roles (11 Total)

Sistem menggunakan **11 roles** dengan hierarki dari Executive hingga Specialist level.

| Level | Roles | Total Pages | Notes |
|-------|-------|-------------|-------|
| **Executive** | super-admin, director-utama, director-ops, manager | 19 | Full access |
| **Management** | kurator, head-keeper | 17 | No stock |
| **Operational** | kesehatan, animal-register | 14-16 | Limited operational |
| **Specialist** | keeper, store-master | 1-2 | Very limited ⚡ |
| **View Only** | view | 19 | Read-only 👁️ |

📖 **For detailed role specifications and access matrix, see:** [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md)

---

## 🗺️ Page Structure Overview

Sistem terdiri dari **19 pages** yang dikelompokkan dalam 6 modul:

| Module | Pages | Description |
|--------|-------|-------------|
| **Dashboard** | 1 page | Welcome page (accessible by all) |
| **Modul Satwa** | 4 pages | Animal management (9 roles) |
| **Modul Kandang** | 1 page | Cage management (8 roles) |
| **Modul Pakan** | 1 page | Feed management (9 roles) ⚡ Keeper landing |
| **Modul Tugas** | 1 page | Task management (8 roles) |
| **Modul Inventaris** | 1 page | Stock management (6 roles) ⚡ Store-master landing |
| **Master Data** | 10 pages | Configuration data (9 roles) |

**Implementation Status:**
- ✅ **Created**: 2 pages (`/dashboard`, `/animal`)
- ⏳ **Pending**: 17 pages

📖 **For complete page-by-page access mapping, see:** [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md)
└── app/(dashboard)/
    ├── animal/page.tsx             # Example with conditional rendering
    └── [other pages]               # Apply protection as needed
```

---

## 🔄 Authentication Flow

```
1. User Login (POST /login)
   ↓
2. Backend validates & returns TOKEN ONLY
   Response: { data: { token: "..." } }
   ↓
3. Frontend saves token to Cookie
   Cookies.set("accessToken", token)
   ↓
4. Call GET /user/profile (with Bearer token)
   ↓
5. Backend returns USER DATA + ROLES (NESTED!)
   Response: { 
     data: { 
       status: 200, 
       message: "...", 
       data: { name, email, role_user, sub_role_user, ... } 
     } 
   }
   ↓
6. Extract user data: response.data.data
   ↓
7. Combine main + sub roles
   getUserRoles() → ["super-admin", "admin-cms"]
   ↓
8. Save to Zustand store + localStorage
   ↓
9. Redirect to default landing page
   - keeper → /feed
   - store-master → /stock
   - others → /animal
   ↓
10. Sidebar auto-filters based on roles
   ↓
11. Each page/component checks permissions
```

---

## 🛡️ Protection Layers

### Layer 1: Middleware (Route Level)
- Check if token exists in Cookie
- Redirect to /login if no token
- Redirect to landing page if already logged in
- File: `src/middleware.ts`

### Layer 2: Sidebar (UI Level)
- Auto-filter menu items based on role
- Only show accessible menus
- Support for 11 different roles
- Special landing for keeper & store-master
- File: `src/components/layout/sidebar-ui/app-sidebar.tsx`

### Layer 3: Page Protection (Component Level)
- Use `<ProtectedRoute>` wrapper
- Redirect if role not allowed
- Example: Admin-only pages
- File: Each page component

### Layer 4: Conditional Rendering (Element Level)
- Use `<Can>` or `<RoleGuard>`
- Hide/show specific UI elements (buttons, forms, etc)
- Example: Edit/Delete buttons for management only
- File: Within components

### Layer 5: Backend Validation (API Level)
- **MOST IMPORTANT** ⚠️
- Backend MUST validate token + role
- Never trust frontend only
- Return 401/403 for unauthorized

---

## 🚀 Quick Implementation Checklist

### For New Protected Page

- [ ] Define allowed roles in `menu-permissions.ts`
- [ ] Add menu item with `allowedRoles` in `app-sidebar.tsx`
- [ ] Create page in `app/(dashboard)/[page-name]`
- [ ] Wrap page with `<ProtectedRoute>` if needed
- [ ] Use `<Can>` for conditional buttons/actions
- [ ] Test with different user roles (11 roles)
- [ ] Ensure backend validates permissions

### Example Implementation

```tsx
// 1. Config (menu-permissions.ts)
export const MENU_PERMISSIONS = {
  "/new-page": [
    ROLE_CODES.SUPER_ADMIN, 
    ROLE_CODES.MANAGER,
    ROLE_CODES.DIRECTOR_OPS
  ],
};

// 2. Sidebar (app-sidebar.tsx)
{
  title: "New Feature",
  url: "/new-page",
  icon: IconStar,
  allowedRoles: [
    ROLE_CODES.SUPER_ADMIN, 
    ROLE_CODES.MANAGER,
    ROLE_CODES.DIRECTOR_OPS
  ],
}

// 3. Page Component
export default function NewPage() {
  return (
    <ProtectedRoute 
      allowedRoles={[
        ROLE_CODES.SUPER_ADMIN, 
        ROLE_CODES.MANAGER
      ]}
    >
      <div>
        <h1>New Feature</h1>
        
        {/* Admin only action */}
      11 role codes defined
- [x] Permission utility functions for all roles
- [x] Menu permissions configuration (18 pages)
- [x] `usePermissions` hook
- [x] `<Can>` component
- [x] `<RoleGuard>` component
- [x] `<ProtectedRoute>` component
- [x] Sidebar auto-filtering for 11 roles
- [x] Default landing page logic (keeper→/feed, store-master→/stock)
- [x] Example implementation in animal page
- [x] Nested API response handling (response.data.data)
- [x] Main + sub roles support
- [x] Debug component for development
- [x] Complete documentation

### ⏳ Pending (Pages to Create - 17 pages)
- [ ] `/mutation` - Mutasi Satwa
- [ ] `/sick` - Satwa Sakit
- [ ] `/dead` - Satwa Mati
- [ ] `/cage` - Kandang
- [ ] `/feed` - Pakan (keeper landing page)
- [ ] `/task` - Tugas Keeper
- [ ] `/stock` - Stok Barang (store-master landing page)
- [ ] `/unit-area` - Area Unit
- [ ] `/zone-area` - Area Zona
- [ ] `/family` - Family
- [ ] `/feed-category` - Kategori Pakan
- [ ] `/cage-model` - Jenis Kandang
- [ ] `/cage-type` - Tipe Kandang
- [ ] `/feed-type` - Jenis Pakan
- [ ] `/mix-feed` - Mix Pakan
- [ ] `/species` - Spesies
---

## 🚀 Implementation Guide

For adding new protected pages and implementing RBAC features, see:
- **Step-by-step guide:** [RBAC_GUIDE.md](./RBAC_GUIDE.md)
- **Quick API reference:** [PERMISSION_API.md](./PERMISSION_API.md)

---

## 📝 System Status

### ✅ Infrastructure (Complete)
- [x] 11 role system with hierarchy
- [x] Authentication flow (login → profile → roles)
- [x] 5-layer protection system
- [x] Permission utilities & hooks
- [x] RBAC components (Can, ProtectedRoute, RoleGuard)
- [x] Sidebar auto-filtering
- [x] Nested API response handling
- [x] Main + sub roles support

### 📄 Pages Status
- ✅ **Created**: 2/19 pages (`/dashboard`, `/animal`)
- ⏳ **Pending**: 17/19 pages

📖 **For complete page list, see:** [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md#-implementation-status)

---

## 🧪 Testing

For comprehensive testing scenarios and debugging tools:
- **Testing guide:** [RBAC_GUIDE.md](./RBAC_GUIDE.md#-testing-different-roles)
- **Role test cases:** [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md#-testing-scenarios)

**Quick Test:**
```typescript
// Verify login console output
✅ User Profile Retrieved from /user/profile
📧 Email: user@example.com
🎭 Roles: ["super-admin"]
🚀 Redirecting to: /animal (or /feed for keeper, /stock for store-master)
```
---

## 🔗 Related Files

| Purpose | File Path |
|---------|-----------|
| Permission Functions | `src/lib/permissions.ts` |
| Menu Configuration | `src/config/menu-permissions.ts` |
| Permission Hook | `src/hooks/use-permissions.ts` |
| Can Component | `src/components/shared/can.tsx` |
| RoleGuard Component | `src/components/shared/role-guard.tsx` |
| ProtectedRoute Component | `src/components/shared/protected-route.tsx` |
| Debug Component | `src/components/shared/user-debug-info.tsx` |
| Sidebar | `src/components/layout/sidebar-ui/app-sidebar.tsx` |
| Auth Store | `src/store/use-auth-store.ts` |
| Auth Types | `src/types/auth.ts` |
| Auth Services | `src/services/auth.services.ts` |
| Middleware | `src/middleware.ts` |
| Login Hook | `src/hooks/auth/use-login.ts` |

---

## 📞 Next Steps

1. **Test Current Implementation**
   - Login dengan berbagai role (11 roles)
   - Verify authentication flow
   - Check console logs for nested response
   - Verify landing pages (keeper→/feed, store-master→/stock)

2. **Create Missing Pages** (17 pages)
   - Prioritas: `/feed` (keeper landing)
   - Prioritas: `/stock` (store-master landing)
   - Apply protection to each page

3. **Backend Integration**
   - Ensure backend validates roles
   - Implement permission middleware di API
   - Handle nested response structure
   - Support main + sub roles

---

## 📚 Related Documentation

- **[COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md)** - Who can access what (specification)
- **[RBAC_GUIDE.md](./RBAC_GUIDE.md)** - How to implement RBAC (developer guide)
- **[PERMISSION_API.md](./PERMISSION_API.md)** - Quick API reference
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual flow diagrams
- **[API_COMPATIBILITY.md](./API_COMPATIBILITY.md)** - API response analysis

---

## 📝 Notes

- Frontend permission adalah untuk UX, **ALWAYS validate di backend**
- Token disimpan di Cookie (`accessToken`)
- User data di localStorage via Zustand persist
- Axios auto-inject token di setiap request
- 401 response auto-redirect ke login
- Response `/user/profile` adalah NESTED (`response.data.data`)
- Support main roles (`role_user`) + sub roles (`sub_role_user`)
- Keeper dan Store Master punya landing page khusus
- Total: 11 roles, 19 pages

---

**Last Updated**: January 11, 2026  
**Version**: 2.1 (Authentication Architecture Focus)
- [API_COMPATIBILITY.md](./API_COMPATIBILITY.md) - API response analysis

---

## 📝 Notes

- Frontend permission adalah untuk UX, **ALWAYS validate di backend**
- Token disimpan di Cookie (`accessToken`)
- User data di localStorage via Zustand persist
- Axios auto-inject token di setiap request
- 401 response auto-redirect ke login
- Response `/user/profile` adalah NESTED (`response.data.data`)
- Support main roles (`role_user`) + sub roles (`sub_role_user`)
- Keeper dan Store Master punya landing page khusus
- Total: 11 roles, 18 pages

---

**Last Updated**: January 11, 2026  
**Version**: 2.0 (Updated with 11 roles system)
