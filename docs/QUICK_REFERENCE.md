# 🎨 QUICK REFERENCE: UI/UX Consistency Visual Guide

## One-Page Cheat Sheet

---

## 📐 PAGE LAYOUT STRUCTURE (WAJIB)

```
┌─────────────────────────────────────────────────────┐
│  BREADCRUMB                                         │
├─────────────────────────────────────────────────────┤
│  HEADER (Title + Description)                       │
├─────────────────────────────────────────────────────┤
│  SEARCH + ACTION BUTTON (flex-wrap, gap-4)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TABLE WRAPPER (border, rounded-md)                 │
│  ┌─────────────────────────────────────────────────┐
│  │ HEADERS (bg-muted/50)                           │
│  ├─────────────────────────────────────────────────┤
│  │ DATA ROWS (hover:bg-muted/50)                   │
│  │                                                 │
│  │ LOADING: 5 Skeleton rows                        │
│  │ EMPTY: Icon + Text centered                     │
│  └─────────────────────────────────────────────────┘
│  PAGINATION (border-t, p-4)                         │
├─────────────────────────────────────────────────────┤
│  MODALS/DIALOGS (Dialog, AlertDialog)              │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 STYLING CHEAT SHEET

### Container

```tsx
// Main wrapper
className = "space-y-6 bg-card p-6 rounded-md border border-border shadow-sm";

// Header
className =
  "flex flex-col md:flex-row justify-between items-start md:items-center gap-4";

// Search + Action bar
className = "flex items-center justify-between gap-4 flex-wrap";

// Search input wrapper
className = "relative flex-1 min-w-64";

// Table wrapper
className = "rounded-md border border-border bg-background overflow-hidden";

// Pagination wrapper (INSIDE TABLE)
className = "flex items-center justify-between gap-4 w-full";

// Pagination info text
className = "text-sm text-muted-foreground w-80";
```

### Text

```tsx
// Title
className = "text-2xl font-bold tracking-tight";

// Description
className = "text-muted-foreground text-sm";

// Secondary text
className = "text-muted-foreground";

// Semibold text (table header)
className = "font-semibold";
```

### Colors

```tsx
// Primary button
className = "bg-primary hover:bg-primary/80";

// Success button
className = "bg-emerald-600 hover:bg-emerald-700";

// Danger button
className = "bg-red-600 hover:bg-red-700";

// Edit button (amber/brown)
className = "text-amber-700 hover:text-amber-900 hover:bg-amber-50";

// Delete button (red)
className = "text-red-600 hover:text-red-700 hover:bg-red-50";

// Icon secondary
className = "text-muted-foreground/50";
```

### Icons

```tsx
// Search icon
<IconSearch className="h-4 w-4 text-muted-foreground" />
// Position: absolute left-2.5 top-2.5

// Empty state icon
<IconSearch className="h-8 w-8 text-muted-foreground/50" />

// Add button icon
<IconPlus className="mr-2 h-4 w-4" />

// Edit/Delete icon
<IconEdit size={16} />
<IconTrash size={16} />

// Loading spinner
<IconLoader className="animate-spin h-5 w-5" />
```

---

## 🔌 STATE COMPONENTS

### Loading State (CORRECT ✅)

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

### Empty State (CORRECT ✅)

```tsx
{tableData.length === 0 ? (
  <TableRow>
    <TableCell colSpan={cols.length} className="h-32 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <IconSearch className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-muted-foreground">Tidak ada data</p>
      </div>
    </TableCell>
  </TableRow>
) : ...}
```

### Pagination (CORRECT ✅)

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

**Layout:** `flex justify-between items-center gap-4 w-full`

---

## ✅ FORM REQUIREMENTS (CRITICAL)

### MUST HAVE:

```tsx
// 1. useEffect untuk reset initialData
useEffect(() => {
  if (initialData && isEditMode) {
    form.reset({ field1: initialData.field1, ... });
  }
}, [initialData, isEditMode, form]);

// 2. Permission check
<Can roles={[ROLE_CODES.SUPER_ADMIN, ...]}>
  <Button>Tambah</Button>
</Can>

// 3. Query invalidation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["resources"] });
}

// 4. Toast notifications
onSuccess: () => toast.success("Data berhasil disimpan")
onError: (err) => toast.error(err.message)

// 5. Delete confirmation
<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
  {/* Confirmation dialog */}
</AlertDialog>

// 6. Loading state di button
<Button disabled={mutation.isPending}>
  {mutation.isPending && <IconLoader2 className="animate-spin mr-2" />}
  Submit
</Button>
```

---

## 🚫 DON'T DO THIS ❌

| ❌ WRONG                    | ✅ CORRECT                   |
| --------------------------- | ---------------------------- |
| `gap-2`, `gap-3`, `gap-5`   | `gap-4` ALWAYS               |
| `w-100` (fixed width)       | `flex-1 min-w-64`            |
| No `flex-wrap`              | `flex-wrap` for mobile       |
| Text "Memuat data..."       | Skeleton rows                |
| Plain text empty            | Icon + descriptive text      |
| No permission check         | `<Can>` wrapper REQUIRED     |
| No toast notification       | Toast for every action       |
| Forgot useEffect reset form | `useEffect` for form reset   |
| `text-gray-500`             | `text-muted-foreground`      |
| `bg-gray-100`               | `bg-background` or `bg-card` |
| Multiple gaps inconsistent  | Standardized gap-4           |
| Forgot invalidate query     | Invalidate after mutation    |
| Form onBlur only            | onKeyDown + onBlur both      |

---

## 📋 FORM FIELDS (Standard)

```tsx
// Input text
<FormInput
  control={form.control}
  name="field_name"
  label="Label"
  placeholder="Placeholder..."
  required
