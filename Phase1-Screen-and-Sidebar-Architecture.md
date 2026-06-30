# Screen & Sidebar Architecture — Influencer Marketplace (Phase 1)

> **Product name:** `My Plyn` — domain `myplyn.com`
> **Purpose of this document:** the complete, build-ready map of every screen, organized by role and by sidebar menu. Each role has its own dashboard shell and sidebar; each sidebar item maps to a landing page; each page lists its sub-pages, wizard steps, drawers, modals, and workflow screens. Every screen has a referenceable ID (e.g. `ADV-08`) so designers and engineers can point to it directly. Scope is **web only** (responsive site + desktop-first dashboards). No mobile apps, AI matching, or social-API integrations (Phase 2).

---

## A. Navigation principles applied

1. **≤7 primary sidebar items per role.** Anything beyond goes into nesting or the utility group, never a longer flat list.
2. **Role-based rendering at the nav level.** Three distinct sidebars. A user only ever sees their role's menu; admin permissions further gate items inside the admin sidebar (super-admin / moderator / finance).
3. **Object + workflow structure.** Menu = the objects users manage (Campaigns, Creators, Pages, Users) + the verbs they run (Create, Review, Verify, Withdraw).
4. **Two groups in every sidebar:** a **Primary** group (core destinations) and a **Utility** group at the bottom (Settings, Help, profile/sign-out).
5. **Top "primary action" button** above the nav for the single most common create action per role (e.g. advertiser "+ New Campaign").
6. **Badge counts** on items with pending work (Applications, Invitations, Review Queue, Messages).
7. **Breadcrumbs** on every detail/nested screen so users can backtrack without the sidebar.
8. **Sidebar = 260px, collapsible to a 72px icon rail** with hover tooltips; collapse state persisted.

---

## B. Screen ID legend

| Prefix | Area |
|---|---|
| `PUB-` | Public marketing website |
| `AUTH-` | Authentication & onboarding |
| `ADV-` | Advertiser dashboard |
| `CRE-` | Creator dashboard |
| `ADM-` | Admin dashboard |

**Type tags used below:** `page` · `tab` (within a detail page) · `wizard` (multi-step) · `drawer` (right slide-over) · `modal` · `state` (empty/loading/success/error variant).

---

## C. Shared dashboard shell (applies to all three roles)

Every dashboard screen is composed inside this shell, so it's built once as a component and reused:

- **Sidebar (left, 260px):** logo → primary action button → Primary nav group → Utility nav group → user/profile cluster at bottom. Active-item highlight, collapse toggle.
- **Top bar:** breadcrumb (left) · global search · notifications bell (with count) · role-specific chip (advertiser = wallet balance, creator = available balance, admin = environment indicator) · avatar menu.
- **Content area:** page title + actions row, then the page body on the 12-col grid.
- **System states baked into every data surface:** empty, loading (skeleton), error, success/confirmation. (Listed explicitly only where a distinct screen is needed.)

---

## D. Public website & authentication (shared, outside the sidebar)

### D.1 Public marketing site (detailed in the separate design-prompt doc; listed here for completeness)
| ID | Screen | Type |
|---|---|---|
| PUB-01 | Landing / Home | page |
| PUB-02 | How It Works | page |
| PUB-03 | Pricing | page |
| PUB-04 | About Us | page |
| PUB-05 | Contact Us | page |
| PUB-06 | Terms of Service | page |
| PUB-07 | Privacy Policy | page |
| PUB-08 | 404 / error | state |

### D.2 Authentication & role onboarding
| ID | Screen | Type | Notes |
|---|---|---|---|
| AUTH-01 | Sign-up role chooser (Advertiser / Creator) | page | Two large selectable cards |
| AUTH-02 | Advertiser sign-up form | page | + company name |
| AUTH-03 | Creator sign-up form | page | + country/niche |
| AUTH-04 | Log in | page | Shared for advertiser/creator |
| AUTH-05 | Forgot password (request) | page | |
| AUTH-06 | Reset password (set new) | page | |
| AUTH-07 | "Check your inbox" confirmation | state | |
| AUTH-08 | Email verified — success | state | |
| AUTH-09 | Admin log in (separate URL) | page | Not linked from public site |

