import React, { useMemo, useState } from 'react';
import { CheckCircle2, Globe2, Landmark, Receipt, Scale } from 'lucide-react';
import { AccurateGeoMaps2D, type AccurateMapPin, type GeoMapRegion } from './AccurateGeoMaps2D';

export type SocialExtVariant =
  | 'economics_taxes_gst'
  | 'geography_resources_industries'
  | 'civics_foreign_policy'
  | 'social_chapter_2d';

interface SocialExtensions2DProps {
  variant: SocialExtVariant;
  sectionId: string;
  sectionTitle: string;
  onExplore: () => void;
}

/**
 * Pure deterministic GST & Progressive Income Tax calculator (unit-tested!)
 */
export function computeGstAndDirectTax(basePriceInr: number, gstSlabPct: number, annualIncomeLakhs: number) {
  const gstTotal = Number(((basePriceInr * gstSlabPct) / 100).toFixed(2));
  const cgst = Number((gstTotal / 2).toFixed(2));
  const sgst = Number((gstTotal / 2).toFixed(2));
  const finalPrice = Number((basePriceInr + gstTotal).toFixed(2));

  let directTaxRatePct = 0;
  if (annualIncomeLakhs > 10) directTaxRatePct = 20;
  else if (annualIncomeLakhs > 5) directTaxRatePct = 10;
  else if (annualIncomeLakhs > 3) directTaxRatePct = 5;

  const directTaxLakhs = Number(((annualIncomeLakhs * directTaxRatePct) / 100).toFixed(2));
  return { gstTotal, cgst, sgst, finalPrice, directTaxRatePct, directTaxLakhs };
}

const INDIA_RESOURCE_PINS: AccurateMapPin[] = [
  { id: 'chotanagpur', label: 'Chotanagpur Plateau', lat: 23.35, lon: 85.33, category: 'Iron Ore · Coal · Mica', detail: 'Called the "Mineral Heartland of India" (Jharkhand/Odisha/West Bengal) — powers TISCO (Jamshedpur) & major steel plants (p. 171).', examFact: 'Hematite & Magnetite iron ores anchor India’s heavy steel corridor.' },
  { id: 'mumbai_high', label: 'Mumbai High', lat: 19.4, lon: 71.35, category: 'Offshore Petroleum · Textiles', detail: 'India’s largest offshore oilfield in the Arabian Sea, alongside Mumbai ("Cottonopolis of India") backed by Deccan black cotton soil & port links.', examFact: 'Digboi (Assam) is India’s oldest onshore oilfield.' },
  { id: 'neyveli', label: 'Neyveli & Salem', lat: 11.6, lon: 79.48, category: 'Lignite · Iron Ore · Magnesite', detail: 'Neyveli Lignite Corporation powers thermal electricity across Tamil Nadu; Salem hosts iron ore & magnesite deposits.', examFact: 'Lignite (brown coal) reserves in India are concentrated heavily in Tamil Nadu.' },
  { id: 'muppandal', label: 'Muppandal (TN)', lat: 8.26, lon: 77.55, category: 'Wind Energy Corridor', detail: 'One of Asia’s largest onshore wind-farm clusters harnessing funnelled winds through the Aralvaimozhi Pass!', examFact: 'Tamil Nadu leads India in installed onshore wind generation capacity.' },
  { id: 'bengaluru', label: 'Bengaluru–Chennai', lat: 12.97, lon: 77.59, category: 'IT & Automobile Corridor', detail: 'Bengaluru ("Electronic Capital of India") & Chennai ("Detroit of Asia") anchor software exports, electronics & EV manufacturing.', examFact: 'Coimbatore is widely known as the "Manchester of South India".' },
];

const PANCHSHEEL_5 = [
  '1. Mutual respect for each other’s territorial integrity and sovereignty.',
  '2. Mutual non-aggression.',
  '3. Mutual non-interference in each other’s internal affairs.',
  '4. Equality and cooperation for mutual benefit.',
  '5. Peaceful co-existence.',
];

interface UnitMapSpec {
  region: GeoMapRegion;
  title: string;
  subtitle: string;
  showRivers?: boolean;
  showMonsoon?: boolean;
  pins: AccurateMapPin[];
}

