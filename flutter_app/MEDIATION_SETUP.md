# AdMob + Meta Audience Network Mediation (Hip Hop)

## Console setup (no code)

### AdMob — Bidding (Asta)
- Map Meta placement ID → AdMob ad unit (banner done).
- **System user token:** NOT required if AdMob only asks for placement ID (bidding setup).

### AdMob — Optional waterfall backup (Meta docs)
Same placement ID in **Cascata** under the bidding group as fallback when bids do not fill.
Not required to launch; can add later.

### Meta Monetization Dashboard
- App ID: `1533492195079867`
- Banner placement: `1533492195079867_1533493681746385`
- **Interstitial placement:** `1533492195079867_1533518441743909`
- Add test device ID under Testing.

### AdMob — Interstitial mediation group (do this in console)

1. **Mediation** → **Create mediation group** (or edit existing for interstitial).
2. Ad unit: **Interstitial** → `ca-app-pub-5162875721816233/9130233335`
3. **Asta (bidding):** AdMob Network + Meta Audience Network (both Active).
4. **Map placement:** Meta interstitial `1533492195079867_1533518441743909` ↔ AdMob interstitial unit above.
5. (Optional) Same placement ID in **Cascata** as waterfall backup.
6. Save and wait a few hours for propagation.

## App code (already integrated)

| Item | Value |
|------|--------|
| AdMob banner | `ca-app-pub-5162875721816233/4852911129` |
| AdMob interstitial | `ca-app-pub-5162875721816233/9130233335` |
| Meta adapter | `com.google.ads.mediation:facebook:6.21.0.3` |
| Meta App ID (manifest) | `1533492195079867` |

Placement IDs stay in AdMob Console only — not in Dart.

## Still TODO

1. ~~Create Interstitial placement on Meta~~ → done (`1533492195079867_1533518441743909`)
2. **Map interstitial in AdMob** mediation group (steps above).
3. Test with AdMob Mediation Test Suite + Meta test device.
4. Release build and monitor fill in AdMob + Meta dashboards (24–48h).

## References

- [Google: Meta mediation Android](https://developers.google.com/admob/android/mediation/meta)
- [Meta: AdMob bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob/)
