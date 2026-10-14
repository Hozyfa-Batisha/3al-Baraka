import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  ink: '#102033',
  navy: '#13273c',
  navySoft: '#1d3852',
  paper: '#f5f6f2',
  paperAlt: '#e8ece8',
  white: '#ffffff',
  muted: '#73818c',
  line: '#dce3df',
  sun: '#f4b84a',
  sunSoft: '#fff1ce',
  green: '#3b8c71',
};

const MAP_POINTS = [
  { id: 'maadi', name: 'Maadi', area: 'South Cairo', x: 24, y: 70, weather: { temp: '24°', description: 'Clear skies, light breeze', wind: '12 km/h', rain: 'No rain', sun: 'E 82°' } },
  { id: 'downtown', name: 'Downtown', area: 'Central Cairo', x: 52, y: 45, weather: { temp: '25°', description: 'Bright and calm', wind: '10 km/h', rain: 'No rain', sun: 'E 84°' } },
  { id: 'dokki', name: 'Dokki', area: 'West Cairo', x: 35, y: 38, weather: { temp: '24°', description: 'Clear, mild breeze', wind: '11 km/h', rain: 'No rain', sun: 'E 83°' } },
  { id: 'zamalek', name: 'Zamalek', area: 'Island district', x: 58, y: 27, weather: { temp: '24°', description: 'Clear with soft wind', wind: '13 km/h', rain: 'No rain', sun: 'E 81°' } },
  { id: 'heliopolis', name: 'Heliopolis', area: 'East Cairo', x: 78, y: 24, weather: { temp: '26°', description: 'Sunny and dry', wind: '15 km/h', rain: 'No rain', sun: 'E 86°' } },
];

function Icon({ name, size = 18, color = COLORS.ink }) {
  return <Feather name={name} size={size} color={color} />;
}

function ChoiceChip({ label, active, onPress, icon }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.choiceChip, active && styles.choiceChipActive]}
      onPress={onPress}
    >
      {icon ? <Icon name={icon} size={15} color={active ? COLORS.white : COLORS.muted} /> : null}
      <Text style={[styles.choiceLabel, active && styles.choiceLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function MapPicker({ activePoint, selectionMode, startPoint, endPoint, onSelect }) {
  return (
    <View style={styles.mapCard}>
      <View style={styles.mapHeader}>
        <View><Text style={styles.cardEyebrow}>TAP A REGION</Text><Text style={styles.mapTitle}>Choose {selectionMode === 'start' ? 'your start' : 'destination'}</Text></View>
        <Icon name="map" size={20} color={COLORS.navy} />
      </View>
      <View style={styles.mapSurface}>
        <View style={styles.mapRiver} />
        <View style={[styles.mapRoute, { transform: [{ rotate: '-28deg' }] }]} />
        {MAP_POINTS.map((point) => {
          const selected = point.id === activePoint.id;
          const isStart = point.id === startPoint.id;
          const isEnd = point.id === endPoint.id;
          return (
            <TouchableOpacity key={point.id} activeOpacity={0.8} onPress={() => onSelect(point)} style={[styles.mapPin, { left: `${point.x}%`, top: `${point.y}%` }]}>
              <View style={[styles.pinDot, selected && styles.pinDotActive]}><Icon name={isStart ? 'radio' : isEnd ? 'flag' : 'map-pin'} size={selected ? 13 : 11} color={selected ? COLORS.ink : COLORS.white} /></View>
              <Text style={[styles.pinLabel, selected && styles.pinLabelActive]}>{point.name}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.mapCompass}><Icon name="navigation" size={13} color={COLORS.navy} /><Text style={styles.mapCompassText}>N</Text></View>
      </View>
      <View style={styles.mapLegend}><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.green }]} /><Text style={styles.legendText}>Start · {startPoint.name}</Text></View><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.sun }]} /><Text style={styles.legendText}>End · {endPoint.name}</Text></View></View>
    </View>
  );
}