---

## E. ADVERTISER dashboard

### E.1 Advertiser sidebar
```
[ + New Campaign ]            ← primary action button (accent)

PRIMARY
  ◻ Dashboard
  ◻ Campaigns
  ◻ Creator Marketplace
  ◻ Collaborations          • badge: proofs to verify
  ◻ Wallet & Payments
  ◻ Messages                • badge: unread

UTILITY
  ◻ Settings
  ◻ Help & Support
  ◻ [avatar] Account ▾
```

### E.2 Onboarding (first-run, post-signup)
| ID | Screen | Type |
|---|---|---|
| ADV-ON1 | Onboarding · Business profile (name, logo, website, industry, country/city, description) | wizard |
| ADV-ON2 | Onboarding · Add billing/payment method (Stripe) | wizard |
| ADV-ON3 | Onboarding · Create your first campaign (CTA hand-off) | wizard |

### E.3 Menu → pages

**M1 · Dashboard**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADV-01 | Dashboard home | page | KPI row (Active Campaigns · Funds in Holding · Total Spent · Pending Applications · Live Collaborations), spend trend chart, budget-used donut, "needs attention" queue, recommended creators strip |
| ADV-01a | First-run empty dashboard | state | Guided CTA to create first campaign |

**M2 · Campaigns**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADV-02 | Campaigns list | page | Table/card toggle; filters (status, platform, niche, date); status pills; budget mini-bar |
| ADV-03 | Create campaign · Step 1 Basics | wizard | Name, description, promotion requirements |
| ADV-04 | Create campaign · Step 2 Targeting | wizard | Country, city, niche (multi), platforms |
| ADV-05 | Create campaign · Step 3 Media assets | wizard | Image/video drag-drop uploader |
| ADV-06 | Create campaign · Step 4 Budget & schedule | wizard | Total/per-placement budget, start/end dates |
| ADV-07 | Create campaign · Step 5 Review & fund (Stripe) | wizard | Summary + payment + fee math (budget held, 15% on completion) |
| ADV-07a | Campaign published — success | state | |
| ADV-08 | Campaign detail · Overview | page+tab | KPIs, budget donut, timeline |
| ADV-09 | Campaign detail · Applications | tab | Creators who applied; approve/reject; bulk select; badge count |
| ADV-09a | Application review | drawer | Creator mini-profile, proposed price, message, approve/reject |
| ADV-10 | Campaign detail · Invited | tab | Creators you sent requests to + response status |
| ADV-11 | Campaign detail · Collaborations | tab | Accepted creators, status timelines |
| ADV-12 | Campaign detail · Assets | tab | Campaign media library |
| ADV-13 | Campaign detail · Activity log | tab | Audit trail |
| ADV-14 | Edit campaign | page | Re-enter wizard in edit mode |
| ADV-15 | Add funds to campaign | modal | Stripe top-up for a live campaign |
| ADV-16 | Pause / Close campaign | modal | Destructive confirm |

**M3 · Creator Marketplace**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADV-17 | Marketplace search & results | page | Sticky filter rail (country, city, platform, niche, followers, reach, engagement, price range) + result grid + dynamic count |
| ADV-17a | Zero-results / suggestions | state | "Widen filters" + nearest matches (never a dead end) |
| ADV-18 | Creator profile | drawer/page | Listed pages, stats, portfolio, ratings, pricing, verified badge |
| ADV-19 | Send collaboration request | modal | Pick campaign, pick page, message, proposed budget |
| ADV-19a | Request sent — success | state | |
| ADV-20 | Saved / shortlisted creators | page | Bookmarked creators |

