# Role-Based Access Control (RBAC) - Developer Guide

**Focus:** Practical implementation guide for developers

---

## 📚 Overview

Sistem RBAC ini memungkinkan kontrol akses berdasarkan role user untuk:
1. **Sidebar Menu** - Show/hide menu items berdasarkan role
2. **Route Protection** - Mencegah akses ke halaman tertentu
3. **Conditional Rendering** - Show/hide UI components berdasarkan role

---

## 🎭 Role System Quick Reference

Sistem menggunakan **11 roles** dengan access level berbeda:

| Level | Role Codes | Access |
|-------|------------|--------|
| **Executive** | `super-admin`, `director-utama`, `director-ops`, `manager` | 19 pages (full) |
| **Management** | `kurator`, `head-keeper` | 17 pages |
| **Operational** | `kesehatan`, `animal-register` | 14-16 pages |
| **Specialist** | `keeper`, `store-master` | 1-2 pages ⚡ |
| **View** | `view` | 19 pages (read-only) |

**Landing Pages:**
- Most roles → `/animal`
- `keeper` → `/feed` ⚡
- `store-master` → `/stock` ⚡

📖 **For complete role specifications:** [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md)  
📖 **For authentication flow:** [AUTH_ROLE_MAPPING.md](./AUTH_ROLE_MAPPING.md)

---

## 🚀 Usage Examples

### 1. Sidebar Menu (Automatic Filtering)

Sidebar sudah otomatis filter menu berdasarkan role user. Tidak perlu action tambahan.

```tsx
// File: src/components/layout/sidebar-ui/app-sidebar.tsx
// Menu sudah otomatis di-filter berdasarkan canAccessMenu()
```

---

### 2. Conditional Rendering with `<Can>`

Hide/show UI elements berdasarkan role:

```tsx
import { Can } from "@/components/shared/can";
import { ROLE_CODES } from "@/lib/permissions";

// Contoh 1: Hanya super admin yang bisa lihat tombol delete
<Can roles={[ROLE_CODES.SUPER_ADMIN]}>
  <Button variant="destructive">Delete All</Button>
</Can>

// Contoh 2: Management roles bisa edit
<Can roles={[
  ROLE_CODES.SUPER_ADMIN, 
  ROLE_CODES.DIRECTOR_UTAMA,
  ROLE_CODES.DIRECTOR_OPS,
  ROLE_CODES.MANAGER
]}>
  <Button>Edit</Button>
</Can>

// Contoh 3: Dengan fallback
<Can 
  roles={[ROLE_CODES.SUPER_ADMIN, ROLE_CODES.MANAGER]} 
  fallback={<p className="text-muted-foreground">Access denied</p>}
>
  <AdminPanel />
</Can>

// Contoh 4: Custom permission logic
<Can permission={() => user.id === post.authorId}>
  <Button>Edit My Post</Button>
</Can>
```

---

### 3. Route Protection with `<ProtectedRoute>`

Protect entire page berdasarkan role:

```tsx
// File: src/app/(dashboard)/stock/page.tsx
import { ProtectedRoute } from "@/components/shared/protected-route";
import { ROLE_CODES } from "@/lib/permissions";

export default function StockPage() {
  return (
    <ProtectedRoute 
      allowedRoles={[
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.MANAGER,
        ROLE_CODES.STORE_MASTER,
        ROLE_CODES.VIEW
      ]}
      redirectTo="/animal"
    >
      <div>
        <h1>Stok Barang</h1>
        {/* Content accessible by executives + store-master */}
      </div>
    </ProtectedRoute>
  );
}
```

---

### 4. RoleGuard Component

Alternative untuk `<Can>` dengan nama lebih explicit:

```tsx
import { RoleGuard } from "@/components/shared/role-guard";
import { ROLE_CODES } from "@/lib/permissions";

<RoleGuard allowedRoles={[
  ROLE_CODES.SUPER_ADMIN,
  ROLE_CODES.DIRECTOR_UTAMA,
  ROLE_CODES.MANAGER
]}>
  <ReportsPanel />
</RoleGuard>

// Dengan fallback
<RoleGuard 
  allowedRoles={[
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.DIRECTOR_OPS
  ]}
  fallback={<AccessDeniedMessage />}
  hideOnDenied={false} // Show fallback instead of hiding
>
  <ExecutiveSettings />
</RoleGuard>
```

---

### 5. Using `usePermissions` Hook

Untuk logic programmatic:

```tsx
import { usePermissions } from "@/hooks/use-permissions";
import { ROLE_CODES } from "@/lib/permissions";

function MyComponent() {
  const { hasRole, isAdmin, isManagement, hasFullAccess, canAccessMenu } = usePermissions();

  // Check single role
  if (hasRole([ROLE_CODES.SUPER_ADMIN])) {
    console.log("User is super admin");
  }

  // Check if user is admin (super-admin or directors)
  if (isAdmin()) {
    console.log("User has admin privileges");
  }

  // Check if management level
  if (isManagement()) {
    console.log("User is management");
  }

  // Check full access (18 pages)
  if (hasFullAccess()) {
    console.log("User has access to all 18 pages");
  }

  // Check menu access
  if (canAccessMenu("/stock")) {
    console.log("User can access stock page");
  }

  // Conditional rendering
  return (
    <div>
      {hasRole([
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.KURATOR
      ]) && (
        <Button>Edit Animal</Button>
      )}
    </div>
  );
}
```

---

### 6. Permission Utility Functions

```tsx
import { hasRole, isAdmin, getUserRoles } from "@/lib/permissions";
import { useAuthStore } from "@/store/use-auth-store";

const { user } = useAuthStore();

// Check if user has specific role
if (hasRole(user, ["super-admin", "director-ops"])) {
  // User has permission
}

// Check if user is admin (super-admin or directors)
if (isAdmin(user)) {
  // User is admin
}

// Check if management level
if (isManagement(user)) {
  // User is management (kurator, head-keeper, kesehatan)
}

// Check if has full access (18 pages)
if (hasFullAccess(user)) {
  // Can access all pages
}

// Get all user roles (includes main + sub roles)
const roles = getUserRoles(user);
console.log(roles); // ["super-admin", "admin-cms"]
```

---

## 🔧 Configuration

### Adding New Roles

1. Update role codes di `src/lib/permissions.ts`:
```typescript
export const ROLE_CODES = {
  SUPER_ADMIN: "super-admin",
  DIRECTOR_UTAMA: "director-utama",
  DIRECTOR_OPS: "director-ops",
  MANAGER: "manager",
  KURATOR: "kurator",
  HEAD_KEEPER: "head-keeper",
  KEEPER: "keeper",
  KESEHATAN: "kesehatan",
  ANIMAL_REGISTER: "animal-register",
  STORE_MASTER: "store-master",
  VIEW: "view",
  NEW_ROLE: "new_role", // ← Add new roles here
} as const;
```

2. Update menu permissions di `src/config/menu-permissions.ts`:
```typescript
export const MENU_PERMISSIONS: Record<string, RoleCode[]> = {
  "/new-page": [ROLE_CODES.NEW_ROLE],
};
```

### Adding New Menu with Permission

Di `src/components/layout/sidebar-ui/app-sidebar.tsx`:

```tsx
{
  title: "New Menu",
  url: "/new-page",
  icon: IconStar,
  allowedRoles: [
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.MANAGER,
    ROLE_CODES.NEW_ROLE
  ],
}
```

---

## 🎨 Real-World Examples

### Example 1: Animal List Page