function SeatDiagram({ side }) {
  const highlightedLeft = side === 'left';
  const layout = [[1, 1, 1], [1, 1, 0], [1, 1, 1], [1, 1, 1], [1, 1, 1]];
  return (
    <View style={styles.busShell}>
      <View style={styles.busTopRow}>
        <View style={styles.busDot} />
        <Text style={styles.busLabel}>FRONT</Text>
        <View style={styles.busDot} />
      </View>
      <View style={styles.seatGrid}>
        {layout.map((row, rowIndex) => <View key={rowIndex} style={styles.seatRow}>
          {row.map((hasSeat, columnIndex) => hasSeat ? (
            <View key={`${rowIndex}-${columnIndex}`} style={[styles.seat, ((highlightedLeft && columnIndex === 0) || (!highlightedLeft && columnIndex === 2)) && styles.seatHot]}>
              {((highlightedLeft && columnIndex === 0) || (!highlightedLeft && columnIndex === 2)) ? <View style={styles.seatSun} /> : null}
            </View>
          ) : <View key={`${rowIndex}-${columnIndex}`} style={styles.emptySeat} />)}
        </View>)}
      </View>
      <View style={styles.busBottomRow}>
        <Icon name="arrow-down" size={14} color={COLORS.muted} />
        <Text style={styles.busLabel}>REAR</Text>
        <Icon name="arrow-down" size={14} color={COLORS.muted} />
      </View>
    </View>
  );
}

