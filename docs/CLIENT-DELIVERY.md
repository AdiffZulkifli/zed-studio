# Client Delivery Checklist

For real (paying) client projects. Demos have relaxed rules; **clients never do**.

## Kick-off
- [ ] WhatsApp/call discovery: business goals, audience, content sources, languages needed
- [ ] Fixed quote sent and accepted (package + add-ons, in writing)
- [ ] Collect: logo, photos, copy or copy-approval process, domain preferences

## Build
- [ ] New Supabase project **per client** (never share the demo project)
- [ ] RLS locked down: public = read-only on public tables; writes only via authenticated admin. Never `USING (true) WITH CHECK (true)` for writes
- [ ] Admin password: strong + unique (never `123123`), delivered securely, client forced to change on first login
- [ ] Bilingual if in package (EN/BM dictionaries from day one)
- [ ] No Zed demo ribbon on client sites

## Launch
- [ ] Domain registered **in client's name** (they own it) — DNS add-on RM 150
- [ ] Deploy to Vercel (separate project), custom domain attached, HTTPS verified
- [ ] Meta/OG/favicon set; sitemap + robots; Google Business Profile linked if relevant
- [ ] Lighthouse ≥ 90 all categories on mobile
- [ ] All WhatsApp CTAs point to the client's number

## Handover
- [ ] 15-min admin panel walkthrough (record it, send the video)
- [ ] Credentials doc: domain registrar, Vercel, Supabase, admin panel
- [ ] Support window dates confirmed in writing
- [ ] Care Plan offered (Essential RM 79 / Pro RM 149 monthly)

## Care Plan runbook (monthly)
- Essential (RM 79): uptime check, dependency/security review, backup export, ≤ 2 small content changes
- Pro (RM 149): everything in Essential + ≤ 8 content changes, 1 new section/banner per quarter, monthly analytics summary via WhatsApp
