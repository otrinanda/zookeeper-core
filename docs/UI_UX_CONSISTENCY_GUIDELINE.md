# 🎨 UI/UX CONSISTENCY GUIDELINE

## Zookeeper Core - Master Data & List Pages

---

## 📋 TABLE OF CONTENTS

1. [Layout Structure](#1-layout-structure)
2. [Header Section](#2-header-section)
3. [Search & Action Bar](#3-search--action-bar)
4. [Table States](#4-table-states)
5. [Pagination](#5-pagination)
6. [Form Pattern](#6-form-pattern)
7. [Color & Styling](#7-color--styling)
8. [Responsive Design](#8-responsive-design)

---

## 1. LAYOUT STRUCTURE

Semua halaman list/master-data harus mengikuti struktur berikut:

```
┌─────────────────────────────────────┐
│  BREADCRUMB                         │
├─────────────────────────────────────┤
│  HEADER (Title + Description)       │
├─────────────────────────────────────┤
│  SEARCH BAR + ACTION BUTTON         │
├─────────────────────────────────────┤
│  TABLE                              │
│  ├─ Header                          │
│  ├─ Rows (dengan loading/empty)     │
│  └─ Pagination Control              │
└─────────────────────────────────────┘
```

### Implementation

```tsx
<div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
  {/* BREADCRUMB */}
  <PageBreadcrumb items={breadcrumbItems} />

  {/* HEADER */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Title</h2>
      <p className="text-muted-foreground text-sm">Description</p>
    </div>
  </div>

  {/* SEARCH & ACTION */}
  <div className="flex items-center justify-between gap-4 flex-wrap">
    <div className="relative flex-1 min-w-64">
      <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4" />
      <Input ... />
    </div>
    <Button>Action</Button>
  </div>

  {/* TABLE */}
  <div className="rounded-md border border-border bg-background overflow-hidden">
    <Table>...</Table>
    {/* PAGINATION INSIDE */}
  </div>
</div>
```

---

## 2. HEADER SECTION

### Rules

- ✅ Title: `text-2xl font-bold tracking-tight`
- ✅ Description: `text-muted-foreground text-sm`
- ✅ Container: `flex flex-col md:flex-row justify-between items-start md:items-center gap-4`
- ✅ Responsive di mobile

### ❌ DO NOT

- Gunakan font size berbeda
- Skip description
- Hardcoded text tanpa semantic meaning

### Example

```tsx
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>
    <h2 className="text-2xl font-bold tracking-tight">Manajemen Hewan</h2>
    <p className="text-muted-foreground text-sm">
      Data dikelompokkan berdasarkan Family dan Spesies.
    </p>
  </div>
</div>
```

---

## 3. SEARCH & ACTION BAR

### Rules

- ✅ Container: `flex items-center justify-between gap-4 flex-wrap`
- ✅ Search width: `flex-1 min-w-64` (responsive)
- ✅ Gap: **ALWAYS `gap-4`**
- ✅ Search icon positioning: `absolute left-2.5 top-2.5`
- ✅ Input class: `pl-9` (untuk icon space)
- ✅ Button action: `bg-primary hover:bg-primary/80`
- ✅ `flex-wrap` untuk reflow di mobile

### ❌ DO NOT

- Gunakan fixed width di search
- Gap yang tidak standard (jangan `gap-2`, `gap-3`, dll)
- Overlap icon dengan text

### Example

```tsx
<div className="flex items-center justify-between gap-4 flex-wrap">
  <div className="relative flex-1 min-w-64">
    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Cari..."
      className="pl-9"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
      onBlur={() => handleSearch(searchTerm)}
    />
  </div>

  {/* Permission check REQUIRED */}
  <Can roles={[ROLE_CODES.ADMIN, ...]}>
    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/80">
      <IconPlus className="mr-2 h-4 w-4" /> Tambah
    </Button>
  </Can>
</div>
```

### ⚠️ IMPORTANT

**Selalu tambahkan permission check dengan `<Can>` component!**

---

## 4. TABLE STATES

### 4.1 Loading State

**STANDARD (Gunakan Skeleton):**

```tsx
{isLoading ? (
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {columns.map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ))
) : ...}
```

**❌ JANGAN:**

- Gunakan text "Memuat data..."
- Gunakan spinner/loading indicator di tengah table
- Hardcode jumlah skeleton rows

---

### 4.2 Empty State

**STANDARD (Icon + Descriptive Text):**

```tsx
{tableData.length === 0 ? (
  <TableRow>
    <TableCell colSpan={columns.length} className="h-32 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <IconSearch className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-muted-foreground">Tidak ada data ditemukan</p>
      </div>
    </TableCell>
  </TableRow>
) : ...}
```

**Rules:**

- ✅ Icon size: `h-8 w-8`
- ✅ Icon color: `text-muted-foreground/50`
- ✅ Text color: `text-muted-foreground`
- ✅ Container height: `h-32` (untuk visual balance)
- ✅ Gap icon+text: `gap-2`

**❌ JANGAN:**

- Gunakan text sederhana tanpa icon
- Gunakan icon size berbeda
- Skip gap antara icon dan text

---

## 5. PAGINATION

### Layout

```tsx
{
  meta && (
    <PaginationControl
      currentPage={page}
      totalPages={Math.ceil(meta.total / limit)}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      itemsPerPage={limit}
      totalItems={meta.total}
    />
  );
}
```

**Output:**

```
Menampilkan 21-40 dari 500 data     < 1 2 3 4 5 >
```

### Rules

- ✅ **INSIDE table container** (tidak outside)
- ✅ Component: `<PaginationControl>` (reusable)
- ✅ Layout: `flex justify-between items-center gap-4 w-full`
- ✅ Info text (kiri): `text-sm text-muted-foreground`
- ✅ Format info: "Menampilkan X-Y dari Z data"
- ✅ Pass props: `currentPage`, `totalPages`, `onPageChange`, `isLoading`, `itemsPerPage`, `totalItems`
- ✅ Pagination buttons (kanan): Previous, page numbers, Next

### Props Detail

| Prop           | Type     | Default | Description                             |
| -------------- | -------- | ------- | --------------------------------------- |
| `currentPage`  | number   | -       | Current page number (1-indexed)         |
| `totalPages`   | number   | -       | Total pages calculated from total/limit |
| `onPageChange` | function | -       | Callback saat page changed              |
| `isLoading`    | boolean  | false   | Disable buttons saat loading            |
| `itemsPerPage` | number   | 20      | Items per page (default 20)             |
| `totalItems`   | number   | 0       | Total data items untuk info text        |

### ❌ DO NOT

- Wrap pagination dengan extra div
- Skip `totalItems` prop (untuk info text)
- Lupa pass `isLoading` prop
- Hardcode "Menampilkan X dari Y"

---

## 6. FORM PATTERN

### 6.1 Kapan Gunakan Modal vs Page Terpisah?

| Kriteria         | Modal               | Page Terpisah           |
| ---------------- | ------------------- | ----------------------- |
| **Kompleksitas** | Simple (< 5 fields) | Complex (> 5 fields)    |
| **Flow**         | Inline CRUD         | Navigation flow         |
| **Contoh**       | Unit Area, Location | Animal, User            |
| **Edit Data**    | Modal dialog        | Navigate to detail page |

### 6.2 Modal Pattern (untuk simple CRUD)

**Page Component:**

```tsx
// State untuk form
const [isFormOpen, setIsFormOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

// Query untuk list
const { data, isLoading } = useQuery({...});

// Query untuk detail (edit)
const { data: detailData, isLoading: isLoadingDetail } = useQuery({
  queryKey: ["resource", selectedId],
  queryFn: () => service.getById(selectedId!),
  enabled: !!selectedId, // Auto-trigger saat selectedId set
});

// Mutation untuk delete
const deleteMutation = useMutation({
  mutationFn: (id: string) => service.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resources"] });
  },
});

// Handler
const handleEdit = (id: string) => {
  setSelectedId(id);
  setIsFormOpen(true); // Detail akan auto-fetch
};

const handleDelete = (id: string, name: string) => {
  setSelectedId(id);
  setSelectedName(name);
  setIsDeleteOpen(true);
};

return (
  <>
    {/* Table dengan action buttons */}
    <Table>
      {/* Columns dengan onClick handlers */}
    </Table>

    {/* Form Modal */}
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent>
        {isLoadingDetail ? (
          <LoadingSpinner />
        ) : (
          <FormComponent
            initialData={detailData?.data}
            isEditMode={!!selectedId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        )}
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation */}
    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      {/* Delete dialog */}
    </AlertDialog>
  </>
);
```

**Form Component:**

```tsx
export function FormComponent({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: FormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      /* empty */
    },
  });

  // ⚠️ IMPORTANT: Reset form ketika initialData berubah
  useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        field1: initialData.field1,
        field2: initialData.field2,
      });
    } else {
      form.reset({ field1: "", field2: "" });
    }
  }, [initialData, isEditMode, form]);

  const mutation = useMutation({
    mutationFn: (values) =>
      isEditMode && initialData
        ? service.update(initialData.id, values)
        : service.create(values),
    onSuccess: () => {
      toast.success(isEditMode ? "Updated" : "Created");
      onSuccess?.();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
        {/* Form fields */}
        <div className="flex gap-3 justify-end border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader />}
            {isEditMode ? "Perbarui" : "Tambah"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 6.3 Page Pattern (untuk complex form)

Lihat contoh di `animal/create` dan `animal/[id]` pages.

---

## 7. COLOR & STYLING

### Typography

- **Page Title:** `text-2xl font-bold tracking-tight`
- **Section Label:** `font-semibold`
- **Description:** `text-muted-foreground text-sm`
- **Table Text:** `text-foreground` (normal)

### Colors

- **Primary Button:** `bg-primary hover:bg-primary/80`
- **Success:** `bg-emerald-600 hover:bg-emerald-700`
- **Danger:** `bg-red-600 hover:bg-red-700`
- **Edit/Warning:** `text-amber-700 hover:bg-amber-50`
- **Disabled:** `disabled:opacity-50 cursor-not-allowed`

### Spacing

- **Container padding:** `p-6`
- **Section gap:** `space-y-6`
- **Row/item gap:** `gap-4`
- **Internal item gap:** `gap-2`
- **Border radius:** `rounded-md`

### Borders & Shadows

- **Card border:** `border border-border`
- **Card background:** `bg-card` (outer) atau `bg-background` (inner)
- **Shadow:** `shadow-sm`
- **Hover effect:** `hover:bg-muted/50`

---

## 8. RESPONSIVE DESIGN

### Breakpoints

Gunakan Tailwind standard breakpoints:

- `md:` → 768px (tablet)
- `lg:` → 1024px (desktop)
- `xl:` → 1280px (large desktop)

### Mobile-First Rules

1. **Default:** Mobile layout
2. **md:flex-row:** Desktop layout horizontal
3. **flex-wrap:** Untuk reflow items di mobile
4. **min-w-64:** Minimum width search bar
5. **flex-1:** Search bar fleksibel

### Example

```tsx
{/* Header - responsive */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  {/* ... */}
</div>

{/* Search & Action - responsive with wrap */}
<div className="flex items-center justify-between gap-4 flex-wrap">
  <div className="relative flex-1 min-w-64">
    <Input ... />
  </div>
  <Button>Action</Button>
</div>
```

---

## 🎯 CHECKLIST SEBELUM DEPLOY

Sebelum membuat halaman list/master-data baru, pastikan:

- [ ] Layout mengikuti struktur standard (breadcrumb → header → search → table)
- [ ] Header ada title + description
- [ ] Search bar responsive dengan `flex-1 min-w-64`
- [ ] Action button ada dan menggunakan `bg-primary`
- [ ] Permission check dengan `<Can>` component
- [ ] Loading state menggunakan Skeleton
- [ ] Empty state menggunakan icon + text
- [ ] Pagination ada dan berada di dalam table container
- [ ] Delete action ada confirmation dialog
- [ ] Edit action (modal atau page, konsisten dengan type form)
- [ ] Form reset initialData dengan useEffect
- [ ] Toast notification untuk success/error
- [ ] URL params untuk pagination dan search
- [ ] QueryClient invalidation setelah mutation
- [ ] isLoading prop di semua queries
- [ ] Error handling di semua mutations
- [ ] Responsive design tested di mobile

---

## 📞 TROUBLESHOOTING

### Form initialData tidak terisi saat edit?

✅ **Solusi:** Tambahkan `useEffect` di form component untuk reset form:

```tsx
useEffect(() => {
  if (initialData && isEditMode) {
    form.reset({ field1: initialData.field1, ... });
  }
}, [initialData, isEditMode, form]);
```

### Search tidak trigger?

✅ **Solusi:** Pastikan ada `onKeyDown` atau `onBlur` handler:

```tsx
onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
onBlur={() => handleSearch(searchTerm)}
```

### Pagination tidak muncul?

✅ **Solusi:** Pastikan `meta` dari response ada, dan kondisional render:

```tsx
{meta && (
  <div className="p-4 border-t border-border">
    <PaginationControl ... />
  </div>
)}
```

### Loading skeleton tidak muncul?

✅ **Solusi:** Import Skeleton component:

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

### Form dropdown/select value tidak terpilih saat edit row berbeda?

**Masalah:** Edit row 1 → initial value terpilih ✅, Edit row 2 → initial value tidak terpilih ❌

**Root Cause:** **Query Cache Staling with Race Condition**

- React Query cache masih menyimpan data lama (stale)
- Form reset dipicu sebelum Select options sepenuhnya tersedia
- Race condition antara dependency options dan form render

✅ **Solusi:** Set aggressive cache invalidation pada query yang menyediakan options:

```tsx
// ❌ SEBELUM (Masalah: data di-cache)
const { data: unitAreasData } = useQuery({
  queryKey: ["unit-areas-all"],
  queryFn: () => unitAreaService.getList({ ... }),
  enabled: isEditMode || true,
});

// ✅ SESUDAH (Fix: data selalu fresh)
const { data: unitAreasData, isLoading: isLoadingUnitAreas } = useQuery({
  queryKey: ["unit-areas-all"],
  queryFn: () => unitAreaService.getList({ ... }),
  staleTime: 0,  // Data selalu dianggap stale, di-refetch setiap mount
  gcTime: 0,     // Jangan cache setelah unmount (garbage collection time)
});

// Update useMemo juga dengan dependency baru
const unitAreas = useMemo(() => unitAreasData?.data || [], [unitAreasData]);

// Update form reset dependency
useEffect(() => {
  if (initialData && isEditMode) {
    form.reset({ ... });
  }
}, [initialData, isEditMode, form, unitAreas]); // ← Tambah unitAreas
```

**Additional Improvement:** Handle loading state di Select component:

```tsx
<Select
  value={field.value}
  onValueChange={field.onChange}
  disabled={isLoadingUnitAreas} // ← Disable saat fetching
>
  <FormControl>
    <SelectTrigger>
      <SelectValue
        placeholder={isLoadingUnitAreas ? "Memuat..." : "Pilih..."}
      />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    {unitAreas.length > 0 ? (
      unitAreas.map((unit) => (
        <SelectItem key={unit.id} value={unit.id}>
          {unit.name}
        </SelectItem>
      ))
    ) : (
      <div className="px-2 py-1.5 text-sm text-muted-foreground">
        Tidak ada opsi
      </div>
    )}
  </SelectContent>
</Select>
```

**Penjelasan:**

- `staleTime: 0` → Data dianggap stale, selalu di-refetch saat komponen di-mount
- `gcTime: 0` → Data tidak di-cache di memory setelah komponen unmount
- `isLoadingUnitAreas` di useEffect → Memaksa form reset ulang saat unitAreas berubah
- Disable Select saat loading → Prevent user interaksi sebelum options siap

---

## 📚 REFERENCE PAGES

Gunakan pages berikut sebagai reference:

- **Simple CRUD (Modal):** `/master-data/unit-area`
- **Complex List (Expandable):** `/dashboard/animal`
- **Complex Form (Page):** `/animal/create`, `/animal/[id]`

---

**Last Updated:** January 17, 2026  
**Version:** 1.0