**M4 · Collaborations**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADV-21 | Collaborations list | page | Across all campaigns; filters by status |
| ADV-22 | Collaboration detail | page | Status timeline + submitted proof view |
| ADV-23 | Verify proof / release payment | modal | Payout breakdown (gross → 15% → net); confirm release |
| ADV-24 | Request changes | modal | Send proof back to creator |
| ADV-25 | Provide promotional content | modal | Upload/share content to creator (workflow step 6) |
| ADV-26 | Raise dispute | modal | Reason + evidence → routes to admin |

**M5 · Wallet & Payments**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADV-27 | Wallet overview | page | Balance, funds-in-holding, total spent cards |
| ADV-28 | Add funds / fund balance | modal | Stripe |
| ADV-29 | Transactions | page | Ledger (funding, release, refund); filters; export |
| ADV-30 | Transaction / invoice detail | drawer | Download invoice |
| ADV-31 | Payment methods | page | Manage cards |

**M6 · Messages**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADV-32 | Messages | page | Thread list + conversation (tied to collaborations) |
| ADV-32a | Empty inbox | state | |

**Utility · Settings & account**
| ID | Screen | Type |
|---|---|---|
| ADV-33 | Settings · Business profile | tab |
| ADV-34 | Settings · Billing & payment methods | tab |
| ADV-35 | Settings · Team members (invite, roles) | tab |
| ADV-36 | Settings · Notifications | tab |
| ADV-37 | Settings · Security (password, 2FA) | tab |
| ADV-38 | Settings · Account (export, close) | tab |
| ADV-39 | Help & Support | page |
| ADV-40 | Notifications panel | dropdown/page |

---

## F. CREATOR dashboard

### F.1 Creator sidebar
```
[ + List a Page ]            ← primary action button (accent)

PRIMARY
  ◻ Dashboard
  ◻ My Pages
  ◻ Discover Campaigns
  ◻ Invitations             • badge: new requests
  ◻ Collaborations          • badge: proof to submit
  ◻ Earnings & Payouts
  ◻ Messages                • badge: unread

UTILITY
  ◻ Settings
  ◻ Help & Support
  ◻ [avatar] Account ▾
```
*Persistent top banner until Stripe Connect onboarding is complete: "Set up payouts to withdraw earnings."*

### F.2 Onboarding (first-run)
| ID | Screen | Type |
|---|---|---|
| CRE-ON1 | Onboarding · Profile (photo, country/city, niche, bio) | wizard |
| CRE-ON2 | Onboarding · List your first page | wizard |
| CRE-ON3 | Onboarding · Connect payouts (Stripe Connect Express) | wizard |

### F.3 Menu → pages

**M1 · Dashboard**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| CRE-01 | Dashboard home | page | KPI row (Available Balance · Pending in Holding · Total Earned · Active Collaborations · New Invitations), earnings trend, "action needed" list, recommended campaigns, payout-setup nudge |
| CRE-01a | First-run empty dashboard | state | Guide: complete profile → list page → connect payouts |

**M2 · My Pages**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| CRE-02 | My Pages list | page | Cards per listed social page; verification status; "+ Add page" |
| CRE-03 | Add page | page/modal | Platform, page name, profile URL, followers, avg reach, engagement (opt), country, city, niche |
| CRE-04 | Edit page | page/modal | Same form, pre-filled |
| CRE-05 | Page detail | page | Stats, verification badge, collaboration history for this page |
| CRE-06 | Remove page | modal | Confirm |

**M3 · Discover Campaigns**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| CRE-07 | Discover campaigns | page | Browse/search open campaigns; filters (niche, platform, budget, country/city, dates) |
| CRE-07a | Zero-results | state | Widen filters / suggestions |
| CRE-08 | Campaign detail | drawer/page | Brand, requirements, budget, platforms, dates |
| CRE-09 | Apply to campaign | modal | Pick page, pitch message, proposed price |
| CRE-09a | Application sent | state | |
| CRE-10 | My applications | page/tab | Pending / approved / rejected |

