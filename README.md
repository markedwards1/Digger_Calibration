# Digger Calibration
Offline iPhone PWA for Survey GPS − Excavator GPS checks. No account, dependencies or server database. Jobs and drafts are saved in localStorage on the device. Export CSV regularly; browser storage is not a permanent backup.

## Use
1. New job: excavator EX number, Cloud Kicker Pit or Crown Prince Pit, Shot number. Save captures Perth date (DD/MM/YYYY) and time once for all rows in that job.
2. Enter full Northing, Easting and RL for Survey and Excavator GPS. Northing starts with 707 and Easting with 64. Add remaining digits or replace the complete value. Maximum 3 decimal places.
3. Calculate saves one row and shows signed differences. Pass is inclusive ±0.400 m for Northing/Easting, ±0.200 m for RL.
4. Next calibration adds another row; Edit replaces the current row. Finish shows arithmetic signed means (opposite signs can cancel). Means are not exported.
5. Export downloads a CSV of every calibration across every job. Share opens iOS sharing when supported. New jobs append to the saved dataset. Clear all data requires confirmation.

CSV columns: Location, Time, Date, excavator, Shot, Survey Northing, Survey Easting, Survey RL, Excavator Northing, Excavator Easting, Excavator RL.

## Publish on GitHub
Create a repository named `Digger_Calibration`. Upload the contents of this folder, including `.github/workflows/pages.yml`, on branch `main`. In Settings → Pages choose **GitHub Actions** as the source. Run the Deploy GitHub Pages workflow. This is a static app; it needs no secrets. Your coordinate records remain in your phone browser, not in GitHub.

Alternatively upload the static files to the root of the repository and use Settings → Pages → Deploy from a branch → main / (root).

## Install on iPhone
Open the HTTPS GitHub Pages URL in Safari while online. Wait for **Offline ready**. Tap Share → Add to Home Screen (Open as Web App if offered). Open the installed icon once while online, wait for Offline ready, then test in Airplane Mode. Safari and Home Screen apps may have separate storage: enter and export records consistently from the installed app. CSV sharing requires a compatible iOS share target; Export is the fallback.

## Verify
`node --test tests/*.test.cjs`

Field checks before production: enter a known pair of coordinates, check signs and boundaries; edit without duplication; add another row; finish/export; close/reopen with a draft; test offline; verify CSV in your office spreadsheet. Browser UI and physical iPhone checks have not been completed in the build environment.

## Updating
Change the cache version in `sw.js` whenever static app files change. Keep the storage key unless providing a migration. Opening online loads a new service worker; reopen the app after updating. Do not clear website data to update, as doing so deletes calibration records.