const HISTORY_AND_GEO_2D_MAPS: Record<string, UnitMapSpec> = {
  'social-history-02': {
    region: 'world',
    title: 'History Unit 2 · Interwar Global Crises (1919–1939)',
    subtitle: 'Click any accurate GPS turning point across America, Europe, Asia & Africa',
    pins: [
      { id: 'ny', label: 'New York (1929)', lat: 40.71, lon: -74.0, category: 'Great Depression', detail: 'Wall Street crash (Oct 1929) collapsed credit globally and triggered FDR’s New Deal.', examFact: 'Colonial Indian farm prices fell steeply while land revenue remained harsh.' },
      { id: 'rome', label: 'Rome (1922)', lat: 41.9, lon: 12.49, category: 'Fascism', detail: 'Mussolini’s March on Rome established Fascist dictatorship in Italy.', examFact: 'Italy invaded Ethiopia (1935), exposing League of Nations weakness.' },
      { id: 'berlin', label: 'Berlin (1933)', lat: 52.52, lon: 13.4, category: 'Nazism', detail: 'Hitler dismantled Weimar democracy, exploiting Versailles resentment & unemployment.', examFact: 'Militarization of Rhineland & annexation of Austria led toward WWII.' },
      { id: 'hanoi', label: 'Hanoi (Indo-China)', lat: 21.02, lon: 105.85, category: 'Anti-Colonialism', detail: 'Ho Chi Minh organized nationalist resistance against French colonial rule.', examFact: 'Parallel anti-colonial awakenings grew in Egypt and South Africa.' },
    ],
  },
  'social-history-03': {
    region: 'world',
    title: 'History Unit 3 · World War II Theatres & United Nations (1939–1945)',
    subtitle: 'Real-coastline 2D map of European, Pacific & UN Founding locations',
    pins: [
      { id: 'warsaw', label: 'Warsaw (1939)', lat: 52.23, lon: 21.01, category: 'Outbreak · 1 Sep 1939', detail: 'German invasion of Poland triggered Britain & France declaring war.', examFact: 'Axis (Germany, Italy, Japan) vs Allies (Britain, USSR, USA, France).' },
      { id: 'stalingrad', label: 'Stalingrad (1942–43)', lat: 48.7, lon: 44.51, category: 'Eastern Front Turning Point', detail: 'Soviet victory halted German eastward expansion at immense human cost.', examFact: 'Followed by Allied Normandy D-Day landings (6 June 1944).' },
      { id: 'pearl', label: 'Pearl Harbor (1941)', lat: 21.35, lon: -157.95, category: 'Pacific Theatre · 7 Dec 1941', detail: 'Japanese air attack on the US Pacific Fleet brought the USA formally into WWII.', examFact: 'Atomic bombings of Hiroshima & Nagasaki ended the war in Aug 1945.' },
      { id: 'sf', label: 'San Francisco (UN 1945)', lat: 37.77, lon: -122.41, category: '24 Oct 1945 · United Nations', detail: 'UN Charter signed to safeguard peace, human rights & decolonisation.', examFact: 'Bretton Woods (1944) also created the IMF & World Bank.' },
    ],
  },
  'social-history-05': {
    region: 'india',
    title: 'History Unit 5 · 19th-Century Social & Religious Reform Movements',
    subtitle: 'Accurate 2D India map of key reform centres from Calcutta to Vadalur',
    pins: [
      { id: 'calcutta', label: 'Calcutta (1828)', lat: 22.57, lon: 88.36, category: 'Brahmo Samaj', detail: 'Raja Rammohan Roy fought Sati (abolished 1829); Vidyasagar championed Widow Remarriage (1856).', examFact: 'Swami Vivekananda later founded the Ramakrishna Mission (1897).' },
      { id: 'pune', label: 'Pune (1873)', lat: 18.52, lon: 73.86, category: 'Satyashodhak Samaj', detail: 'Jyotiba & Savitribai Phule pioneered girls’ schools and challenged caste oppression.', examFact: 'First school for girls opened in Pune in 1848.' },
      { id: 'aligarh', label: 'Aligarh (1875)', lat: 27.89, lon: 78.08, category: 'Aligarh Movement', detail: 'Sir Syed Ahmed Khan promoted modern scientific education through Aligarh College.', examFact: 'Bombay also saw Parsi Reform (Rahnumai Mazdayasnan Sabha, 1851).' },
      { id: 'vadalur', label: 'Vadalur (1867)', lat: 11.55, lon: 79.55, category: 'Tamil Nadu Reform', detail: 'Vallalar (Ramalinga Adigal) opened Sathya Dharma Salai preaching Jeeva Karunya.', examFact: 'Narayana Guru & Ayyankali led transformative reforms in Kerala.' },
    ],
  },
  'social-history-06': {
    region: 'tamil_nadu',
    title: 'History Unit 6 · Early Revolts Against British Rule in Tamil Nadu',
    subtitle: 'Accurate 2D Tamil Nadu satellite map of Palayakkarar & Vellore Revolt centres',
    pins: [
      { id: 'nerkattum', label: 'Nerkattumseval (1755)', lat: 9.15, lon: 77.45, category: 'Puli Thevar', detail: 'Puli Thevar built the earliest organized Palayakkarar resistance against Company rule.', examFact: 'Defeated British forces at Kalakadu.' },
      { id: 'sivagangai', label: 'Sivagangai (1780)', lat: 9.85, lon: 78.48, category: 'Rani Velunachiyar', detail: 'With Marudhu Brothers & Kuyili, Velunachiyar reclaimed Sivagangai in 1780.', examFact: 'First queen in India to fight and defeat British colonial rule.' },
      { id: 'panchal', label: 'Panchalankurichi (1799)', lat: 8.95, lon: 78.02, category: 'Kattabomman', detail: 'Veerapandiya Kattabomman defied tribute demands; executed at Kayathar (16 Oct 1799).', examFact: 'Marudhu Brothers issued the 1801 Tiruchirappalli Proclamation.' },
      { id: 'vellore', label: 'Vellore Fort (1806)', lat: 12.92, lon: 79.13, category: '10 July 1806 Revolt', detail: 'Indian sepoys revolted against humiliating dress codes (Agnew’s turban) and hoisted Tipu’s flag.', examFact: 'Widely regarded as the forerunner of the 1857 Rebellion.' },
    ],
  },
  'social-history-07': {
    region: 'india',
    title: 'History Unit 7 · 1857 Rebellion & Birth of Indian Nationalism',
    subtitle: 'Accurate 2D India map of 1857, INC (1885), Swadeshi (1905) & Home Rule (1916)',
    pins: [
      { id: 'meerut', label: 'Meerut & Delhi (1857)', lat: 28.98, lon: 77.7, category: 'Great Rebellion of 1857', detail: 'Sepoy uprising marched to Delhi; led nationally alongside Rani Lakshmibai (Jhansi) & Kunwar Singh.', examFact: 'Led to Queen Victoria’s Proclamation (1858) ending Company rule.' },
      { id: 'bombay', label: 'Bombay (1885)', lat: 19.07, lon: 72.87, category: 'INC Founded', detail: 'First session of the Indian National Congress chaired by W.C. Bonnerjee.', examFact: 'Dadabhai Naoroji exposed colonial "Drain of Wealth".' },
      { id: 'bengal', label: 'Calcutta (1905)', lat: 22.57, lon: 88.36, category: 'Swadeshi Movement', detail: 'Partition of Bengal sparked boycott of foreign goods & national education.', examFact: 'Energized Lal–Bal–Pal militant nationalism.' },
      { id: 'adyar', label: 'Adyar, Madras (1916)', lat: 13.0, lon: 80.25, category: 'Home Rule League', detail: 'Annie Besant launched the Home Rule Movement demanding self-government.', examFact: 'Lucknow Pact (1916) also united Congress & Muslim League.' },
    ],
  },
  'social-history-08': {
    region: 'india',
    title: 'History Unit 8 · Nationalism: Gandhian Phase (1919–1947)',
    subtitle: 'Accurate 2D India map of Champaran, Amritsar, Dandi & Quit India',
    pins: [
      { id: 'champaran', label: 'Champaran (1917)', lat: 26.65, lon: 84.91, category: 'First Satyagraha', detail: 'Gandhi freed indigo peasants from the exploitative Tinkathia system in Bihar.', examFact: 'Followed by Kheda & Ahmedabad mill satyagrahas.' },
      { id: 'amritsar', label: 'Amritsar (1919)', lat: 31.62, lon: 74.87, category: 'Jallianwala Bagh', detail: '13 April 1919 massacre shocked India; Tagore renounced his Knighthood.', examFact: 'Sparked nationwide Non-Cooperation Movement (1920).' },
      { id: 'dandi', label: 'Dandi (1930)', lat: 20.89, lon: 72.8, category: 'Salt Satyagraha', detail: '241-mile march from Sabarmati Ashram (12 Mar–6 Apr 1930) broke the British Salt Law.', examFact: 'Lahore Congress (1929) declared Purna Swaraj.' },
      { id: 'mumbai', label: 'Mumbai (1942)', lat: 19.07, lon: 72.87, category: 'Quit India · Do or Die', detail: '8 August 1942 Quit India resolution alongside Netaji’s INA accelerated freedom on 15 Aug 1947.', examFact: 'Poona Pact (1932) united Gandhi & Dr. Ambedkar on representation.' },
    ],
  },
  'social-history-09': {
    region: 'tamil_nadu',
    title: 'History Unit 9 · Freedom Struggle in Tamil Nadu',
    subtitle: 'Accurate 2D Tamil Nadu satellite map of Thoothukudi, Vedaranyam, Tiruppur & Chennai',
    pins: [
      { id: 'madras', label: 'Chennai (Madras)', lat: 13.08, lon: 80.27, category: '1852–1942 Civic Hub', detail: 'Madras Native Association (1852), Madras Mahajana Sabha (1884), and Subramania Bharati’s patriotic press.', examFact: 'Rukmani Lakshmipathi was the first woman imprisoned in TN Salt Satyagraha.' },
      { id: 'thoothukudi', label: 'Thoothukudi (1906)', lat: 8.76, lon: 78.13, category: 'V.O.C. Swadeshi Steam', detail: 'V.O. Chidambaranar launched ships Galia & Lavo to challenge British maritime monopoly.', examFact: 'Earned the honour Kappalottiya Tamizhan.' },
      { id: 'vedaranyam', label: 'Vedaranyam (1930)', lat: 10.37, lon: 79.85, category: 'Salt Satyagraha (Rajaji)', detail: 'C. Rajagopalachari marched with 100 volunteers from Tiruchirappalli to break the Salt Law.', examFact: 'Volunteers sang Namakkal Kavignar’s "Kathi Indri Ratham Indri".' },
      { id: 'tiruppur', label: 'Tiruppur (1932)', lat: 11.11, lon: 77.34, category: 'Tiruppur Kumaran', detail: 'Kodi Kaatha Kumaran held the national flag aloft even while fatally struck in 1932.', examFact: 'Kamarajar & Sathyamurthi broadened grassroots freedom participation.' },
    ],
  },
  'social-history-10': {
    region: 'tamil_nadu',
    title: 'History Unit 10 · Social Transformation in Tamil Nadu',
    subtitle: 'Accurate 2D Tamil Nadu map of Tamil Renaissance, Justice Party & Self-Respect centres',
    pins: [
      { id: 'chennai10', label: 'Chennai (1916–1921)', lat: 13.08, lon: 80.27, category: 'Justice Party & Print', detail: 'Justice Party passed Communal G.O., women’s voting rights (1921) & Noon Meal pilot; Dr. Muthulakshmi Reddy abolished Devadasi system.', examFact: 'Tamil was India’s first non-European language printed (1578).' },
      { id: 'erode', label: 'Erode (Periyar · 1925)', lat: 11.34, lon: 77.72, category: 'Self-Respect Movement', detail: 'Periyar E.V.R. championed rationalism, women’s equality, and eradication of caste hierarchy.', examFact: 'Led Vaikom Satyagraha (1924) earning the title "Vaikom Hero".' },
      { id: 'vaikom', label: 'Vaikom (1924)', lat: 9.75, lon: 76.39, category: 'Temple Entry Rights', detail: 'Historic peaceful struggle securing public street access around Vaikom temple.', examFact: 'Demonstrated South Indian solidarity for human dignity.' },
      { id: 'thanjavur', label: 'Thanjavur–Kumbakonam', lat: 10.96, lon: 79.38, category: 'Tamil Renaissance', detail: 'U.Ve. Swaminatha Iyer & C.W. Damotharanar recovered priceless Sangam palm-leaf classics.', examFact: 'Maraimalai Adigal led Tani Tamil Iyakkam (Pure Tamil Movement).' },
    ],
  },
  'social-geography-02': {
    region: 'india',
    title: 'Geography Unit 2 · Climate, Monsoons & Natural Vegetation of India',
    subtitle: 'Toggle Accurate 2D Rivers & SW Monsoon Wind Streams over real NASA India relief',
    showRivers: true,
    showMonsoon: true,
    pins: [
      { id: 'kerala', label: 'Malabar Coast (Burst)', lat: 10.5, lon: 76.2, category: 'SW Monsoon Onset (~June 1)', detail: 'Arabian Sea branch strikes Western Ghats causing heavy orographic rainfall along windward slopes.', examFact: 'Pre-monsoon "Mango Showers" ripen mangoes across Kerala & Karnataka.' },
      { id: 'mawsynram', label: 'Mawsynram (Meghalaya)', lat: 25.3, lon: 91.58, category: 'Wettest Place on Earth', detail: 'Funnel-shaped Khasi Hills trap Bay of Bengal monsoon clouds (~1141 cm annual rainfall).', examFact: 'Located just west of Cherrapunji.' },
      { id: 'coromandel', label: 'Coromandel Coast (TN)', lat: 12.6, lon: 80.1, category: 'NE Monsoon (Oct–Dec)', detail: 'Retreating winds pick up Bay of Bengal moisture delivering Tamil Nadu’s primary rainy season.', examFact: 'Tropical Deciduous forests are India’s most widespread forest biome.' },
      { id: 'nilgiri', label: 'Nilgiri Biosphere', lat: 11.4, lon: 76.7, category: '18 Biosphere Reserves', detail: 'India’s first Biosphere Reserve conserving shola forests & Nilgiri Tahr alongside Gulf of Mannar.', examFact: 'Project Tiger was launched in 1973.' },
    ],
  },
  'social-geography-03': {
    region: 'india',
    title: 'Geography Unit 3 · India — Soils, Irrigation & Agriculture',
    subtitle: 'Accurate 2D India map of ICAR Soil Belts & Multipurpose River Valley Projects',
    showRivers: true,
    pins: [
      { id: 'ganga_alluvial', label: 'Ganga Alluvial Plain', lat: 26.8, lon: 81.0, category: 'Alluvial Soil · Kharif/Rabi', detail: 'Fertile river silt ideal for rice, wheat, sugarcane & pulses — feeds dense populations.', examFact: 'Khadar = new fertile alluvium; Bhangar = older alluvium.' },
      { id: 'deccan_black', label: 'Deccan Black Soil', lat: 20.5, lon: 76.5, category: 'Regur (Black Cotton) Soil', detail: 'Formed from Deccan basalt lava; retains moisture strongly, ideal for cotton cultivation.', examFact: 'Red soil gets its reddish colour from iron oxide.' },
      { id: 'bhakra', label: 'Bhakra Nangal (Sutlej)', lat: 31.41, lon: 76.43, category: 'Multipurpose Dam', detail: 'High gravity dam providing irrigation & hydroelectricity across Punjab, Haryana & Rajasthan.', examFact: 'Hirakud Dam (Mahanadi, Odisha) is India’s longest earthen dam.' },
      { id: 'mettur', label: 'Mettur Dam (Kaveri)', lat: 11.79, lon: 77.8, category: 'Stanley Reservoir (TN)', detail: 'Anchors irrigation for the Thanjavur Kaveri Delta ("Rice Bowl of Tamil Nadu").', examFact: 'Green Revolution (HYV seeds) boosted India’s foodgrain self-sufficiency.' },
    ],
  },
  'social-geography-05': {
    region: 'india',
    title: 'Geography Unit 5 · Population, Transport, Communication & Trade',
    subtitle: 'Accurate 2D India map of Golden Quadrilateral, NH-44 & Major Sea Ports',
    pins: [
      { id: 'delhi_gq', label: 'New Delhi (GQ North)', lat: 28.61, lon: 77.21, category: 'Golden Quadrilateral (5,846 km)', detail: 'Connects India’s 4 metro hubs — Delhi, Mumbai, Chennai & Kolkata — accelerating freight.', examFact: 'NH-44 (Srinagar to Kanyakumari) is India’s longest national highway.' },
      { id: 'mumbai_port', label: 'Mumbai & JNPT Port', lat: 18.95, lon: 72.83, category: 'West Coast Gateway', detail: 'Natural deep-water harbour handling major container trade alongside Konkan Railway.', examFact: 'India has 13 Major Ports.' },
      { id: 'chennai_port', label: 'Chennai & Ennore Ports', lat: 13.09, lon: 80.29, category: 'East Coast Hub', detail: 'Artificial deep-sea port + Kamarajar (Ennore) & Thoothukudi link TN exports globally.', examFact: 'Exports > Imports creates a Favourable Balance of Trade.' },
      { id: 'sriharikota', label: 'Sriharikota (ISRO)', lat: 13.72, lon: 80.23, category: 'Satellite Communication', detail: 'INSAT & GSAT communication satellites connect rural telemedicine, education & cyclone alerts.', examFact: 'Indian Census is conducted every 10 years.' },
    ],
  },
  'social-geography-06': {
    region: 'tamil_nadu',
    title: 'Geography Unit 6 · Physical Geography of Tamil Nadu',
    subtitle: 'Accurate 2D Tamil Nadu NASA map with Western/Eastern Ghats, Rivers & NE Monsoon',
    showRivers: true,
    showMonsoon: true,
    pins: [
      { id: 'doddabetta', label: 'Doddabetta (2,637 m)', lat: 11.4, lon: 76.73, category: 'Western Ghats Highest Peak', detail: 'Highest peak in Tamil Nadu (Nilgiris); passes include Palghat, Shencottah, Aralvaimozhi & Achankoil.', examFact: 'Javadhu, Servarayan & Kolli Hills form TN’s Eastern Ghats.' },
      { id: 'kallanai', label: 'Kallanai & Kaveri Delta', lat: 10.83, lon: 78.82, category: 'Grand Anicut (2nd Cen. CE)', detail: 'Built by Karikala Chola across the Kaveri ("Ganga of the South") irrigating Thanjavur.', examFact: 'Kaveri splits into Kollidam & Kaveri at Srirangam.' },
      { id: 'marina', label: 'Marina Beach (Chennai)', lat: 13.05, lon: 80.28, category: 'Coromandel Coastal Plain', detail: '13 km urban sandy coast along the Bay of Bengal — 2nd longest urban beach in the world.', examFact: 'Pulicat Lake lies at the northern TN–AP coastal border.' },
      { id: 'thamirabarani', label: 'Thamirabarani Basin', lat: 8.71, lon: 77.75, category: 'Only Perennial TN River', detail: 'Originates in Pothigai Hills (Agasthyamalai) and drains into the Gulf of Mannar.', examFact: 'Receives rain from both SW and NE Monsoons!' },
    ],
  },
  'social-geography-07': {
    region: 'tamil_nadu',
    title: 'Geography Unit 7 · Human Geography of Tamil Nadu',
    subtitle: 'Accurate 2D Tamil Nadu map of Agriculture, Industry & Coastal Resilience',
    showRivers: true,
    pins: [
      { id: 'thanjavur7', label: 'Thanjavur (Rice Bowl)', lat: 10.79, lon: 79.13, category: 'Paddy · 3 Seasons', detail: 'Cultivates Sornavari, Samba (main) & Navarai paddy crops; TNAU (Coimbatore) leads crop research.', examFact: 'Erode is renowned for GI-tagged Turmeric; Nilgiris for Tea.' },
      { id: 'coimbatore7', label: 'Coimbatore–Tiruppur', lat: 11.02, lon: 76.96, category: 'Textiles, Pumps & Knitwear', detail: 'Coimbatore ("Manchester of South India") & Tiruppur (cotton knitwear export capital).', examFact: 'Sivakasi leads printing & fireworks; Ambur leads leather.' },
      { id: 'chennai7', label: 'Chennai–Sriperumbudur', lat: 13.0, lon: 80.0, category: 'Auto, IT & Ports', detail: 'Major automobile, electronics, railway coach (ICF) & TIDEL Park software cluster.', examFact: 'Tamil Nadu achieves one of India’s highest literacy & urbanization rates.' },
      { id: 'pichavaram', label: 'Pichavaram Mangroves', lat: 11.43, lon: 79.77, category: 'Coastal Disaster Shield', detail: 'Dense mangrove forests buffer eastern coastal villages against storm surges & cyclones.', examFact: 'Disaster preparedness pairs early warnings with cyclone shelters.' },
    ],
  },
};

