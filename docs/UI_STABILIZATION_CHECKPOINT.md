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


## Step 8: Shared category management and storefront category browsing
- Category metadata is now stored in the Firestore `categories` collection so names/images are shared across admin sessions and storefront devices.
- Admin major and minor category cards now show an image thumbnail, pencil edit action, and delete action. Editing supports category-name changes plus image URL upload/file upload/remove.
- Category image uploads are resized in the browser before being stored as compact WebP data URLs, keeping each category image in its own Firestore document rather than adding a large catalog blob.
- Existing local category names are migrated into Firestore when the shared category collection is first initialized.
- The homepage Shop by category shelf now shows the first 15 shared categories and links to a dedicated all-categories page.
- The new all-categories page uses large circular category images, six categories per desktop row, responsive scrolling down the page, and links each category directly to the existing shop category filter.
- Existing product-category assignments are preserved when a category is renamed; deleting a category now also persists the corresponding product assignment cleanup/move before removing the category record.
- Firebase product schema and existing Recently Viewed/More to love logic remain unchanged.
- Status: completed after repository verification.


## Step 9: Homepage category images
- Fixed the homepage Shop by category mapper so it preserves each shared Firestore category's `image` field instead of rebuilding the category with an empty image.
- The homepage now uses the exact same category image stored by the Admin category editor and displayed on the all-categories page.
- Category IDs are also preserved from the shared records; fallback categories are still generated only when the shared category collection is unavailable.
- Status: completed.


## Step 10: Product image save reliability
- Product image file uploads are now resized to a maximum 1000px dimension and encoded as WebP before being stored in the Firestore product document.
- This prevents large original camera/image files and multiple uploads from unnecessarily exceeding Firestore's 1 MiB document limit.
- The admin product save error now exposes the underlying Firestore error message in addition to logging the detailed error object, making future rule/storage failures diagnosable instead of always showing a generic rules message.
- Direct image URLs continue to work unchanged.
- Status: completed.


## Step 11: ImageKit media storage integration

- New product and category image uploads now target ImageKit instead of storing new image data inside Firestore.
- The browser requests short-lived ImageKit upload authentication from the Cloudflare Worker at `gifty-hamper.arindia-in.workers.dev`; the ImageKit private key is never included in frontend code.
- Product documents retain the existing `images` array for compatibility and also store parallel `imageKitFileIds` metadata for managed-file deletion.
- Category documents retain the existing `image` field and also store `imageFileId` metadata for managed-file deletion.
- Direct image URLs entered through the Admin UI are imported into ImageKit first, so new catalog images are consistently managed by ImageKit.
- Existing Base64/data-URL images remain supported and are not deleted automatically during this migration.
- Product-image removal and product deletion remove associated ImageKit assets when a managed ImageKit file ID is available. Category image replacement/removal and category deletion follow the same rule.
- Firebase Cloud Functions are no longer used for ImageKit operations, so this integration does not require Firebase Blaze or Firebase Cloud Functions billing.
- Added `wrangler.toml` and `cloudflare-worker/src/index.js` for the secure ImageKit Worker backend.
- Status: frontend integration and Worker code are committed. The remaining deployment step is to add the ImageKit private key as a Cloudflare Worker Secret and let the existing Cloudflare Git deployment publish the new Worker script.

### Cloudflare Worker deployment checklist

1. In Cloudflare Workers & Pages, keep the existing `gifty-hamper` Worker connected to the GitHub repository.
2. The repository now contains `wrangler.toml` with `main = "cloudflare-worker/src/index.js"`. This changes the deployment from the previous static-assets-only setup to an actual Worker script.
3. In the Worker settings, add the encrypted secret named `IMAGEKIT_PRIVATE_KEY`. Paste the ImageKit private key only into Cloudflare's secret field; never commit it to GitHub or put it in frontend JavaScript.
4. Allow the Git-connected deployment to run `npx wrangler deploy`. After deployment, the Worker endpoint remains `https://gifty-hamper.arindia-in.workers.dev`.
5. Test the Worker endpoint in a browser: `https://gifty-hamper.arindia-in.workers.dev/` should return a small JSON status response. ImageKit endpoints additionally require a valid Firebase-authenticated catalog staff account.
6. Test Admin product image upload, category image upload, direct URL import, image removal, product deletion and category deletion.
7. Existing Firestore-hosted Base64/data-URL images remain intact. Only newly managed ImageKit files are removed through the ImageKit file ID metadata.
8. Do not run `firebase deploy --only functions`, do not add the ImageKit private key to Firebase, and do not upgrade the Firebase project to Blaze for this feature.
9. Never commit the ImageKit private key or expose it in `js/`, HTML, GitHub Actions logs, or other frontend files.


## Step 12 — Stage category images until save
- Category image selection is now staged in the admin editor instead of uploading immediately to ImageKit.
- File/URL selection shows a preview, but ImageKit upload happens only when the category is actually saved.
- If category save fails, any newly uploaded ImageKit file is deleted automatically.
- Cancel/close or replacing a pending selection no longer creates unnecessary ImageKit assets.
- Existing saved category ImageKit files remain protected until the new category save succeeds.
- Removing an existing category image clears Firestore and then deletes the old ImageKit file.
- Admin cache was refreshed so the new workflow is loaded by GitHub Pages.
- Status: completed after repository verification.
