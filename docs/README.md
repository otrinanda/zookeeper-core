# ZooKeeper Core - Documentation

Dokumentasi lengkap sistem autentikasi dan Role-Based Access Control (RBAC).

---

## 📚 Documentation Structure

Each document has a specific purpose to avoid overlap:

### 1. [AUTH_ROLE_MAPPING.md](./AUTH_ROLE_MAPPING.md) 🔐
**Focus: Authentication Architecture & API Flow**

- API endpoints & response structure
- Authentication flow (11 steps)
- 5-layer protection system
- File structure & implementation status
- Testing & next steps

**📖 Read this for**: Understanding how authentication works, API integration, system architecture

---

### 2. [COMPLETE_ROLE_MAPPING.md](./COMPLETE_ROLE_MAPPING.md) 📋
**Focus: Role Specifications & Access Matrix**

- Detailed 11 role definitions with hierarchy
- Complete page-by-page access mapping (19 pages)
- Access summary tables
- Role categorization
- Landing page specifications
- Test scenarios by role

**📖 Read this for**: "Who can access what" - reference document for permissions

---

### 3. [RBAC_GUIDE.md](./RBAC_GUIDE.md) 🚀
**Focus: Developer Implementation Guide**

- Usage examples (`<Can>`, `<ProtectedRoute>`, `<RoleGuard>`)
- `usePermissions` hook usage
- Configuration guide (adding roles/menus)
- Real-world code examples
- Best practices
- Quick reference for role constants

**📖 Read this for**: Practical guide for implementing RBAC in code

---

### 4. [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
**Visual diagram arsitektur sistem**
- Authentication flow diagram
- Request authorization flow
- RBAC protection layers
- Role-based menu rendering
- Conditional rendering flow
- File dependencies tree
- Data flow summary

**📖 Baca ini untuk**: Memahami flow sistem secara visual dan arsitektur.

---

## 🚀 Quick Start

### 1. Setup Basic Protection

```tsx
// Protect entire page
import { ProtectedRoute } from "@/components/shared/protected-route";
import { ROLE_CODES } from "@/lib/permissions";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLE_CODES.ADMIN]}>
      <YourContent />
    </ProtectedRoute>
  );
}
```

### 2. Conditional Rendering

```tsx
// Hide/show UI elements
import { Can } from "@/components/shared/can";

<Can roles={[ROLE_CODES.ADMIN, ROLE_CODES.STAFF]}>
  <Button>Edit</Button>
</Can>
```

### 3. Use Permission Hook

```tsx
// Check permissions in logic
import { usePermissions } from "@/hooks/use-permissions";

const { hasRole, isAdmin } = usePermissions();

if (isAdmin()) {
  // Admin logic
}
```

---

## 🎭 Available Roles

| Role Code | Description |
|-----------|-------------|
| `admin` / `super_admin` | Full access |
| `staff` | Staff kebun binatang |
| `veterinarian` | Dokter hewan |
| `logistics` | Pengelola pakan |
| `manager` | Manajer (laporan) |
| `viewer` | Read-only |

---

## 📋 Menu Access Matrix

### Primary Features
- **Dashboard**: All roles ✅
- **Daftar Hewan**: admin, staff, veterinarian ✅
- **Tambah/Edit Hewan**: admin, staff ✅
- **Kategori & Spesies**: admin, veterinarian ✅
- **Mutasi Hewan**: admin, staff ✅
- **Kandang & Area**: admin, staff ✅
- **Pakan & Logistik**: admin, staff, logistics ✅

### Admin Only
- **User Management**: admin ✅
- **Settings**: admin ✅

### Reports
- **Laporan**: admin, manager ✅

---

## 🔧 Core Files

| File | Purpose |
|------|---------|
| `src/lib/permissions.ts` | Core permission functions |
| `src/config/menu-permissions.ts` | Menu access rules |
| `src/hooks/use-permissions.ts` | Permission hook |
| `src/components/shared/can.tsx` | Conditional render component |
| `src/components/shared/protected-route.tsx` | Route protection |
| `src/components/layout/sidebar-ui/app-sidebar.tsx` | Auto-filtered sidebar |

---

## 📖 Reading Guide

**Untuk Developer Baru:**
1. Start: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - Pahami flow sistem
2. Next: [AUTH_ROLE_MAPPING.md](./AUTH_ROLE_MAPPING.md) - Lihat mapping lengkap
3. Then: [RBAC_GUIDE.md](./RBAC_GUIDE.md) - Belajar cara implementasi
4. Reference: [PERMISSION_API.md](./PERMISSION_API.md) - Quick API reference saat coding

**Untuk Developer yang Sudah Familiar:**
- Quick API lookup → [PERMISSION_API.md](./PERMISSION_API.md)
- Tambah menu baru → [RBAC_GUIDE.md](./RBAC_GUIDE.md) section "Configuration"
- Check permission matrix → [AUTH_ROLE_MAPPING.md](./AUTH_ROLE_MAPPING.md)

**Untuk Code Review:**
- Check flow → [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
- Verify permissions → [AUTH_ROLE_MAPPING.md](./AUTH_ROLE_MAPPING.md)

---

## ✅ Implementation Checklist

Untuk setiap fitur baru dengan permission:

- [ ] Define role permission di `menu-permissions.ts`
- [ ] Add menu item di `app-sidebar.tsx` dengan `allowedRoles`
- [ ] Wrap page dengan `<ProtectedRoute>` jika perlu
- [ ] Use `<Can>` untuk conditional actions
- [ ] Test dengan berbagai role
- [ ] Ensure backend validate permissions

---

## 🔗 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST | Login & get token |
| `/user/profile` | GET | Get user + roles |
| `/logout` | POST | Logout (optional) |

---

## 🧪 Testing

Update role for testing di `src/hooks/auth/use-login.ts`:

```typescript
const dummyUser = {
  name: "Test User",
  email: "test@zoo.com",
  role_user: [
    { role_code: "staff", role_name: "Staff" }  // Change here
  ]
};
```

Test dengan:
- `admin` - Full access
- `staff` - Limited access
- `veterinarian` - Medical access
- `viewer` - Read-only

---

## 📞 Support

Untuk pertanyaan atau issue:
1. Check documentation files di atas
2. Review implementation examples
3. Check troubleshooting section di PERMISSION_API.md

---

## 📝 Notes

- Frontend permission adalah untuk UX, **ALWAYS validate di backend**
- Token disimpan di Cookie (`accessToken`)
- User data di localStorage via Zustand persist
- Axios auto-inject token di setiap request
- 401 response auto-redirect ke login

---

**Last Updated**: January 11, 2026