interface Unit2DCard {
  tag: string;
  title: string;
  summary: string;
  keyFact: string;
}

const CIVICS_ECON_2D_BANK: Record<string, { header: string; cards: Unit2DCard[] }> = {
  'social-civics-01': {
    header: 'Civics Unit 1 · Indian Constitution, Preamble & Fundamental Rights',
    cards: [
      { tag: '26 Nov 1949 → 26 Jan 1950', title: 'Drafting Committee & Sovereign Secular Republic', summary: 'Chaired by Dr. B.R. Ambedkar; Preamble commits India to Justice, Liberty, Equality & Fraternity.', keyFact: '42nd Amendment (1976) added Socialist, Secular & Integrity to the Preamble.' },
      { tag: 'Part III (Art. 12–35)', title: '6 Fundamental Rights & Constitutional Remedies (Art. 32)', summary: 'Equality, Freedom, Against Exploitation, Religion, Cultural/Educational Rights, and Writ Protection via Supreme Court.', keyFact: 'Dr. Ambedkar called Article 32 the "Heart and Soul of the Constitution".' },
      { tag: 'Part IV & IV-A', title: 'Directive Principles (DPSP) & 11 Fundamental Duties', summary: 'DPSP guides social welfare policy; Art. 51A reminds citizens to uphold unity, scientific temper & environment.', keyFact: 'Balances enforceable citizen rights with democratic duties.' },
    ],
  },
  'social-civics-02': {
    header: 'Civics Unit 2 · Central Government — Union Executive, Parliament & Judiciary',
    cards: [
      { tag: 'Legislature', title: 'Parliament: Lok Sabha + Rajya Sabha + President', summary: 'Lok Sabha (directly elected, Money Bills originate here) & Rajya Sabha (permanent upper house) make Union & Concurrent laws.', keyFact: 'Council of Ministers is collectively responsible to the Lok Sabha.' },
      { tag: 'Executive', title: 'President (Nominal Head) & Prime Minister (Real Head)', summary: 'President acts on aid and advice of the Prime Minister and Cabinet (Art. 74).', keyFact: 'Ensures both constitutional continuity and electoral accountability.' },
      { tag: 'Judiciary', title: 'Supreme Court of India — Guardian of Constitution', summary: 'Independent apex court exercising Original, Appellate, Advisory jurisdictions and Judicial Review.', keyFact: 'Protects Fundamental Rights and adjudicates Centre–State disputes.' },
    ],
  },
  'social-civics-03': {
    header: 'Civics Unit 3 · State Government — Governor, CM & High Court',
    cards: [
      { tag: 'State Legislature', title: 'Tamil Nadu Legislative Assembly (Unicameral)', summary: 'Directly elected MLAs legislate on State List subjects (Public Health, Agriculture, Police, Local Bodies).', keyFact: 'Tamil Nadu abolished its Legislative Council in 1986.' },
      { tag: 'State Executive', title: 'Governor & Chief Minister with State Cabinet', summary: 'Governor is constitutional head; elected Chief Minister & Ministers exercise real state executive power.', keyFact: 'Mirrors parliamentary accountability at the state level.' },
      { tag: 'State Judiciary', title: 'Madras High Court (Est. 1862) & District Courts', summary: 'Exercises Writ jurisdiction (Art. 226) and supervises subordinate civil and criminal courts across Tamil Nadu.', keyFact: 'One of India’s oldest chartered High Courts (with a permanent Madurai Bench).' },
    ],
  },
  'social-civics-05': {
    header: 'Civics Unit 5 · India’s International Relations & Global Groupings',
    cards: [
      { tag: 'Neighbours', title: 'South Asia, SAARC & BIMSTEC Bay of Bengal Bridge', summary: 'Connectivity, energy, cultural & maritime ties with Sri Lanka, Bhutan, Nepal, Bangladesh, Maldives & Myanmar.', keyFact: 'BIMSTEC links South Asia directly with South-East Asia.' },
      { tag: 'Multilateral Forums', title: 'BRICS, G20, ASEAN, SCO & International Solar Alliance', summary: 'Advocates inclusive development finance, clean solar transition, and reformed global governance.', keyFact: 'India is a major contributor to UN Peacekeeping missions worldwide.' },
    ],
  },
  'social-economics-01': {
    header: 'Economics Unit 1 · Gross Domestic Product (GDP) & Growth',
    cards: [
      { tag: 'Formula', title: 'GDP = C + I + G + (X − M) & GNP = GDP + NFIA', summary: 'Measures final market value of goods & services inside domestic borders in a year (excluding intermediate goods to prevent double counting).', keyFact: 'Per Capita Income = National Income / Population.' },
      { tag: 'Structural Shift', title: 'Primary (Agri) → Secondary (Industry) → Tertiary (Services)', summary: 'India’s Tertiary sector (IT, Banking, Transport, Education) now contributes over half of national GDP.', keyFact: 'Economic development pairs GDP growth with HDI (health, literacy, life expectancy).' },
    ],
  },
  'social-economics-02': {
    header: 'Economics Unit 2 · Globalization, MNCs & World Trade',
    cards: [
      { tag: '1991 Reforms', title: 'Liberalisation, Privatisation & Globalisation (LPG)', summary: 'Reduced industrial licensing and tariffs, attracting FDI while enabling Indian MNCs (Tata, Infosys, TVS, Sun Pharma) to expand globally.', keyFact: 'World Trade Organization (WTO, 1995, Geneva) administers multilateral trade rules.' },
      { tag: 'Fair Trade', title: 'Protecting Small Farmers & Local Artisans', summary: 'Balances wider consumer choice and technology transfer with social safeguards and labour standards.', keyFact: 'Fair globalization shares gains equitably across regions.' },
    ],
  },
  'social-economics-03': {
    header: 'Economics Unit 3 · Food Security, Buffer Stock & Nutrition',
    cards: [
      { tag: '3 Pillars', title: 'Availability · Accessibility · Affordability of Food', summary: 'FCI buys grain at Minimum Support Price (MSP) to build Buffer Stock distributed through Fair Price Shops.', keyFact: 'Tamil Nadu uniquely runs a Universal Public Distribution System (PDS)!' },
      { tag: 'Welfare Schemes', title: 'Chief Minister’s Noon Meal Scheme, ICDS & NFSA (2013)', summary: 'Midday meals and Dr. Muthulakshmi Reddy Maternity Benefit directly fight child malnutrition & boost school attendance.', keyFact: 'Purchasing power depends on wages, employment & stable food prices.' },
    ],
  },
  'social-economics-05': {
    header: 'Economics Unit 5 · Industrial Clusters in Tamil Nadu',
    cards: [
      { tag: 'Auto & IT Hub', title: 'Chennai–Sriperumbudur–Hosur Corridor ("Detroit of Asia")', summary: 'Global manufacturing base for cars, two-wheelers, railway coaches (ICF), electronics & TIDEL Park IT exports.', keyFact: 'SIPCOT estates, ports & engineering colleges power TN’s industrial ecosystem.' },
      { tag: 'MSME Clusters', title: 'Coimbatore · Tiruppur · Sivakasi · Karur · Ambur', summary: 'Coimbatore (textiles/pumps), Tiruppur (knitwear exports), Sivakasi (printing/matches), Karur (home textiles), Ambur (leather).', keyFact: 'Geographic clustering lowers transport costs and builds shared skilled talent.' },
    ],
  },
};

