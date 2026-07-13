// Fetches current weather for every city below in a SINGLE batched
// Open-Meteo request, and writes the result to weather.json.
// Run on a schedule by .github/workflows/update-weather.yml — this is
// the ONLY thing that ever calls the Open-Meteo API. All 30+ signage
// screens read weather.json instead, so Open-Meteo's rate limit is
// never touched no matter how many screens you deploy.

import { writeFileSync } from 'fs';

// Keep this list in sync with PINNED + POOL in the signage HTML file.
// Only name/lat/lon are needed here (timezone is only used client-side
// for rendering the clock face, not for the weather lookup).
const CITIES = [
  ["Makati",14.5547,121.0244],
  ["Sydney",-33.8688,151.2093],
  ["New Delhi",28.6139,77.2090],
  ["Beijing",39.9042,116.4074],
  ["London",51.5074,-0.1278],
  ["Tokyo",35.6762,139.6503],
  ["Berlin",52.52,13.405],
  ["Paris",48.8566,2.3522],
  ["New York",40.7128,-74.0060],
  ["Los Angeles",34.0522,-118.2437],
  ["Dubai",25.2048,55.2708],
  ["Singapore",1.3521,103.8198],
  ["Hong Kong",22.3193,114.1694],
  ["Seoul",37.5665,126.9780],
  ["Bangkok",13.7563,100.5018],
  ["Jakarta",-6.2088,106.8456],
  ["Mumbai",19.0760,72.8777],
  ["Moscow",55.7558,37.6173],
  ["Cairo",30.0444,31.2357],
  ["Johannesburg",-26.2041,28.0473],
  ["Nairobi",-1.2921,36.8219],
  ["Istanbul",41.0082,28.9784],
  ["Rome",41.9028,12.4964],
  ["Madrid",40.4168,-3.7038],
  ["Amsterdam",52.3676,4.9041],
  ["Toronto",43.6532,-79.3832],
  ["Chicago",41.8781,-87.6298],
  ["Mexico City",19.4326,-99.1332],
  ["Sao Paulo",-23.5505,-46.6333],
  ["Buenos Aires",-34.6037,-58.3816],
  ["Vancouver",49.2827,-123.1207],
  ["Honolulu",21.3069,-157.8583],
  ["Auckland",-36.8485,174.7633],
  ["Dublin",53.3498,-6.2603],
  ["Zurich",47.3769,8.5417],
  ["Stockholm",59.3293,18.0686],
  ["Lagos",6.5244,3.3792],
  ["Riyadh",24.7136,46.6753],
  ["Kuala Lumpur",3.1390,101.6869],
  ["Taipei",25.0330,121.5654]
];

async function main(){
  const lats = CITIES.map(c => c[1]).join(',');
  const lons = CITIES.map(c => c[2]).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code`;

  const res = await fetch(url);
  if(!res.ok){
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }
  const data = await res.json();
  // With multiple locations, Open-Meteo returns an array of forecast
  // objects, in the same order as the input lat/lon lists.
  const list = Array.isArray(data) ? data : [data];

  const out = { generatedAt: new Date().toISOString(), cities: {} };
  CITIES.forEach((c, i) => {
    const d = list[i];
    if(d && d.current){
      out.cities[c[0]] = {
        temp: Math.round(d.current.temperature_2m),
        code: d.current.weather_code
      };
    }
  });

  writeFileSync('weather.json', JSON.stringify(out));
  console.log(`Wrote weather.json with ${Object.keys(out.cities).length} cities`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
