# Pintail Experience — Software Build Plan

*Build target: live for the 16 attendees by mid-November, fully polished for the December 30 trip. ~7 months. Built in Next.js + Supabase + Vercel + Claude Code by Isaac.*

---

## The Vision in One Paragraph

The Pintail platform is a private, branded experience portal that each attendee carries in their pocket from the day they're confirmed until long after the trip ends. Before the trip it builds anticipation — a daily pre-trip devotional, teaser content, the room assignment, the packing list, a face-and-bio of every other man who'll be there. During the trip it's the run-of-show in their hand — schedule, locations, the curriculum text, photos appearing in real time as the photographer shoots. After the trip it becomes their archive — every teaching session as audio and text, every photo, the group portrait, the blessing. **The trip lasts 3 days. The portal makes it last forever.** That's the wow factor. And it's the entire marketing engine for trip #2 — every attendee has a beautifully designed brand experience on their home screen for the rest of their lives.

---

## Why This Wins

- **No competitor has anything like it.** Pine Hill emails PDFs. Wild at Heart sends physical workbooks. The Christian outdoor ministries don't even have decent websites. The first faith-hunting brand with a real platform owns the category.
- **The lift is one-time, the value is forever.** Trip #2 plugs in. Trip #20 plugs in. The curriculum library compounds with every trip the father-in-law teaches.
- **It's the cheapest marketing in the business.** A father shows the photo gallery to a friend at church on Jan 5. The friend opens the app, sees the blessing video, reads the founder's bio, and books trip #2.
- **It's a real moat.** Soulcycle, Equinox, REI Adventures — all built proprietary apps that became core to brand identity. The app *is* the brand experience above a certain price point.

---

## The Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | **Next.js 15 (App Router) + React + TypeScript** | Your existing stack, fastest path |
| Styling | **Tailwind CSS + shadcn/ui** | Premium-feeling out of the box, fully customizable |
| Database + Auth | **Supabase (Postgres + Auth + Storage + Realtime)** | Multi-role auth (attendee/founder/vendor/admin) via RLS, file storage for photos, real-time photo drops day-of |
| Hosting | **Vercel** | Same as CSG Core, auto-deploys from GitHub |
| Email | **Resend** | Transactional email + the daily devotional drip, $20/mo, beautiful React Email templates |
| Video | **Mux** | The brand film, teaching session videos. Streams beautifully on mobile, ~$0.005/min stored, free tier covers v1 |
| Photos | **Supabase Storage + Cloudflare R2** for cheap cold storage if it grows | $0–$25/mo |
| Notifications | **Web Push (built into PWA)** | "Head to the lodge in 15" without an app store |
| PWA | **next-pwa** or Next.js native PWA config | Client portal "installs" to attendees' home screens — feels native, no App Store friction |
| Form / waiver e-sign | **Custom signature pad + Supabase storage** | Don't pay DocuSign $40/mo for a waiver — sign with a finger, save the PNG + timestamp + IP |
| Payments (optional v1) | **Stripe** | For deposits/final payments. If you're already on WeTravel, skip — link out |
| Analytics | **PostHog (free tier)** | See which devotionals get opened, which curriculum gets re-listened |

**Total ongoing infra cost:** ~$25–$75/month for v1, scaling slowly as content storage grows.

## Two Surfaces, One Codebase

The platform has two distinct surfaces, deliberately designed for different devices, different users, and different jobs. Both ship from the same Next.js codebase under route groups, sharing the database, auth, and brand system — but the layouts, navigation, and design priorities diverge sharply.

### `/(client)` — The Attendee Portal (Mobile-First, App-Like)

