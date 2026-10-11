# Digger Calibration v1.1.0
Offline iPhone PWA for Survey GPS minus Excavator GPS checks, ore digging checklist, signatures, CSV and PDF exports.

## Job flow
New job fields: Operator Name, Excavator (EX prefix), Bench/Flitch, Shot, R/L, Block ID, Location (Cloud Kicker Pit or Crown Prince Pit). Date and time are captured once in Perth time on Save. Unknown optional details remain blank. Checklist choices are explicit Yes, No, N/A for all five items in the supplied Ore Digging Checklist.

Calibration input, prefixes (707 Northing, 64 Easting), tolerances and signed averages retain version 1 behavior. Limits are inclusive: Northing/Easting ±0.400 m; RL ±0.200 m. Coordinates accept up to three decimal places. Edit replaces a record. Next adds another.

Finish displays signed averages. Sign off job asks for Surveyor Name and finger signature, then Operator Name and finger signature. Each can be explicitly skipped. The PDF says Signature skipped when skipped; it never represents missing signatures as signed. These are drawn acknowledgements, not cryptographic digital signatures. All fail results remain visible. Editing job details, checklist or a calibration invalidates previous signatures and requires a fresh sign-off.

After sign-off, Export CSV & PDF / Share CSV & PDF opens the native share sheet for both files where supported. Save to Files or choose an email app; the app does not send email by itself. Separate CSV and PDF download buttons are available when combined file sharing is unsupported. Files are prepared before the sharing tap so iOS retains its user gesture. PDF contains the selected job only; CSV contains all saved jobs. Saved jobs can be reopened from the job list for export, updating details or sign-off. New-job drafts and unfinished signatures recover after closing the app.

## CSV compatibility
The first 11 columns are exactly:
Location, Time, Date, Excavator, Shot, Survey Northing, Survey Easting, Survey RL, Excavator Northing, Excavator Easting, Excavator RL.

Additional columns follow these: Operator Name, Bench/Flitch, R/L, Block ID, five checklist answers, Surveyor Name, Surveyor Signature Status, Operator Signature Status. Existing jobs have blank new details and Not completed statuses. Averages and signature drawings are not in the CSV.

## PDF
Page 1 reproduces the supplied form's logo, details, checklist and acknowledgements (Surveyor replaces the original Geology signatory as requested). Calibration pages show Survey, Excavator and signed Difference with pass/fail on every axis. Six calibrations per page; 8-10 calibrations produce three pages in total. Font and line wrapping adapt to long details. Standard PDF fonts cover Western European names; unsupported glyphs are replaced with a question mark. PDF creation is entirely local using the bundled pdf-lib MIT library, no CDN or server requests beyond cached app files.

## Data and updating
Retains the `digger-calibration-v1` storage key, existing rows, timestamps and identifiers. No deletion or reset is needed. Keep using the same installed Home Screen app and URL. Safari and Home Screen apps can have separate storage. Export periodically: browser data is not a durable backup. Signature drawings remain on the phone until the user exports/shares the document; they are not uploaded to GitHub.

Open online and close/reopen to pick up the v1.1.0 cache; check the displayed version and Offline ready, then test Airplane Mode. Do not clear website data or remove/reinstall the app to update because that can erase records. The app caches PDF library and logo alongside the UI.

## Hosting
GitHub Pages deploys from main / (root). No build step or dependency installation is needed. Publish all static files, including report.js, vendor/pdf-lib.min.js, vendor/pdf-lib-LICENSE.md, and ozland-logo.png.

## Checks
`node --test tests/*.test.cjs`
Automated tests cover boundary math, CSV column order, editing, persistence, explicit skipped sign-offs, signature invalidation, legacy records, and multi-page PDF generation. PDF page images are inspected during development. Physical iPhone signing and native share sheet behavior still require device validation.
