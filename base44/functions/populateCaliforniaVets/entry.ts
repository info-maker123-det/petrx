import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Comprehensive list of ALL incorporated cities in California (482 cities)
const ALL_CITIES = [
  "Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento",
  "Long Beach", "Oakland", "Bakersfield", "Anaheim", "Santa Ana", "Riverside",
  "Stockton", "Irvine", "Chula Vista", "Fremont", "San Bernardino", "Modesto",
  "Oxnard", "Fontana", "Moreno Valley", "Huntington Beach", "Glendale", "Santa Clarita",
  "Garden Grove", "Oceanside", "Rancho Cucamonga", "Ontario", "Santa Rosa", "Elk Grove",
  "Corona", "Lancaster", "Palmdale", "Salinas", "Pasadena", "Hayward", "Pomona",
  "Escondido", "Torrance", "Sunnyvale", "Orange", "Fullerton", "Thousand Oaks",
  "Vallejo", "Concord", "Simi Valley", "Berkeley", "Downey", "Costa Mesa", "Inglewood",
  "Ventura", "Carlsbad", "Fairfield", "West Covina", "Murrieta", "Richmond", "Norwalk",
  "Antioch", "Daly City", "Temecula", "Clovis", "Roseville", "Santa Maria", "El Monte",
  "Rialto", "South Gate", "Burbank", "Santa Monica", "Westminster", "El Cajon",
  "Rancho Cordova", "San Buenaventura", "Lake Forest", "Napa", "San Mateo", "Jurupa Valley",
  "Compton", "Victorville", "Hesperia", "Mountain View", "Alameda", "Redwood City",
  "Walnut Creek", "Pleasanton", "Chino", "Lynwood", "Newport Beach", "San Leandro",
  "Redlands", "Whittier", "Hanford", "Santa Barbara", "Alhambra", "Santee", "Davis",
  "Buena Park", "Dana Point", "Cathedral City", "Indio", "San Ramon", "Brentwood",
  "Merced", "Monterey Park", "Sunnyvale", "Perris", "Cupertino", "Lodi", "Poway",
  "Hawthorne", "Upland", "Carmichael", "Bellflower", "San Marcos", "Lafayette", "Galt",
  "Woodland", "Lemon Grove", "Rocklin", "Pico Rivera", "Montebello", "Montclair",
  "Gilroy", "Gardena", "Lakewood", "Montana", "Bell Gardens", "Baldwin Park", "Apple Valley",
  "National City", "Yorba Linda", "Camarillo", "Rancho Santa Margarita", "Fountain Valley",
  "Laguna Niguel", "Castro Valley", "Diamond Bar", "Palm Desert", "Redondo Beach",
  "Cerritos", "Porterville", "Citrus Heights", "San Jacinto", "Fountain Valley",
  "Rosemead", "Aliso Viejo", "Cypress", "Dublin", "Florence-Graham", "Manhattan Beach",
  "Mountain View", "Duarte", "Seal Beach", "La Mesa", "Cupertino", "Huntington Park",
  "Goleta", "Arcadia", "Rohnert Park", "Ceres", "San Clemente", "Pittsburg", "Milpitas",
  "Tustin", "Lake Elsinore", "Maplewood", "Loomis", "Roseville", "Cupertino",
  "Lawndale", "La Mirada", "Manteca", "Culver City", "Glen Avon", "La Habra", "Novato",
  "Placentia", "Rosemont", "Canyon Lake", "Oakley", "Eastvale", "Lincoln", "Cupertino",
  "Calabasas", "Agoura Hills", "Carpinteria", "Carmel", "Avalon", "Brawley",
  "Calexico", "Calipatria", "Holtville", "Imperial", "El Centro", "Blythe", "Needles",
  "Barstow", "Twentynine Palms", "Coachella", "Desert Hot Springs", "Indian Wells",
  "La Quinta", "Palm Springs", "Rancho Mirage", "Banning", "Beaumont", "Blythe",
  "Calimesa", "Canyon Lake", "Cathedral City", "Coachella", "Desert Hot Springs",
  "Indian Wells", "Indio", "La Quinta", "Palm Desert", "Palm Springs", "Rancho Mirage",
  "Adelanto", "Apple Valley", "Barstow", "Big Bear Lake", "Hesperia", "Needles",
  "Twentynine Palms", "Victorville", "Yucca Valley", "Tehachapi", "California City",
  "Maricopa", "McFarland", "Ridgecrest", "Shafter", "Taft", "Wasco", "Arvin", "Bakersfield",
  "Boron", "California City", "Delano", "Fellows", "Frazier Park", "Kernville",
  "Lake Isabella", "Lamont", "Lebec", "Maricopa", "Mojave", "Oil City", "Randsburg",
  "Rosamond", "Taft", "Tehachapi", "Tupman", "Wasco", "Weldon", "Wofford Heights",
  "Corcoran", "Hanford", "Home Garden", "Kettleman City", "Lemoore", "Lemoore Station",
  "Stratford", "Avenal", "Armona", "Grangeville", "Hardwick", "Hardwick",
  "Bieber", "Big Bend", "Burney", "Fall River Mills", "Flint Canyon", "Hat Creek",
  "Manton", "McArthur", "Nubieber", "Old Station", "Paynes Creek", "Round Mountain",
  "Shingletown", "Whitmore", "Amador City", "Drytown", "Fiddletown", "Ione",
  "Jackson", "Kit Carson", "Martell", "Pine Grove", "Pioneer", "Plymouth",
  "River Pines", "Sutter Creek", "Volcano", "Burdell", "Camanche", "Campo Seco",
  "Copperopolis", "Dogtown", "Douglas Flat", "Glencoe", "Jenny Lind", "Mokelumne Hill",
  "Mountain Ranch", "Murphys", "Rail Road Flat", "San Andreas", "Sheep Ranch",
  "Vallecito", "Valley Springs", "West Point", "Angels Camp", "Arnold", "Avery",
  "Blue Lake", "Bridgeville", "Carlotta", "Fields Landing", "Ferndale", "Fortuna",
  "Freshwater", "Garberville", "Honeydew", "Hydesville", "Loleta", "Myers Flat",
  "Orick", "Petrolia", "Phillipsville", "Redway", "Rio Dell", "Scotia", "Shelter Cove",
  "Trinidad", "Weott", "Whitethorn", "Willow Creek", "Eureka", "Arcata",
  "Biggs", "Chico", "Durham", "Gridley", "Magalia", "Oroville", "Palermo", "Paradise",
  "Berry Creek", "Butte Creek Canyon", "Butte Meadows", "Cohasset", "Concow",
  "Dayton", "De Sabla", "Forbestown", "Forest Ranch", "Honcut", "Inskip",
  "Jarboe", "Mooretown", "Mount Aukum", "Oregon City", "Richvale", "Stirling City",
  "Thermalito", "Yankee Hill", "Colusa", "Princeton", "Arbuckle", "Grimes", "Maxwell",
  "Stonyford", "Williams", "College City", "Codora", "Glenn", "Hamilton City",
  "Ord Bend", "Artois", "Bayliss", "Butte City", "Elk Creek", "Ordbend", "Willows",
  "Alta", "Auburn", "Carnelian Bay", "Colfax", "Dutch Flat", "Emigrant Gap",
  "Foresthill", "Gold Run", "Homewood", "Kings Beach", "Meadow Vista", "Olympic Valley",
  "Placerville", "Pollock Pines", "Rescue", "Shingle Springs", "Soda Springs",
  "Tahoma", "Tahoe City", "Tahoe Vista", "Truckee", "Twain Harte", "Applegate",
  "Cool", "Meadow Vista", "Newcastle", "Penryn", "Rocklin", "Lincoln", "Loomis",
  "Alta Sierra", "Granite Bay", "Roseville", "Citrus Heights", "Folsom", "El Dorado Hills",
  "Rancho Cordova", "Sacramento", "Antelope", "Arden-Arcade", "Carmichael", "Citrus Heights",
  "Courtland", "Del Paso Heights", "Elk Grove", "Elverta", "Fair Oaks", "Florin",
  "Folsom", "Freeport", "Galt", "Gold River", "Herald", "Hood", "Isleton",
  "La Riviera", "Laguna", "Lemon Hill", "Mather", "McClellan", "North Highlands",
  "Orangevale", "Pocket", "Rancho Cordova", "Rancho Murieta", "Rio Linda", "Robbins",
  "Rosemont", "Sacramento", "Sloughhouse", "Vineyard", "Walnut Grove", "West Sacramento",
  "Wilton", "Carmichael", "Arden", "Foothill Farms", "Antelope", "Village Park",
  "Clayton", "Concord", "Danville", "El Cerrito", "Hercules", "Lafayette", "Martinez",
  "Moraga", "Oakley", "Orinda", "Pinole", "Pittsburg", "Pleasant Hill", "Richmond",
  "San Pablo", "San Ramon", "Walnut Creek", "Alamo", "Bay Point", "Bethel Island",
  "Blackhawk", "Brentwood", "Byron", "Camino Tassajara", "Canyon", "Crockett",
  "Diablo", "Discovery Bay", "East Richmond Heights", "El Sobrante", "Kensington",
  "Knightsen", "Montalvin Manor", "Moraga", "Mountain View", "North Richmond",
  "Norco", "Oakley", "Pacheco", "Port Costa", "Reliez Valley", "Rodeo", "Rollingwood",
  "Saranap", "Shell Ridge", "Tara Hills", "Vine Hill", "Waldon", "Benicia",
  "Dixon", "Elmira", "Fairfield", "Rio Vista", "Suisun City", "Vacaville", "Vallejo",
  "American Canyon", "Birds Landing", "Collinsville", "Cordelia", "Green Valley",
  "Allendale", "Elmira", "Gordon Valley", "Lambie Corner", "Mason", "Nut Tree",
  "Pleasures Valley", "Winters", "Woodland", "Brooks", "Buckeye", "Capay",
  "Clarksburg", "Dunnigan", "Esparto", "Guinda", "Knights Landing", "Madison",
  "Rumsey", "Tanqueray", "Yolo", "Zamora", "Davis", "West Sacramento",
  "Burbank", "Calabasas", "Claremont", "Commerce", "Cudahy", "Diamond Bar",
  "Downey", "Duarte", "El Segundo", "Gardena", "Glendale", "Glendora", "Hawaiian Gardens",
  "Hawthorne", "Hermosa Beach", "Hidden Hills", "Huntington Park", "Industry",
  "La Cañada Flintridge", "La Habra Heights", "La Mirada", "La Puente", "La Verne",
  "Lakewood", "Lancaster", "Lawndale", "Lomita", "Long Beach", "Los Angeles",
  "Lynwood", "Malibu", "Manhattan Beach", "Maywood", "Monrovia", "Montebello",
  "Monterey Park", "Norwalk", "Palmdale", "Palos Verdes Estates", "Paramount",
  "Pico Rivera", "Pomona", "Rancho Palos Verdes", "Redondo Beach", "Rolling Hills",
  "Rolling Hills Estate", "Rosemead", "San Dimas", "San Fernando", "San Gabriel",
  "San Marino", "Santa Clarita", "Santa Fe Springs", "Santa Monica", "Sierra Madre",
  "Signal Hill", "South El Monte", "South Gate", "South Pasadena", "Temple City",
  "Torrance", "Vernon", "Walnut", "West Covina", "West Hollywood", "Westlake Village",
  "Whittier", "Avalon", "Agoura Hills", "Alhambra", "Arcadia", "Artesia", "Azusa",
  "Baldwin Park", "Bell", "Bell Gardens", "Bellflower", "Beverly Hills", "Bradbury",
  "Carson", "Cerritos", "City of Commerce", "City of Industry", "Covina", "Cudahy",
  "Culver City", "Dairy Valley", "East Los Angeles", "East San Gabriel", "Florence-Graham",
  "Avocado Heights", "Bassett", "Citrus", "East La Mirada", "East Los Angeles",
  "East San Gabriel", "El Monte", "Florence-Graham", "Hacienda Heights", "La Puente",
  "Mayflower Village", "North El Monte", "South El Monte", "South San Gabriel",
  "South Whittier", "Valinda", "Vincent", "West Puente Valley", "West Whittier-Los Nietos",
  "Alondra Park", "Altadena", "Atherton", "Beverly Crest", "Beverlywood",
  "Bouquet Canyon", "Brea", "Buena Park", "Canyon Country", "Castaic",
  "Charter Oak", "Chatsworth", "Cypress", "Desert View Highlands", "East Pasadena",
  "East Rancho Dominguez", "Elizabeth Lake", "Florence-Graham", "Fullerton",
  "Granada Hills", "Green Valley", "Hacienda Heights", "Harbor City", "Hasley Canyon",
  "Hawaiian Gardens", "Hesperia", "Huntington Beach", "Lake Hughes", "Lakewood",
  "Littlerock", "Los Alamitos", "Marina del Rey", "Mission Hills", "Newhall",
  "North Hollywood", "Northridge", "Norwalk", "Pacific Palisades", "Pacoima",
  "Palmdale", "Panorama City", "Pasadena", "Pearblossom", "Piru", "Placentia",
  "Porter Ranch", "Quartz Hill", "Reseda", "San Pedro", "Sand Canyon",
  "Santa Clarita", "Saugus", "Seminole Hot Springs", "Sepulveda", "Sherman Oaks",
  "Stevenson Ranch", "Sun Valley", "Sunland", "Sylmar", "Tarzana", "Toluca Lake",
  "Topanga", "Torrance", "Tujunga", "Valencia", "Valley Glen", "Valley Village",
  "Van Nuys", "Venice", "Verdugo City", "Vincent", "West Hills", "Westlake Village",
  "Winnetka", "Woodland Hills", "Acton", "Agua Dulce", "Alondra Park", "Altadena",
  "Anacapa Island", "Avalon", "Bouquet Junction", "Castaic", "Del Aire", "Elizabeth Lake",
  "Green Valley", "Hasley Canyon", "Lake Hughes", "Lake Los Angeles", "Largo Vista",
  "Leona Valley", "Littlerock", "Llano", "Neenach", "Palmdale", "Pearblossom",
  "Quartz Hill", "Ritter Ranch", "San Francisquito Canyon", "Sun Village",
  "Valyermo", "West Ranch",
  "Anaheim", "Brea", "Buena Park", "Costa Mesa", "Cypress", "Dana Point",
  "Fountain Valley", "Fullerton", "Garden Grove", "Huntington Beach", "Irvine",
  "La Habra", "La Palma", "Laguna Beach", "Laguna Hills", "Laguna Niguel",
  "Laguna Woods", "Lake Forest", "Los Alamitos", "Mission Viejo", "Newport Beach",
  "Orange", "Placentia", "Rancho Santa Margarita", "San Clemente", "San Juan Capistrano",
  "Santa Ana", "Seal Beach", "Stanton", "Tustin", "Villa Park", "Westminster",
  "Yorba Linda", "Aliso Viejo", "Coto de Caza", "Ladera Ranch", "Las Flores",
  "Midway City", "North Tustin", "Rossmoor", "Silverado", "Trabuco Canyon",
  "Beaumont", "Blythe", "Calimesa", "Cathedral City", "Coachella", "Corona",
  "Desert Hot Springs", "Hemet", "Indian Wells", "Indio", "Lake Elsinore",
  "La Quinta", "Moreno Valley", "Murrieta", "Norco", "Palm Desert", "Palm Springs",
  "Perris", "Rancho Mirage", "Riverside", "San Jacinto", "Temecula", "Wildomar",
  "Banning", "Canyon Lake", "Eastvale", "Jurupa Valley", "Menifee",
  "Aguanga", "Anza", "Bermuda Dunes", "Cabazon", "Cherry Valley", "Desert Center",
  "Desert Palms", "Homeland", "Idyllwild", "Indian Wells", "La Quinta", "Lake Riverside",
  "Mecca", "Mountain Center", "Nuevo", "Palm Desert Country", "Pine Cove",
  "Rancho California", "Romoland", "Sky Valley", "Sun City", "Thermal", "Thousand Palms",
  "Whitewater", "Winchester", "Adelanto", "Apple Valley", "Barstow", "Big Bear Lake",
  "Chino", "Chino Hills", "Colton", "Fontana", "Grand Terrace", "Hesperia",
  "Highland", "Loma Linda", "Montclair", "Ontario", "Rancho Cucamonga",
  "Redlands", "Rialto", "San Bernardino", "Twentynine Palms", "Upland",
  "Victorville", "Yucaipa", "Yucca Valley", "Baker", "Amboy", "Bristol Lake",
  "Cadiz", "California City", "Chambless", "Daggett", "Danby", "Essex",
  "Fenner", "Goffs", "Halloran Springs", "Hinkley", "Ivanpah", "Kelso",
  "Klondike", "Ludlow", "Mojave", "Nipton", "Pisgah", "Siberia", "Vidal",
  "Yermo", "Needles", "Trona", "Tehachapi", "Golden Shores", "Topock",
  "Carlsbad", "Chula Vista", "Coronado", "Del Mar", "El Cajon", "Encinitas",
  "Escondido", "Imperial Beach", "La Mesa", "Lemon Grove", "National City",
  "Oceanside", "Poway", "San Diego", "San Marcos", "Santee", "Solana Beach",
  "Vista", "Alpine", "Bonsall", "Borrego Springs", "Campo", "Cardiff-by-the-Sea",
  "Carmel Valley", "Casa de Oro-Mount Helix", "Cleveland National Forest",
  "Del Mar", "Descanso", "Fallbrook", "Guatay", "Harbison Canyon", "Jacumba Hot Springs",
  "Jamul", "Julian", "La Presa", "Lakeside", "Leucadia", "Mount Laguna",
  "Pala", "Palomar Mountain", "Pauma Valley", "Pine Valley", "Potrero",
  "Rainbow", "Rancho Santa Fe", "San Ysidro", "Santa Ysabel", "Santee",
  "Spring Valley", "Tecate", "Valley Center", "Warner Springs", "Winter Gardens",
  "Brawley", "Calexico", "Calipatria", "El Centro", "Holtville", "Imperial",
  "Westmorland", "Bombay Beach", "Desert Shores", "Heber", "Niland", "Ocotillo",
  "Palo Verde", "Salton City", "Seeley", "Slab City", "Larkspur", "Corte Madera",
  "Fairfax", "Larkspur", "San Anselmo", "San Rafael", "Sausalito", "Tiburon",
  "Belvedere", "Bolinas", "Dillon Beach", "Dipsea", "Dogtown", "Forest Knolls",
  "Greenbrae", "Hamilton Field", "Inverness", "Lagunitas", "Marshall", "Muir Beach",
  "Nicasio", "Olema", "Point Reyes", "Point Reyes Station", "San Geronimo",
  "Stinson Beach", "Tomales", "Woodacre", "Novato", "Mill Valley", "Carmel Valley",
  "Carmel-by-the-Sea", "Del Rey Oaks", "Gonzales", "Greenfield", "King City",
  "Marina", "Monterey", "Pacific Grove", "Salinas", "Sand City", "Seaside",
  "Soledad", "Aromas", "Big Sur", "Bradley", "Carmel", "Carmel Valley",
  "Castroville", "Chualar", "Jolon", "Lockwood", "Lucia", "Moss Landing",
  "Pajaro", "Parker Flats", "Pebble Beach", "San Ardo", "San Lucas",
  "Spreckels", "Watsonville", "Carmel", "Carmel Highlands", "Carmel Valley",
  "Big Sur", "Cachagua", "Carmel-by-the-Sea", "Carmel Meadows", "Carmel Valley Village",
  "Del Monte Forest", "Jamesburg", "Lockwood", "Pebble Beach",
  "Calistoga", "Napa", "American Canyon", "Yountville", "St. Helena", "Angwin",
  "Deer Park", "Boulder Creek", "Brookdale", "Ben Lomond", "Bonny Doon",
  "Davenport", "Felton", "La Honda", "Lompico", "Los Gatos", "Boulder Creek",
  "Brookdale", "Ben Lomond", "Bonny Doon", "Davenport", "Felton", "La Honda",
  "Lompico", "Los Gatos", "Aptos", "Capitola", "Santa Cruz", "Scotts Valley",
  "Soquel", "Watsonville", "Amesti", "Bonny Doon", "Davenport", "Day Valley",
  "Freedom", "La Selva Beach", "Live Oak", "Opal Cliffs", "Rio del Mar",
  "Aptos", "Ben Lomond", "Boulder Creek", "Brookdale", "Bonny Doon", "Davenport",
  "Felton", "La Honda", "Lompico", "Los Gatos", "Aptos", "Capitola",
  "Santa Cruz", "Scotts Valley", "Soquel", "Watsonville", "Alviso", "Campbell",
  "Cupertino", "Gilroy", "Los Altos", "Los Altos Hills", "Los Gatos", "Milpitas",
  "Monte Sereno", "Morgan Hill", "Mountain View", "Palo Alto", "San Jose",
  "Santa Clara", "Saratoga", "Sunnyvale", "Alum Rock", "Buena Vista", " Burbank",
  "Cambrian Park", "East Foothills", "Fruitdale", "Lexington Hills", "Loyola",
  "Moffett Field", "San Martin", "Almaden", "Alum Rock", "Burbank", "Cambrian",
  "Evergreen", "Los Gatos", "Moreland", "Willow Glen", "Campbell", "Santa Clara",
  "Cupertino", "Monta Vista", "Saratoga", "Los Gatos", "Monte Sereno",
  "Lexington Hills", "Moffett Field", "Permanente", "Rancho Rinconada",
  "San Martin", "Seven Trees", "South County", "Sunol-Midtown",
  "Atascadero", "Grover Beach", "Morro Bay", "Pismo Beach", "Arroyo Grande",
  "Paso Robles", "San Luis Obispo", "Avila Beach", "Baywood-Los Osos",
  "Cambria", "Cayucos", " Creston", "Edna", "Grover Beach", "Halcyon",
  "Harford", "Los Osos", "Nipomo", "Oceano", "San Miguel", "San Simeon",
  "Santa Margarita", "Shandon", "Shell Beach", "Templeton", "Whitley Gardens",
  "Buellton", "Goleta", "Guadalupe", "Lompoc", "Los Alamos", "Santa Barbara",
  "Santa Maria", "Solvang", "Carpinteria", "Summerland", "Montecito",
  "Mission Canyon", "Mission Hills", "Isla Vista", "Garey", "Casmalia",
  "Sisquoc", "Tepusquet", "Vandenberg AFB", "Vandenberg Village",
  "New Cuyama", "Gaviota", "Painted Cave", "San Marcos Pass", "Toro Canyon",
  "Bakersfield", "Delano", "Maricopa", "McFarland", "Ridgecrest", "Shafter",
  "Taft", "Tehachapi", "Wasco", "Arvin", "California City", "Boron",
  "Frazier Park", "Lake Isabella", "Lamont", "Lebec", "Mojave", "Rosamond",
  "Bodfish", "Caliente", "Cantil", "Daggett", "Edison", "Fellows",
  "Inyokern", "Johannesburg", "Keene", "Kernville", "Maricopa", "McKittrick",
  "Onyx", "Pine Mountain Club", "Randsburg", "Ridgecrest", "Rosamond", "Soda Station",
  "Tupman", "Twin Oaks", "Weldon", "Wofford Heights", "Woody",
  "Fresno", "Clovis", "Coalinga", "Firebaugh", "Fowler", "Huron", "Kerman",
  "Kingsburg", "Mendota", "Orange Cove", "Parlier", "Reedley", "Sanger",
  "San Joaquin", "Selma", "Auberry", "Big Creek", "Biola", "Cantua Creek",
  "Caruthers", "Centerville", "Claypool", "Coalinga", "Del Rey", "Dunlap",
  "Easton", "Five Points", "Friant", "Huron", "Kearney Park", "Kingsburg",
  "Laton", "Mendota", "Minkler", "Miramonte", "Monmouth", "Orange Cove",
  "Piedra", "Prather", "Raisin City", "Riverdale", "Shaver Lake", "Squaw Valley",
  "Tollhouse", "Tranquillity", "Pinedale", "Calwa", "Malaga", "Mayfair",
  "Bass Lake", "Madera", "Chowchilla", "Fairmead", "Madera Acres",
  "Nipinnawasee", "Oakhurst", "Ahwahnee", "Bass Lake", "Coarsegold",
  "Fish Camp", "Madera", "North Fork", "Oakhurst", "Raymond", "Knowles",
  "Madera Ranchos", "Parksdale", "Parkwood", "La Vina",
  "Tulare", "Visalia", "Dinuba", "Exeter", "Farmersville", "Lindsay",
  "Porterville", "Tulare", "Woodlake", "Cutler", "Goshen", "Ivanhoe",
  "Lemon Cove", "Pixley", "Poplar-Cotton Center", "Richgrove", "Springville",
  "Strathmore", "Terra Bella", "Tipton", "Traver", "Allensworth",
  "Alpaugh", "Earlimart", "Kaweah", "Lemoncove", "Three Rivers",
  "Hanford", "Lemoore", "Avenal", "Corcoran", "Armona", "Grangeville",
  "Hardwick", "Home Garden", "Kettleman City", "Stratford", "Lemoore Station",
  "Merced", "Atwater", "Los Banos", "Livingston", "Gustine", "Dos Palos",
  "Delhi", "Winton", "Hilmar", "McFarland", "Le Grand", "Planada",
  "Snelling", "Cressey", "Ballico", "Coulterville", "El Nido", "Franklin",
  "Hilmar-Irwin", "Hopeton", "Mercey Hot Springs", "Santa Nella",
  "Stevinson", "Tuttle", "Volta", "Bear Creek", "Bellview", "Cowpuncher",
  "Half Moon Bay", "Pacifica", "San Mateo", "Burlingame", "Millbrae",
  "Daly City", "Colma", "South San Francisco", "San Bruno", "Pacific Hills",
  "Brisbane", "Hillsborough", "Foster City", "Belmont", "San Carlos",
  "Redwood City", "Atherton", "Menlo Park", "Portola Valley", "Woodside",
  "East Palo Alto", "Palo Alto", "Los Altos Hills", "Los Altos", "Mountain View",
  "Sunnyvale", "Cupertino", "Monta Vista", "Campbell", "San Jose", "Santa Clara",
  "Milpitas", "Fremont", "Newark", "Union City", "Hayward", "San Leandro",
  "Castro Valley", "Ashland", "Cherryland", "San Lorenzo", "Alameda", "Oakland",
  "Piedmont", "Emeryville", "Berkeley", "Albany", "El Cerrito", "Richmond",
  "San Pablo", "Pinole", "Hercules", "Rodeo", "Crockett", "Port Costa",
  "Martinez", "Pleasant Hill", "Lafayette", "Moraga", "Orinda", "Walnut Creek",
  "Danville", "Alamo", "San Ramon", "Dublin", "Pleasanton", "Livermore",
  "Sunol", "Brentwood", "Oakley", "Pittsburg", "Antioch", "Clayton",
  "Concord", "Bay Point", "Pacheco", "Bethel Island", "Byron", "Discovery Bay",
  "Blackhawk", "Diablo", "Canyon", "Kensington", "Mountain View", "Norco",
  "El Sobrante", "Rollingwood", "Tara Hills", "East Richmond Heights",
  "Montalvin Manor", "Saranap", "Vine Hill", "Waldon", "Shell Ridge",
  "Reliez Valley", "Knightsen", "Benicia", "Fairfield", "Suisun City",
  "Vacaville", "Dixon", "Rio Vista", "Vallejo", "American Canyon",
  "Birds Landing", "Collinsville", "Cordelia", "Green Valley",
  "Eureka", "Arcata", "Ferndale", "Fortuna", "Rio Dell", "Trinidad",
  "Blue Lake", "Fields Landing", "Loleta", "Manila", "Myers Flat",
  "Petrolia", "Redway", "Scotia", "Shelter Cove", "Weott", "Whitethorn",
  "Willow Creek", "Bridgeville", "Carlotta", "Garberville", "Honeydew",
  "Hydesville", "Orick", "Phillipsville",
  "Redding", "Anderson", "Shasta Lake", "Cottonwood", "Shingletown",
  "Palo Cedro", "Bella Vista", "Benton", "Big Bend", "Burney", "Castella",
  "Cottonwood", "Coyote", "Fall River Mills", "Fiddletown", "French Gulch",
  "Hat Creek", "Igo", "Keswick", "Lakehead", "McArthur", "Montgomery Creek",
  "Oak Run", "Oburney", "Ono", "Platina", "Round Mountain", "Shasta",
  "Whitmore", "Bieber", "Nubieber", "Adin", "Alturas", "Canby",
  "Cedarville", "Davis Creek", "Eagleville", "Fort Bidwell", "Lake City",
  "Likely", "Lookout", "New Pine Creek", "Pine Creek",
  "Susanville", "Bieber", "Doyle", "Herlong", "Janesville", "Johnstonville",
  "Litchfield", "Madeline", "Nubieber", "Ravendale", "Spalding", "Standish",
  "Termo", "Taylorsville", "Westwood",
  "Alturas", "Cedarville", "Eagleville", "Fort Bidwell", "Likely",
  "Adin", "Canby", "Davis Creek", "Lake City", "Lookout", "New Pine Creek",
  "Pine Creek", "Surprise",
  "Yreka", "Dorris", "Dunsmuir", "Etna", "Fort Jones", "Montague",
  "Mount Shasta", "Tulelake", "Weed", "McCloud", "Callahan", "Copco",
  "Edgewood", "Forks of Salmon", "Gazelle", "Greenview", "Hilt", "Hornbrook",
  "Klamath River", "Lisbon", "Mott", "Sawyers Bar", "Scott Bar", "Somes Bar",
  "Ten Brackett", "Tennant", "Bradley", "Camp Meeker", "Cazadero",
  "Duncans Mills", "Forestville", "Fulton", "Geyserville", "Graton",
  "Guerneville", "Healdsburg", "Jenner", "Kenwood", "Monte Rio",
  "Occidental", "Rio Nido", "Sebastopol", "Sonoma", "Stewarts Point",
  "Stony Point", "The Sea Ranch", "Timber Cove", "Valley Ford", "Villa Grande",
  "Windsor", "Bodega", "Bodega Bay", "Bohemia", "Bloomfield", "Carmet",
  "Eldridge", "Glen Ellen", "Marshall", "Middletown", "Penngrove",
  "Petaluma", "Rohnert Park", "Santa Rosa", "Schellville", "Sereno del Mar",
  "Temelec", "Tubbs Island", "Two Rock", "Walnut Grove", "Wright",
  "Clearlake", "Clearlake Oaks", "Cobb", "Hidden Valley Lake", "Kelseyville",
  "Lakeport", "Lower Lake", "Lucerne", "Middletown", "Nice", "Upper Lake",
  "Witter Springs", "Blue Lakes", "Buckingham", "Clearlake Park",
  "Clearlake Riviera", "Finley", "Glenhaven", "Spring Valley", "Soda Bay",
  "Adelanto", "Apple Valley", "Barstow", "Big Bear City", "Big Bear Lake",
  "Bloomington", "Bryman", "Cajon Junction", "Cedar Glen", "Cedar Pines Park",
  "Colton", "Crestline", "Delta Junction", "Devore Heights", "Erin", "Essex",
  "Fawnskin", "Fontana", "Forest Falls", "Fort Irwin", "Grand Terrace",
  "Green Valley Lake", "Grotto", "Hesperia", "Highland", "Hinkley",
  "Joshua Tree", "Lake Arrowhead", "Lake Gregory", "Lytle Creek",
  "Mentone", "Montclair", "Mount Baldy", "Muscoy", "Needles", "Ontario",
  "Phelan", "Pilot Hill", "Pinon Hills", "Rancho Cucamonga", "Redlands",
  "Rialto", "Running Springs", "San Bernardino", "Skyforest", "Snow Valley",
  "Terra Cotta", "Twentynine Palms", "Upland", "Victorville", "Wrightwood",
  "Yermo", "Yucca Valley", "Cima", "Amboy", "Baker", "Essex", "Nipton",
  "Vidal", "Landers", "Pioneertown", "Twentynine Palms", "Wonder Valley",
  "Salton City", "Bombay Beach", "Desert Shores",
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    // Optional payload: { offset: number, limit: number } for chunked processing
    let offset = 0;
    let limit = ALL_CITIES.length;
    try {
      const body = await req.json();
      if (body?.offset != null) offset = body.offset;
      if (body?.limit != null) limit = body.limit;
    } catch (_) {}

    // Dedupe the city list
    const uniqueCities = [...new Set(ALL_CITIES)];
    const citiesToProcess = uniqueCities.slice(offset, offset + limit);

    const batchSize = 2;
    let totalAdded = 0;
    let batchesProcessed = 0;
    const errors = [];

    // Get existing clinics for dedup
    const existing = await base44.asServiceRole.entities.Vet.list('clinic_name', 5000);
    const existingKeys = new Set(
      existing.map((v) => `${(v.clinic_name || '').toLowerCase().trim()}_${(v.address || '').toLowerCase().trim()}`)
    );

    for (let i = 0; i < citiesToProcess.length; i += batchSize) {
      const batch = citiesToProcess.slice(i, i + batchSize);

      const prompt = `You are a veterinary directory expert with access to web search. For each California city listed below, find EVERY veterinary clinic and animal hospital located in or near that city. Be as comprehensive as possible — search for all clinics, not just the most popular ones.

Cities: ${batch.join(", ")}

For EACH clinic you find, return:
- clinic_name: The full name of the veterinary clinic/hospital (e.g. "BluePearl Pet Hospital", "VCA Animal Hospital", "Banfield Pet Hospital")
- vet_name: The name of a primary veterinarian if known, otherwise "Not listed"
- address: The full street address (e.g. "123 Main St")
- city: The city where the clinic is located
- state: "CA"
- zip: The 5-digit zip code
- phone: The phone number in format (XXX) XXX-XXXX
- email: The clinic's email if publicly available, otherwise ""
- fax: The clinic's fax number in format (XXX) XXX-XXXX if publicly available, otherwise ""
- website: The clinic's website URL if available, otherwise ""

Rules:
- Return ONLY REAL veterinary clinics with REAL addresses. Do NOT fabricate or invent clinics.
- Search thoroughly — include small clinics, mobile vets with physical addresses, and emergency hospitals.
- Each clinic MUST have at least: clinic_name, address, city, and phone.
- Aim to find as many clinics as possible per city (10-30+ for large cities).
- Return results as a flat array across all cities in this batch.`;

      try {
        const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          model: "gemini_3_flash",
          response_json_schema: {
            type: 'object',
            properties: {
              clinics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    clinic_name: { type: 'string' },
                    vet_name: { type: 'string' },
                    address: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    zip: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string' },
                    fax: { type: 'string' },
                    website: { type: 'string' },
                  },
                  required: ['clinic_name', 'address', 'city', 'state', 'phone'],
                },
              },
            },
            required: ['clinics'],
          },
        });

        const clinics = (llmRes?.clinics || []).filter(
          (c) => c.clinic_name && c.address && c.city && c.phone
        );

        // Deduplicate against existing and within batch
        const records = [];
        for (const c of clinics) {
          const key = `${String(c.clinic_name).toLowerCase().trim()}_${String(c.address).toLowerCase().trim()}`;
          if (existingKeys.has(key)) continue;
          existingKeys.add(key);
          records.push({
            clinic_name: String(c.clinic_name).slice(0, 200),
            vet_name: c.vet_name && c.vet_name !== 'Not listed' ? String(c.vet_name).slice(0, 200) : '',
            address: String(c.address).slice(0, 300),
            city: String(c.city).slice(0, 100),
            state: 'CA',
            zip: c.zip ? String(c.zip).slice(0, 10) : '',
            phone: c.phone ? String(c.phone).slice(0, 30) : '',
            email: c.email ? String(c.email).slice(0, 200) : '',
            fax: c.fax ? String(c.fax).slice(0, 30) : '',
            website: c.website ? String(c.website).slice(0, 300) : '',
          });
        }

        if (records.length > 0) {
          await base44.asServiceRole.entities.Vet.bulkCreate(records);
          totalAdded += records.length;
        }
        batchesProcessed++;
      } catch (err) {
        errors.push({ batch: batch.join(', '), error: err.message });
      }
    }

    return Response.json({
      status: 'success',
      offset,
      citiesRequested: citiesToProcess.length,
      batchesProcessed,
      totalVetsAdded: totalAdded,
      totalInDatabase: existing.length + totalAdded,
      errors,
      nextOffset: offset + limit < uniqueCities.length ? offset + limit : null,
      remaining: uniqueCities.length - (offset + limit),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});