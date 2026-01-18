# 📋 PROMPT GUIDE: Cara Meminta Feature Baru dengan Consistency Terjamin

## Panduan untuk User agar AI langsung refer ke UI/UX Standards

---

## 🎯 THE PROBLEM

Saat membuat halaman baru, jika tidak ada konteks yang jelas tentang consistency standards, AI bisa:

- ❌ Generate UI baru dengan design yang berbeda
- ❌ Menggunakan styling yang tidak konsisten
- ❌ Implement pattern yang tidak sesuai dengan existing code
- ❌ Lupa permission checks, form resets, query invalidation, dll

## ✅ THE SOLUTION

**Selalu include dokumentasi reference di prompt Anda!**

---

## 📦 STEP 1: SIAPKAN INI SEBELUM MEMBERI PROMPT

### A. Dokumentasi yang HARUS Anda Referensikan

Sebelum memberi prompt, siapkan referensi ini:

```markdown
# CRITICAL REFERENCES (Copy-paste ke prompt):

1. **UI/UX Standard:** docs/QUICK_REFERENCE.md
2. **Implementation Guide:** docs/UI_UX_CONSISTENCY_GUIDELINE.md
3. **Code Template:** docs/TEMPLATE_LIST_PAGE.md
4. **Example Pages:**
   - /dashboard/animal (complex list)
   - /master-data/unit-area (simple CRUD)
```

### B. Informasi Feature yang Jelas

```markdown
# Feature Information:

Resource Name: [nama_resource]
Resource Type: [list/detail/form]
API Endpoint: [endpoint_backend]
Fields: [field1, field2, field3, ...]
Actions: [create, read, update, delete, or custom]
Permission Roles: [list of roles]
```

### C. Referensi Code yang Relevant

```markdown
# Code References:

Reference Page: /master-data/unit-area (jika CRUD simple)
Reference Page: /dashboard/animal (jika list complex)

Service File: src/services/unit-area.service.ts
Form File: src/app/(master-data)/master-data/unit-area/\_components/unit-area-form.tsx
Page File: src/app/(master-data)/master-data/unit-area/page.tsx
```

---

## 📝 STEP 2: TEMPLATE PROMPT YANG OPTIMAL

Gunakan template berikut saat memberikan prompt ke AI:

```markdown
# REQUEST: [Create/Update] [Resource Name] Page

## CONTEXT & REQUIREMENTS

**Resource Information:**

- Name: [Resource Name]
- Type: [List/Detail/Form]
- API Base: [api-endpoint]
- Fields:
  - field1: [type & description]
  - field2: [type & description]
  - field3: [type & description]
- Actions Needed: [create, read, update, delete, or custom]
- Permission: Required roles = [ROLE_CODES.xxx, ROLE_CODES.yyy]

**API Endpoints:**

- List: GET /[endpoint]/all?page&keyword&page_size
- Detail: GET /[endpoint]/{id}
- Create: POST /[endpoint]
- Update: PUT /[endpoint]/{id}
- Delete: DELETE /[endpoint]/{id}

## CONSISTENCY REQUIREMENTS

**⚠️ CRITICAL: Use these exact references:**

1. **MUST FOLLOW:** docs/QUICK_REFERENCE.md
   - Section: [PAGE LAYOUT STRUCTURE, STYLING CHEATSHEET, etc]
   - Key Rule: [describe specific rule]

2. **MUST USE TEMPLATE:** docs/TEMPLATE_LIST_PAGE.md
   - Copy from: [service/schema/columns/form/page]
   - Adapt for: [resource name]

3. **MUST MATCH:** docs/UI_UX_CONSISTENCY_GUIDELINE.md
   - Section: [Loading State, Empty State, Search Bar, etc]

4. **REFERENCE CODE:**
   - Simple CRUD example: /master-data/unit-area
   - Complex List example: /dashboard/animal
   - [Specific code pattern to follow]

## SPECIFIC REQUIREMENTS

- [ ] Layout: Breadcrumb → Header → Search → Table → Pagination (EXACT ORDER)
- [ ] Loading state: Skeleton rows ONLY (not text)
- [ ] Empty state: Icon + descriptive text ONLY
- [ ] Gap: gap-4 ALWAYS
- [ ] Search: flex-1 min-w-64 + flex-wrap
- [ ] Permission: <Can> wrapper REQUIRED
- [ ] Form: useEffect reset initialData CRITICAL
- [ ] Toast: All mutations (create/update/delete)
- [ ] Query: Invalidate after mutation
- [ ] Responsive: Mobile tested

## WHAT NOT TO DO

❌ Don't create new UI design
❌ Don't invent new styling patterns
❌ Don't skip permission checks
❌ Don't forget form resets
❌ Don't add visual variations
❌ Don't use different spacing values

## DELIVERABLES

I need:

1. Service file (unit-area.service.ts pattern)
2. Schema file (Zod validation)
3. Columns file (TanStack table)
4. Form component (with useEffect reset)
5. Page component (complete list page)

All following EXACT patterns from docs/QUICK_REFERENCE.md + docs/TEMPLATE_LIST_PAGE.md

## OPTIONAL: FILES TO CREATE

**Directory Structure:**
```

