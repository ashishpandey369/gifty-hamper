# UI Stabilization Checkpoint

## Goal
Stabilize the mobile homepage/shop experience without introducing duplicate navigation, catalog, or recently-viewed logic.

## Current diagnosis
1. The homepage and shop intentionally have different marketplace/header markup, but the homepage must reuse the project's existing shared `.menu-toggle` + `#primary-nav` logic from `js/main.js`.
2. The homepage currently has marketplace-specific mobile header CSS that overrides the shared header grid. This is causing the menu/header arrangement to differ from the stable shop layout.
3. Recently Viewed is stored in localStorage by `js/product.js`, while the homepage reads it from `js/home-marketplace.js`. The current implementation uses an expiring list, but the homepage does not validate/refresh entries against the live Firebase catalog after rendering.
4. The homepage currently renders the first 10 active products in For You, while Recently Viewed is a separate horizontal shelf. This separation must remain: viewing a product must never remove it from For You/all products.
5. Firebase public catalog loading is centralized in `js/catalog-store.js` through `loadPublicCatalog()`; no catalog data should be duplicated or rewritten by this UI work.

## Safe implementation sequence
- Step 1: Document and isolate the existing behavior (this checkpoint) — completed.
- Step 2: Normalize the homepage mobile header to the same shared menu positioning without changing `js/main.js` — completed. Also removed a literal `\\n` text artifact from `index.html` that was visible above the header.
- Step 3: Make Recently Viewed a clean temporary reference list, deduplicated by product id, refreshed on view, expired after 7 days, and always resolved against the live catalog — completed by centralizing the storage/read logic in `js/catalog-store.js`.
- Step 4: Keep For You independent from Recently Viewed and show exactly 10 active products before the View More CTA — verified in `js/home-marketplace.js`.
- Step 5: Refresh cache versions only for files whose behavior changed — homepage cache bumped to `v=3`.
- Step 6: Verify no duplicate menu functions/selectors or catalog mutation were introduced — completed. Final checks found no `setupMarketplaceMenu` or `marketplace-menu-toggle` references; public catalog remains Firebase-backed; Recently Viewed is localStorage-only and separate from the catalog.

## Guardrails
- Do not change Firebase schema/rules for this UI task.
- Do not replace the existing shared menu logic.
- Do not remove products from the catalog because they appear in Recently Viewed.
- Do not seed or overwrite Firebase products from the homepage.
- Make one focused change at a time and update this checkpoint after each step.


## Step 7: Product-page “More to love” shelf
- Requested behavior: make the product-page More to love section use the same horizontal shelf interaction as Recently Viewed.
- Target: show up to 10 related/active products instead of 3, keep the existing View all gifts CTA, and add left/right scroll controls with disabled-state handling and touch/trackpad horizontal scrolling.
- Guardrails: keep the current product-page catalog source, do not alter Firebase data, and do not change the existing Recently Viewed behavior.
- Status: completed. The product page now renders up to 10 active related products, keeps the existing View all gifts link, and uses the same left/right horizontal shelf interaction with disabled arrow states and touch/trackpad scrolling.
