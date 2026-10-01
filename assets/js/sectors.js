/* ============================================================================
   SECTOR CONFIG  —  the ONE place you edit to add / point sectors.
   ============================================================================
   WHERE THE CSV IS LOADED: each sector's `csv` is resolved against CSV_BASE.
     1) SAME REPO (default): put clean CSVs in /data, leave CSV_BASE = "".
        Fetches e.g.  ./data/healthcare.csv
     2) RAW GITHUB URL: set CSV_BASE to a raw base and keep csv = "data/x.csv".
   Relative paths (default) resolve correctly under a /<repo>/ Pages site.
   ============================================================================ */

const CSV_BASE = ""; // "" = same-repo /data folder, or a raw.githubusercontent.com base URL

/* ---- COUNTRY LAYER --------------------------------------------------------
   Data is organised per country: data/<country>/<sector>.csv. Germany is the
   first corridor; add further countries here and drop their files into their
   own folder — nothing else needs to change. The active country resolves from
   the ?country= URL parameter and defaults to Germany. */
const COUNTRIES = [
  { id: "germany", label: "Germany", flag: "\uD83C\uDDE9\uD83C\uDDEA", active: true,
    tagline: "StepStone Germany \u00b7 healthcare, hospitality, logistics" },
  { id: "japan",   label: "Japan",   flag: "\uD83C\uDDEF\uD83C\uDDF5", active: false,
    tagline: "SSW &amp; TITP corridors \u00b7 coming soon" },
  { id: "gulf",    label: "Gulf States", flag: "\uD83C\uDDE6\uD83C\uDDEA", active: false,
    tagline: "GCC corridors \u00b7 coming soon" }
];
const GATI_COUNTRY = (function(){
  try { return new URLSearchParams(window.location.search).get("country") || "germany"; }
  catch(e){ return "germany"; }
})();
if (typeof window !== "undefined"){ window.COUNTRIES = COUNTRIES; window.GATI_COUNTRY = GATI_COUNTRY; }

const SECTORS = [
  {
    id: "healthcare", label: "Healthcare", csv: "healthcare.csv",
    tagline: "Nurses, doctors, care & allied health",
    scope: "ISCO 22 · 32 · 53", accent: "#0F5B5A",
    source: "StepStone Germany",
    kpiNoun: "Clinical Healthcare",
    catColumn: "Employer_Category", catLabel: "Employer Sector", catLabelPlural: "Employer Sectors",     // used in KPI/alert copy
    /* Optional narrative tabs loaded from /content at runtime. Remove to hide. */
    staticTabs: [
      { id: "about", label: "About & Methods",        file: "content/healthcare-about.html" },
      { id: "quals", label: "Qualifications & Skills", file: "content/healthcare-quals.html" },
      { id: "visa",  label: "Visa & Work Authorization", file: "content/healthcare-visa.html" }
    ],
    icon: "M12 21s-6.7-4.35-9.2-8.06C1 10.24 1.9 6.5 5.2 5.6 7.3 5 9.3 6 12 8.7c2.7-2.7 4.7-3.7 6.8-3.1 3.3.9 4.2 4.64 2.4 7.34C18.7 16.65 12 21 12 21z"
  },
  {
    id: "hospitality", label: "Hospitality", csv: "hospitality.csv",
    tagline: "Hotels, kitchens, service & events",
    scope: "ISCO 14 · 51 · 91 · 94", accent: "#C4880C",
    source: "StepStone Germany", kpiNoun: "Hospitality",
    catColumn: "Employer_Category", catLabel: "Employer Sector", catLabelPlural: "Employer Sectors",
    staticTabs: [
      { id: "about", label: "About & Methods",        file: "content/hospitality-about.html" },
      { id: "quals", label: "Qualifications & Skills", file: "content/hospitality-quals.html" },
      { id: "visa",  label: "Visa & Work Authorization", file: "content/hospitality-visa.html" }
    ],
    icon: "M4 3h16v2H4zm2 4h12l-1 13H7L6 7zm4 3v7m4-7v7"
  },
  {
    id: "construction", label: "Construction", csv: "construction.csv",
    tagline: "Skilled building trades & site labour",
    scope: "ISCO 71 · 72 · 74 · 93", accent: "#2D9B9A",
    source: "StepStone Germany", kpiNoun: "Construction",
    staticTabs: [],
    icon: "M3 21h18M6 21V9l6-4 6 4v12M9 21v-6h6v6"
  },
  {
    id: "logistics", label: "Logistics & Transport", csv: "logistics.csv",
    tagline: "Drivers, warehouse, dispatch & supply chain",
    scope: "ISCO 83 · 93 · 43", accent: "#3B6E8F",
    source: "StepStone Germany", kpiNoun: "Logistics",
    catColumn: "Employer_Category", catLabel: "Employer Sector", catLabelPlural: "Employer Sectors",
    staticTabs: [
      { id: "about", label: "About & Methods",        file: "content/logistics-about.html" },
      { id: "quals", label: "Qualifications & Skills", file: "content/logistics-quals.html" },
      { id: "visa",  label: "Visa & Work Authorization", file: "content/logistics-visa.html" }
    ],
    icon: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
  }
];

