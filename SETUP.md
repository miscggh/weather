# Shared weather hub — setup (one-time, ~5 minutes)

This makes ONE scheduled job fetch weather for all your cities, and every
signage screen just reads that shared result instead of calling
Open-Meteo itself. No server to run or maintain.

## 1. Create the repo
1. Go to https://github.com/new
2. Name it anything, e.g. `signage-weather`. Public repo (required for
   the free GitHub Pages tier).
3. Upload these three files, keeping the folder structure:
   - `update-weather.mjs`
   - `weather.json`
   - `.github/workflows/update-weather.yml`
   (Easiest way: on the repo page, "Add file" → "Upload files", drag all
   three in — GitHub preserves the `.github/workflows/` path automatically
   if you drag the whole folder, or create the file manually via
   "Add file" → "Create new file" and paste in the path
   `.github/workflows/update-weather.yml`.)

## 2. Enable GitHub Pages
1. In the repo, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to "Deploy from a branch".
3. Branch: `main`, folder: `/ (root)`. Save.
4. GitHub will give you a URL like:
   `https://YOUR_USERNAME.github.io/signage-weather/`
   Your weather file will be at:
   `https://YOUR_USERNAME.github.io/signage-weather/weather.json`

## 3. Run the workflow once manually
1. Go to the **Actions** tab → "Update shared weather.json" → **Run workflow**.
2. Wait ~30 seconds, then open your weather.json URL from step 2 in a
   browser — you should see real temperatures for all cities.
3. After this, it re-runs automatically every 15 minutes forever.

## 4. Point the signage HTML at your hub
In the clock HTML file, find this line near the top of the `<script>`:

```js
const WEATHER_HUB_URL='https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/weather.json';
```

Replace it with your actual URL from step 2, then deploy that same HTML
file to all 30+ signages. They'll all read from the one shared file.

## Notes
- If you ever add/remove a city in the signage HTML's `POOL`/`PINNED`
  list, add/remove it in `update-weather.mjs`'s `CITIES` list too, so
  the hub keeps covering every city the screens can show.
- If the hub is briefly unreachable, each screen falls back to calling
  Open-Meteo directly for just that one missing city (same safety net
  as before) — so weather doesn't just disappear, it only means a
  handful of direct calls happen occasionally instead of zero.
- GitHub's free tier easily covers this: Pages bandwidth and Actions
  minutes are both far beyond what 96 runs/day of a tiny script needs.
