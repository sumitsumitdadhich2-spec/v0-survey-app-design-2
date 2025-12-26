# Advertisement Placement Guide

## Ad Component Types

### 1. AdLeaderboard
- **Size**: 728x90 (Desktop) / 320x50 (Mobile)
- **Best for**: Page headers and footers
- **Use case**: Banner ads from Google AdSense, other ad networks

### 2. AdRectangle  
- **Size**: 336x280 or 300x250
- **Best for**: Content breaks, sidebar areas
- **Use case**: Medium rectangle ads, highly visible

### 3. AdBanner (Top/Middle/Bottom)
- **Sizes**: 
  - Top: 728x90 (Desktop) / 320x50 (Mobile)
  - Middle: 300x250 (All devices)
  - Bottom: 728x90 (Desktop) / 320x100 (Mobile)
- **Best for**: Within content flows
- **Use case**: Survey pages, forms

### 4. AdSidebar
- **Size**: 300x250
- **Best for**: Desktop sidebar areas
- **Use case**: Sticky sidebar ads (if needed)

---

## Ad Placements by Page

### 📊 Dashboard (`/dashboard`)
- **Top**: AdLeaderboard (728x90)
- **Middle**: AdRectangle (300x250) - Between stats and Quick Actions
- **Bottom**: AdLeaderboard (728x90)
- **Total**: 3 ad spaces
- **User Impact**: Minimal - Ads placed in natural content breaks

### 📝 Surveys Listing (`/surveys`)
- **Top**: AdLeaderboard (728x90)
- **Middle**: AdRectangle (300x250) - Between progress card and survey grid
- **Bottom**: AdLeaderboard (728x90) - After completed surveys
- **Total**: 3 ad spaces
- **User Impact**: Low - Does not interfere with survey browsing

### 📋 Survey Detail Page (`/surveys/[id]`)
- **Top**: AdLeaderboard (728x90)
- **Bottom**: AdLeaderboard (728x90)
- **Total**: 2 ad spaces
- **User Impact**: Low - Positioned outside main survey content

### ✍️ Survey Form (Within Survey)
- **Top**: AdBanner (before questions)
- **Middle**: AdBanner (between question navigation)
- **Bottom**: AdBanner (after submit button)
- **Total**: 3 ad spaces per question
- **User Impact**: Moderate - Multiple exposures during survey, but non-intrusive placement
- **Note**: This is your highest engagement area, maximize revenue here

### 💰 Wallet (`/wallet`)
- **Top**: AdLeaderboard (728x90)
- **Middle**: AdRectangle (300x250) - Between balance cards and transaction history
- **Bottom**: AdLeaderboard (728x90)
- **Total**: 3 ad spaces
- **User Impact**: Minimal - Natural content breaks

### 👥 Referrals (`/referrals`)
- **Top**: AdLeaderboard (728x90)
- **Middle**: AdRectangle (300x250) - Between stats and referral link
- **Bottom**: AdLeaderboard (728x90)
- **Total**: 3 ad spaces
- **User Impact**: Low - Does not disrupt referral sharing

### 💸 Withdraw (`/withdraw`)
- **Top**: AdLeaderboard (728x90)
- **Middle**: AdRectangle (300x250) - After balance card
- **Bottom**: AdLeaderboard (728x90)
- **Total**: 3 ad spaces
- **User Impact**: Low - Positioned around withdrawal form

### 🎁 Enter Code (`/enter-code`)
- **Top**: AdLeaderboard (728x90)
- **Bottom**: AdLeaderboard (728x90)
- **Total**: 2 ad spaces
- **User Impact**: Minimal - Simple page with focused action

### 🏠 Home Page (`/`)
- **After Header**: AdLeaderboard (728x90)
- **After Features**: AdLeaderboard (728x90)
- **After CTA**: AdLeaderboard (728x90)
- **Total**: 3 ad spaces
- **User Impact**: Low - Spread throughout long landing page

---

## Total Ad Inventory

**Per User Session (Typical Flow)**:
- Home page: 3 ads
- Sign up: 0 ads
- Dashboard: 3 ads
- Survey page: 3 ads
- Survey detail: 2 ads
- Survey form (5 questions): 15 ads
- Referrals: 3 ads
- Wallet: 3 ads

**Total: ~32 ad impressions** per typical user session

---

## Ad Integration Instructions

### For Google AdSense:

```tsx
// Replace AdLeaderboard component content with:
<div className="w-full">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX"
       crossOrigin="anonymous"></script>
  <ins className="adsbygoogle"
       style={{ display: 'block' }}
       data-ad-client="ca-pub-XXXXXXX"
       data-ad-slot="XXXXXXXXX"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### For Other Ad Networks:

Replace the placeholder content in each ad component with your ad network's code snippets.

---

## Revenue Optimization Tips

1. **Highest Value Placements**:
   - Survey form ads (users are most engaged)
   - Survey listing page (high traffic)
   - Dashboard (frequent visits)

2. **A/B Testing Recommendations**:
   - Test removing middle ads to improve user experience
   - Test different ad sizes (300x250 vs 336x280)
   - Monitor completion rates with/without certain ads

3. **User Experience Balance**:
   - Current placement is user-friendly
   - Ads don't block core functionality
   - Natural content breaks maintain flow

4. **Ad Frequency Capping**:
   - Consider limiting ads on survey forms to 2 instead of 3
   - Remove ads from payment/withdrawal pages if needed for trust

---

## Compliance Notes

- All ad placements are clearly separated from content
- No ads placed directly adjacent to clickable buttons (accidental clicks prevention)
- Ad spaces are marked with dashed borders (to be replaced with actual ads)
- User can complete all tasks without ad interaction

---

## Implementation Checklist

- [x] Create ad components (AdLeaderboard, AdRectangle, AdBanner, AdSidebar)
- [x] Add ads to Dashboard
- [x] Add ads to Surveys pages
- [x] Add ads to Survey form
- [x] Add ads to Wallet
- [x] Add ads to Referrals
- [x] Add ads to Withdraw
- [x] Add ads to Enter Code
- [x] Add ads to Home page
- [ ] Replace placeholder content with actual ad network code
- [ ] Test ad loading performance
- [ ] Monitor user completion rates
- [ ] Optimize based on analytics