**M4 · Invitations**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| CRE-11 | Invitations & requests list | page | Incoming collaboration requests; badge count |
| CRE-12 | Invitation detail | drawer | Brand, campaign, page requested, offered amount, message |
| CRE-13 | Accept request | modal | Confirm → becomes a collaboration |
| CRE-14 | Reject request | modal | Optional reason |

**M5 · Collaborations**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| CRE-15 | Collaborations list | page | Active + past; status pills |
| CRE-16 | Collaboration detail | page | Status timeline; shows net payout & expected release |
| CRE-17 | View provided content | drawer | Content the advertiser supplied (workflow step 6/7) |
| CRE-18 | Submit proof | modal | URL + screenshot upload (workflow step 8) |
| CRE-18a | Proof submitted — awaiting verification | state | |

**M6 · Earnings & Payouts**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| CRE-19 | Earnings overview | page | Available · Pending (held) · Lifetime; always shows gross → 15% → net |
| CRE-20 | Withdraw funds | modal | Amount, payout method, breakdown |
| CRE-20a | Withdrawal requested | state | |
| CRE-21 | Payout history | page | Table (gross, fee, net, status: pending/processing/paid) |
| CRE-22 | Stripe Connect payout setup / status | page | Connected / pending verification / restricted; re-onboard CTA |

**M7 · Messages**
| ID | Screen | Type |
|---|---|---|
| CRE-23 | Messages | page |
| CRE-23a | Empty inbox | state |

**Utility · Settings & account**
| ID | Screen | Type |
|---|---|---|
| CRE-24 | Settings · Profile | tab |
| CRE-25 | Settings · Payout setup (Stripe Connect) | tab |
| CRE-26 | Settings · Notifications | tab |
| CRE-27 | Settings · Security | tab |
| CRE-28 | Settings · Account | tab |
| CRE-29 | Help & Support | page |
| CRE-30 | Notifications panel | dropdown/page |

---

## G. ADMIN dashboard

### G.1 Admin sidebar
```
PRIMARY
  ◻ Dashboard
  ◻ Users
  ◻ Campaigns
  ◻ Review Queue            • badge: pending items (reports, disputes, proofs)
  ◻ Finance
  ◻ Reports

UTILITY
  ◻ Settings
  ◻ [avatar] Admin ▾
```
*Permission gating: super-admin sees all; moderator sees Dashboard/Users/Campaigns/Review Queue; finance sees Dashboard/Finance/Reports.*

### G.2 Menu → pages

**M1 · Dashboard**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-01 | Platform overview | page | KPI row (Total Users [adv/creator split] · Active Campaigns · Total Revenue/commission · Funds in Holding · Open Disputes/Reports), GMV & commission chart, signups chart, work queues |

**M2 · Users**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-02 | Users · Advertisers | page/tab | Searchable/filterable table |
| ADM-03 | Users · Creators | page/tab | Searchable/filterable table |
| ADM-04 | Pending approvals | page/tab | New accounts awaiting approval |
| ADM-05 | Advertiser detail | page | Profile, campaigns, transactions, status controls, audit log |
| ADM-06 | Creator detail | page | Profile, pages, earnings, status controls, audit log |
| ADM-07 | Approve / suspend / restrict | modal | Confirm + reason |
| ADM-08 | Verify creator page stats | drawer | Manual stat verification (Phase 1 has no social API) |

**M3 · Campaigns**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-09 | All campaigns | page | Table: brand, name, status, budget, dates, #collaborations; filters |
| ADM-10 | Campaign detail (admin view) | page | Full campaign incl. applications, collaborations, money trail |

**M4 · Review Queue (moderation, disputes, verification)**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-11 | Reported content queue | page/tab | Items, reporter, reason |
| ADM-12 | Report detail / resolve | drawer | Action: dismiss / warn / remove |
| ADM-13 | Disputes queue | page/tab | Parties, amount, reason |
| ADM-14 | Dispute detail / resolve | page/drawer | Evidence; resolve → release / refund / split; audit |
| ADM-15 | Verify promotions queue | page/tab | Proofs awaiting admin verification |
| ADM-16 | Proof verification detail | drawer | Approve → triggers payout / reject (workflow step 9) |

