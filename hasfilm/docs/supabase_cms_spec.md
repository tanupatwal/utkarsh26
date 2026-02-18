# Utkarsh CMS — Supabase Spec Document

> Reference for building an internal admin dashboard to manage events, team members, and highlights.

---

## 1. Supabase Project

| Key | Value |
|---|---|
| **Project name** | Utkarsh2026 |
| **Project ID** | `hmuarkonwsdofpumqqqp` |
| **Region** | `ap-northeast-1` (Tokyo) |
| **API URL** | `https://hmuarkonwsdofpumqqqp.supabase.co` |
| **Anon key** | `eyJhbG...XGNc` (in `.env.local`) |
| **Dashboard** | [Table Editor](https://supabase.com/dashboard/project/hmuarkonwsdofpumqqqp/editor) |

---

## 2. Database Schema

### 2.1 `events` — 60 rows

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `UUID` (PK) | No | `gen_random_uuid()` | Auto-generated |
| `day_id` | `INTEGER` | No | — | `1`, `2`, or `3` |
| `time` | `TEXT` | No | — | 24hr format `"08:00"` |
| `end_time` | `TEXT` | Yes | — | `"09:00"` or `NULL` |
| `title` | `TEXT` | No | — | Event name |
| `venue` | `TEXT` | No | — | Location name |
| `description` | `TEXT` | Yes | — | Short event blurb |
| `category` | `TEXT` | Yes | — | One of: `tech`, `cultural`, `sports`, `ceremony`, `music` |
| `image_url` | `TEXT` | Yes | — | Currently `/assets/eventimg/img1.webp` — will be R2 URL later |
| `prize_pool` | `TEXT` | Yes | — | e.g. `"₹75,000"` or `NULL` |
| `team_size` | `TEXT` | Yes | — | e.g. `"2-4 Members"` or `NULL` |
| `registration_link` | `TEXT` | Yes | — | External registration URL (currently all `NULL`) |
| `sort_order` | `INTEGER` | No | `0` | For manual ordering within a day |
| `created_at` | `TIMESTAMPTZ` | No | `now()` | Auto-set |

**Category constraint:** `CHECK (category IN ('tech', 'cultural', 'sports', 'ceremony', 'music'))`
**Index:** `idx_events_day_id` on `(day_id, sort_order)`

#### Category → Accent Color Map (client-side)

```json
{
  "tech": "#38BDF8",
  "cultural": "#A78BFA",
  "sports": "#34D399",
  "ceremony": "#FBBF24",
  "music": "#F472B6"
}
```

#### Day IDs

| `day_id` | Label | Date |
|---|---|---|
| 1 | DAY 01 | Feb 25 |
| 2 | DAY 02 | Feb 26 |
| 3 | DAY 03 | Feb 27 |

> [!NOTE]
> Day labels/dates are currently hardcoded in `SCHEDULE_DAYS` and NOT stored in Supabase. If you want to make them editable, create a `schedule_days` table.

---

### 2.2 `team_members` — 24 rows

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `UUID` (PK) | No | `gen_random_uuid()` | Auto-generated |
| `name` | `TEXT` | No | — | Uppercase display name |
| `role` | `TEXT` | No | — | Position title |
| `image_url` | `TEXT` | No | — | Currently `/assets/team/gs.webp` |
| `sort_order` | `INTEGER` | No | `0` | Display order (1 = first) |
| `created_at` | `TIMESTAMPTZ` | No | `now()` | Auto-set |

**Index:** `idx_team_sort` on `(sort_order)`

---

### 2.3 `highlights` — 12 rows

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `UUID` (PK) | No | `gen_random_uuid()` | Auto-generated |
| `title` | `TEXT` | No | — | Highlight name |
| `description` | `TEXT` | Yes | — | Short caption |
| `image_url` | `TEXT` | No | — | Currently `/assets/highlights/1.webp` |
| `sort_order` | `INTEGER` | No | `0` | Display order |
| `created_at` | `TIMESTAMPTZ` | No | `now()` | Auto-set |

**Index:** `idx_highlights_sort` on `(sort_order)`

---

## 3. Row-Level Security (RLS)

All three tables have RLS enabled with a single policy each:

| Table | Policy | Action | Rule |
|---|---|---|---|
| `events` | "Allow public read" | `SELECT` | `USING (true)` |
| `team_members` | "Allow public read" | `SELECT` | `USING (true)` |
| `highlights` | "Allow public read" | `SELECT` | `USING (true)` |

> [!IMPORTANT]
> There are **no INSERT/UPDATE/DELETE policies** for the `anon` role. Writes are only possible via the Supabase dashboard (service role) or by adding authenticated policies for the admin dashboard.

### For the Admin Dashboard

You'll need to add policies for authenticated admin users:

```sql
-- Example: Allow authenticated users to manage data
CREATE POLICY "Admin full access" ON public.events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access" ON public.team_members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access" ON public.highlights
    FOR ALL USING (auth.role() = 'authenticated');
```

---

## 4. Client Architecture

### 4.1 Environment Variables

File: `.env.local`

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://hmuarkonwsdofpumqqqp.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | The anon JWT key |

### 4.2 Supabase Client

File: [supabaseClient.ts](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/lib/supabaseClient.ts)

- Singleton `createClient()` call
- Exports `null` if env vars are missing (graceful fallback)

### 4.3 Data Hooks

File: [useSupabaseData.ts](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/hooks/useSupabaseData.ts)

| Hook | Query Key | Supabase Table | Order By | Fallback Data |
|---|---|---|---|---|
| `useEvents()` | `['events']` | `events` | `day_id` ASC, `time` ASC | `SCHEDULE_EVENTS` |
| `useTeamMembers()` | `['team_members']` | `team_members` | `sort_order` ASC | `TEAM_MEMBERS` |
| `useHighlights()` | `['highlights']` | `highlights` | `sort_order` ASC | `HIGHLIGHTS_CONTENT` |

**Each hook returns:**

```typescript
{
  data,           // The array (from Supabase or fallback)
  isLoading,      // true while fetching
  error,          // Error object or null
  ref,            // IntersectionObserver ref (attach to container)
  isFromSupabase, // true if data came from Supabase
}
```

**Caching:** TanStack React Query with 5-minute stale time, no refetch on window focus.
**Lazy loading:** Data only fetches when the section is within 300px of the viewport (via `react-intersection-observer`).

### 4.4 Type Mapping (Supabase → Client)

| Supabase Column | Client Property | Transformation |
|---|---|---|
| `day_id` | `dayId` | direct |
| `end_time` | `endTime` | `null` → `undefined` |
| `image_url` | `image` (events) / `url` (highlights) | rename |
| `prize_pool` | `prizePool` | `null` → `undefined` |
| `team_size` | `teamSize` | `null` → `undefined` |
| `registration_link` | `registrationLink` | `null` → `undefined` |
| `sort_order` | *(not mapped, used for ordering)* | — |

---

## 5. Component Wiring Map

| Component | Hook | Lazy Ref | Used Data |
|---|---|---|---|
| `ScheduleSection.tsx` | `useEvents()` | ✅ merged with `containerRef` | `events`, `days` |
| `TeamSection.tsx` | `useTeamMembers()` | ✅ merged with root div | `members` |
| `MobileTeamSection.tsx` | `useTeamMembers()` | — (parent handles) | `members` |
| `HighlightsSection.tsx` | `useHighlights()` | ✅ merged with `containerRef` | `highlights` |
| `MobileHighlightsSection.tsx` | `useHighlights()` | — (parent handles) | `highlights` |

---

## 6. Image Strategy

### Current State
- Images served from `public/assets/` (Cloudflare Pages static)
- `image_url` values are relative paths: `/assets/team/gs.webp`

### Future: Cloudflare R2 Migration

```sql
-- One-time batch update when R2 is ready
UPDATE events SET image_url = REPLACE(image_url, '/assets/', 'https://media.utkarsh.in/');
UPDATE team_members SET image_url = REPLACE(image_url, '/assets/', 'https://media.utkarsh.in/');
UPDATE highlights SET image_url = REPLACE(image_url, '/assets/', 'https://media.utkarsh.in/');
```

**R2 bucket structure** should mirror local:
```
media.utkarsh.in/
├── eventimg/img1.webp … img9.webp
├── team/gs.webp, tech1.webp, …
├── team-bg/bg1.webp … bg10.webp
└── highlights/1.webp … 12.webp
```

---

## 7. Admin Dashboard Requirements

### 7.1 Auth
- Use Supabase Auth (email/password or magic link)
- Add RLS policies for `authenticated` role (see Section 3)
- Protect dashboard routes with session check

### 7.2 CRUD Operations per Table

#### Events Dashboard
| Action | Fields | Notes |
|---|---|---|
| **List** | All, filterable by `day_id` and `category` | Sorted by `day_id`, `sort_order` |
| **Create** | All except `id`, `created_at` | `sort_order` auto-increment suggestion |
| **Edit** | All except `id`, `created_at` | Inline or modal |
| **Delete** | By `id` | Confirm dialog |
| **Reorder** | Drag-drop `sort_order` | Batch `UPDATE` |
| **Bulk import** | CSV upload | Map columns to schema |

#### Team Members Dashboard
| Action | Fields |
|---|---|
| **List** | `name`, `role`, `image_url`, `sort_order` |
| **Create/Edit** | `name`, `role`, `image_url`, `sort_order` |
| **Delete** | By `id` |
| **Reorder** | Drag-drop `sort_order` |

#### Highlights Dashboard
| Action | Fields |
|---|---|
| **List** | `title`, `description`, `image_url`, `sort_order` |
| **Create/Edit** | All editable fields |
| **Delete** | By `id` |
| **Reorder** | Drag-drop `sort_order` |

### 7.3 Image Upload (future)
- Upload to Cloudflare R2 via presigned URL or API
- Auto-populate `image_url` with the R2 public URL
- Show image preview in the form

### 7.4 Suggested Tech Stack for Dashboard
- **Framework:** Next.js or Vite + React
- **Supabase client:** `@supabase/supabase-js` (same as frontend)
- **UI library:** shadcn/ui or Radix for polished admin components
- **Auth:** `@supabase/auth-helpers-nextjs`
- **Drag-drop:** `@dnd-kit/core` for reordering

---

## 8. Useful Queries

```sql
-- Get all events for Day 1, ordered
SELECT * FROM events WHERE day_id = 1 ORDER BY sort_order;

-- Count events per day
SELECT day_id, count(*) FROM events GROUP BY day_id ORDER BY day_id;

-- Find events with prize pools
SELECT title, prize_pool FROM events WHERE prize_pool IS NOT NULL;

-- Find events missing registration links
SELECT title, day_id FROM events WHERE registration_link IS NULL ORDER BY day_id;

-- Batch update registration links
UPDATE events SET registration_link = 'https://forms.google.com/...' WHERE title = 'Hackathon Kickoff';
```
