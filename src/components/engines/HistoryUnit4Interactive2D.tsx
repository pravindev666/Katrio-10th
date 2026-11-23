import React, { useState } from 'react';
import { CheckCircle2, Compass, Info, RotateCcw } from 'lucide-react';

export type HistoryUnit4Variant = '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7' | '4.8' | '4.9' | '4.10';

interface InteractiveStep {
  id: string;
  yearOrTag: string;
  title: string;
  regionLabel: string;
  svgHighlight: { x: number; y: number; color: string; r?: number };
  fact: string;
  nuance: string;
  compareLeftLabel?: string;
  compareLeft?: string;
  compareRightLabel?: string;
  compareRight?: string;
}

interface VariantBlueprint {
  mapHeading: string;
  mapSubtitle: string;
  landPolygons: { d: string; label: string; lx: number; ly: number; fill: string }[];
  connectorPath?: string;
  steps: InteractiveStep[];
}

const HISTORY4_INTERACTIVES: Record<HistoryUnit4Variant, VariantBlueprint> = {
  '4.1': {
    mapHeading: '2D Historical Route Map: China’s Transformation (1911–1949)',
    mapSubtitle: 'Step through Canton → Hunan → Long March (6,000 miles) → Northern Shensi → Peking (1949)',
    landPolygons: [
      { d: 'M65,65 L245,45 L335,70 L325,180 L235,215 L125,205 L65,145 Z', label: 'CHINA', lx: 195, ly: 122, fill: '#1e293b' },
      { d: 'M270,40 L338,48 L335,98 L280,90 Z', label: 'Manchuria (Japan base)', lx: 300, ly: 62, fill: '#3f2c2c' },
      { d: 'M348,155 L370,155 L368,195 L346,192 Z', label: 'Taiwan', lx: 358, ly: 208, fill: '#1e3a5f' },
    ],
    connectorPath: 'M255,182 Q165,195 148,145 T215,96 L268,94',
    steps: [
      {
        id: '1911', yearOrTag: '1911', title: 'End of Manchu Dynasty & Republic (Dr. Sun Yat-sen)', regionLabel: 'Canton & Shanghai',
        svgHighlight: { x: 255, y: 182, color: '#38bdf8' },
        fact: 'After centuries of Manchu rule (since ~1650), peasant distress, and Western pressure, local army mutinies in Oct 1911 led to a new Republic with Dr. Sun Yat-sen as provisional president.',
        nuance: 'Sun Yat-sen’s Three Principles were Nationalism, Democracy, and People’s Livelihood (with Socialism as ultimate goal).',
        compareLeftLabel: 'Manchu / Old Order', compareLeft: 'Scholar-official mandarins & heavy peasant rents/taxes.',
        compareRightLabel: '1911 Republic (Kuomintang)', compareRight: 'Middle-class reform movement seeking national unity.',
      },
      {
        id: '1928', yearOrTag: '1925–1928', title: 'Kuomintang Split & Mao Organizes the Peasantry', regionLabel: 'Hunan Mountains & Peking',
        svgHighlight: { x: 230, y: 162, color: '#f59e0b' },
        fact: 'After Sun Yat-sen’s death (1925), Chiang Kai-shek purged communists and captured Peking (1928). Mao Tse-tung recognized cities were tightly held and organized rural peasants in the mountains.',
        nuance: 'This rural peasant strategy differed from classical European factory-worker revolutions.',
        compareLeftLabel: 'Kuomintang (Chiang)', compareLeft: 'Backed by landlords, urban capitalists, and later US aid.',
        compareRightLabel: 'CPC (Mao & Chou En-lai)', compareRight: 'Built peasant army & rural base areas in Hunan.',
      },
      {
        id: '1934', yearOrTag: '1934–1935', title: 'The Long March (~6,000 Miles)', regionLabel: 'Hunan → Northern Shensi',
        svgHighlight: { x: 205, y: 102, color: '#ef4444', r: 11 },
        fact: 'Encircled by Chiang’s fortified posts, ~1,00,000 Communist soldiers set out in 1934; ~20,000 reached Northern Shensi late in 1935 after crossing ~6,000 miles.',
        nuance: 'Mao gained leadership of the party and by 1937 led over 10 million people while temporarily pausing civil war against Japanese aggression.',
      },
      {
        id: '1949', yearOrTag: 'Sep–Oct 1949', title: 'People’s Republic of China Proclaimed', regionLabel: 'Peking (Beijing)',
        svgHighlight: { x: 268, y: 94, color: '#10b981', r: 12 },
        fact: 'Despite US military aid to Kuomintang, disillusioned peasant soldiers and middle-class outreach helped Communists win; the People’s Political Consultative Conference (Sep 1949, >650 delegates) elected Mao Chairman.',
        nuance: 'The USA refused to recognize the PRC or seat it at the UN for over two decades.',
      },
    ],
  },
  '4.2': {
    mapHeading: '2D Bipolar Cold War Comparison: US vs. USSR (1945–1951)',
    mapSubtitle: 'Inspect how rivalry unfolded on political, economic, and ideological fronts without direct superpower war',
    landPolygons: [
      { d: 'M30,65 L145,65 L145,175 L30,175 Z', label: 'Western Europe (Marshall Plan: 16 Nations)', lx: 88, ly: 125, fill: '#1e3a8a' },
      { d: 'M215,55 L370,55 L370,185 L215,185 Z', label: 'USSR & Eastern Bloc (1948 Socialist Govts)', lx: 292, ly: 125, fill: '#7f1d1d' },
    ],
    connectorPath: 'M145,120 L215,120',
    steps: [
      {
        id: 'rivalry', yearOrTag: '1945–1948', title: 'Two Superpowers & The “Cold War”', regionLabel: 'Europe & Global Spheres',
        svgHighlight: { x: 180, y: 120, color: '#fbbf24', r: 11 },
        fact: 'After WWII, European empires declined while the USA and USSR emerged as rival superpowers waging political, economic, and ideological conflict without direct battlefield war between them.',
        nuance: 'Both sides presented their policies as defensive security against the other bloc.',
        compareLeftLabel: 'United States Bloc', compareLeft: 'Capitalist democracy, Truman Containment, economic aid.',
        compareRightLabel: 'Soviet Union Bloc', compareRight: 'Socialist single-party states across Eastern Europe (1948).',
      },
      {
        id: 'truman', yearOrTag: '1947–1948', title: 'Truman’s Policy of Containment', regionLabel: 'Eastern vs Western Europe',
        svgHighlight: { x: 245, y: 115, color: '#ef4444' },
        fact: 'When the USSR installed socialist governments across Nazi-liberated Eastern Europe by 1948, US President Harry Truman launched Containment to stop communism spreading further.',
        nuance: 'Containment shaped US involvement later in Korea (1950) and Vietnam (1965).',
      },
      {
        id: 'marshall', yearOrTag: '1947–1951', title: 'The Marshall Plan (European Self-Help Aid)', regionLabel: '16 Western European Nations',
        svgHighlight: { x: 95, y: 115, color: '#38bdf8', r: 11 },
        fact: 'US Secretary of State George C. Marshall proposed American-financed recovery via the Economic Cooperation Administration (ECA). Sixteen Western European nations joined; funding ended in 1951.',
        nuance: 'Dual goal (Book Exercise III-2!): Rebuild war-torn Europe AND limit communist electoral appeal by bringing Western Europe under US influence.',
      },
    ],
  },
  '4.3': {
    mapHeading: '2D Cold War Military Alliance Matrix (1949–1991)',
    mapSubtitle: 'Click each of the four textbook military pacts to compare region, members, standing forces, and end date',
    landPolygons: [
      { d: 'M30,45 L165,45 L165,125 L30,125 Z', label: 'NATO (1949 · N. Atlantic)', lx: 98, ly: 86, fill: '#1d4ed8' },
      { d: 'M185,45 L365,45 L365,120 L185,120 Z', label: 'Warsaw Pact (1955 · Moscow)', lx: 275, ly: 84, fill: '#991b1b' },
      { d: 'M175,135 L275,135 L275,205 L175,205 Z', label: 'CENTO (1955 · West Asia)', lx: 225, ly: 172, fill: '#92400e' },
      { d: 'M285,135 L378,135 L378,205 L285,205 Z', label: 'SEATO (1954 · SE Asia)', lx: 332, ly: 172, fill: '#065f46' },
    ],
    steps: [
      {
        id: 'nato', yearOrTag: '1949 (West Germany 1955)', title: '(a) NATO — North Atlantic Treaty Organization', regionLabel: 'North America & Western Europe',
        svgHighlight: { x: 98, y: 86, color: '#38bdf8', r: 11 },
        fact: 'Formed by the US, Canada, UK, France, Italy, Belgium, Denmark, Iceland, Luxembourg, Netherlands, Norway, and Portugal to resist Soviet aggression. Greece & Turkey joined in 1952; West Germany joined in 1955.',
        nuance: 'Key Exam Fact: NATO had a standing joint military command structure.',
      },
      {
        id: 'seato', yearOrTag: '1954 (Manila Pact)', title: '(b) SEATO — Southeast Asia Treaty Organization', regionLabel: 'Southeast Asia & Pacific',
        svgHighlight: { x: 332, y: 172, color: '#34d399', r: 11 },
        fact: 'Signed via the Manila Pact (1954) by the US, France, England, New Zealand, Australia, Philippines, Thailand, and Pakistan to prevent communism spreading in Southeast Asia.',
        nuance: 'Crucial Contrast: Unlike NATO, SEATO had NO joint command with standing forces (Book p. 44).',
      },
      {
        id: 'warsaw', yearOrTag: '14 May 1955 – 1991', title: '(c) Warsaw Pact (Soviet Counter-Alliance)', regionLabel: '8 Eastern European Nations (HQ: Moscow)',
        svgHighlight: { x: 275, y: 84, color: '#f87171', r: 11 },
        fact: 'Concluded by USSR, Poland, East Germany, Czechoslovakia, Hungary, Romania, Bulgaria, and Albania with joint military command headquartered in Moscow.',
        nuance: 'Dissolved in 1991 following the collapse of the Soviet Union (Book MCQ Q6!).',
      },
      {
        id: 'cento', yearOrTag: '1955 – 1979', title: '(d) CENTO — Central Treaty / Baghdad Pact', regionLabel: 'Turkey, Iraq, UK, Pakistan, Iran (+US 1958)',
        svgHighlight: { x: 225, y: 172, color: '#fbbf24', r: 11 },
        fact: 'Begun as the Baghdad Pact (1955) and renamed CENTO after the US joined in 1958; explicitly open to any Arab nation desiring regional peace and security.',
        nuance: 'Dissolved in 1979 (Book Blank Q4 & Brief Q3!).',
      },
    ],
  },
  '4.4': {
    mapHeading: '2D Peninsula Map: 38th Parallel & The Three Worlds (1945–1953)',
    mapSubtitle: 'Inspect how the Cold War turned into a devastating hot conflict across divided Korea',
    landPolygons: [
      { d: 'M145,35 L255,35 L245,115 L155,115 Z', label: 'NORTH KOREA (Kim Il-sung · USSR/China)', lx: 200, ly: 76, fill: '#7f1d1d' },
      { d: 'M155,123 L245,123 L252,205 L158,205 Z', label: 'SOUTH KOREA (Syngman Rhee · US/UN)', lx: 202, ly: 166, fill: '#1e3a8a' },
    ],
    connectorPath: 'M120,119 L285,119',
    steps: [
      {
        id: 'partition', yearOrTag: '1945', title: 'Partition of Korea into North & South', regionLabel: '38th Parallel Divide',
        svgHighlight: { x: 200, y: 119, color: '#fbbf24', r: 11 },
        fact: 'Divided in 1945 after WWII: North Korea (People’s Republic of Korea) led by Kim Il-sung and South Korea (Republic of Korea) led by Syngman Rhee — each claiming legitimacy to unify Korea.',
        nuance: 'External superpower rivalry hardened a temporary post-war division into a lasting frontier.',
      },
      {
        id: 'war1950', yearOrTag: 'June 1950 – 1953', title: 'Outbreak & Three Years of Devastation', regionLabel: 'Korean Peninsula',
        svgHighlight: { x: 200, y: 85, color: '#ef4444', r: 11 },
        fact: 'North Korea attacked South Korea in June 1950 with Stalin’s tacit support, misjudging that the US would not intervene. The three-year conflict brought enormous human suffering while leaving Korea still divided.',
        nuance: 'Historical lesson: Military escalation produced immense human cost without achieving unification.',
      },
      {
        id: 'thirdworld', yearOrTag: 'Cold War Taxonomy', title: 'First, Second & Third World Countries', regionLabel: 'Global Political Grouping',
        svgHighlight: { x: 200, y: 165, color: '#10b981', r: 11 },
        fact: 'First World = US-led capitalist nations; Second World = USSR-led communist nations; Third World = countries outside both superpower military blocs.',
        nuance: 'Important: Originally a political Cold War alignment term (p. 44), NOT an insult about human capability.',
      },
    ],
  },
  '4.5': {
    mapHeading: '2D Non-Aligned Movement Map: Bandung (1955) → Belgrade (1961)',
    mapSubtitle: 'Explore the 5 founding leaders and the 4 core principles of Non-Alignment',
    landPolygons: [
      { d: 'M115,45 L175,45 L175,92 L115,92 Z', label: 'Yugoslavia (Tito)', lx: 145, ly: 70, fill: '#1e3a8a' },
      { d: 'M135,112 L195,112 L195,155 L135,155 Z', label: 'Egypt (Nasser)', lx: 165, ly: 135, fill: '#065f46' },
      { d: 'M62,148 L122,148 L122,195 L62,195 Z', label: 'Ghana (Nkrumah)', lx: 92, ly: 172, fill: '#7c2d12' },
      { d: 'M215,108 L280,108 L280,168 L215,168 Z', label: 'India (Nehru)', lx: 248, ly: 138, fill: '#4c1d95' },
      { d: 'M295,158 L372,158 L372,202 L295,202 Z', label: 'Indonesia (Sukarno)', lx: 334, ly: 182, fill: '#0f766e' },
    ],
    connectorPath: 'M334,182 Q248,138 145,70',
    steps: [
      {
        id: 'bandung', yearOrTag: '1955 · Bandung', title: 'Afro-Asian Solidarity at Bandung (Indonesia)', regionLabel: 'Bandung, Indonesia',
        svgHighlight: { x: 334, y: 182, color: '#34d399', r: 11 },
        fact: 'Newly independent Asian and African nations urged countries to abstain from joining either superpower bloc and pledged to oppose colonialism and imperialism.',
        nuance: 'Decolonization created a global moral voice outside the US and Soviet blocs.',
      },
      {
        id: 'belgrade', yearOrTag: '1961 · Belgrade', title: 'First NAM Summit & The 5 Founding Leaders', regionLabel: 'Belgrade, Yugoslavia (Serbia)',
        svgHighlight: { x: 145, y: 70, color: '#fbbf24', r: 12 },
        fact: 'Convened under Tito (Yugoslavia), Nasser (Egypt), Jawaharlal Nehru (India), Kwame Nkrumah (Ghana), and Sukarno (Indonesia).',
        nuance: 'Four core Belgrade principles: (1) Peaceful co-existence, (2) Peace & security, (3) No superpower military alliance, (4) No foreign superpower military bases.',
      },
      {
        id: 'post1991', yearOrTag: 'Post-1991 Context', title: 'Shift After Collapse of USSR', regionLabel: 'India & Global South',
        svgHighlight: { x: 248, y: 138, color: '#38bdf8', r: 11 },
        fact: 'As the textbook notes (p. 44), the dissolution of the USSR ended bipolar Cold War rivalry, transforming NAM’s original bloc-abstention role into broader economic/Global South cooperation (see also Civics 4.4).',
        nuance: 'Non-alignment meant independent judgment on issues — never passive apathy.',
      },
    ],
  },
  '4.6': {
    mapHeading: '2D Caribbean Map: Cuban Revolution & 1962 Missile Crisis',
    mapSubtitle: 'Trace how economic conflict escalated to nuclear danger — and how diplomacy defused it',
    landPolygons: [
      { d: 'M115,30 L285,30 L265,92 L135,92 Z', label: 'UNITED STATES (Florida ~90 mi)', lx: 200, ly: 62, fill: '#1e3a8a' },
      { d: 'M145,135 L278,142 L268,168 L140,162 Z', label: 'CUBA (Havana / Bay of Pigs)', lx: 210, ly: 155, fill: '#065f46' },
      { d: 'M30,135 L110,135 L110,198 L30,198 Z', label: 'Central America', lx: 70, ly: 168, fill: '#334155' },
    ],
    connectorPath: 'M200,92 L205,138',
    steps: [
      {
        id: 'nationalize', yearOrTag: '1959–1960', title: 'Fidel Castro & Economic Nationalization', regionLabel: 'Havana, Cuba',
        svgHighlight: { x: 205, y: 150, color: '#34d399', r: 11 },
        fact: 'When US-owned refineries in Cuba refused to process Russian oil, Castro nationalized refineries, US-owned sugar companies, electricity, and telephone monopolies; the US halted Cuban sugar purchases.',
        nuance: 'Economic retaliation rapidly pushed Cuba closer to the Soviet Union.',
      },
      {
        id: 'bayofpigs', yearOrTag: 'April 1961', title: 'Bay of Pigs Landing Attempt', regionLabel: 'Southern Cuba Coast',
        svgHighlight: { x: 185, y: 162, color: '#f59e0b', r: 11 },
        fact: 'In April 1961, the US bombed Cuban airfields and backed Cuban exiles landing at the Bay of Pigs to overthrow Castro — increasing Cuban fears of full US invasion.',
        nuance: 'This insecurity prompted Cuba and the USSR to deploy defensive/nuclear missiles.',
      },
      {
        id: 'missiles', yearOrTag: 'October 1962', title: 'Cuban Missile Crisis Defused by Diplomacy', regionLabel: 'Caribbean Naval Blockade',
        svgHighlight: { x: 200, y: 112, color: '#ef4444', r: 12 },
        fact: 'US intelligence detected secret Soviet nuclear missiles in Cuba; US warships encircled the island. Soviet leader Khrushchev and US President Kennedy reached a mutual agreement: USSR withdrew missiles; US pledged never to invade Cuba.',
        nuance: 'Textbook Exam Focus (Brief Q6): Mutual diplomatic compromise averted nuclear war.',
      },
    ],
  },
  '4.7': {
    mapHeading: '2D West Asia Map: Arab–Israeli Conflicts & Suez Diplomacy (1947–1973)',
    mapSubtitle: 'Balanced factual timeline distinguishing Israeli, Palestinian/Arab, and international perspectives',
    landPolygons: [
      { d: 'M55,95 L165,95 L165,205 L55,205 Z', label: 'EGYPT (Suez Canal · Sinai)', lx: 110, ly: 155, fill: '#78350f' },
      { d: 'M176,75 L230,75 L230,175 L176,175 Z', label: 'Israel / Palestine (Jerusalem · Gaza)', lx: 203, ly: 124, fill: '#1e3a8a' },
      { d: 'M238,55 L345,55 L345,120 L238,120 Z', label: 'Syria', lx: 290, ly: 88, fill: '#334155' },
      { d: 'M238,128 L345,128 L345,200 L238,200 Z', label: 'Jordan', lx: 290, ly: 165, fill: '#3f3f46' },
    ],
    steps: [
      {
        id: '1947', yearOrTag: '1919–1949', title: 'Mandates, UN Partition (29 Nov 1947) & First War', regionLabel: 'Palestine / Israel',
        svgHighlight: { x: 203, y: 124, color: '#38bdf8', r: 11 },
        fact: 'After WWI mandates (Britain: Palestine/Iraq/Jordan; France: Syria/Lebanon) and Zionist settlement, the UN voted (29 Nov 1947) to partition Palestine. Fighting broke out immediately, followed by separate armistice lines.',
        nuance: 'Balanced perspective (Book p. 45): Israelis remember 1948 as their War of Independence; Arabs remember it as the Nakbah (“Catastrophe”) due to mass Palestinian displacement.',
      },
      {
        id: '1956', yearOrTag: '1956 · Suez', title: 'Suez Canal Crisis & Nehru’s Peace Diplomacy', regionLabel: 'Suez Canal, Egypt',
        svgHighlight: { x: 158, y: 138, color: '#10b981', r: 11 },
        fact: 'Egyptian President Nasser nationalized the Suez Canal (1956). Israel invaded (29 Oct) and Britain & France bombed Egyptian airfields (31 Oct). World opinion — with India’s PM Nehru playing a key mediating role — ended hostilities on 6 Nov.',
        nuance: 'Showed declining European imperial power and rising moral influence of newly independent nations.',
      },
      {
        id: '1967', yearOrTag: 'June 1967', title: 'Arab–Israeli War of 1967 & PLO Leadership', regionLabel: 'Sinai, Gaza & West Bank',
        svgHighlight: { x: 175, y: 152, color: '#f59e0b', r: 11 },
        fact: 'After border raids, Sinai mobilization, and closure of the Gulf of Aqaba, Israel launched a pre-emptive air strike (5 June 1967) capturing Gaza and the Sinai Peninsula. Yasser Arafat became PLO Chairman in 1969.',
        nuance: 'PLO (founded 1964) federated Palestinian resistance groups politically under Arafat.',
      },
      {
        id: '1973', yearOrTag: '6 Oct 1973', title: 'Arab–Israeli (Yom Kippur) War & US Mediation', regionLabel: 'Sinai & Golan Fronts',
        svgHighlight: { x: 235, y: 105, color: '#ef4444', r: 11 },
        fact: 'Egypt (Anwar Sadat) and Syria (Hafez al-Assad) launched a surprise joint offensive on 6 October 1973 after peace-for-Sinai talks failed. Israel pushed back despite heavy losses; US mediation expanded American influence in West Asia.',
        nuance: 'Exam link: Anwar Sadat = Egypt (Book Match Q3); Yasser Arafat = PLO Chairman 1969 (MCQ Q4).',
      },
    ],
  },
  '4.8': {
    mapHeading: '2D Indochina Map: Vietnam Partition to Unification (1945–1976)',
    mapSubtitle: 'Step through Viet Minh → Geneva (1954) → Escalation (1965) → Reunification (1976)',
    landPolygons: [
      { d: 'M155,35 L240,35 L252,118 L185,118 Z', label: 'NORTH VIETNAM (Hanoi · Ho Chi Minh)', lx: 205, ly: 76, fill: '#991b1b' },
      { d: 'M185,124 L255,124 L242,208 L175,205 Z', label: 'SOUTH VIETNAM (Saigon / Ho Chi Minh City)', lx: 215, ly: 168, fill: '#1e3a8a' },
      { d: 'M95,70 L175,70 L175,195 L105,195 Z', label: 'Laos & Cambodia', lx: 135, ly: 136, fill: '#334155' },
    ],
    connectorPath: 'M165,121 L275,121',
    steps: [
      {
        id: 'geneva', yearOrTag: '1945–1954', title: 'Viet Minh Victory & Geneva Conference (1954)', regionLabel: 'Hanoi & 17th Parallel',
        svgHighlight: { x: 205, y: 76, color: '#f59e0b', r: 11 },
        fact: 'Ho Chi Minh’s Viet Minh defeated French colonial troops. The 1954 Geneva Conference granted independence to Laos & Cambodia while temporarily dividing Vietnam into Communist North (Ho Chi Minh) and South (Bao Dai / Ngo Dinh Diem).',
        nuance: 'Division was meant to be temporary, yet Cold War politics prolonged it for 22 years.',
      },
      {
        id: 'escalation', yearOrTag: '1965–1973', title: 'US Troop Buildup & Humanitarian Devastation', regionLabel: 'Danang & Rural Vietnam',
        svgHighlight: { x: 225, y: 121, color: '#ef4444', r: 11 },
        fact: 'US Marines landed at Danang in 1965 (reaching 2,10,000 troops by year-end). Heavy bombing, napalm, and defoliant Agent Orange devastated forests and took hundreds of thousands of lives, alongside heavy US casualties.',
        nuance: 'Historical reflection (Book Activity VII-2): Emphasizes the immense human & ecological toll of warfare.',
      },
      {
        id: 'united', yearOrTag: '1975–1976', title: 'Liberation of Saigon (30 Apr 1975) & Unification (1976)', regionLabel: 'Ho Chi Minh City',
        svgHighlight: { x: 212, y: 185, color: '#10b981', r: 12 },
        fact: 'All US troops withdrew by 30 April 1975 as Saigon was liberated. North and South Vietnam formally united in 1976, and Saigon was renamed Ho Chi Minh City.',
        nuance: 'Distinguish carefully for Book MCQ Q5: Saigon fell in 1975; formal political unification occurred in 1976!',
      },
    ],
  },
  '4.9': {
    mapHeading: '2D Institutional Staircase: Council of Europe (1949) → European Union (1992)',
    mapSubtitle: 'Click each integration treaty to trace how Western Europe built lasting peace and a single market',
    landPolygons: [
      { d: 'M30,155 L95,155 L95,205 L30,205 Z', label: '1949 Council', lx: 62, ly: 182, fill: '#1e3a8a' },
      { d: 'M102,130 L168,130 L168,205 L102,205 Z', label: '1951 ECSC', lx: 135, ly: 170, fill: '#1d4ed8' },
      { d: 'M175,105 L242,105 L242,205 L175,205 Z', label: '1957 EEC', lx: 208, ly: 158, fill: '#0f766e' },
      { d: 'M249,78 L315,78 L315,205 L249,205 Z', label: '1987 SEA', lx: 282, ly: 145, fill: '#047857' },
      { d: 'M322,48 L388,48 L388,205 L322,205 Z', label: '1992 EU', lx: 355, ly: 130, fill: '#4338ca' },
    ],
    steps: [
      {
        id: 'council', yearOrTag: 'May 1949', title: '(a) Council of Europe (HQ: Strasbourg)', regionLabel: 'London → Strasbourg',
        svgHighlight: { x: 62, y: 155, color: '#38bdf8', r: 10 },
        fact: 'Ten European nations met in London (May 1949) to end France–Germany rivalry, resist Soviet pressure, act as a third force, and coordinate continental resources. Headquarters: Strasbourg.',
        nuance: 'Exam Blank Q7: Strasbourg was the headquarters of the Council of Europe!',
      },
      {
        id: 'ecsc_eec', yearOrTag: '1951 & 1957', title: '(b–c) ECSC & EEC (Treaty of Rome · HQ: Brussels)', regionLabel: '6 Founding Nations',
        svgHighlight: { x: 208, y: 105, color: '#14b8a6', r: 10 },
        fact: 'Six ECSC members (France, West Germany, Italy, Belgium, Holland, Luxembourg) signed the Treaty of Rome forming the EEC / Common Market — removing barriers to goods, services, capital, and labour, plus CAP.',
        nuance: 'Notice the headquarters shift: Council of Europe = Strasbourg; EEC / EU = Brussels!',
      },
      {
        id: 'sea', yearOrTag: '1 July 1987', title: '(d) Single European Act (SEA)', regionLabel: 'Deepened Political Cooperation',
        svgHighlight: { x: 282, y: 78, color: '#10b981', r: 10 },
        fact: 'Came into force 1 July 1987; gave European Political Cooperation a legal foundation, weighted votes by population, and required roughly two-thirds majority for legislation.',
        nuance: 'Bridged economic integration into coordinated foreign and legislative policy.',
      },
      {
        id: 'eu', yearOrTag: '7 Feb 1992', title: '(e) Maastricht Treaty Creates European Union & Euro', regionLabel: 'Maastricht → Brussels',
        svgHighlight: { x: 355, y: 48, color: '#818cf8', r: 11 },
        fact: 'Signed 7 February 1992 at Maastricht (Netherlands), creating the European Union and planning common monetary policy and the Euro currency from headquarters in Brussels, Belgium.',
        nuance: 'Updated Context Note (Rule A7): Textbook p. 48 prints 28 members; after Brexit (31 Jan 2020), the EU has 27 member states.',
      },
    ],
  },
  '4.10': {
    mapHeading: '2D Collapse Timeline: Berlin Wall (1961–1989) & End of USSR (1991)',
    mapSubtitle: 'Compare divided Berlin and trace the 1985–1991 reform & dissolution sequence',
    landPolygons: [
      { d: 'M35,55 L178,55 L178,195 L35,195 Z', label: 'WEST BERLIN (FRG · Marshall Recovery)', lx: 106, ly: 125, fill: '#1e3a8a' },
      { d: 'M208,55 L368,55 L368,195 L208,195 Z', label: 'EAST BERLIN (GDR) & SOVIET BLOC', lx: 288, ly: 125, fill: '#7f1d1d' },
    ],
    connectorPath: 'M193,42 L193,205',
    steps: [
      {
        id: 'wall1961', yearOrTag: '1961', title: 'East Germany Builds the Berlin Wall', regionLabel: 'Divided Berlin',
        svgHighlight: { x: 193, y: 125, color: '#f59e0b', r: 11 },
        fact: 'Prosperity in West Berlin contrasted sharply with economic hardship and restricted freedom in East Berlin. To stop mass migration westward, East Germany built a guarded wall in 1961.',
        nuance: 'Became the defining physical symbol of the Cold War divide between capitalism and communism.',
      },
      {
        id: 'gorbachev', yearOrTag: '1985–1988', title: 'Gorbachev’s Glasnost, Perestroika & Economic Strain', regionLabel: 'Moscow & USSR',
        svgHighlight: { x: 300, y: 92, color: '#38bdf8', r: 11 },
        fact: 'With ~1/3 of GDP consumed by military parity (Reagan’s Star Wars) and the 1986 Chernobyl nuclear accident, Mikhail Gorbachev launched Perestroika (economic restructuring) and Glasnost (political openness).',
        nuance: 'Unlike earlier Soviet rulers, Gorbachev refused brutal military repression when protests grew in Armenia, the Baltics, Poland, and Hungary.',
      },
      {
        id: 'nov1989', yearOrTag: '9 Nov 1989 → 3 Oct 1990', title: 'Fall of Berlin Wall & German Reunification', regionLabel: 'Berlin, Germany',
        svgHighlight: { x: 193, y: 85, color: '#10b981', r: 12 },
        fact: 'Crowds from both sides demolished the Berlin Wall on 9 November 1989; Chancellor Helmut Kohl guided official German reunification on 3 October 1990. Communist regimes across Czechoslovakia, Bulgaria, and Romania fell.',
        nuance: 'Helmut Kohl & French President Mitterrand also co-architected the 1992 Maastricht Treaty.',
      },
      {
        id: 'dec1991', yearOrTag: 'Dec 1991', title: 'CIS Formation & Dissolution of the USSR', regionLabel: '15 Independent Republics',
        svgHighlight: { x: 300, y: 158, color: '#c084fc', r: 12 },
        fact: 'After a failed conservative coup (Aug 1991) elevated Boris Yeltsin, Baltic states (Estonia, Latvia, Lithuania) left and 11 republics formed the CIS. Gorbachev resigned on 25 Dec; the USSR formally dissolved at midnight on 31 December 1991.',
        nuance: 'Careful date distinction: Berlin Wall fell 9 Nov 1989; Germany reunited 3 Oct 1990; USSR ended 31 Dec 1991!',
      },
    ],
  },
};

