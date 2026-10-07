# data/ — clean sector CSVs

Put one clean CSV per sector here. The dashboard for a sector loads the file
named in `assets/js/sectors.js`.

Expected filenames (default config):

| Sector        | File                  |
| ------------- | --------------------- |
| Healthcare    | `healthcare.csv`      |
| Hospitality   | `hospitality.csv`     |
| Construction  | `construction.csv`    |
| Logistics     | `logistics.csv`       |

`healthcare.csv` currently contains a small **sample** so the dashboard runs out
of the box. Replace it with your real clean CSV (same columns) and add the other
three.

Columns used (from the final classifier output):
`Job_Title, Job_Category, ISCO_4, ISCO_3, ISCO_2, ISCO_4_name, State,
Company_Name, Employer_Category, Date_Posted, Employment_type, Salary,
Description, Requirements, Benefits, Work_Type, Job_URL, Job_ID, Scope_Category`

Rows whose `Scope_Category` (or `Job_Category`) is `Out of Scope` /
`CLASSIFICATION_FAILED`, or that have no `ISCO_4`, are dropped from the analysis.

## Adding another country (draft cards)

The dashboards are country-generic. To add a country as a draft card next to
Germany, do two things, nothing else:

1. Drop its CSVs in a new folder: `data/<country-id>/<sector>.csv`
   (same filenames: healthcare.csv, hospitality.csv, construction.csv, logistics.csv).

2. Add one line to `COUNTRIES` in `assets/js/sectors.js`:
   `{ id: "<country-id>", label: "<Name>", flag: "<emoji>", active: true,
      landing: "germany.html?country=<country-id>", tagline: "<short note>" }`

The country card then reuses the existing sector landing and the existing
dashboards with no new pages. Clicking a sector opens
`dashboard.html?sector=<id>&country=<country-id>`, which loads that folder.

## Country column and the Country Breakdown tab

New multi-country datasets should carry ALL the Germany columns above, PLUS a
final `Country` column. When a loaded CSV has a non-empty `Country` column, the
dashboard shows an extra "Country Breakdown" tab (postings by country). Germany
StepStone data has no Country column, so that tab never appears there. Nothing
else changes.