src/app/(master-data)/master-data/[resource-name]/
├── \_components/
│ ├── columns.tsx
│ └── [resource-name]-form.tsx
└── page.tsx

src/services/[resource-name].service.ts
src/types/schemas/[resource-name].schema.ts

```

---

**IMPORTANT:** Do NOT deviate from the referenced documentation.
If unsure about styling or pattern, ALWAYS reference docs/QUICK_REFERENCE.md first.
```

---

## 🎯 STEP 3: CARA INCLUDE DOKUMENTASI DI PROMPT

### OPTION A: Explicit Reference (Recommended)

```markdown
# Build: User Management Page

Reference this EXACTLY:

- docs/QUICK_REFERENCE.md (entire document as guide)
- docs/TEMPLATE_LIST_PAGE.md (use Service + Schema + Columns + Form + Page sections)
- src/app/(master-data)/master-data/unit-area (copy this directory structure)
- src/services/unit-area.service.ts (follow this pattern exactly)

Resource: User
Fields: name, email, role, status
Actions: CRUD
Roles: SUPER_ADMIN, MANAGER

Requirements:

- [ ] Gap MUST be gap-4
- [ ] Loading MUST be Skeleton
- [ ] Empty MUST be Icon+Text
- [ ] Search MUST be flex-1 min-w-64
```

### OPTION B: Link Reference (When Already Provided)

```markdown
# Build: Location Page

Follow:
✅ docs/QUICK_REFERENCE.md
✅ docs/TEMPLATE_LIST_PAGE.md (Section: "5️⃣ MAIN PAGE COMPONENT")
✅ Reference: /master-data/unit-area

Resource: Location
Fields: name, description, capacity
Actions: CRUD + search
Permission: ADMIN, MANAGER

Don't create new design - use exact pattern from template!
```

### OPTION C: Minimum (When You're Sure I Know)

```markdown
# Build: Category Page (simple CRUD)

Template: docs/TEMPLATE_LIST_PAGE.md
Reference: /master-data/unit-area
Docs: docs/QUICK_REFERENCE.md

Resource: Category
Fields: name, code, description
Actions: CRUD

Keep consistency with unit-area pattern!
```

---

## 📋 CHECKLIST: SEBELUM MEMBERI PROMPT

Pastikan Anda sudah:

- [ ] Baca docs/QUICK_REFERENCE.md minimal 1x
- [ ] Baca docs/TEMPLATE_LIST_PAGE.md minimal 1x
- [ ] Lihat actual code di /master-data/unit-area atau /dashboard/animal
- [ ] Siapkan API endpoint information
- [ ] Siapkan field information
- [ ] Siapkan permission roles
- [ ] Jelas tentang CRUD actions needed
- [ ] **Include explicit references di prompt** ⚠️ CRITICAL

---

## 🎓 CONTOH PROMPT YANG BAIK

### ❌ BAD PROMPT (Will cause inconsistency)

```
Bikin halaman product management. Ada form untuk create/edit product.
Dengan tabel list, search, pagination. Styling yang bagus. Warna hijau.
```

**Problem:**

- Tidak ada reference
- "Styling yang bagus" terlalu vague
- "Warna hijau" akan buat inconsistent dengan color scheme
- Tidak jelas action apa yang diperlukan

