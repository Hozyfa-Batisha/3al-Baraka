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

const ROUTES = {
  work: { from: 'Maadi', to: 'Downtown', time: '28 min', direction: 'NE', bearing: '042°' },
  home: { from: 'Downtown', to: 'Maadi', time: '31 min', direction: 'SW', bearing: '222°' },
};

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

function SeatDiagram({ side }) {
  const highlightedLeft = side === 'left';
  return (
    <View style={styles.busShell}>
      <View style={styles.busTopRow}>
        <View style={styles.busDot} />
        <Text style={styles.busLabel}>FRONT</Text>
        <View style={styles.busDot} />
      </View>
      <View style={styles.seatGrid}>
        {[0, 1, 2, 3, 4, 5].map((seat) => (
          <React.Fragment key={seat}>
            <View style={[styles.seat, highlightedLeft && seat === 0 && styles.seatHot]}>
              {highlightedLeft && seat === 0 ? <View style={styles.seatSun} /> : null}
            </View>
            {seat === 2 ? <View style={styles.aisleWide} /> : <View style={styles.aisle} />}
            <View style={[styles.seat, !highlightedLeft && seat === 0 && styles.seatHot]}>
              {!highlightedLeft && seat === 0 ? <View style={styles.seatSun} /> : null}
            </View>
          </React.Fragment>
        ))}
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
  const route = ROUTES[trip];
  const recommendedSide = useMemo(() => (trip === 'work' ? 'left' : 'right'), [trip]);

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
          <View style={styles.conditionsTop}><View><Text style={styles.cardEyebrow}>RIGHT NOW</Text><Text style={styles.weatherTemp}>24°</Text><Text style={styles.weatherDesc}>Clear skies, light breeze</Text></View><View style={styles.sunIconWrap}><Icon name="sun" size={32} color={COLORS.sun} /></View></View>
          <View style={styles.weatherDetails}><View style={styles.weatherDetail}><Icon name="wind" size={15} color={COLORS.muted} /><Text style={styles.weatherDetailText}>12 km/h</Text></View><View style={styles.weatherDetail}><Icon name="droplet" size={15} color={COLORS.muted} /><Text style={styles.weatherDetailText}>No rain</Text></View><View style={styles.weatherDetail}><Icon name="compass" size={15} color={COLORS.muted} /><Text style={styles.weatherDetailText}>E 82°</Text></View></View>
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
  segmented: { flexDirection: 'row', gap: 8, marginTop: 10 }, transportRow: { flexDirection: 'row', gap: 8 }, choiceChip: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1 }, choiceChipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy }, choiceLabel: { color: COLORS.muted, fontSize: 12, fontWeight: '700', flexShrink: 1 }, choiceLabelActive: { color: COLORS.white },
  conditionsCard: { marginHorizontal: 22, backgroundColor: COLORS.paperAlt, borderRadius: 18, padding: 18, marginBottom: 26 }, conditionsTop: { flexDirection: 'row', justifyContent: 'space-between' }, cardEyebrow: { color: COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, weatherTemp: { color: COLORS.ink, fontSize: 35, fontWeight: '800', letterSpacing: -1, marginTop: 4 }, weatherDesc: { color: COLORS.muted, fontSize: 12, marginTop: 1 }, sunIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.sunSoft, alignItems: 'center', justifyContent: 'center' }, weatherDetails: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#d4dcd7', marginTop: 17, paddingTop: 13, gap: 18 }, weatherDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 }, weatherDetailText: { color: COLORS.muted, fontSize: 11, fontWeight: '700' },
  recommendationCard: { marginHorizontal: 22, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 18 }, recommendationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, bestBadge: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: '#e3f2e8', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 5 }, bestBadgeText: { color: COLORS.green, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }, routeTime: { color: COLORS.muted, fontSize: 11, fontWeight: '700' }, recommendationTitle: { color: COLORS.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginTop: 17 }, recommendationCopy: { color: COLORS.muted, lineHeight: 19, fontSize: 13, marginTop: 7 },
  busShell: { alignSelf: 'center', width: 166, marginTop: 20, borderRadius: 20, padding: 11, backgroundColor: '#edf0ec', borderWidth: 1, borderColor: '#d4ddd8' }, busTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 7, marginBottom: 8 }, busBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 7, marginTop: 8 }, busDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.navy }, busLabel: { color: COLORS.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1 }, seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8, paddingHorizontal: 4 }, seat: { width: 36, height: 26, backgroundColor: '#cad6d0', borderRadius: 7, borderBottomWidth: 3, borderBottomColor: '#afc0b8' }, seatHot: { backgroundColor: COLORS.sun, borderBottomColor: '#d59b35' }, seatSun: { width: 8, height: 8, backgroundColor: '#fff7df', borderRadius: 4, alignSelf: 'center', marginTop: 7 }, aisle: { width: 5 }, aisleWide: { width: 5 }, tipRow: { flexDirection: 'row', gap: 8, backgroundColor: '#f2f5f2', padding: 11, borderRadius: 11, marginTop: 18, alignItems: 'flex-start' }, tipText: { flex: 1, color: COLORS.navy, fontSize: 11, lineHeight: 16, fontWeight: '600' },
  primaryButton: { marginHorizontal: 22, marginTop: 22, borderRadius: 14, backgroundColor: COLORS.sun, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }, primaryButtonText: { color: COLORS.ink, fontSize: 14, fontWeight: '800' }, footerNote: { color: '#9aa5a8', textAlign: 'center', fontSize: 11, marginTop: 17 },
});