```tsx
// src/app/(dashboard)/animal/page.tsx
import { Can } from "@/components/shared/can";
import { ROLE_CODES } from "@/lib/permissions";

export default function AnimalPage() {
  return (
    <div>
      <h1>Satwa Hidup</h1>
      
      {/* 9 roles bisa lihat list */}
      <AnimalTable />
      
      {/* Management & operational roles bisa tambah hewan baru */}
      <Can roles={[
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.MANAGER,
        ROLE_CODES.KURATOR,
        ROLE_CODES.HEAD_KEEPER,
        ROLE_CODES.KESEHATAN,
        ROLE_CODES.ANIMAL_REGISTER
      ]}>
        <Button>Tambah Satwa</Button>
      </Can>
      
      {/* View role tidak bisa tambah (read-only) */}
    </div>
  );
}
```

### Example 2: Animal Detail with Actions

```tsx
import { Can } from "@/components/shared/can";
import { usePermissions } from "@/hooks/use-permissions";

export default function AnimalDetailPage() {
  const { hasRole, isAdmin, hasFullAccess } = usePermissions();
  
  // Logic untuk enable/disable features
  const canEdit = hasRole([
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.KURATOR,
    ROLE_CODES.HEAD_KEEPER
  ]);
  const canDelete = isAdmin(); // Only executives can delete

  return (
    <div>
      <AnimalInfo />
      
      <div className="actions">
        {/* Edit button: Management roles */}
        <Can roles={[
          ROLE_CODES.SUPER_ADMIN,
          ROLE_CODES.DIRECTOR_OPS,
          ROLE_CODES.KURATOR,
          ROLE_CODES.HEAD_KEEPER
        ]}>
          <Button>Edit</Button>
        </Can>
        
        {/* Delete button: Executives only */}
        <Can roles={[
          ROLE_CODES.SUPER_ADMIN,
          ROLE_CODES.DIRECTOR_UTAMA,
          ROLE_CODES.DIRECTOR_OPS
        ]}>
          <Button variant="destructive">Delete</Button>
        </Can>
        
        {/* Medical records: Health team & Admin */}
        <Can roles={[
          ROLE_CODES.SUPER_ADMIN,
          ROLE_CODES.DIRECTOR_UTAMA,
          ROLE_CODES.KESEHATAN
        ]}>
          <MedicalRecordsButton />
        </Can>
      </div>
    </div>
  );
}
```

### Example 3: Protected Admin Page

```tsx
// src/app/(dashboard)/feed/page.tsx
import { ProtectedRoute } from "@/components/shared/protected-route";
import { ROLE_CODES } from "@/lib/permissions";

export default function FeedPage() {
  return (
    <ProtectedRoute 
      allowedRoles={[
        ROLE_CODES.SUPER_ADMIN,
        ROLE_CODES.DIRECTOR_UTAMA,
        ROLE_CODES.DIRECTOR_OPS,
        ROLE_CODES.MANAGER,
        ROLE_CODES.KURATOR,
        ROLE_CODES.HEAD_KEEPER,
        ROLE_CODES.KEEPER, // ⚡ Keeper landing page
        ROLE_CODES.KESEHATAN,
        ROLE_CODES.VIEW
      ]}
      redirectTo="/animal"
    >
      <div>
        <h1>Pakan</h1>
        <FeedTable />
        
        {/* Only non-keeper roles can manage */}
        <Can roles={[
          ROLE_CODES.SUPER_ADMIN,
          ROLE_CODES.DIRECTOR_OPS,
          ROLE_CODES.MANAGER
        ]}>
          <CreateFeedButton />
        </Can>
      </div>
    </ProtectedRoute>
  );
}
```

---

## 🔐 Middleware Protection