### ✅ GOOD PROMPT (Will ensure consistency)

```markdown
# REQUEST: Create Product Management Page

Follow EXACTLY:

- docs/QUICK_REFERENCE.md (one-page cheatsheet)
- docs/TEMPLATE_LIST_PAGE.md (use all 5 file templates)
- Reference: /master-data/unit-area (same pattern)

**Resource Details:**

- Name: Product
- Type: Simple CRUD
- Fields:
  - name (string, required)
  - sku (string, required)
  - category (select, required)
  - price (number, required)
  - description (text)
  - status (select: active/inactive)
- Actions: Create, Read, Update, Delete, Search, Pagination
- Roles: ADMIN, MANAGER, STAFF

**API Endpoints:**

- GET /product/all?page&keyword&page_size
- GET /product/{id}
- POST /product
- PUT /product/{id}
- DELETE /product/{id}

**CRITICAL Requirements:**

- [ ] Gap MUST be gap-4 (QUICK_REFERENCE line: "gap-4 ALWAYS")
- [ ] Loading MUST use Skeleton (not text "Memuat...")
- [ ] Empty state MUST be Icon + descriptive text
- [ ] Search bar: flex-1 min-w-64 + flex-wrap
- [ ] Form: useEffect reset initialData (CRITICAL!)
- [ ] Permission: <Can> wrapper required
- [ ] Toast: All mutations (create/update/delete)
- [ ] Query: invalidateQueries after mutation
- [ ] Layout: Breadcrumb → Header → Search → Table → Pagination

**Do NOT:**

- ❌ Create new UI design
- ❌ Add new color scheme (use existing)
- ❌ Invent new spacing values (gap-4 only)
- ❌ Skip permission checks
- ❌ Forget form resets
- ❌ Use text loading state

**Files to Create:**

1. src/services/product.service.ts (from TEMPLATE)
2. src/types/schemas/product.schema.ts (from TEMPLATE)
3. src/app/(...)/product/\_components/columns.tsx (from TEMPLATE)
4. src/app/(...)/product/\_components/product-form.tsx (from TEMPLATE)
5. src/app/(...)/product/page.tsx (from TEMPLATE)

Expected output: Exact same pattern as /master-data/unit-area
```

**Why This Works:**

- ✅ Explicit references (QUICK_REFERENCE, TEMPLATE, actual code)
- ✅ Clear field & API information
- ✅ CRITICAL requirements explicitly listed
- ✅ What NOT to do clearly stated
- ✅ Expected pattern clearly defined

---

## 🔧 STEP 4: TIPS UNTUK PROMPT YANG LEBIH BAIK

### TIP 1: Copy-Paste dari Dokumentasi

```markdown
From docs/QUICK_REFERENCE.md - STYLING CHEATSHEET:

Container: className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm"
Header: className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
Search: className="flex items-center justify-between gap-4 flex-wrap"

FOLLOW THIS EXACTLY.
```

### TIP 2: Reference Specific Line Numbers

```markdown
From docs/TEMPLATE_LIST_PAGE.md:

Service Pattern:

- Lines 1-30: Import & Types
- Lines 32-50: getList() with pagination
- Lines 52-60: getById() for edit
- Lines 62-75: create() mutation
- Lines 77-85: update() mutation
- Lines 87-95: delete() mutation

Copy EXACT pattern for Product service.
```

### TIP 3: Specify Sections

```markdown
From docs/UI_UX_CONSISTENCY_GUIDELINE.md:

Section 4.1 - Loading State (Line X):
Use Skeleton rows pattern EXACTLY as shown.

Section 4.2 - Empty State (Line Y):
Use Icon (h-8 w-8) + text pattern EXACTLY as shown.

Section 3 - Search & Action Bar (Line Z):
Use flex-1 min-w-64 + gap-4 + flex-wrap EXACTLY as shown.
```

### TIP 4: Include Expected Output Example

```markdown
Expected Result Should Match Pattern:
/master-data/unit-area - Exact same:

- Layout structure
- Styling & spacing
- Component patterns
- State management
- Query patterns
- Form handling

NO visual differences.
NO styling variations.
NO new patterns.
```

