// Location taxonomy — the single source of truth for places, mirroring the
// pattern in categories.ts. Hierarchy: country → state → metro. US-only for
// now, but the shape leaves room to add more countries later.

export type Metro = { slug: string; name: string };
export type UsState = { code: string; name: string; metros: Metro[] };

export const COUNTRY = "United States";

/** Cookie that stores the visitor's chosen metro slug. */
export const PLACE_COOKIE = "place";

// Every state has at least 3 metros; larger states have more. Slugs are
// globally unique, so cities that share a name across states carry a state
// suffix (e.g. columbia-sc vs columbia-mo). DC is a single city by nature.
export const STATES: UsState[] = [
  { code: "AL", name: "Alabama", metros: [{ slug: "birmingham", name: "Birmingham" }, { slug: "huntsville", name: "Huntsville" }, { slug: "montgomery", name: "Montgomery" }, { slug: "mobile", name: "Mobile" }] },
  { code: "AK", name: "Alaska", metros: [{ slug: "anchorage", name: "Anchorage" }, { slug: "fairbanks", name: "Fairbanks" }, { slug: "juneau", name: "Juneau" }] },
  { code: "AZ", name: "Arizona", metros: [{ slug: "phoenix", name: "Phoenix" }, { slug: "tucson", name: "Tucson" }, { slug: "mesa", name: "Mesa" }, { slug: "flagstaff", name: "Flagstaff" }] },
  { code: "AR", name: "Arkansas", metros: [{ slug: "little-rock", name: "Little Rock" }, { slug: "fayetteville-ar", name: "Fayetteville" }, { slug: "fort-smith", name: "Fort Smith" }] },
  { code: "CA", name: "California", metros: [{ slug: "los-angeles", name: "Los Angeles" }, { slug: "sf-bay-area", name: "SF Bay Area" }, { slug: "san-diego", name: "San Diego" }, { slug: "sacramento", name: "Sacramento" }, { slug: "fresno", name: "Fresno" }, { slug: "orange-county", name: "Orange County" }, { slug: "inland-empire", name: "Inland Empire" }, { slug: "bakersfield", name: "Bakersfield" }] },
  { code: "CO", name: "Colorado", metros: [{ slug: "denver", name: "Denver" }, { slug: "colorado-springs", name: "Colorado Springs" }, { slug: "boulder", name: "Boulder" }, { slug: "fort-collins", name: "Fort Collins" }] },
  { code: "CT", name: "Connecticut", metros: [{ slug: "hartford", name: "Hartford" }, { slug: "new-haven", name: "New Haven" }, { slug: "bridgeport", name: "Bridgeport" }, { slug: "stamford", name: "Stamford" }] },
  { code: "DE", name: "Delaware", metros: [{ slug: "wilmington-de", name: "Wilmington" }, { slug: "dover-de", name: "Dover" }, { slug: "newark-de", name: "Newark" }] },
  { code: "DC", name: "District of Columbia", metros: [{ slug: "washington-dc", name: "Washington, DC" }] },
  { code: "FL", name: "Florida", metros: [{ slug: "miami", name: "Miami" }, { slug: "orlando", name: "Orlando" }, { slug: "tampa", name: "Tampa" }, { slug: "jacksonville", name: "Jacksonville" }, { slug: "fort-lauderdale", name: "Fort Lauderdale" }, { slug: "tallahassee", name: "Tallahassee" }, { slug: "fort-myers", name: "Fort Myers" }, { slug: "sarasota", name: "Sarasota" }] },
  { code: "GA", name: "Georgia", metros: [{ slug: "atlanta", name: "Atlanta" }, { slug: "savannah", name: "Savannah" }, { slug: "augusta-ga", name: "Augusta" }, { slug: "athens-ga", name: "Athens" }, { slug: "columbus-ga", name: "Columbus" }] },
  { code: "HI", name: "Hawaii", metros: [{ slug: "honolulu", name: "Honolulu" }, { slug: "maui", name: "Maui" }, { slug: "hilo", name: "Hilo / Big Island" }] },
  { code: "ID", name: "Idaho", metros: [{ slug: "boise", name: "Boise" }, { slug: "idaho-falls", name: "Idaho Falls" }, { slug: "coeur-dalene", name: "Coeur d’Alene" }] },
  { code: "IL", name: "Illinois", metros: [{ slug: "chicago", name: "Chicago" }, { slug: "springfield-il", name: "Springfield" }, { slug: "peoria", name: "Peoria" }, { slug: "rockford", name: "Rockford" }, { slug: "champaign", name: "Champaign-Urbana" }] },
  { code: "IN", name: "Indiana", metros: [{ slug: "indianapolis", name: "Indianapolis" }, { slug: "fort-wayne", name: "Fort Wayne" }, { slug: "bloomington-in", name: "Bloomington" }, { slug: "south-bend", name: "South Bend" }] },
  { code: "IA", name: "Iowa", metros: [{ slug: "des-moines", name: "Des Moines" }, { slug: "cedar-rapids", name: "Cedar Rapids" }, { slug: "iowa-city", name: "Iowa City" }] },
  { code: "KS", name: "Kansas", metros: [{ slug: "wichita", name: "Wichita" }, { slug: "topeka", name: "Topeka" }, { slug: "lawrence-ks", name: "Lawrence" }, { slug: "overland-park", name: "Overland Park" }] },
  { code: "KY", name: "Kentucky", metros: [{ slug: "louisville", name: "Louisville" }, { slug: "lexington", name: "Lexington" }, { slug: "bowling-green", name: "Bowling Green" }] },
  { code: "LA", name: "Louisiana", metros: [{ slug: "new-orleans", name: "New Orleans" }, { slug: "baton-rouge", name: "Baton Rouge" }, { slug: "shreveport", name: "Shreveport" }, { slug: "lafayette-la", name: "Lafayette" }] },
  { code: "ME", name: "Maine", metros: [{ slug: "portland-me", name: "Portland" }, { slug: "bangor", name: "Bangor" }, { slug: "augusta-me", name: "Augusta" }] },
  { code: "MD", name: "Maryland", metros: [{ slug: "baltimore", name: "Baltimore" }, { slug: "annapolis", name: "Annapolis" }, { slug: "frederick", name: "Frederick" }, { slug: "silver-spring", name: "Silver Spring" }] },
  { code: "MA", name: "Massachusetts", metros: [{ slug: "boston", name: "Boston" }, { slug: "worcester", name: "Worcester" }, { slug: "springfield-ma", name: "Springfield" }, { slug: "cape-cod", name: "Cape Cod" }] },
  { code: "MI", name: "Michigan", metros: [{ slug: "detroit", name: "Detroit" }, { slug: "grand-rapids", name: "Grand Rapids" }, { slug: "ann-arbor", name: "Ann Arbor" }, { slug: "lansing", name: "Lansing" }, { slug: "flint", name: "Flint" }, { slug: "kalamazoo", name: "Kalamazoo" }] },
  { code: "MN", name: "Minnesota", metros: [{ slug: "minneapolis", name: "Minneapolis" }, { slug: "st-paul", name: "St. Paul" }, { slug: "duluth", name: "Duluth" }, { slug: "rochester-mn", name: "Rochester" }] },
  { code: "MS", name: "Mississippi", metros: [{ slug: "jackson-ms", name: "Jackson" }, { slug: "gulfport", name: "Gulfport" }, { slug: "hattiesburg", name: "Hattiesburg" }] },
  { code: "MO", name: "Missouri", metros: [{ slug: "kansas-city", name: "Kansas City" }, { slug: "st-louis", name: "St. Louis" }, { slug: "springfield-mo", name: "Springfield" }, { slug: "columbia-mo", name: "Columbia" }] },
  { code: "MT", name: "Montana", metros: [{ slug: "billings", name: "Billings" }, { slug: "missoula", name: "Missoula" }, { slug: "bozeman", name: "Bozeman" }] },
  { code: "NE", name: "Nebraska", metros: [{ slug: "omaha", name: "Omaha" }, { slug: "lincoln", name: "Lincoln" }, { slug: "grand-island", name: "Grand Island" }] },
  { code: "NV", name: "Nevada", metros: [{ slug: "las-vegas", name: "Las Vegas" }, { slug: "reno", name: "Reno" }, { slug: "carson-city", name: "Carson City" }] },
  { code: "NH", name: "New Hampshire", metros: [{ slug: "manchester-nh", name: "Manchester" }, { slug: "nashua", name: "Nashua" }, { slug: "concord-nh", name: "Concord" }] },
  { code: "NJ", name: "New Jersey", metros: [{ slug: "north-jersey", name: "North Jersey" }, { slug: "central-jersey", name: "Central Jersey" }, { slug: "south-jersey", name: "South Jersey" }, { slug: "jersey-shore", name: "Jersey Shore" }] },
  { code: "NM", name: "New Mexico", metros: [{ slug: "albuquerque", name: "Albuquerque" }, { slug: "santa-fe", name: "Santa Fe" }, { slug: "las-cruces", name: "Las Cruces" }] },
  { code: "NY", name: "New York", metros: [{ slug: "new-york", name: "New York City" }, { slug: "long-island", name: "Long Island" }, { slug: "hudson-valley", name: "Hudson Valley" }, { slug: "buffalo", name: "Buffalo" }, { slug: "rochester-ny", name: "Rochester" }, { slug: "syracuse", name: "Syracuse" }, { slug: "albany", name: "Albany" }] },
  { code: "NC", name: "North Carolina", metros: [{ slug: "charlotte", name: "Charlotte" }, { slug: "raleigh", name: "Raleigh" }, { slug: "asheville", name: "Asheville" }, { slug: "greensboro", name: "Greensboro" }, { slug: "durham", name: "Durham" }, { slug: "wilmington-nc", name: "Wilmington" }] },
  { code: "ND", name: "North Dakota", metros: [{ slug: "fargo", name: "Fargo" }, { slug: "bismarck", name: "Bismarck" }, { slug: "grand-forks", name: "Grand Forks" }] },
  { code: "OH", name: "Ohio", metros: [{ slug: "columbus", name: "Columbus" }, { slug: "cleveland", name: "Cleveland" }, { slug: "cincinnati", name: "Cincinnati" }, { slug: "toledo", name: "Toledo" }, { slug: "akron", name: "Akron" }, { slug: "dayton", name: "Dayton" }] },
  { code: "OK", name: "Oklahoma", metros: [{ slug: "oklahoma-city", name: "Oklahoma City" }, { slug: "tulsa", name: "Tulsa" }, { slug: "norman", name: "Norman" }] },
  { code: "OR", name: "Oregon", metros: [{ slug: "portland", name: "Portland" }, { slug: "eugene", name: "Eugene" }, { slug: "salem-or", name: "Salem" }, { slug: "bend", name: "Bend" }] },
  { code: "PA", name: "Pennsylvania", metros: [{ slug: "philadelphia", name: "Philadelphia" }, { slug: "pittsburgh", name: "Pittsburgh" }, { slug: "harrisburg", name: "Harrisburg" }, { slug: "allentown", name: "Allentown" }, { slug: "erie", name: "Erie" }, { slug: "scranton", name: "Scranton" }] },
  { code: "RI", name: "Rhode Island", metros: [{ slug: "providence", name: "Providence" }, { slug: "newport-ri", name: "Newport" }, { slug: "warwick", name: "Warwick" }] },
  { code: "SC", name: "South Carolina", metros: [{ slug: "charleston-sc", name: "Charleston" }, { slug: "columbia-sc", name: "Columbia" }, { slug: "greenville-sc", name: "Greenville" }, { slug: "myrtle-beach", name: "Myrtle Beach" }] },
  { code: "SD", name: "South Dakota", metros: [{ slug: "sioux-falls", name: "Sioux Falls" }, { slug: "rapid-city", name: "Rapid City" }, { slug: "pierre", name: "Pierre" }] },
  { code: "TN", name: "Tennessee", metros: [{ slug: "nashville", name: "Nashville" }, { slug: "memphis", name: "Memphis" }, { slug: "knoxville", name: "Knoxville" }, { slug: "chattanooga", name: "Chattanooga" }] },
  { code: "TX", name: "Texas", metros: [{ slug: "austin", name: "Austin" }, { slug: "dallas", name: "Dallas / Fort Worth" }, { slug: "houston", name: "Houston" }, { slug: "san-antonio", name: "San Antonio" }, { slug: "el-paso", name: "El Paso" }, { slug: "corpus-christi", name: "Corpus Christi" }, { slug: "lubbock", name: "Lubbock" }, { slug: "waco", name: "Waco" }] },
  { code: "UT", name: "Utah", metros: [{ slug: "salt-lake-city", name: "Salt Lake City" }, { slug: "provo", name: "Provo" }, { slug: "ogden", name: "Ogden" }] },
  { code: "VT", name: "Vermont", metros: [{ slug: "burlington-vt", name: "Burlington" }, { slug: "montpelier", name: "Montpelier" }, { slug: "rutland", name: "Rutland" }] },
  { code: "VA", name: "Virginia", metros: [{ slug: "richmond", name: "Richmond" }, { slug: "virginia-beach", name: "Virginia Beach" }, { slug: "norfolk", name: "Norfolk" }, { slug: "arlington-va", name: "Arlington" }, { slug: "charlottesville", name: "Charlottesville" }] },
  { code: "WA", name: "Washington", metros: [{ slug: "seattle", name: "Seattle" }, { slug: "spokane", name: "Spokane" }, { slug: "tacoma", name: "Tacoma" }, { slug: "bellingham", name: "Bellingham" }, { slug: "olympia", name: "Olympia" }] },
  { code: "WV", name: "West Virginia", metros: [{ slug: "charleston-wv", name: "Charleston" }, { slug: "morgantown", name: "Morgantown" }, { slug: "huntington-wv", name: "Huntington" }] },
  { code: "WI", name: "Wisconsin", metros: [{ slug: "milwaukee", name: "Milwaukee" }, { slug: "madison", name: "Madison" }, { slug: "green-bay", name: "Green Bay" }, { slug: "appleton", name: "Appleton" }] },
  { code: "WY", name: "Wyoming", metros: [{ slug: "cheyenne", name: "Cheyenne" }, { slug: "casper", name: "Casper" }, { slug: "jackson-wy", name: "Jackson Hole" }] },
];

export type Place = {
  slug: string;
  name: string;
  stateCode: string;
  stateName: string;
  /** "Seattle, WA" — handy display label. */
  label: string;
};

export const PLACES: Place[] = STATES.flatMap((s) =>
  s.metros.map((m) => ({
    slug: m.slug,
    name: m.name,
    stateCode: s.code,
    stateName: s.name,
    label: `${m.name}, ${s.code}`,
  }))
);

export const PLACE_MAP: Record<string, Place> = Object.fromEntries(
  PLACES.map((p) => [p.slug, p])
);

export function getPlace(slug: string | undefined | null): Place | undefined {
  return slug ? PLACE_MAP[slug] : undefined;
}

export function isValidPlace(slug: string | undefined | null): boolean {
  return Boolean(slug && slug in PLACE_MAP);
}
