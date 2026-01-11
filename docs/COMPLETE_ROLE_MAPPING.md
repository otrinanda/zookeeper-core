# Complete Role-Based Access Mapping - ZooKeeper Core

## 📋 Overview

Sistem ini menggunakan 11 role berbeda dengan akses yang sangat spesifik berdasarkan struktur organisasi kebun binatang.

---

## 🎭 **ROLE DEFINITIONS**

### **Executive Level** (Full Access - 19 Pages)
| Role Code | Description | Total Access |
|-----------|-------------|--------------||
| `super-admin` | Super Administrator | 19 pages |
| `director-utama` | Main Director | 19 pages |
| `director-ops` | Operations Director | 19 pages |
| `manager` | Manager | 19 pages |

**Landing Page**: `/animal`

---

### **Management Level**
| Role Code | Description | Total Access | Restrictions |
|-----------|-------------|--------------|--------------|
| `kurator` | Curator | 18 pages | ❌ No stock access |
| `head-keeper` | Head Keeper | 18 pages | ❌ No stock access |

**Landing Page**: `/animal`

---

### **Operational Level**
| Role Code | Description | Total Access | Restrictions |
|-----------|-------------|--------------|--------------|
| `kesehatan` | Health Team | 17 pages | ❌ No task & stock access |
| `animal-register` | Animal Registration | 15 pages | ❌ No cage, feed, task, stock |

**Landing Page**: `/animal`

---

### **Specialist Roles** (Limited Access)
| Role Code | Description | Total Access | Access Only |
|-----------|-------------|--------------|-------------|
| `keeper` | Keeper | 3 pages | ✅ Dashboard, Feed & Task only |
| `store-master` | Warehouse Master | 2 pages | ✅ Dashboard & Stock only |

**Landing Page**: 
- `keeper` → `/feed`
- `store-master` → `/stock`

---

### **View Only**
| Role Code | Description | Total Access | Mode |
|-----------|-------------|--------------|------|
| `view` | View Only | 19 pages | 👁️ Read-only |

**Landing Page**: `/animal`

---

## 📊 **PAGE ACCESS MATRIX**

### **Dashboard**

#### 0. Dashboard (`/dashboard`)
**Accessible by ALL 11 roles:**
- ✅ super-admin
- ✅ director-utama
- ✅ director-ops
- ✅ manager
- ✅ kurator
- ✅ head-keeper
- ✅ kesehatan
- ✅ animal-register
- ✅ keeper
- ✅ store-master
- ✅ view

**Features:**
- Welcome message with user name
- Current primary role display
- Sub-roles display (if any)
- User information cards (email, identity, total roles)

---

### **Modul Satwa (Animal Management)**

#### 1. Satwa Hidup (`/animal`)
**Accessible by 9 roles:**
- ✅ animal-register
- ✅ director-ops
- ✅ director-utama
- ✅ head-keeper
- ✅ kesehatan
- ✅ kurator
- ✅ manager
- ✅ super-admin
- ✅ view

**NOT Accessible:**
- ❌ keeper
- ❌ store-master

---

#### 2. Mutasi Satwa (`/mutation`)
**Same access as Satwa Hidup - 9 roles**

---

#### 3. Satwa Sakit (`/sick`)
**Same access as Satwa Hidup - 9 roles**

**Special**: Primary focus for `kesehatan` role

---

#### 4. Satwa Mati (`/dead`)
**Same access as Satwa Hidup - 9 roles**

---

### **Modul Kandang (Cage Management)**

#### 5. Kandang (`/cage`)
**Accessible by 8 roles:**
- ✅ director-ops
- ✅ director-utama
- ✅ head-keeper
- ✅ kesehatan
- ✅ kurator
- ✅ manager
- ✅ super-admin
- ✅ view

**NOT Accessible:**
- ❌ animal-register
- ❌ keeper
- ❌ store-master

---

### **Modul Pakan (Feed Management)**

