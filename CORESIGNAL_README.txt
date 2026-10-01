CORESIGNAL DATA — where to drop CSVs
====================================
Each CoreSignal country has its own folder. Put a sector CSV in its country
folder using the sector's file name. The landing cards and dashboards pick it
up automatically (counts refresh from the file itself; no build step).

Folder            Accepts these files
----------------  -------------------------------------------
saudi-arabia/     construction.csv  hospitality.csv  logistics.csv
uae/              construction.csv  hospitality.csv  logistics.csv
qatar/            construction.csv  hospitality.csv
kuwait/           construction.csv
australia/        healthcare.csv    hospitality.csv
canada/           logistics.csv     healthcare.csv
coresignal-germany/  healthcare.csv

To add a country or sector, edit CORESIGNAL_COUNTRIES in assets/js/sectors.js
(a country's `sectors: [...]` list controls which cards show) and create the
matching data/<country-id>/ folder. CSV columns must match the dashboard schema
(the standardizer notebook produces exactly these).