- **Primary device:** phone. The attendee lives in this on their iPhone or Android while on the road, in the duck blind, around the fire pit.
- **Design baseline:** 375px viewport. Build for phone first; tablet and desktop are "scaled up beautifully" but never the primary lens.
- **Navigation pattern:** persistent **bottom tab bar** (Home / Schedule / Curriculum / Photos / More) — thumb-zone reachable, matches native app conventions attendees already know from Instagram, Strava, AllTrails.
- **Touch targets:** ≥44px (Apple HIG) / 48dp (Material) for every tap zone. No hover states are load-bearing.
- **PWA-first behavior:** installable from a first-visit prompt, splash screen with the Pintail crest, app icon polished, standalone display mode (no browser chrome once installed), offline support for already-viewed content (cached curriculum text, devotional audio, previously-loaded photos).
- **Real-time signals:** push notifications for the four moments that matter — new devotional, announcement, photo drop during the trip, "next thing on the schedule." Nothing else.
- **Gestures:** swipe between days on the schedule; swipe through the photo gallery; pull-to-refresh on Home.
- **Performance budget:** First Contentful Paint <1.5s on a 4G phone, Time to Interactive <3s. Mux + Cloudflare image transforms do the heavy lifting.
- **Future-proofing for an app store:** the PWA covers 95% of "feels like an app." If you ever want to publish to the App Store (year 2+), the cleanest path is **Capacitor** — it wraps the existing Next.js client portal into an iOS/Android app shell in a few days, reuses the same code, and publishes from the same build pipeline. Don't do this for v1, but design the client routes so this is a 1-week project later, not a 6-week rewrite.

### `/(admin)` — The Founder + Father-in-Law Control Room (Responsive, Desktop-Primary)

- **Primary device:** laptop. Power tasks happen at a desk — drag-and-drop schedule editing, markdown authoring, bulk photo upload, roster review, schedule-and-email coordination.
- **Secondary device:** phone. The founder needs to do *quick* things on his phone — check who's paid, send a one-line announcement, view dietary restrictions while at the lodge with the chef, mark a waiver received. Phone use is *light-weight ops*, not deep authoring.
- **Design baseline:** 1280px viewport for the primary case. Tablet/phone scaling is "all functionality available, optimized layout."
- **Navigation pattern:** persistent **left sidebar** on desktop (Trips / Roster / Schedule / Curriculum / Content / Vendors / Inquiries / Settings); collapses to a hamburger + bottom tab strip on mobile with just the 4 highest-frequency tasks.
- **Tables and data density:** desktop admin can show 30 rows at a glance with sorting and filtering. Mobile admin shows a card list with the same data prioritized for skimming.
- **Authoring views (curriculum, devotionals, schedule editing):** **desktop-only** in v1. Mobile users see a read-only "view the draft" mode with a "edit on desktop" hint. Mobile authoring is a year-2 problem — not worth the complexity for v1, and the father-in-law will draft on a laptop anyway.
- **Quick actions on mobile admin:** check roster, view payment status, send broadcast, mark items done, view incoming inquiries, view dietary/waiver flags. Five jobs the founder might do from a phone, all polished. Everything else punts to desktop.

### Why this split matters

Trying to build one app that does both well is the most common mistake in this category. The client portal needs to feel like Strava — light, beautiful, fast, thumb-driven. The admin needs to feel like Linear or Notion — dense, productive, keyboard-friendly. Different design languages, different navigation, different priorities. Sharing the codebase (auth, schema, design tokens, brand) is correct. Sharing the layouts is wrong. Two route groups, two layouts, two navigation patterns. Same database, same brand.

---

## The MVP for Dec 30

Three things the platform must do by Dec 30, in priority order:

**1. The Attendee Experience (the wow)**
- Branded landing + onboarding (claim account, fill profile, sizes, dietary, prayer request, intro bio)
- Trip Home — countdown, schedule, location, lodge info, who else is coming
- Pre-Trip Devotional Drip — 30 days out, one per day, each one short (3-min read or 5-min audio)
- Curriculum Library — the three teaching sessions live here, available as text + audio
- Photo Gallery — empty before, populated live during, archived forever after
- Vendor Profiles — the lodge, the dog handlers, photographer, the father-in-law's teaching pillar, Pintail Goods
- Final Logistics — packing list, travel info, what to expect day-by-day
- PWA installable from the landing page

**2. The Founder Admin (the control room)**
- Attendee roster with all profile data, payment status, waiver status, special notes
- Schedule editor (drag-and-drop blocks, set visibility)
- Curriculum editor (markdown + audio upload + scripture refs)
- Announcement broadcaster (push notification + email)
- Photo uploader (drag a folder, photos appear in the gallery)
- Vendor manager
- Simple finance view (per-attendee revenue, pass-through costs, margin — pulled from the spreadsheet you build in the Action Plan)