---

## 📊 COMPARISON: DENGAN vs TANPA GOOD PROMPT

### SCENARIO 1: Prompt Buruk → Inconsistent Result

```markdown
# Prompt (Bad):

"Bikin halaman kategori. Ada create/edit dengan modal.
Styling bagus. Warna biru. Ada search dan pagination."

# Result (Inconsistent):

❌ Layout berbeda (custom arrangement)
❌ Color biru (tidak sesuai design system)
❌ Spacing gap-3 atau gap-5 (tidak gap-4)
❌ Loading state: spinners (bukan skeleton)
❌ Empty state: custom message (bukan icon+text)
❌ Form: tidak ada useEffect reset
❌ Search: fixed width (bukan flex-1)
❌ Missing permission checks
❌ Missing query invalidation

TIME SPENT: 2-3 jam refactor + fix
```

### SCENARIO 2: Prompt Baik → Consistent Result

```markdown
# Prompt (Good):

"Follow docs/QUICK_REFERENCE.md + docs/TEMPLATE_LIST_PAGE.md
Reference: /master-data/unit-area
Resource: Category
Fields: name, code, type, description
CRITICAL: Match EXACT pattern - no design variation"

# Result (Consistent):

✅ Layout exactly same (Breadcrumb → Header → Search → Table → Pagination)
✅ Colors from design system (primary, muted-foreground)
✅ Spacing gap-4 ALWAYS
✅ Loading state: skeleton rows
✅ Empty state: icon + text
✅ Form: useEffect reset included
✅ Search: flex-1 min-w-64
✅ Permission checks included
✅ Query invalidation included

TIME SPENT: 15-30 min implement + customize
```

---

## 🎯 BEST PRACTICE: THE "REFERENCE SANDWICH"

Gunakan struktur ini untuk setiap prompt:

```markdown
# BUILD: [Resource Name] Page

## REFERENCE (TOP)

- Follow: docs/QUICK_REFERENCE.md (CRITICAL)
- Template: docs/TEMPLATE_LIST_PAGE.md (use exact code)
- Example: /master-data/unit-area (same structure)

## DETAILS (MIDDLE)

- Resource: [name]
- Fields: [list]
- Actions: [create/read/update/delete]
- Permissions: [roles]

## CONSTRAINTS (BOTTOM)

- Layout: Exact same as unit-area
- Styling: Use only gap-4, bg-primary, text-muted-foreground
- Pattern: No variations
- Checklist: [checkbox list of requirements]

## EXPECTED RESULT

Output should be 100% consistent with /master-data/unit-area
```

---

## ⚠️ CRITICAL REMINDERS

1. **ALWAYS include references** - Don't assume I'll remember
2. **Be explicit about "EXACT PATTERN"** - Makes it clear no variations
3. **Use checklist format** - Easy to verify compliance
4. **Include what NOT to do** - Prevents creative interpretations
5. **Copy relevant sections** - Don't make me search documentation
6. **Specify reference code** - /master-data/unit-area, not "similar page"

---

## 🚀 WORKFLOW: STEP-BY-STEP

### Step 1: Prepare (5 min)

```
1. Read docs/QUICK_REFERENCE.md
2. Read docs/TEMPLATE_LIST_PAGE.md
3. Review /master-data/unit-area code
4. Gather resource information
```

### Step 2: Compose Prompt (5 min)

```
1. Use template from this document
2. Include explicit references
3. List fields & API endpoints
4. State critical requirements
5. Include checklist
```

### Step 3: Send Prompt (1 min)

```
1. Copy-paste structured prompt
2. Include documentation references
3. Specify reference code paths
4. Send to AI with clear expectations
```

### Step 4: Review Output (10 min)

```
1. Check against docs/QUICK_REFERENCE.md checklist
2. Compare with reference code
3. Verify consistency
4. Request adjustments if needed
```

**Total Time: 20-30 min** (includes review)
vs
**5+ hours** (if building from scratch without reference)

---

## 📝 TEMPLATE: COPY-PASTE THIS

Gunakan template di bawah ini untuk setiap feature baru:

```markdown
# REQUEST: Create [RESOURCE] Management Page

## 🔗 REFERENCES (DO NOT DEVIATE)

- Docs: docs/QUICK_REFERENCE.md
- Template: docs/TEMPLATE_LIST_PAGE.md
- Code Example: /master-data/unit-area
- Guideline: docs/UI_UX_CONSISTENCY_GUIDELINE.md

## 📋 RESOURCE INFORMATION

**Basic Info:**

- Resource Name: [name]
- Type: [List/Detail/CRUD]
- Feature: [what it does]

**Fields:**

- [field1]: [type] - [description]
- [field2]: [type] - [description]
- [field3]: [type] - [description]

**API Endpoints:**

- List: GET /[endpoint]/all?page&keyword&page_size
- Detail: GET /[endpoint]/{id}
- Create: POST /[endpoint]
- Update: PUT /[endpoint]/{id}
- Delete: DELETE /[endpoint]/{id}

**Permission:**

- Required Roles: [ROLE_CODES.xxx, ROLE_CODES.yyy]

## ✅ REQUIREMENTS (MANDATORY)

From docs/QUICK_REFERENCE.md:

- [ ] Layout: Breadcrumb → Header → Search → Table → Pagination (EXACT ORDER)
- [ ] Container: className="space-y-6 bg-card p-6 rounded-md..."
- [ ] Gap: gap-4 ALWAYS (not 2, 3, 5, etc)
- [ ] Loading: Skeleton rows ONLY
- [ ] Empty: Icon (h-8 w-8) + text ONLY
- [ ] Search: flex-1 min-w-64 + flex-wrap
- [ ] Button: bg-primary hover:bg-primary/80
- [ ] Permission: <Can roles={[...]}>
- [ ] Form: useEffect reset initialData
- [ ] Toast: All mutations (success/error)
- [ ] Query: invalidateQueries after mutation
- [ ] Pagination: Inside table, border-t, p-4

## 🚫 DO NOT

- ❌ Create new UI design
- ❌ Use different spacing (only gap-4)
- ❌ Skip permission checks
- ❌ Forget form resets
- ❌ Use text loading state
- ❌ Use plain text empty state
- ❌ Invent color scheme
- ❌ Add visual variations

## 📂 OUTPUT: Create These Files

1. `src/services/[resource].service.ts`
   - Pattern: docs/TEMPLATE_LIST_PAGE.md section "1️⃣ SERVICE FILE"

2. `src/types/schemas/[resource].schema.ts`
   - Pattern: docs/TEMPLATE_LIST_PAGE.md section "2️⃣ SCHEMA FILE"

3. `src/app/([folder])/[path]/_components/columns.tsx`
   - Pattern: docs/TEMPLATE_LIST_PAGE.md section "3️⃣ COLUMNS FILE"

4. `src/app/([folder])/[path]/_components/[resource]-form.tsx`
   - Pattern: docs/TEMPLATE_LIST_PAGE.md section "4️⃣ FORM COMPONENT"

5. `src/app/([folder])/[path]/page.tsx`
   - Pattern: docs/TEMPLATE_LIST_PAGE.md section "5️⃣ MAIN PAGE COMPONENT"

## 🎯 EXPECTED RESULT

Output should be:

- 100% consistent with /master-data/unit-area
- 100% match docs/QUICK_REFERENCE.md styles
- 100% follow docs/TEMPLATE_LIST_PAGE.md patterns
- Zero visual variations
- Zero code pattern deviations

## ⚠️ IMPORTANT

DO NOT PROCEED if unsure about any requirement.
ALWAYS refer to docs/QUICK_REFERENCE.md first.
If different from template, use template pattern.
```

---

## 🎉 KESIMPULAN

**Dengan mengikuti panduan ini, Anda bisa:**

✅ Memastikan saya selalu refer ke dokumentasi  
✅ Mencegah UI inconsistency  
✅ Menjaga code pattern consistency  
✅ Hemat waktu review & refactor  
✅ Maintain consistency untuk seluruh project

**Key: Be Explicit + Include References + State Constraints**

---

**Next Time You Ask For a Feature:**
Use the template above + explicit references = Guaranteed consistency! ✅

---

**Created:** January 17, 2026  
**Updated:** January 17, 2026  
**Status:** Ready to Use ✅
