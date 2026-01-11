# Permission API Quick Reference

## 🎯 Components

### `<Can>`
Conditional rendering berdasarkan role.

```tsx
import { Can } from "@/components/shared/can";
import { ROLE_CODES } from "@/lib/permissions";

// Basic usage
<Can roles={[ROLE_CODES.ADMIN]}>
  <AdminButton />
</Can>

// Multiple roles
<Can roles={[ROLE_CODES.ADMIN, ROLE_CODES.STAFF]}>
  <EditButton />
</Can>

// With fallback
<Can roles={[ROLE_CODES.ADMIN]} fallback={<AccessDenied />}>
  <DeleteButton />
</Can>

// Custom permission
<Can permission={() => user.id === post.authorId}>
  <EditMyPost />
</Can>
```

---

### `<RoleGuard>`
Alternative untuk `<Can>` dengan nama lebih explicit.

```tsx
import { RoleGuard } from "@/components/shared/role-guard";

<RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
  <AdminPanel />
</RoleGuard>

// Show fallback instead of hiding
<RoleGuard 
  allowedRoles={[ROLE_CODES.ADMIN]}
  fallback={<AccessDenied />}
  hideOnDenied={false}
>
  <AdminSettings />
</RoleGuard>
```

---

### `<ProtectedRoute>`
Protect entire page/route.

```tsx
import { ProtectedRoute } from "@/components/shared/protected-route";

export default function AdminPage() {
  return (
    <ProtectedRoute 
      allowedRoles={[ROLE_CODES.ADMIN]}
      redirectTo="/dashboard"
    >
      <AdminContent />
    </ProtectedRoute>
  );
}
```

---

## 🪝 Hooks

### `usePermissions()`
Hook untuk permission checking.

```tsx
import { usePermissions } from "@/hooks/use-permissions";

function MyComponent() {
  const { 
    hasRole, 
    hasAnyRole, 
    hasAllRoles, 
    isAdmin, 
    getUserRoles,
    canAccessMenu,
    user 
  } = usePermissions();

  // Check single or multiple roles
  if (hasRole([ROLE_CODES.ADMIN])) {
    // ...
  }

  // Check if admin
  if (isAdmin()) {
    // ...
  }

  // Check menu access
  if (canAccessMenu("/users")) {
    // ...
  }

  // Get all user roles
  const roles = getUserRoles();
  console.log(roles); // ["admin", "staff"]

  // Use in JSX
  return (
    <div>
      {hasRole([ROLE_CODES.ADMIN]) && <AdminButton />}
    </div>
  );
}
```

---

## 🛠️ Utility Functions

### `hasRole(user, allowedRoles)`
Check if user has any of the specified roles.

```tsx
import { hasRole } from "@/lib/permissions";
import { useAuthStore } from "@/store/use-auth-store";

const { user } = useAuthStore();

if (hasRole(user, ["admin", "staff"])) {
  console.log("User has permission");
}
```

---

### `hasAllRoles(user, requiredRoles)`
Check if user has ALL of the specified roles.

```tsx
import { hasAllRoles } from "@/lib/permissions";

if (hasAllRoles(user, ["admin", "manager"])) {
  console.log("User has both roles");
}
```

---

### `isAdmin(user)`
Quick check if user is admin.

```tsx
import { isAdmin } from "@/lib/permissions";

if (isAdmin(user)) {
  console.log("User is admin");
}
```

---

### `getUserRoles(user)`
Get array of user's role codes.

```tsx
import { getUserRoles } from "@/lib/permissions";

const roles = getUserRoles(user);
console.log(roles); // ["admin", "staff"]
```

---

### `canAccessMenu(url, userRoles)`
Check if user can access specific menu.

```tsx
import { canAccessMenu } from "@/config/menu-permissions";
import { getUserRoles } from "@/lib/permissions";

const userRoles = getUserRoles(user);
if (canAccessMenu("/users", userRoles)) {
  console.log("User can access users page");
}
```

---

## 🎭 Role Constants