/>

// Textarea
<FormTextarea
  control={form.control}
  name="field_name"
  label="Label"
  placeholder="Placeholder..."
  required
  rows={4}
/>

// Select
<FormSelect
  control={form.control}
  name="field_name"
  label="Label"
  options={options}
  labelKey="label_field"
  required
/>
```

---

## 🔄 QUERY PATTERNS

### List Query (dengan pagination & search)

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["resources", { page, keyword, limit }],
  queryFn: () => resourceService.getList({ page, limit, keyword }),
});

const tableData = data?.data || [];
const meta = data?.meta;
```

### Detail Query (untuk edit)

```tsx
const { data: detailData, isLoading: isLoadingDetail } = useQuery({
  queryKey: ["resource", selectedId],
  queryFn: () => resourceService.getById(selectedId!),
  enabled: !!selectedId, // Auto-fetch saat selectedId set
});
```

### Mutation (create/update/delete)

```tsx
const mutation = useMutation({
  mutationFn: (data) => resourceService.create(data),
  onSuccess: () => {
    toast.success("Success message");
    queryClient.invalidateQueries({ queryKey: ["resources"] });
    // Close form/dialog
  },
  onError: (err) => toast.error(err.message),
});
```

---

## 🧩 MODAL/DIALOG PATTERN

```tsx
// Form Dialog
<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>
        {selectedId ? "Edit" : "Tambah"} Resource
      </DialogTitle>
    </DialogHeader>

    {isLoadingDetail ? (
      <LoadingSpinner />
    ) : (
      <ResourceForm
        initialData={detailData?.data}
        isEditMode={!!selectedId}
        onSuccess={handleFormSuccess}
        onCancel={handleFormClose}
      />
    )}
  </DialogContent>
</Dialog>

// Delete Confirmation
<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Hapus Resource?</AlertDialogTitle>
      <AlertDialogDescription>
        Apakah yakin hapus "<strong>{selectedName}</strong>"?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <div className="flex gap-3 justify-end">
      <AlertDialogCancel>Batal</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-red-600"
      >
        Hapus
      </AlertDialogAction>
    </div>
  </AlertDialogContent>
</AlertDialog>
```

---

## 🎯 BEFORE YOU DEPLOY - CHECKLIST

- [ ] Loading state pakai Skeleton?
- [ ] Empty state pakai Icon + Text?
- [ ] Search bar responsive (`flex-1 min-w-64`)?
- [ ] Gap konsisten `gap-4`?
- [ ] Permission check ada?
- [ ] Form reset initialData ada (useEffect)?
- [ ] Toast notification semua action?
- [ ] Delete confirmation dialog?
- [ ] QueryClient invalidation?
- [ ] isLoading prop passed correctly?
- [ ] Breadcrumb ada?
- [ ] Header title + description?
- [ ] Pagination inside table?
- [ ] Responsive tested di mobile?
- [ ] URL params working (page & keyword)?

---

## 📞 REFERENCE PAGES

**Lihat actual code di:**

- ✅ `/dashboard/animal` (complex list)
- ✅ `/master-data/unit-area` (simple CRUD)
- ✅ `/master-data/zone-area` (CRUD with dependency/dropdown)

**Gunakan sebagai template untuk halaman baru!**

---

## 🔧 COMMON ISSUES & SOLUTIONS

### Form Dropdown Value Tidak Terpilih Saat Edit Row Berbeda

**Gejala:**

- Edit row 1 → dropdown value terpilih ✅
- Edit row 2 → dropdown value TIDAK terpilih ❌
- Terjadi pada form dengan field dropdown/select yang ambil data dari API

**Masalah:** 🔴 **Query Cache Staling with Race Condition**

```
Masalahnya:
1. React Query cache data dropdown (stale)
2. Form reset dipicu sebelum Select options render
3. Race condition antara options loading dan form populate
```

**Solusi:** 🟢 **Aggressive Cache Invalidation dengan StaleTime Zero**

```tsx
// Pada form component yang punya dropdown
const { data: optionsData, isLoading: isLoadingOptions } = useQuery({
  queryKey: ["dropdown-options"],
  queryFn: () => optionService.getList({ limit: 100 }),
  staleTime: 0, // ← CRITICAL: Selalu refetch, jangan cache
  gcTime: 0, // ← Jangan cache setelah unmount
});

// Wrap data dengan useMemo
const options = useMemo(() => optionsData?.data || [], [optionsData]);

// Tambahkan options ke useEffect dependency
useEffect(() => {
  if (initialData && isEditMode) {
    form.reset({
      dropdown_field: initialData.dropdown_field_id,
      // ... other fields
    });
  }
}, [initialData, isEditMode, form, options]); // ← Tambah options!

// Handle loading di Select
<Select
  value={field.value}
  onValueChange={field.onChange}
  disabled={isLoadingOptions}
>
  <SelectTrigger>
    <SelectValue placeholder={isLoadingOptions ? "Memuat..." : "Pilih..."} />
  </SelectTrigger>
  {/* ... options */}
</Select>;
```

**Penjelasan Teknis:**
| Parameter | Efek | Gunanya |
|-----------|------|---------|
| `staleTime: 0` | Data selalu dianggap usang | Dipaksa refetch setiap mount |
| `gcTime: 0` | Jangan simpan cache di memory | Data fresh setiap kali dibuka |
| `options` di useEffect dependency | Force re-run form reset | Sinkronisasi form dengan data terbaru |
| `disabled={isLoadingOptions}` | Disable select saat fetch | Prevent user click sebelum options siap |

**Reference Implementasi:** Lihat `/master-data/zone-area` (form component dengan field `unit_id` dropdown)

---

**Last Updated:** January 18, 2026 ✨