/* ---------------------------------------------------------------------------
   REGION (Germany) — shared map config for the Regional tab. All sectors here
   are Germany/StepStone. To add another country, add a REGION and point a
   sector at it via sector.region.
   --------------------------------------------------------------------------- */
const REGIONS = {
  germany: {
    label: "Germany",
    unit: "Bundesländer",
    center: [51.2, 10.4], zoom: 5,
    geojson: "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json",
    /* GeoJSON feature .properties.name (German) -> dashboard English state name */
    nameMap: {
      "Baden-Württemberg":"Baden-Württemberg","Bayern":"Bavaria","Berlin":"Berlin",
      "Brandenburg":"Brandenburg","Bremen":"Bremen","Hamburg":"Hamburg","Hessen":"Hesse",
      "Niedersachsen":"Lower Saxony","Mecklenburg-Vorpommern":"Mecklenburg-Vorpommern",
      "Nordrhein-Westfalen":"North Rhine-Westphalia","Rheinland-Pfalz":"Rhineland-Palatinate",
      "Saarland":"Saarland","Sachsen":"Saxony","Sachsen-Anhalt":"Saxony-Anhalt",
      "Schleswig-Holstein":"Schleswig-Holstein","Thüringen":"Thuringia"
    }
  }
};
function regionFor(sector) { return REGIONS[sector.region || "germany"] || REGIONS.germany; }

/* Shared employer-sector (ISIC) colour map. Unknown sectors fall back to teal. */
const ISIC_COLORS = {
  "Residential & Long-term Care":"#1A7B7A","Medical & Dental Practice":"#D4940A",
  "Other Health Services & Industry":"#2D9B9A","Hospitals & Acute Care":"#E8A820",
  "Staffing & Recruitment":"#0F5B5A","Mental Health & Rehabilitation":"#B8D9D9",
  /* hospitality (derived) */
  "Hotels & Accommodation":"#1A7B7A","Restaurants, Cafés & Bars":"#D4940A",
  "Bakeries, Butchers & Food Retail":"#E8A820","Contract & Institutional Catering":"#2D9B9A",
  "Care, Clinic & Community Kitchens":"#4AABAA","Events, Leisure & Travel":"#8A6FBF",
  "System Catering & Fast Food":"#C4626A","Independent Gastronomy & Other":"#5B7C8D",
  "Staffing Agencies & Other":"#0F5B5A",
  /* logistics (derived) */
  "Freight Forwarding & Road Transport":"#1A7B7A","Parcel, Post & Last-mile Delivery":"#D4940A",
  "Warehousing & Fulfilment":"#2D9B9A","Public & Passenger Transport":"#8A6FBF",
  "Waste & Environmental Services":"#6B8E23","Construction & Industrial Transport":"#B8860B",
  "Retail & Wholesale Distribution":"#E8A820","Removals & Courier Services":"#C4626A",
  "Other Logistics Employers":"#5B7C8D"
};

function csvUrlFor(sector) { return CSV_BASE + sector.csv; }
function getSector(id) { return SECTORS.find(function (s) { return s.id === id; }) || null; }

/* resolve each sector's CSV inside the active country's data folder */
SECTORS.forEach(function (s) {
  if (s.csv && s.csv.indexOf("/") === -1) s.csv = "data/" + GATI_COUNTRY + "/" + s.csv;
});
if (typeof window !== "undefined"){ window.SECTORS = SECTORS; window.getSector = getSector; window.csvUrlFor = csvUrlFor; }

/* ============================================================================
   CORESIGNAL LAYER  (additive — nothing above is changed)
   ----------------------------------------------------------------------------
   A second data source alongside StepStone/Germany. Countries and the sectors
   available per country are declared here. Each sector's CSV lives at
   data/<country-id>/<sector>.csv — the SAME folder convention as Germany, so
   you only ever drop CSVs into the right folder. Landing counts self-populate
   from whatever CSV is present (and show an "add data" note until then).

   To add a country: add an entry to CORESIGNAL_COUNTRIES with its sector ids.
   To add a sector to a country: add its id to that country's `sectors` array.
   The sector definitions themselves (icon, scope, tagline, catColumn, tabs)
   are REUSED from the SECTORS list above, so classification/columns are identical.
   ============================================================================ */