**3. The Marketing Front Door (the engine for trip #2)**
- Public landing page with brand film, founder + father-in-law bios, vision, FAQ
- "Inquire about future trips" form → email + saved lead
- Future trip listings (set up trip #2 placeholder for Q1 2027 — date TBD)
- Public photo gallery (curated, attendees can opt in) — this is what the friend sees in January when an attendee forwards the link

That's it. Everything else is post-MVP.

---

## The Data Model (v1)

Clean Postgres schema, RLS-enforced. Keep it simple — don't over-normalize.

```
users
  id, email, role (attendee | founder | father_in_law | vendor | admin)
  full_name, phone, avatar_url, bio, intro_note
  created_at, last_active_at

trips
  id, slug ("december-2026"), name, start_date, end_date
  location, lodge_id (FK → vendors), description
  hero_image_url, brand_film_mux_id
  status (draft | live | past)

trip_attendees
  trip_id, user_id (composite PK)
  shirt_size, jacket_size, hat_size, glove_size, boot_size
  dietary_notes, room_preference, room_assignment
  payment_status, deposit_paid_at, balance_paid_at
  waiver_signed_at, waiver_image_url
  prayer_request
  arrival_info, departure_info

schedule_items
  id, trip_id, day_number, start_time, end_time
  title, description, location
  category (hunt | meal | teaching | rest | travel | special)
  visible_to_attendees (bool)

curriculum_sessions
  id, trip_id, session_number (1-3)
  title, scripture_reference
  written_content (markdown), audio_mux_id, video_mux_id
  discussion_questions (jsonb), published_at

devotionals
  id, trip_id, day_offset (-30 to +3)
  title, scripture, written_content, audio_mux_id
  scheduled_for (datetime)

announcements
  id, trip_id, created_by (FK users)
  title, body, channel (in_app | push | email | all)
  sent_at

photos
  id, trip_id, uploaded_by (FK users)
  storage_path, thumbnail_path
  caption, taken_at, featured (bool), public_visible (bool)

vendors
  id, name, slug, role (lodge | dog_handler | photographer | leather_goods | speaker | other)
  description, logo_url, website_url, contact_name, contact_phone
  featured_photo_url

waivers
  id, trip_id, user_id, signed_at, signature_image_path, ip_address
  document_version

inquiries (public form submissions)
  id, name, email, phone, message
  trip_interest, created_at, status (new | contacted | qualified | closed)
```

12 tables. RLS policies do most of the security work — attendees only see their own profile + their trip's data; vendors only see their own profile; founder sees everything; father-in-law sees curriculum + roster.

---

## The User Journeys (Concrete)

### Attendee — Sarah's husband Mark, paid in March, trip is Dec 30

**June** — Gets an email from the founder: "Welcome to your Pintail Experience. Set up your profile and grab your spot on the home screen." Clicks the link, sets a password, fills out his sizes and dietary preferences. Sees a teaser of the lodge and the father-in-law's bio. Reads the founder's welcome letter. Installs the PWA to his home screen — it looks like an app icon, with the Pintail crest.

**July–November** — Once a week, a notification: "New from John (father-in-law): Day 14 devotional — On the courage of Joshua." 3-minute read or 4-minute audio while Mark is in the driveway. He looks forward to it.

**Late November** — Push notification: "Your packing list and travel info are ready." Mark opens the app, sees a beautifully laid-out logistics page. Signs the waiver with his finger. Sees that Trevor (an old college friend) is also on the trip — surprise.

**Dec 29 evening** — "Welcome to Pintail. The first hunt is at 0530. We can't wait to see you." Mark sees the day-by-day schedule in his pocket. Looks at the bios of the other 15 men.

**Dec 30–Jan 1** — Day 1, photo notifications start pinging: the photographer is dropping shots from the dawn blind. By dinner there are 60 photos, including one of Mark holding his first banded duck. Day 2 evening teaching session is available as audio by the time he goes to bed. Day 3 morning: the blessing video drops in his app while the founder is delivering it live — he watches it in slow motion that night on the plane home.

**January 5** — Sunday morning at church. A friend asks how the trip was. Mark hands him his phone. The friend scrolls through the photo gallery, reads the founder's note, watches the 2-minute brand film. By Tuesday, the friend has filled out the inquiry form.

### Founder — week of the trip

Opens the admin dashboard. Sees all 16 attendees with green checkmarks (paid, waivered, profile complete). Sees Dave has a tree-nut allergy — flags it for the lodge chef via a one-click email. Drag-and-drop the final schedule into place. Uploads the father-in-law's three teaching scripts as markdown — they preview live as he types. Day-of, uploads a folder of 80 photos in two minutes — they fan out to the gallery and push to attendees. After the trip, exports the photo gallery as a public link, emails it to the 16 with a CTA: "Forward to one friend who needs this in 2027."

### Father-in-law — drafting the curriculum

Logs in with his own credentials. Sees the three session slots. Types the teaching content in markdown directly in the app — scripture refs auto-link to BibleGateway. Uploads the audio of his rehearsal recording (Mux handles the transcoding). Adds three discussion questions per session. Marks them "published" when ready. Done.

### Vendor — Pine Hill (or wherever you anchor)

Gets a link from the founder. Fills out a profile page (description, logo, hero photo, website). Their page is visible to the 16 attendees. After the trip the founder can mark them "featured" and they show on the public marketing site as a partner — a quiet but real benefit they get for the relationship.

---

## The 7-Month Build Plan

Velocity assumption: 12–15 focused hours/week. Claude Code accelerates 2–3x on greenfield Next.js + Supabase work. The schedule below has buffer baked in for the sales job and trip prep getting in the way.

### Phase 1 — Foundation (May 22 → mid-June, ~3 weeks)

**Goal:** App exists, you can log in, the schema is live, the home screen renders.

- Repo scaffolded (Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui)
- Supabase project provisioned, schema migrated (all 12 tables)
- Auth working (email magic link to start — passwordless is premium-feeling and removes a friction)
- Role-based access via RLS
- Basic admin dashboard skeleton — list users, list trips
- Vercel deploy from `main`, preview deploys on PRs
- Branded landing page (single page, hero image, vision statement, founder intro, inquiry form)

**Definition of done:** You can log in, the founder can see the 16 attendees in a list, a non-logged-in visitor can read the landing page and submit an inquiry.

### Phase 2 — Attendee Onboarding + Trip Page (mid-June → mid-July, ~4 weeks)

**Goal:** Send a real welcome email to the 16 and have them set up their accounts.

- Onboarding flow (claim invite → set password → fill profile → sizes/dietary/bio)
- Trip Home page (countdown, hero image, schedule placeholder, "what to expect")
- Roster view (the 16 see each other's bios — opt-in)
- Email transactional flow via Resend (welcome, profile reminder)
- Founder admin: edit trip, view + edit attendee profiles, send broadcast email

**Definition of done:** Founder pulls the trigger on the welcome email. All 16 onboard within 2 weeks. Profiles fill in.

### Phase 3 — Content Engine (mid-July → end of August, ~6 weeks)

**Goal:** Devotionals and curriculum can be authored, scheduled, and delivered. Father-in-law is in the system.

- Devotional system (authoring in markdown, scheduled drip, audio attach via Mux)
- Curriculum editor (3 sessions with markdown + audio + discussion questions + scripture refs)
- Push notification setup (Web Push via service worker)
- Email digest for devotionals (so attendees who don't open the app still get them)
- Father-in-law's account live, he can author independently
- Audio recording workflow documented (he records on his phone → uploads → Mux handles the rest)

**Definition of done:** First pre-trip devotional ships to the 16 on Aug 30. Father-in-law has authored at least one full teaching session in the system.

### Phase 4 — The Vendor + Logistics Layer (September, ~4 weeks)

**Goal:** Everything an attendee or vendor needs about the trip lives in the app.

- Vendor profile pages (the lodge, dog handlers, photographer, Pintail Goods, the father-in-law as "Speaker")
- Logistics page (packing list, travel info, what to bring, day-by-day overview)
- Digital waiver flow (custom signature pad → PNG + timestamp + IP → stored)
- Schedule editor (drag-and-drop blocks)
- Founder admin: vendor CRUD, logistics editor, schedule editor

**Definition of done:** Founder hands the app to a friend (test user). Friend can navigate, read every page, sign a fake waiver, find their packing list. No dead ends.

### Phase 5 — Polish + The Wow Pass (October, ~4 weeks)

**Goal:** The two surfaces each feel like a luxury brand product. Client portal feels like an app. Admin feels like a tool the founder wants to open. This is what separates Pintail from every Christian outdoor ministry website that exists.

**Client portal (mobile-first polish):**
- Brand film (Mux player on landing page + Trip Home)
- Photography pass — every page has at least one hero image that earns its real estate
- Typography pass — serif headers (Fraunces or similar editorial face), tight letter-spacing on display sizes; clean sans body (Inter)
- Subtle motion (fade-up on page load, parallax on hero, image hover lifts)
- Dark mode by default (premium-feeling, candle-lit, masculine)
- Micro-copy pass — every button, every empty state, every confirmation reads like the brand
- PWA install prompts at the right moments — first visit (soft prompt), after onboarding (hard prompt), after first devotional opened (last chance)
- Splash screen, app icon, themed status bar — fully native-feeling once installed
- Swipe gestures on schedule (between days) and photo gallery (between photos)
- 404 and offline states branded; offline mode caches curriculum + previously-loaded devotionals
- Loading skeletons (not spinners)
- Bottom tab bar fine-tuning — haptic feedback on iOS where available

**Admin (responsive, desktop-primary polish):**
- Sidebar nav with clean icons, persistent across pages
- Dense roster table with sortable columns, inline payment status badges, dietary flags
- Drag-and-drop schedule editor that feels Linear-like, with keyboard shortcuts
- Markdown editor with live preview for curriculum + devotionals
- Bulk photo upload with progress bar and inline tagging
- Mobile admin "quick actions" view — the 5 things the founder might do from a phone (check roster, payment status, send broadcast, view inquiries, view flags), each polished and one-tap
- "Edit on desktop" hints on mobile when the founder hits an authoring screen

**Definition of done:** You'd be proud to airdrop the public landing URL to a Sea Island or Joshua Creek client, the 16 hit the client portal and screenshot it, and the founder opens the admin on his laptop without complaint.

### Phase 6 — Day-of Mode + Testing (November, ~4 weeks)

**Goal:** Real-time during the trip works, photo uploads at scale work, founder + father-in-law have run through every flow.

- Photographer upload mode (drag a folder, batch-tag, set visibility — built so the photographer doesn't need training)
- Real-time photo drops to attendees via Supabase Realtime + push notification
- Day-of mode toggle on Trip Home — pinned to "today's schedule," big tap targets
- Stress test — upload 200 photos in a session, see latency on attendee devices
- Full dry-run with founder + father-in-law (every flow, every role)
- Bug bash with 2–3 friends as test attendees
- Mobile QA on iOS Safari, Android Chrome, and a couple weird devices

**Definition of done:** Founder and father-in-law can independently run the app at a level where they could do the trip tomorrow without you on call.

### Phase 7 — Launch + Drip (December, ~3 weeks before the trip)

**Goal:** All 16 attendees living in the app daily. Daily devotional drip running. Day-of-trip mode rehearsed.

- Final invite + onboarding push (any stragglers)
- Daily devotional going out from Nov 30 → Dec 29 (30 days)
- Final logistics email + push 7 days before
- Day-of-trip mode armed
- Founder has run the photo-upload workflow at least 5 times solo

**Definition of done:** Dec 30, the platform runs itself. You're watching it work.

---

## What We Are NOT Building (v1 Scope Discipline)

**Park all of these.** They sound good. They are not the wow. They will eat your timeline.

- Multi-trip product (it's one trip — hardcode where it makes shipping faster)
- Native iOS/Android apps in App Store / Play Store (PWA is enough for v1 — and the route-group structure leaves a Capacitor wrap as a clean 1-week project for year 2 if you want App Store distribution)
- Mobile authoring in the admin (founders use desktop for authoring; mobile admin is for quick ops only)
- Payment processing inside the app (link out to WeTravel or Stripe checkout)
- Booking flow for future trips (an inquiry form is enough — the founder closes manually)
- Vendor self-service portal (founder edits vendor pages for v1)
- Discussion forums / chat / DMs between attendees (cool, but a year-2 feature and a moderation headache)
- Per-attendee personalized curriculum tracks
- E-commerce for Pintail Goods (separate Shopify site if needed)
- Multi-language
- Analytics dashboards beyond PostHog default
- Admin reporting beyond a single "trip overview" page
- Calendar sync (ICS export is enough)
- Maps integration (text address + a link to Google Maps is enough)

If any of these become obvious year-2 features after the trip lands, ship them then. **Every hour spent on the above list before Dec 30 is an hour not spent on the things attendees actually touch.**

---

## The Wow Moments — Concrete

Five specific moments where attendees screenshot the app and text it to a friend:

1. **The PWA install** — beautifully designed install prompt, app icon is a tight Pintail crest, splash screen is the founder's hand silhouetted with a duck. Feels expensive.
2. **The first devotional notification** — 30 days out, "From John: Day 1 — On preparation." 3-minute read, scripture in serif type, audio play button glowing softly.
3. **The roster page** — every other attendee with a real bio, photo, and intro note. "Trevor — Atlanta, GA. Husband, dad of 3, plant-shop owner, has hunted ducks since he was 8." It makes them feel like they belong to something before they arrive.
4. **The day-2 photo drop** — they're at lunch, the photographer just uploaded 40 shots from the morning hunt, and notifications cascade in. They show their tablemates. Phones come out.
5. **The blessing video** — the founder delivers the final blessing on day 3 morning. By the time the attendees board the plane home that afternoon, the video is in their app. They watch it again at 35,000 feet, get emotional, and forward the public gallery link to their wives.

If you nail those five moments, the app is a moat.

---

## Risk + Bailout Plan

Three honest risks and what to do if they hit:

**Risk 1: You're 6 weeks out and behind schedule.** Cut order: drop the brand film integration (link out to YouTube unlisted), drop dark mode, drop motion polish, drop public photo gallery (private only). Ship the attendee experience and the founder admin. That's the only thing that has to work on Dec 30.

**Risk 2: Father-in-law can't author in markdown.** Bailout: build a 2-hour Loom for him, or have founder ghost-author and check with him. Don't let his learning curve block content shipping. Long-term you can build a richer WYSIWYG; for v1 it's not a feature, it's a process.

**Risk 3: Photographer can't or won't use the upload tool.** Bailout: founder uploads from his phone or laptop during meals. Slower, but works. Don't let vendor coordination be on the critical path.

If two of these hit at once, the trip still works — the platform's job is to amplify the experience, not be the experience.

---

## Decisions Locked

- **Trip name:** **The Pintail Experience** (this inaugural trip carries the brand-defining name — every future trip is "The Pintail Experience — [Season/Year]" or similar)
- **Domain:** Skip the custom domain purchase for now. Run on the **default Vercel subdomain** (likely `the-pintail-experience.vercel.app`) through the build phase. Revisit when the platform is content-rich and the founder is ready to send the public link to the 16 — likely September/October.
- **Stack assumed:** Next.js 15 + Supabase + Vercel (same as CSG Core). If you want to deviate, say so before scaffolding.

## What's Needed From You This Week

1. **Confirm the stack assumption above** (one-line yes/no is enough).
2. **Get the founder + father-in-law to commit to recording one test audio devotional this month.** That's the content-pipeline reality check — if they can't get one done in 4 weeks, the daily drip plan needs a different shape. Don't wait on this; it's the riskiest dependency in the whole build.
3. **Confirm you're building this yourself in Claude Code**, vs handing it off to a contractor. The phasing assumes you + Claude Code. If you'd rather hire it out, the plan still works but the cost discussion changes.
4. **Send me a green light and I'll scaffold the repo over the weekend** — Next.js + TypeScript + Tailwind + shadcn/ui + Supabase wired up, schema migrated, auth working, deployed to a Vercel preview by Monday. We're in Phase 1 immediately.

---

## The One-Sentence Goal

> **By Dec 30, the 16 men have an app on their home screen they've been using daily for 30 days, the trip runs through it in real time, and the photo gallery + blessing video become the trip #2 marketing engine.**

That's the build. It's real, it's doable in 7 months with this stack, and there is nothing remotely like it in the faith-hunting category. Let's go.