interface HistoryUnit4Interactive2DProps {
  variant: HistoryUnit4Variant;
  questionToInvestigate: string;
  whatToNotice: string;
  onExploreStep?: () => void;
  onFinishAllSteps?: () => void;
}

export function HistoryUnit4Interactive2D({
  variant,
  questionToInvestigate,
  whatToNotice,
  onExploreStep,
  onFinishAllSteps,
}: HistoryUnit4Interactive2DProps) {
  const bp = HISTORY4_INTERACTIVES[variant];
  const [stepIdx, setStepIdx] = useState(0);
  const [visited, setVisited] = useState<string[]>([bp.steps[0].id]);

  const active = bp.steps[stepIdx] ?? bp.steps[0];

  const selectStep = (idx: number) => {
    setStepIdx(idx);
    onExploreStep?.();
    const id = bp.steps[idx].id;
    setVisited((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (next.length === bp.steps.length) onFinishAllSteps?.();
      return next;
    });
  };

  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-card)]">
      {/* Header + Investigation Question */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Explore · Interactive 2D Timeline &amp; Historical Map</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[var(--ink)]">{bp.mapHeading}</h3>
          <p className="text-xs sm:text-sm text-[var(--text)]">
            <strong>Question to investigate:</strong> {questionToInvestigate}
          </p>
        </div>
        <button
          type="button"
          onClick={() => selectStep(0)}
          className="px-3 py-1.5 min-h-[38px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Primary Stepper Control (Keyboard + Mouse Friendly, 44px Touch Targets) */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Historical milestone selector">
        {bp.steps.map((st, idx) => {
          const isSel = idx === stepIdx;
          const isSeen = visited.includes(st.id);
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => selectStep(idx)}
              aria-pressed={isSel}
              className={`px-3.5 py-2 min-h-[44px] rounded-xl border text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-1.5 ${
                isSel
                  ? 'bg-[var(--social)] text-white border-[var(--social)] shadow-xs'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--social)]'
              }`}
            >
              {isSeen && !isSel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{st.yearOrTag}</span>
            </button>
          );
        })}
      </div>

      {/* Synchronized 2D Geopolitical Map + Active Evidence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-6 space-y-2">
          <div className="rounded-2xl border border-[var(--line)] bg-[#0a1326] p-3">
            <svg
              viewBox="0 0 410 230"
              className="w-full h-[220px] sm:h-[245px]"
              role="img"
              aria-label={`2D historical map for ${bp.mapHeading}`}
            >
              {/* Subtle geographic grid */}
              {[50, 115, 180].map((y) => (
                <line key={y} x1="12" y1={y} x2="398" y2={y} stroke="#1e293b" strokeDasharray="3 4" />
              ))}
              {[100, 200, 300].map((x) => (
                <line key={x} x1={x} y1="14" x2={x} y2="216" stroke="#1e293b" strokeDasharray="3 4" />
              ))}

              {/* Historical Region Blocks */}
              {bp.landPolygons.map((poly) => (
                <g key={poly.label}>
                  <path d={poly.d} fill={poly.fill} stroke="#64748b" strokeWidth="1.6" opacity="0.92" />
                  <text x={poly.lx} y={poly.ly} textAnchor="middle" fill="#e2e8f0" fontSize="9.5" fontWeight="700">
                    {poly.label}
                  </text>
                </g>
              ))}

              {/* Route / Divide Connector */}
              {bp.connectorPath && (
                <path
                  d={bp.connectorPath}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.4"
                  strokeDasharray="6 4"
                  opacity="0.85"
                />
              )}

              {/* Clickable Map Pins for Every Step */}
              {bp.steps.map((st, idx) => {
                const isSel = idx === stepIdx;
                const r = isSel ? (st.svgHighlight.r ?? 10) : 6.5;
                return (
                  <g
                    key={st.id}
                    onClick={() => selectStep(idx)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectStep(idx);
                      }
                    }}
                  >
                    {isSel && (
                      <circle
                        cx={st.svgHighlight.x}
                        cy={st.svgHighlight.y}
                        r={r + 7}
                        fill="none"
                        stroke={st.svgHighlight.color}
                        strokeWidth="2"
                        opacity="0.65"
                      />
                    )}
                    <circle
                      cx={st.svgHighlight.x}
                      cy={st.svgHighlight.y}
                      r={r}
                      fill={st.svgHighlight.color}
                      stroke="#ffffff"
                      strokeWidth={isSel ? 2.4 : 1.2}
                    />
                    <text
                      x={st.svgHighlight.x}
                      y={st.svgHighlight.y + 3}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="8.5"
                      fontWeight="900"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}

              <text x="16" y="222" fill="#94a3b8" fontSize="8.5">
                Schematic historical diagram (Not to scale) · Focus: {active.regionLabel}
              </text>
            </svg>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{bp.mapSubtitle}</p>
        </div>

        {/* Active Historical Evidence & Optional Side-by-Side Comparison */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-4 rounded-2xl border border-[var(--social)]/35 bg-[var(--surface-subtle)] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold">
              <span className="text-[var(--social)]">{active.yearOrTag}</span>
              <span className="text-[var(--text-muted)]">{active.regionLabel}</span>
            </div>
            <h4 className="text-base font-extrabold text-[var(--ink)]">{active.title}</h4>
            <p className="text-sm text-[var(--text)] leading-relaxed">{active.fact}</p>

            {active.compareLeft && active.compareRight && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-extrabold text-[var(--primary)]">{active.compareLeftLabel}</div>
                  <p className="text-[var(--text)] mt-1">{active.compareLeft}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-extrabold text-[var(--social)]">{active.compareRightLabel}</div>
                  <p className="text-[var(--text)] mt-1">{active.compareRight}</p>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)] flex items-start gap-2">
              <Info className="w-4 h-4 text-[var(--social)] shrink-0 mt-0.5" />
              <span>
                <strong>Historical Context:</strong> {active.nuance}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={() => selectStep(Math.max(0, stepIdx - 1))}
              className="px-4 py-2 min-h-[42px] rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs font-bold text-[var(--ink)] disabled:opacity-40"
            >
              ← Earlier milestone
            </button>
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              Explored {visited.length} of {bp.steps.length} milestones
            </span>
            <button
              type="button"
              disabled={stepIdx === bp.steps.length - 1}
              onClick={() => selectStep(Math.min(bp.steps.length - 1, stepIdx + 1))}
              className="px-4 py-2 min-h-[42px] rounded-xl bg-[var(--social)] text-white text-xs font-bold disabled:opacity-40"
            >
              Next milestone →
            </button>
          </div>
        </div>
      </div>

      {/* What to Notice Banner */}
      <div className="p-3.5 rounded-xl bg-[var(--info-bg)] border border-[var(--primary)]/25 text-xs sm:text-sm text-[var(--ink)]">
        <strong>What to notice:</strong> {whatToNotice}
      </div>
    </div>
  );
}