#### 6. Pakan (`/feed`)
**Accessible by 9 roles (includes keeper):**
- ✅ director-ops
- ✅ director-utama
- ✅ head-keeper
- ✅ **keeper** ⭐
- ✅ kesehatan
- ✅ kurator
- ✅ manager
- ✅ super-admin
- ✅ view

**NOT Accessible:**
- ❌ animal-register
- ❌ store-master

**Special**: Primary focus for `keeper` role

---

### **Modul Tugas (Task Management)**

#### 7. Tugas Keeper (`/task`)
**Accessible by 8 roles (includes keeper):**
- ✅ director-ops
- ✅ director-utama
- ✅ head-keeper
- ✅ **keeper** ⭐
- ✅ kurator
- ✅ manager
- ✅ super-admin
- ✅ view

**NOT Accessible:**
- ❌ animal-register
- ❌ kesehatan
- ❌ store-master

**Special**: Primary focus for `keeper` role

---

### **Modul Inventaris (Inventory)**

#### 8. Stok Barang (`/stock`)
**Accessible by 6 roles (includes store-master):**
- ✅ director-ops
- ✅ director-utama
- ✅ manager
- ✅ **store-master** ⭐
- ✅ super-admin
- ✅ view

**NOT Accessible:**
- ❌ animal-register
- ❌ head-keeper
- ❌ keeper
- ❌ kesehatan
- ❌ kurator

**Special**: Only page accessible by `store-master`

---

### **Master Data (10 Pages)**

All master data pages accessible by **9 roles**:

#### 9. Area Unit (`/unit-area`)
#### 10. Area Zona (`/zone-area`)
#### 11. Family (`/family`)
#### 12. Kategori Pakan (`/feed-category`)
#### 13. Jenis Kandang (`/cage-model`)
#### 14. Tipe Kandang (`/cage-type`)
#### 15. Jenis Pakan (`/feed-type`)
#### 16. Mix Pakan (`/mix-feed`)
#### 17. Spesies (`/species`)
#### 18. Satuan (`/unit`)

**Accessible by:**
- ✅ animal-register
- ✅ director-ops
- ✅ director-utama
- ✅ head-keeper
- ✅ kesehatan
- ✅ kurator
- ✅ manager
- ✅ super-admin
- ✅ view

**NOT Accessible:**
- ❌ keeper
- ❌ store-master

---

## 📈 **COMPLETE ACCESS SUMMARY TABLE**

| Role | Satwa (4) | Cage (1) | Feed (1) | Task (1) | Stock (1) | Master (10) | **Total** |
|------|-----------|----------|----------|----------|-----------|-------------|-----------|
| **super-admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **18** |
| **director-utama** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **18** |
| **director-ops** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **18** |
| **manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **18** |
| **view** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **18** 👁️ |
| **kurator** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | **17** |
| **head-keeper** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | **17** |
| **kesehatan** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | **16** |
| **animal-register** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | **14** |
| **keeper** | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | **2** ⚡ |
| **store-master** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | **1** ⚡ |

**Legend:**
- ✅ = Has access
- ❌ = No access
- 👁️ = Read-only access
- ⚡ = Limited/Specialist role

---

## 🎯 **ROLE CATEGORIZATION**

### **Category 1: Full Access (19 pages)**
```
super-admin
director-utama
director-ops
manager
view (read-only)
```

### **Category 2: Executive Management (17-18 pages)**
```
kurator (18 pages)
head-keeper (18 pages)
kesehatan (17 pages)
```

### **Category 3: Specialist (15 pages)**
```
animal-register (15 pages)
```

### **Category 4: Limited Operational (2-3 pages)**
```
keeper (3 pages: dashboard, feed & task)
store-master (2 pages: dashboard & stock)
```

---

## 🔄 **DEFAULT LANDING PAGES**

| Role | Landing Page | Reason |
|------|--------------|--------|
| keeper | `/feed` | Primary task: feeding animals |
| store-master | `/stock` | Primary task: inventory management |
| All others | `/animal` | Standard entry point |

---

## 🚀 **IMPLEMENTATION STATUS**