Middleware sudah otomatis check token di cookie. Untuk protection berdasarkan role, bisa tambahkan di middleware:

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Basic auth check
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection bisa ditambahkan di sini
  // Tapi biasanya dilakukan di page level untuk flexibility
  
  return NextResponse.next();
}
```

---

## ✅ Best Practices

1. **Use `<Can>` for UI elements** - Lebih flexible dan clean
2. **Use `<ProtectedRoute>` for entire pages** - Full page protection
3. **Use `usePermissions` hook for logic** - Conditional logic di component
4. **Keep permissions centralized** - Update di `menu-permissions.ts`
5. **Test with different roles** - Pastikan setiap role dapat akses yang sesuai
6. **Don't rely on frontend only** - Backend harus validate permissions juga

---

## 🧪 Testing Different Roles

Untuk testing, update user role di `use-login.ts` saat development:

```typescript
// Temporary untuk testing
const dummyUser = {
  name: "Test User",
  email: "test@zoo.com",
  role_user: [
    { 
      role_code: "keeper",  // ← Change this
      role_name: "Keeper"
    }
  ],
  sub_role_user: [] // Test sub roles
};
```

Role untuk testing (11 roles):
- **Executives** (18 pages):
  - `super-admin` - Full access to everything
  - `director-utama` - Main Director
  - `director-ops` - Operations Director
  - `manager` - Manager
- **Management** (16-17 pages):
  - `kurator` - Curator (no stock)
  - `head-keeper` - Head Keeper (no stock)
  - `kesehatan` - Health Team (no task, no stock)
- **Operational** (14 pages):
  - `animal-register` - Animal Registration (no cage, feed, task, stock)
- **Specialist** (Limited):
  - `keeper` - Only 2 pages (feed, task) → lands on `/feed` ⚡
  - `store-master` - Only 1 page (stock) → lands on `/stock` ⚡
- **View** (18 pages):
  - `view` - Read-only access to all pages 👁️

---

## � Quick Reference

### **Access Summary by Role**

| Role | Total Pages | Landing | Special Notes |
|------|-------------|---------|---------------|
| super-admin, director-utama, director-ops, manager | 18 | `/animal` | Full access |
| view | 18 | `/animal` | Read-only mode 👁️ |
| kurator, head-keeper | 17 | `/animal` | No stock access |
| kesehatan | 16 | `/animal` | No task & stock |
| animal-register | 14 | `/animal` | Limited operational |
| keeper | 2 | **`/feed`** | Feed & Task only ⚡ |
| store-master | 1 | **`/stock`** | Stock only ⚡ |

### **Helper Functions**

```typescript
// Available utility functions
hasRole(user, ["super-admin", "manager"]) // Check specific roles
isAdmin(user) // Check if executive level (super-admin, directors)
isManagement(user) // Check if management (kurator, head-keeper, kesehatan)
hasFullAccess(user) // Check if has access to all 18 pages
getDefaultLandingPage(user) // Get role-based landing page
getUserRoles(user) // Get combined role_user + sub_role_user
```

### **Important Notes**

⚠️ **Nested API Response**: User data from `/user/profile` is nested at `response.data.data`

⚠️ **Sub Roles**: System supports main roles (`role_user`) + secondary roles (`sub_role_user`)

⚠️ **Specialist Roles**: Keeper and Store-master have unique landing pages and limited access

⚠️ **View Role**: Has access to all 18 pages but in read-only mode (implement UI-level restrictions)

⚠️ **Backend Validation**: ALWAYS validate permissions on backend - frontend is for UX only

---

## 📚 Related Documentation

- [AUTH_ROLE_MAPPING.md](./AUTH_ROLE_MAPPING.md) - Complete authentication flow & API structure
- [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md) - Detailed page-by-page access matrix
- [PERMISSION_API.md](./PERMISSION_API.md) - Quick API reference guide
- [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - Visual flow diagrams
- [API_COMPATIBILITY.md](./API_COMPATIBILITY.md) - API response structure analysis

---

**Last Updated**: January 11, 2026  
**Version**: 2.0 (Updated with 11 roles system)

---

## �📞 Support

Jika ada pertanyaan atau butuh tambahan fitur RBAC, contact development team.