const CORESIGNAL_COUNTRIES = [
  { id: "saudi-arabia",        label: "Saudi Arabia",        flag: "🇸🇦",
    tagline: "Gulf corridor · construction, hospitality, logistics",
    sectors: ["construction", "hospitality", "logistics"] },
  { id: "uae",                 label: "United Arab Emirates", flag: "🇦🇪",
    tagline: "Gulf corridor · construction, hospitality, logistics",
    sectors: ["construction", "hospitality", "logistics"] },
  { id: "qatar",               label: "Qatar",               flag: "🇶🇦",
    tagline: "Gulf corridor · construction, hospitality",
    sectors: ["construction", "hospitality"] },
  { id: "kuwait",              label: "Kuwait",              flag: "🇰🇼",
    tagline: "Gulf corridor · construction",
    sectors: ["construction"] },
  { id: "australia",           label: "Australia",           flag: "🇦🇺",
    tagline: "Expanded corridor · healthcare, hospitality",
    sectors: ["healthcare", "hospitality"] },
  { id: "canada",              label: "Canada",              flag: "🇨🇦",
    tagline: "Expanded corridor · logistics, healthcare",
    sectors: ["logistics", "healthcare"] },
  { id: "coresignal-germany",  label: "Germany (CoreSignal)", flag: "🇩🇪",
    tagline: "Structural corridor · healthcare",
    sectors: ["healthcare"] }
];

/* Sectors available for the active CoreSignal country (used by the CoreSignal
   sector landing). Falls back to all SECTORS if the country isn't listed. */
function coresignalCountry(id){
  return (CORESIGNAL_COUNTRIES || []).find(function(c){ return c.id === id; }) || null;
}
function sectorsForCountry(id){
  var c = coresignalCountry(id);
  if (!c) return SECTORS.slice();
  return c.sectors.map(getSector).filter(Boolean);
}
if (typeof window !== "undefined"){
  window.CORESIGNAL_COUNTRIES = CORESIGNAL_COUNTRIES;
  window.coresignalCountry = coresignalCountry;
  window.sectorsForCountry = sectorsForCountry;
}

/* Active-country display helpers used by the dashboard header/footer.
   For the original Germany corridor these return exactly the previous strings. */
function activeCountryLabel(){
  var j = (typeof jobspickrCountry==="function") ? jobspickrCountry(GATI_COUNTRY) : null;
  if (j) return j.label;
  var c = coresignalCountry(GATI_COUNTRY);
  if (c) return c.label;
  if (GATI_COUNTRY === "germany") return "Germany";
  return (window.COUNTRIES||[]).reduce(function(acc,x){ return x.id===GATI_COUNTRY ? x.label : acc; }, "Germany");
}
function activeSourceLabel(defaultSrc){
  if ((typeof jobspickrCountry==="function") && jobspickrCountry(GATI_COUNTRY)) return "JobsPickr";
  if (coresignalCountry(GATI_COUNTRY)) return "CoreSignal";
  return (defaultSrc || "StepStone Germany");
}
if (typeof window !== "undefined"){ window.activeCountryLabel = activeCountryLabel; window.activeSourceLabel = activeSourceLabel; }

/* ============================================================================
   JOBSPICKR LAYER  (additive — a second multi-country source alongside CoreSignal)
   Data lives at data/<country-id>/<sector>.csv, same convention. Country ids are
   prefixed so they never collide with CoreSignal/Germany folders.
   ============================================================================ */
const JOBSPICKR_COUNTRIES = [
  { id: "jp-qatar",             label: "Qatar",                flag: "🇶🇦",
    tagline: "JobsPickr · construction, hospitality", sectors: ["construction","hospitality"] },
  { id: "jp-uae",               label: "United Arab Emirates", flag: "🇦🇪",
    tagline: "JobsPickr · construction, hospitality, logistics", sectors: ["construction","hospitality","logistics"] },
  { id: "jp-saudi-arabia",      label: "Saudi Arabia",         flag: "🇸🇦",
    tagline: "JobsPickr · construction", sectors: ["construction"] },
  { id: "jp-australia",         label: "Australia",            flag: "🇦🇺",
    tagline: "JobsPickr · healthcare, logistics, construction, hospitality", sectors: ["healthcare","logistics","construction","hospitality"] },
  { id: "jp-germany", label: "Germany (JobsPickr)",  flag: "🇩🇪",
    tagline: "JobsPickr · healthcare", sectors: ["healthcare"] }
];
function jobspickrCountry(id){ return (JOBSPICKR_COUNTRIES||[]).find(function(c){return c.id===id;})||null; }

/* unified source resolver so one landing page serves both sources via ?src= */
function countryForSource(src, id){
  if (src === "jobspickr") return jobspickrCountry(id);
  return (typeof coresignalCountry==="function") ? coresignalCountry(id) : null;
}
function sectorsForSourceCountry(src, id){
  var c = countryForSource(src, id);
  if (!c) return SECTORS.slice();
  return c.sectors.map(getSector).filter(Boolean);
}
if (typeof window !== "undefined"){
  window.JOBSPICKR_COUNTRIES = JOBSPICKR_COUNTRIES;
  window.jobspickrCountry = jobspickrCountry;
  window.countryForSource = countryForSource;
  window.sectorsForSourceCountry = sectorsForSourceCountry;
}