**M5 · Finance**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-17 | Transactions ledger | page | All funding, releases, refunds, commission; filters; export |
| ADM-18 | Transaction detail | drawer | |
| ADM-19 | Commissions | page | 15% per completed transaction; total collected |
| ADM-20 | Payouts | page | Creator payouts: pending/processing/paid; Stripe status; retry |
| ADM-21 | Payout detail | drawer | |
| ADM-22 | Refunds | page/tab | Refund management |

**M6 · Reports**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-23 | Reports / analytics | page | Users, campaigns, revenue, active campaigns, funnel (request→accept→complete), top niches/platforms, geo; date filter |
| ADM-24 | Report export / builder | modal | CSV export |

**Utility · Settings**
| ID | Screen | Type | Purpose / key elements |
|---|---|---|---|
| ADM-25 | Settings · Platform config (general) | tab | |
| ADM-26 | Settings · Commission rate | tab | Configurable platform fee (default 15%) |
| ADM-27 | Settings · Categories / niches (CRUD) | tab | Taxonomy management |
| ADM-28 | Settings · Platforms management | tab | Supported social platforms |
| ADM-29 | Settings · Email templates | tab | |
| ADM-30 | Settings · Admin roles & permissions | tab | Super-admin / moderator / finance |
| ADM-31 | Settings · Feature flags | tab | |

---

## H. The 11-step promotion workflow → screen map

Each workflow step touches specific screens across roles. Use this to design the status transitions consistently.

| # | Workflow step | Creator screen | Advertiser screen | Admin screen | Status set |
|---|---|---|---|---|---|
| 1 | Creator registers + lists pages | CRE-ON1/2, CRE-02/03 | — | ADM-08 (verify) | page: pending → active |
| 2 | Advertiser creates + funds campaign | — | ADV-03→07 | — | campaign: draft → live; funds: held |
| 3 | Advertiser searches / posts campaign | CRE-07 (sees it) | ADV-17 | — | — |
| 4 | Collaboration request / application | CRE-09 (apply) | ADV-19 (request) / ADV-09 (review) | — | requested / application pending |
| 5 | Creator accepts | CRE-13 | ADV-10 (status updates) | — | accepted |
| 6 | Advertiser provides content | CRE-17 (view) | ADV-25 | — | content provided |
| 7 | Creator publishes | CRE-16 | ADV-22 | — | published |
| 8 | Creator submits proof | CRE-18 | ADV-22 (sees proof) | — | proof submitted / in review |
| 9 | Advertiser or admin verifies | — | ADV-23 | ADM-15/16 | verified |
| 10 | Payment released to creator | CRE-19/21 | ADV-23 (confirm) | ADM-20 | released → paid out |
| 11 | Platform retains 15% commission | — | — | ADM-19 | commission recorded |

---

## I. Screen count summary

| Area | Approx. screens (incl. key states/modals) |
|---|---|
| Public site (PUB) | 8 |
| Auth & onboarding (AUTH + role onboarding) | 9 + 6 = 15 |
| Advertiser (ADV) | ~46 |
| Creator (CRE) | ~37 |
| Admin (ADM) | ~33 |
| **Total** | **~139** |

*Counts include wizard steps, drawers, modals, and the most important empty/success states, since each is a distinct frame to design. Pure loading/error variants are designed at the component level and not all counted individually.*

---

## J. Build sequence recommendation

1. **Shell + sidebar component** (one component, three role configurations) → C.
2. **Auth + onboarding** → D.2, and each role's `-ON` flow.
3. **Per role, build in workflow order:** Dashboard → the object lists (Campaigns / My Pages / Users) → detail pages → the workflow modals/drawers (request, apply, submit proof, verify, release) → Wallet/Earnings/Finance → Messages → Settings.
4. **Status system first within each role** (status pills + timeline component) so every state renders consistently before screens are populated.
5. **Admin Review Queue + Finance last**, since they depend on the advertiser/creator screens existing to reference.