/**
 * Clean, zero-WebGL, accurate 2D Social Science labs backed by real NASA true-coastline
 * 2D maps for ALL History & Geography units + interactive Civics/Economics calculators.
 */
export function SocialExtensions2D({
  variant,
  sectionId,
  sectionTitle,
  onExplore,
}: SocialExtensions2DProps) {
  const [itemPrice, setItemPrice] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [incomeLakhs, setIncomeLakhs] = useState(8);
  const [policyStage, setPolicyStage] = useState<'panchsheel' | 'nam' | 'modern'>(
    sectionId.toLowerCase().includes('non-aligned') ? 'nam' : sectionId.toLowerCase().includes('contemp') ? 'modern' : 'panchsheel',
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const taxRes = useMemo(
    () => computeGstAndDirectTax(itemPrice, gstRate, incomeLakhs),
    [itemPrice, gstRate, incomeLakhs],
  );

  // 1. ECONOMICS UNIT 4 — DIRECT INCOME TAX vs GST CALCULATOR
  if (variant === 'economics_taxes_gst') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
            <Receipt className="w-4 h-4" />
            <span>Indirect Tax: GST Slab Calculator (Implemented 1 July 2017 · pp. 321–326)</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Base Goods / Service Price: ₹{itemPrice}
            <input type="range" min={200} max={5000} step={100} value={itemPrice} onChange={(e) => { setItemPrice(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--social)] mt-1" />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              [0, '0% (Essential Food)'],
              [5, '5% (Household)'],
              [12, '12% (Standard)'],
              [18, '18% (Services/Tech)'],
              [28, '28% (Luxury)'],
            ].map(([rate, lbl]) => (
              <button key={rate as number} type="button" onClick={() => { setGstRate(rate as number); onExplore(); }} className={`px-2.5 py-1.5 rounded-lg border font-bold ${gstRate === rate ? 'bg-[var(--social)] text-white border-[var(--social)]' : 'bg-[var(--surface-subtle)] border-[var(--line)]'}`}>
                {lbl as string}
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] font-mono-tabular space-y-1">
            <div>Base Price: ₹{itemPrice} + GST ({gstRate}% = ₹{taxRes.gstTotal}) → <strong>Total Bill: ₹{taxRes.finalPrice}</strong></div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Intra-state split: CGST (Central) = ₹{taxRes.cgst} + SGST (State) = ₹{taxRes.sgst}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--primary)] inline-flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            <span>Direct Tax: Progressive Income Tax (Burden Cannot Shift)</span>
          </div>
          <label className="block font-bold text-[var(--ink)]">
            Annual Household Income: ₹{incomeLakhs} Lakhs → Illustrative Rate: {taxRes.directTaxRatePct}% (Tax: ₹{taxRes.directTaxLakhs} L)
            <input type="range" min={2} max={18} step={1} value={incomeLakhs} onChange={(e) => { setIncomeLakhs(Number(e.target.value)); onExplore(); }} className="w-full accent-[var(--primary)] mt-1" />
          </label>
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] leading-relaxed">
            <strong>Direct vs Indirect Key Difference:</strong> Direct taxes (Income Tax, Corporate Tax) are progressive and paid directly by the earner. Indirect taxes (GST) are collected via sellers on consumption — replacing cascading taxes with One Nation, One Tax. Tax evasion fuels <em>Black Money</em> and starves public schools &amp; hospitals.
          </div>
        </div>
      </div>
    );
  }

  // 2. GEOGRAPHY UNIT 4 — ACCURATE NASA 2D INDIA MINERAL BELTS & INDUSTRIAL CLUSTERS MAP!
  if (variant === 'geography_resources_industries') {
    return (
      <AccurateGeoMaps2D
        region="india"
        title="Geography Unit 4 · India Minerals, Energy & Industries"
        subtitle={`Real NASA true-coastline 2D map · Focused on ${sectionTitle}`}
        pins={INDIA_RESOURCE_PINS}
        showRiversToggle
        onExplore={onExplore}
      />
    );
  }

  // 3. CIVICS UNIT 4 — INDIA'S FOREIGN POLICY (PANCHSHEEL, NAM, ART. 51)
  if (variant === 'civics_foreign_policy') {
    return (
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {([
            ['panchsheel', '1954 · Panchsheel (5 Principles)'],
            ['nam', '1961 · Non-Aligned Movement (NAM)'],
            ['modern', 'Art. 51 · Neighbourhood First & Act East'],
          ] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setPolicyStage(k); onExplore(); }} className={`px-3.5 py-2 rounded-xl border font-bold ${policyStage === k ? 'bg-[var(--social)] text-white border-[var(--social)]' : 'bg-[var(--surface)] border-[var(--line)]'}`}>{l}</button>
          ))}
        </div>

        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
          <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
            <Landmark className="w-4 h-4" />
            <span>Civics Unit 4 · India’s Foreign Policy (pp. 269–277)</span>
          </div>
          {policyStage === 'panchsheel' && (
            <div className="space-y-2">
              <div className="font-bold text-[var(--ink)]">Signed 28 April 1954 (India–China Agreement) — Five Principles of Peaceful Coexistence:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PANCHSHEEL_5.map((p) => (
                  <div key={p} className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] font-semibold text-[var(--ink)]">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
          {policyStage === 'nam' && (
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2 leading-relaxed text-[var(--text)]">
              <div className="font-extrabold text-sm text-[var(--ink)]">Founding Architects of NAM (Belgrade Summit, 1961)</div>
              <p>
                <strong>Jawaharlal Nehru</strong> (India), <strong>Tito</strong> (Yugoslavia), <strong>Nasser</strong> (Egypt), <strong>Sukarno</strong> (Indonesia), and <strong>Kwame Nkrumah</strong> (Ghana) championed independent diplomacy outside Cold War military blocs (NATO &amp; Warsaw Pact). Term coined by V.K. Krishna Menon (1953).
              </p>
            </div>
          )}
          {policyStage === 'modern' && (
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2 leading-relaxed text-[var(--text)]">
              <div className="font-extrabold text-sm text-[var(--ink)]">Constitutional Mandate (Article 51) &amp; Contemporary Pillars</div>
              <p>
                Article 51 (Directive Principles) directs India to promote international peace, respect international law, and settle disputes peacefully. India pairs <strong>Neighbourhood First</strong>, <strong>Look East → Act East</strong>, and a credible <strong>No-First-Use</strong> nuclear disarmament stance.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4A. ACCURATE 2D SATELLITE MAPS FOR ALL HISTORY (Units 2–10) & GEOGRAPHY (Units 2–7)!
  const unitKey =
    sectionId.startsWith('social-history-')
      ? sectionId.slice(0, 17)
      : sectionId.startsWith('social-civics-')
        ? sectionId.slice(0, 16)
        : sectionId.slice(0, 19);

  const mapSpec = HISTORY_AND_GEO_2D_MAPS[unitKey];
  if (mapSpec) {
    return (
      <AccurateGeoMaps2D
        region={mapSpec.region}
        title={mapSpec.title}
        subtitle={`${mapSpec.subtitle} · Subtopic: ${sectionTitle}`}
        pins={mapSpec.pins}
        showRiversToggle={Boolean(mapSpec.showRivers)}
        showMonsoonToggle={Boolean(mapSpec.showMonsoon)}
        onExplore={onExplore}
      />
    );
  }

  // 4B. CLEAN 2D GOVERNANCE / ECONOMICS EXPLORER FOR CIVICS & ECONOMICS UNITS
  const unitData = CIVICS_ECON_2D_BANK[unitKey] ?? CIVICS_ECON_2D_BANK['social-civics-01'];
  const current = unitData.cards[activeIdx % unitData.cards.length];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
      <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2">
        <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
          <Globe2 className="w-4 h-4" />
          <span>{unitData.header}</span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          Focused topic: <strong className="text-[var(--ink)]">{sectionTitle}</strong>
        </div>
        <div className="space-y-1.5 pt-1">
          {unitData.cards.map((c, idx) => (
            <button
              key={c.title}
              type="button"
              onClick={() => { setActiveIdx(idx); onExplore(); }}
              className={`w-full p-2.5 rounded-xl border text-left transition-colors ${activeIdx % unitData.cards.length === idx ? 'bg-[var(--social)] text-white border-[var(--social)]' : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)]'}`}
            >
              <div className={`text-[10px] font-bold uppercase ${activeIdx % unitData.cards.length === idx ? 'text-amber-200' : 'text-[var(--social)]'}`}>{c.tag}</div>
              <div className="font-extrabold">{c.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3">
        <div className="inline-block px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[10px] font-extrabold uppercase text-[var(--social)]">
          {current.tag}
        </div>
        <h4 className="text-base font-extrabold text-[var(--ink)]">{current.title}</h4>
        <p className="text-sm text-[var(--text)] leading-relaxed">{current.summary}</p>
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] font-semibold inline-flex items-start gap-2 w-full">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>Textbook Exam Anchor:</strong> {current.keyFact}</span>
        </div>
      </div>
    </div>
  );
}