```tsx
import { ROLE_CODES } from "@/lib/permissions";

ROLE_CODES.ADMIN          // "admin"
ROLE_CODES.SUPER_ADMIN    // "super_admin"
ROLE_CODES.STAFF          // "staff"
ROLE_CODES.VETERINARIAN   // "veterinarian"
ROLE_CODES.LOGISTICS      // "logistics"
ROLE_CODES.MANAGER        // "manager"
ROLE_CODES.VIEWER         // "viewer"
```

---

## ⚙️ Configuration

### Add Menu Permission

Edit `src/config/menu-permissions.ts`:

```typescript
export const MENU_PERMISSIONS: Record<string, RoleCode[]> = {
  "/new-page": [ROLE_CODES.ADMIN, ROLE_CODES.MANAGER],
  // Empty array = all roles can access
  "/dashboard": [],
};
```

---

### Add Menu to Sidebar

Edit `src/components/layout/sidebar-ui/app-sidebar.tsx`:

```typescript
const allNavMainData: MenuItem[] = [
  {
    title: "New Menu",
    url: "/new-page",
    icon: IconStar,
    allowedRoles: [ROLE_CODES.ADMIN, ROLE_CODES.MANAGER],
  },
  // For submenu
  {
    title: "Parent Menu",
    url: "#",
    icon: IconFolder,
    items: [
      {
        title: "Sub Menu",
        url: "/sub-page",
        allowedRoles: [ROLE_CODES.ADMIN],
      },
    ],
  },
];
```

---

## 📖 Common Patterns

### Pattern 1: Admin-Only Action

```tsx
<Can roles={[ROLE_CODES.ADMIN]}>
  <Button variant="destructive">Delete</Button>
</Can>
```

---

### Pattern 2: Multiple Roles Can Edit

```tsx
<Can roles={[ROLE_CODES.ADMIN, ROLE_CODES.STAFF]}>
  <Button>Edit</Button>
</Can>
```

---

### Pattern 3: Owner Can Edit

```tsx
<Can permission={() => user.id === item.ownerId}>
  <Button>Edit My Item</Button>
</Can>
```

---

### Pattern 4: Complex Logic

```tsx
const { hasRole, isAdmin } = usePermissions();
const canEdit = isAdmin() || hasRole([ROLE_CODES.STAFF]);

return (
  <div>
    {canEdit && <EditButton />}
  </div>
);
```

---

### Pattern 5: Protected Page

```tsx
export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLE_CODES.ADMIN]}>
      <div>Admin Content</div>
    </ProtectedRoute>
  );
}
```

---

### Pattern 6: Fallback Message

```tsx
<Can 
  roles={[ROLE_CODES.ADMIN]} 
  fallback={
    <div className="text-muted-foreground">
      You need admin access to view this content
    </div>
  }
>
  <AdminPanel />
</Can>
```

---

## ✅ Checklist untuk Implementasi Baru

Ketika menambahkan fitur baru dengan permission:

- [ ] Define role permission di `menu-permissions.ts`
- [ ] Add menu di `app-sidebar.tsx` dengan `allowedRoles`
- [ ] Wrap page dengan `<ProtectedRoute>` jika perlu
- [ ] Use `<Can>` untuk conditional buttons/actions
- [ ] Test dengan berbagai role
- [ ] Ensure backend juga validate permissions

---

## 🔍 Troubleshooting

### Menu tidak muncul di sidebar
- Check `allowedRoles` di menu definition
- Verify user role di Zustand store
- Check `MENU_PERMISSIONS` configuration

### Button masih muncul untuk role yang tidak seharusnya
- Check `<Can>` wrapper dengan `allowedRoles`
- Verify role codes match exactly (case-sensitive)

### Protected page tidak redirect
- Verify `<ProtectedRoute>` wrapper
- Check `allowedRoles` parameter
- Ensure user data loaded di store

### Permission check selalu return false
- Verify user data ada di store
- Check `role_user` array tidak kosong
- Verify `role_code` format match constants
