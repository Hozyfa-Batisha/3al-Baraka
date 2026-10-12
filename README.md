# SunSeat

SunSeat is a React Native / Expo prototype that recommends the more comfortable side of a public-transport vehicle by combining trip direction, the sun's position, travel time, and weather conditions.

## What is included

- Going to work / going home route toggle
- Bus, metro, and tram transport choices
- Sun and weather summary
- Trip duration and compass direction
- Seat-side recommendation with a simple vehicle layout
- Practical comfort tip for wind, rain, and heat

The current screen uses representative Cairo route and weather data so the interaction can be explored without API keys. The UI state is already structured so live maps, weather, and sun-position services can be added later.

## Run locally

Requirements:

- Node.js 18 or newer
- Expo Go on a physical device, or an Android/iOS simulator

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Then scan the QR code with Expo Go, or press `a` for Android, `i` for iOS, or `w` for the web preview.

Useful scripts:

```bash
npm run android
npm run ios
npm run web
```

## Project structure

- `App.js` - single-screen app and interaction logic
- `app.json` - Expo app metadata
- `package.json` - scripts and runtime dependencies

## Next integration steps

1. Replace the representative route object with a directions API response.
2. Add device location permission and a map provider.
3. Add a weather provider and a solar-position calculation for the trip timestamp.
4. Expand transport layouts to match individual vehicle models and seat numbering.