### ✅ **Completed**
- [x] Role constants updated
- [x] Permission mapping configured
- [x] Sidebar auto-filtering
- [x] Default landing page logic
- [x] Example implementation in animal page
- [x] `/dashboard` - Dashboard (accessible by all 11 roles)

### ⏳ **Pages to Create**
- [ ] `/mutation` - Mutasi Satwa
- [ ] `/sick` - Satwa Sakit
- [ ] `/dead` - Satwa Mati
- [ ] `/cage` - Kandang
- [ ] `/feed` - Pakan
- [ ] `/task` - Tugas Keeper
- [ ] `/stock` - Stok Barang
- [ ] `/unit-area` - Area Unit
- [ ] `/zone-area` - Area Zona
- [ ] `/family` - Family
- [ ] `/feed-category` - Kategori Pakan
- [ ] `/cage-model` - Jenis Kandang
- [ ] `/cage-type` - Tipe Kandang
- [ ] `/feed-type` - Jenis Pakan
- [ ] `/mix-feed` - Mix Pakan
- [ ] `/species` - Spesies
- [ ] `/unit` - Satuan

---

## 💡 **USAGE EXAMPLES**

### Example 1: Check if User Can Add Animal
```tsx
import { usePermissions } from "@/hooks/use-permissions";
import { ROLE_CODES } from "@/lib/permissions";

const { hasRole } = usePermissions();

// Executive and management can add
if (hasRole([
  ROLE_CODES.SUPER_ADMIN,
  ROLE_CODES.DIRECTOR_UTAMA,
  ROLE_CODES.DIRECTOR_OPS,
  ROLE_CODES.MANAGER,
  ROLE_CODES.KURATOR,
  ROLE_CODES.HEAD_KEEPER,
])) {
  // Show add button
}
```

### Example 2: Conditional UI for Keeper
```tsx
import { Can } from "@/components/shared/can";
import { ROLE_CODES } from "@/lib/permissions";

// Keeper only sees feed and task
<Can roles={[ROLE_CODES.KEEPER]}>
  <KeeperDashboard />
</Can>
```

### Example 3: Stock Management Access
```tsx
// Only these roles can access stock
<Can roles={[
  ROLE_CODES.SUPER_ADMIN,
  ROLE_CODES.DIRECTOR_UTAMA,
  ROLE_CODES.DIRECTOR_OPS,
  ROLE_CODES.MANAGER,
  ROLE_CODES.STORE_MASTER,
  ROLE_CODES.VIEW,
]}>
  <StockManagementPanel />
</Can>
```

---

## 🧪 **TESTING SCENARIOS**

### Test Case 1: Super Admin
```typescript
// Should have access to all 19 pages
role_user: [{ role_code: "super-admin", role_name: "Super Admin" }]
// Landing: /animal
```

### Test Case 2: Keeper
```typescript
// Should only see Dashboard, Feed & Task (3 pages)
role_user: [{ role_code: "keeper", role_name: "Keeper" }]
// Landing: /feed
// Sidebar: Dashboard, Feed and Task menu visible
```

### Test Case 3: Store Master
```typescript
// Should only see Dashboard & Stock (2 pages)
role_user: [{ role_code: "store-master", role_name: "Store Master" }]
// Landing: /stock
// Sidebar: Only Stock menu visible
```

### Test Case 4: Health Team
```typescript
// Should see all except Task & Stock (16 pages)
role_user: [{ role_code: "kesehatan", role_name: "Tim Kesehatan" }]
// Landing: /animal
// Focus: /sick (satwa sakit)
```

---

## 📝 **NOTES**

1. **Keeper Role**: Sangat terbatas, hanya feed & task
2. **Store Master**: Paling terbatas, hanya stock
3. **View Role**: Full access tapi read-only
4. **Health Team**: Fokus pada satwa sakit
5. **Animal Register**: Fokus pada pendaftaran & master data
6. **Executive Roles**: Full access semua fitur

---

**Last Updated**: January 11, 2026
**Total Pages**: 18
**Total Roles**: 11