export default function App() {
  const [trip, setTrip] = useState('work');
  const [transport, setTransport] = useState('Bus');
  const [selectionMode, setSelectionMode] = useState('start');
  const [startPoint, setStartPoint] = useState(MAP_POINTS[0]);
  const [endPoint, setEndPoint] = useState(MAP_POINTS[1]);
  const [weatherPoint, setWeatherPoint] = useState('start');
  const activePoint = weatherPoint === 'start' ? startPoint : endPoint;
  const route = { from: startPoint.name, to: endPoint.name, time: startPoint.id === 'maadi' && endPoint.id === 'downtown' ? '28 min' : '24 min', direction: trip === 'work' ? 'NE' : 'SW', bearing: trip === 'work' ? '042°' : '222°' };
  const recommendedSide = useMemo(() => (trip === 'work' ? 'left' : 'right'), [trip]);

  const handleMapSelect = (point) => {
    if (selectionMode === 'start') {
      setStartPoint(point);
      setWeatherPoint('start');
      setSelectionMode('end');
    } else {
      setEndPoint(point);
      setWeatherPoint('end');
      setSelectionMode('start');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>SUNSEAT</Text>
            <Text style={styles.tagline}>A better seat, every trip.</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <Icon name="sun" size={19} color={COLORS.sun} />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroOrb}><View style={styles.heroOrbInner} /></View>
          <Text style={styles.heroEyebrow}>YOUR MORNING PLAN</Text>
          <Text style={styles.heroTitle}>Chase the shade.</Text>
          <Text style={styles.heroCopy}>We’ll read the route, sun, and weather so you can sit comfortably.</Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.metaItem}><Icon name="clock" size={14} color={COLORS.sun} /><Text style={styles.metaText}>08:30 AM</Text></View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}><Icon name="sunrise" size={14} color={COLORS.sun} /><Text style={styles.metaText}>East sun</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Where are you going?</Text><Text style={styles.step}>01</Text></View>
          <View style={styles.routeCard}>
            <View style={styles.routeRail}><View style={styles.routeDot} /><View style={styles.routeLine} /><View style={styles.routeDot} /></View>
            <View style={styles.routeNames}><Text style={styles.routeTop}>{route.from}</Text><Text style={styles.routeBottom}>{route.to}</Text></View>
            <Icon name="map-pin" size={19} color={COLORS.muted} />
          </View>
          <View style={styles.segmented}>
            <ChoiceChip label="Going to work" active={trip === 'work'} onPress={() => setTrip('work')} icon="arrow-up-right" />
            <ChoiceChip label="Going home" active={trip === 'home'} onPress={() => setTrip('home')} icon="arrow-down-left" />
          </View>
          <View style={styles.mapModeRow}>
            <ChoiceChip label={`Start · ${startPoint.name}`} active={selectionMode === 'start'} onPress={() => setSelectionMode('start')} icon="radio" />
            <ChoiceChip label={`End · ${endPoint.name}`} active={selectionMode === 'end'} onPress={() => setSelectionMode('end')} icon="flag" />
          </View>
          <MapPicker activePoint={selectionMode === 'start' ? startPoint : endPoint} selectionMode={selectionMode} startPoint={startPoint} endPoint={endPoint} onSelect={handleMapSelect} />
        </View>

        <View style={styles.sectionTransport}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Your ride</Text><Text style={styles.step}>02</Text></View>
          <View style={styles.transportRow}>
            {['Bus', 'Metro', 'Tram'].map((item, index) => (
              <ChoiceChip key={item} label={item} active={transport === item} onPress={() => setTransport(item)} icon={index === 0 ? 'truck' : index === 1 ? 'git-commit' : 'columns'} />
            ))}
          </View>
        </View>

        <View style={styles.conditionsCard}>
          <View style={styles.weatherSwitch}><Text style={styles.cardEyebrow}>WEATHER ALONG YOUR ROUTE</Text><View style={styles.weatherToggle}><TouchableOpacity onPress={() => setWeatherPoint('start')} style={[styles.weatherToggleItem, weatherPoint === 'start' && styles.weatherToggleActive]}><Text style={[styles.weatherToggleText, weatherPoint === 'start' && styles.weatherToggleTextActive]}>Start</Text></TouchableOpacity><TouchableOpacity onPress={() => setWeatherPoint('end')} style={[styles.weatherToggleItem, weatherPoint === 'end' && styles.weatherToggleActive]}><Text style={[styles.weatherToggleText, weatherPoint === 'end' && styles.weatherToggleTextActive]}>End</Text></TouchableOpacity></View></View>
          <View style={styles.conditionsTop}><View><Text style={styles.weatherRegion}>{activePoint.name} · {activePoint.area}</Text><Text style={styles.weatherTemp}>{activePoint.weather.temp}</Text><Text style={styles.weatherDesc}>{activePoint.weather.description}</Text></View><View style={styles.sunIconWrap}><Icon name="sun" size={32} color={COLORS.sun} /></View></View>
          <View style={styles.weatherDetails}><View style={styles.weatherDetail}><Icon name="wind" size={15} color={COLORS.muted} /><Text style={styles.weatherDetailText}>{activePoint.weather.wind}</Text></View><View style={styles.weatherDetail}><Icon name="droplet" size={15} color={COLORS.muted} /><Text style={styles.weatherDetailText}>{activePoint.weather.rain}</Text></View><View style={styles.weatherDetail}><Icon name="compass" size={15} color={COLORS.muted} /><Text style={styles.weatherDetailText}>{activePoint.weather.sun}</Text></View></View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Your best seat</Text><Text style={styles.step}>03</Text></View>
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}><View style={styles.bestBadge}><Icon name="check" size={13} color={COLORS.green} /><Text style={styles.bestBadgeText}>BEST MATCH</Text></View><Text style={styles.routeTime}>{route.time} · {route.direction}</Text></View>
          <Text style={styles.recommendationTitle}>Sit on the {recommendedSide} side.</Text>
          <Text style={styles.recommendationCopy}>{trip === 'work' ? 'The sun will stay on your right as you head north-east. The left side keeps you in shade.' : 'The sun will stay behind you as you head south-west. The right side keeps glare out of your eyes.'}</Text>
          <SeatDiagram side={recommendedSide} />
          <View style={styles.tipRow}><Icon name="info" size={16} color={COLORS.navy} /><Text style={styles.tipText}>Tip: the shaded side should stay cooler, but crack a window if the bus feels warm.</Text></View>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => setTrip(trip === 'work' ? 'home' : 'work')}>
          <Text style={styles.primaryButtonText}>Plan another trip</Text><Icon name="arrow-right" size={19} color={COLORS.ink} />
        </TouchableOpacity>
        <Text style={styles.footerNote}>Built for the ride between here and there.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  scroll: { paddingBottom: 40 },
  header: { backgroundColor: COLORS.navy, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { color: COLORS.white, fontSize: 18, fontWeight: '800', letterSpacing: 2.2 },
  tagline: { color: '#a7b8c2', fontSize: 12, marginTop: 3 },
  profileButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.navySoft, alignItems: 'center', justifyContent: 'center' },
  hero: { backgroundColor: COLORS.navy, paddingHorizontal: 22, paddingBottom: 30, overflow: 'hidden', position: 'relative' },
  heroOrb: { position: 'absolute', right: -34, top: -30, width: 170, height: 170, borderRadius: 85, borderWidth: 1, borderColor: 'rgba(244,184,74,0.22)', alignItems: 'center', justifyContent: 'center' },
  heroOrbInner: { width: 106, height: 106, borderRadius: 53, backgroundColor: 'rgba(244,184,74,0.10)' },
  heroEyebrow: { color: COLORS.sun, fontSize: 11, fontWeight: '800', letterSpacing: 1.3, marginTop: 8 },
  heroTitle: { color: COLORS.white, fontSize: 38, fontWeight: '800', letterSpacing: -1.1, marginTop: 12 },
  heroCopy: { color: '#c9d5d9', fontSize: 15, lineHeight: 22, maxWidth: 290, marginTop: 10 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 7 }, metaText: { color: COLORS.white, fontSize: 12, fontWeight: '700' }, metaDivider: { width: 1, height: 16, backgroundColor: '#476075', marginHorizontal: 16 },
  section: { paddingHorizontal: 22, paddingTop: 25 }, sectionTransport: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }, sectionTitle: { color: COLORS.ink, fontWeight: '800', fontSize: 18 }, step: { color: '#a5b0b2', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  routeCard: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, padding: 16, flexDirection: 'row', alignItems: 'center' }, routeRail: { alignItems: 'center', width: 22, marginRight: 13 }, routeDot: { width: 9, height: 9, borderRadius: 5, borderWidth: 2, borderColor: COLORS.navy, backgroundColor: COLORS.white }, routeLine: { height: 24, borderLeftWidth: 1, borderColor: COLORS.navySoft, borderStyle: 'dashed' }, routeNames: { flex: 1, gap: 16 }, routeTop: { color: COLORS.muted, fontSize: 13 }, routeBottom: { color: COLORS.ink, fontSize: 16, fontWeight: '800' },
  segmented: { flexDirection: 'row', gap: 8, marginTop: 10 }, mapModeRow: { flexDirection: 'row', gap: 8, marginTop: 10 }, transportRow: { flexDirection: 'row', gap: 8 }, choiceChip: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1 }, choiceChipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy }, choiceLabel: { color: COLORS.muted, fontSize: 12, fontWeight: '700', flexShrink: 1 }, choiceLabelActive: { color: COLORS.white },
  mapCard: { backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 13, marginTop: 12 }, mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 3, marginBottom: 10 }, mapTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '800', marginTop: 3 }, mapSurface: { height: 190, backgroundColor: '#dfe9e5', borderRadius: 13, overflow: 'hidden', position: 'relative' }, mapRiver: { position: 'absolute', width: 52, height: 270, backgroundColor: '#c2d9db', left: '42%', top: -36, transform: [{ rotate: '21deg' }] }, mapRoute: { position: 'absolute', width: 240, height: 3, backgroundColor: COLORS.navySoft, opacity: 0.22, left: 35, top: 112 }, mapPin: { position: 'absolute', alignItems: 'center', transform: [{ translateX: -17 }, { translateY: -13 }] }, pinDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.navySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white }, pinDotActive: { backgroundColor: COLORS.sun, borderColor: COLORS.navy }, pinLabel: { color: COLORS.navy, backgroundColor: 'rgba(255,255,255,0.82)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, fontSize: 9, fontWeight: '800', marginTop: 3 }, pinLabelActive: { color: COLORS.ink }, mapCompass: { position: 'absolute', right: 9, top: 9, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' }, mapCompassText: { color: COLORS.navy, fontSize: 8, fontWeight: '800', marginTop: -2 }, mapLegend: { flexDirection: 'row', gap: 16, marginTop: 10, paddingHorizontal: 3 }, legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 }, legendDot: { width: 7, height: 7, borderRadius: 4 }, legendText: { color: COLORS.muted, fontSize: 10, fontWeight: '700' },
  conditionsCard: { marginHorizontal: 22, backgroundColor: COLORS.paperAlt, borderRadius: 18, padding: 18, marginBottom: 26 }, weatherSwitch: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, weatherToggle: { flexDirection: 'row', backgroundColor: '#d6dfda', borderRadius: 9, padding: 2 }, weatherToggleItem: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7 }, weatherToggleActive: { backgroundColor: COLORS.white }, weatherToggleText: { color: COLORS.muted, fontSize: 10, fontWeight: '800' }, weatherToggleTextActive: { color: COLORS.navy }, conditionsTop: { flexDirection: 'row', justifyContent: 'space-between' }, cardEyebrow: { color: COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, weatherRegion: { color: COLORS.navy, fontSize: 11, fontWeight: '800', marginBottom: 3 }, weatherTemp: { color: COLORS.ink, fontSize: 35, fontWeight: '800', letterSpacing: -1, marginTop: 4 }, weatherDesc: { color: COLORS.muted, fontSize: 12, marginTop: 1 }, sunIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.sunSoft, alignItems: 'center', justifyContent: 'center' }, weatherDetails: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#d4dcd7', marginTop: 17, paddingTop: 13, gap: 18 }, weatherDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 }, weatherDetailText: { color: COLORS.muted, fontSize: 11, fontWeight: '700' },
  recommendationCard: { marginHorizontal: 22, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 18 }, recommendationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, bestBadge: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: '#e3f2e8', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 5 }, bestBadgeText: { color: COLORS.green, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }, routeTime: { color: COLORS.muted, fontSize: 11, fontWeight: '700' }, recommendationTitle: { color: COLORS.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginTop: 17 }, recommendationCopy: { color: COLORS.muted, lineHeight: 19, fontSize: 13, marginTop: 7 },
  busShell: { alignSelf: 'center', width: 166, marginTop: 20, borderRadius: 20, padding: 11, backgroundColor: '#edf0ec', borderWidth: 1, borderColor: '#d4ddd8' }, busTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 7, marginBottom: 8 }, busBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 7, marginTop: 8 }, busDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.navy }, busLabel: { color: COLORS.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1 }, seatGrid: { gap: 8, paddingHorizontal: 4 }, seatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, seat: { width: 36, height: 26, backgroundColor: '#cad6d0', borderRadius: 7, borderBottomWidth: 3, borderBottomColor: '#afc0b8' }, emptySeat: { width: 36, height: 26, backgroundColor: 'transparent' }, seatHot: { backgroundColor: COLORS.sun, borderBottomColor: '#d59b35' }, seatSun: { width: 8, height: 8, backgroundColor: '#fff7df', borderRadius: 4, alignSelf: 'center', marginTop: 7 }, tipRow: { flexDirection: 'row', gap: 8, backgroundColor: '#f2f5f2', padding: 11, borderRadius: 11, marginTop: 18, alignItems: 'flex-start' }, tipText: { flex: 1, color: COLORS.navy, fontSize: 11, lineHeight: 16, fontWeight: '600' },
  primaryButton: { marginHorizontal: 22, marginTop: 22, borderRadius: 14, backgroundColor: COLORS.sun, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }, primaryButtonText: { color: COLORS.ink, fontSize: 14, fontWeight: '800' }, footerNote: { color: '#9aa5a8', textAlign: 'center', fontSize: 11, marginTop: 17 },
});
