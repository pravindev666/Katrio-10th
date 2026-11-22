import React, { Suspense, lazy, useState } from 'react';
import { CheckCircle2, Globe2, Landmark, Scale } from 'lucide-react';
import type { GlobePinSpec } from './HistoryTheatre3DCanvas';
import type { TopicLabProps } from './TopicInteractiveLabs';

const CivicsEconomics3DCanvas = lazy(() => import('./CivicsEconomics3DCanvas'));
const HistoryTheatre3DCanvas = lazy(() => import('./HistoryTheatre3DCanvas'));
const IndiaRelief3DCanvas = lazy(() => import('./IndiaRelief3DCanvas'));

interface StageCard {
  yearOrTag: string;
  title: string;
  detail: string;
  takeaway: string;
}

const CIVICS_CHAPTERS: Record<string, { header: string; kind3D: 'civics_constitution' | 'civics_diplomacy'; cards: StageCard[] }> = {
  'social-civics-01': {
    header: 'Civics Unit 1 · Indian Constitution, Preamble & Fundamental Rights (pp. 239–247)',
    kind3D: 'civics_constitution',
    cards: [
      { yearOrTag: 'Preamble & Framing', title: 'Drafting Committee (Dr. B.R. Ambedkar · Adopted 26 Nov 1949)', detail: 'Came into force on 26 January 1950 — declares India a Sovereign, Socialist, Secular, Democratic Republic.', takeaway: 'Longest written constitution in the world guaranteeing Justice, Liberty, Equality & Fraternity.' },
      { yearOrTag: 'Part III (Art. 12–35)', title: '6 Fundamental Rights (Magna Carta of India)', detail: 'Right to Equality, Freedom, Against Exploitation, Freedom of Religion, Cultural & Educational Rights, and Constitutional Remedies (Art. 32).', takeaway: 'Dr. Ambedkar called Article 32 (Writs: Habeas Corpus, Mandamus, etc.) the Heart & Soul of the Constitution.' },
      { yearOrTag: 'Part IV & IV-A', title: 'Directive Principles (DPSP) & 11 Fundamental Duties', detail: 'DPSP (Art. 36–51) guides welfare governance; Fundamental Duties (Art. 51A, 42nd Amendment 1976) remind citizens to protect heritage, environment & unity.', takeaway: 'Balances individual rights with collective civic responsibility.' },
    ],
  },
  'social-civics-02': {
    header: 'Civics Unit 2 · Central Government — Union Executive, Parliament & Judiciary (pp. 248–258)',
    kind3D: 'civics_constitution',
    cards: [
      { yearOrTag: 'Legislature', title: 'Parliament of India (Lok Sabha + Rajya Sabha + President)', detail: 'Lok Sabha (House of the People, 5-year term, Money Bills originate here) and Rajya Sabha (Council of States, permanent upper house).', takeaway: 'Makes Union List & Concurrent List laws and holds the Council of Ministers accountable.' },
      { yearOrTag: 'Executive', title: 'President (Nominal Head) & Prime Minister (Real Head)', detail: 'President is elected indirectly by Electoral College (Art. 52–62); Prime Minister & Cabinet exercise real executive authority.', takeaway: 'Parliamentary democracy unites stability with collective responsibility to Lok Sabha.' },
      { yearOrTag: 'Judiciary', title: 'Supreme Court of India (Guardian of the Constitution)', detail: 'Headed by the Chief Justice of India; exercises Original, Appellate, Advisory jurisdictions and Judicial Review.', takeaway: 'Independent judiciary protects Fundamental Rights and settles Centre–State disputes.' },
    ],
  },
  'social-civics-03': {
    header: 'Civics Unit 3 · State Government — Governor, CM & High Court (pp. 259–268)',
    kind3D: 'civics_constitution',
    cards: [
      { yearOrTag: 'State Legislature', title: 'Tamil Nadu Legislative Assembly (Vidhan Sabha)', detail: 'Directly elected MLAs legislate on State List subjects (Police, Public Health, Agriculture, Local Government).', takeaway: 'Tamil Nadu has a unicameral legislature (Legislative Assembly).' },
      { yearOrTag: 'State Executive', title: 'Governor & Chief Minister with Council of Ministers', detail: 'Governor is the constitutional head appointed by the President; Chief Minister is the elected leader of the majority party.', takeaway: 'Real executive decisions in the state are carried out by the CM and Cabinet.' },
      { yearOrTag: 'State Judiciary', title: 'Madras High Court (Est. 1862) & Subordinate Courts', detail: 'Highest judicial authority within the state with Writ jurisdiction (Art. 226) and supervisory control over district courts.', takeaway: 'Madras High Court is one of India’s oldest chartered High Courts.' },
    ],
  },
  'social-civics-04': {
    header: 'Civics Unit 4 · India’s Foreign Policy — Panchsheel & Non-Alignment (pp. 269–277)',
    kind3D: 'civics_diplomacy',
    cards: [
      { yearOrTag: '1954 · Panchsheel', title: 'Five Principles of Peaceful Coexistence', detail: 'Mutual respect for sovereignty, non-aggression, non-interference, equality & mutual benefit, and peaceful coexistence.', takeaway: 'Laid the ethical foundation of India’s post-independence diplomacy.' },
      { yearOrTag: '1961 · NAM', title: 'Non-Aligned Movement (Nehru, Nasser, Tito, Sukarno, Nkrumah)', detail: 'Independent foreign policy refusing military alignment with either Cold War superpower bloc while promoting peace & decolonisation.', takeaway: 'Protected India’s strategic autonomy and voice of newly independent nations.' },
      { yearOrTag: 'Modern Policy', title: 'Neighbourhood First, Look East → Act East & Disarmament', detail: 'Promotes regional connectivity, nuclear No-First-Use restraint, UN peacekeeping, and economic cooperation.', takeaway: 'Article 51 of the Indian Constitution explicitly directs the State to promote international peace.' },
    ],
  },
  'social-civics-05': {
    header: 'Civics Unit 5 · India’s International Relations & Global Groupings (pp. 278–291)',
    kind3D: 'civics_diplomacy',
    cards: [
      { yearOrTag: 'South Asia', title: 'Neighbours & SAARC / BIMSTEC Connectivity', detail: 'Cultural, river, energy, and trade partnerships with Bhutan, Nepal, Sri Lanka, Bangladesh, Maldives, and Myanmar.', takeaway: 'BIMSTEC bridges South Asia and South-East Asia around the Bay of Bengal.' },
      { yearOrTag: 'Global Blocs', title: 'BRICS, G20, SCO & ASEAN Partnerships', detail: 'Cooperation in infrastructure finance (New Development Bank), climate action, digital public goods, and Indo-Pacific maritime security.', takeaway: 'Multi-aligned diplomacy expands trade, science, and education opportunities.' },
      { yearOrTag: 'United Nations', title: 'India as Founding Member of the UN (1945)', detail: 'One of the largest contributors to UN Peacekeeping Forces and champion of International Solar Alliance (ISA).', takeaway: 'Demonstrates global leadership in sustainable development & peace.' },
    ],
  },
};

export function CivicsGovernance3DLab({ sectionId, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const unitKey = sectionId.slice(0, 16); // social-civics-01 .. 05
  const data = CIVICS_CHAPTERS[unitKey] ?? CIVICS_CHAPTERS['social-civics-01'];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6 space-y-2">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Civics Model...</div>}>
          <CivicsEconomics3DCanvas kind={data.kind3D} activePillar={activeIdx} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
          <Landmark className="w-4 h-4" />
          <span>{data.header}</span>
        </div>
        <div className="space-y-2">
          {data.cards.map((c, idx) => (
            <button
              key={c.title}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                onInteract();
                onComplete(`Explored 3D Civics Governance pillar: ${c.title}`);
              }}
              className={`w-full p-3 rounded-xl border text-left transition-colors ${activeIdx === idx ? 'bg-[var(--social)] text-white border-[var(--social)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
            >
              <div className={`text-[10px] font-bold uppercase ${activeIdx === idx ? 'text-amber-200' : 'text-[var(--social)]'}`}>{c.yearOrTag}</div>
              <div className="font-extrabold text-sm mt-0.5">{c.title}</div>
              <p className={`mt-1 leading-relaxed ${activeIdx === idx ? 'text-white/95' : 'text-[var(--text)]'}`}>{c.detail}</p>
              <div className={`mt-1.5 pt-1.5 border-t text-[11px] font-semibold ${activeIdx === idx ? 'border-white/20 text-amber-100' : 'border-[var(--line)] text-[var(--ink)]'}`}>
                Exam Key: {c.takeaway}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const ECON_CHAPTERS: Record<string, { header: string; kind3D: 'econ_gdp' | 'econ_trade_clusters'; cards: StageCard[] }> = {
  'social-economics-01': {
    header: 'Economics Unit 1 · Gross Domestic Product (GDP) & Sectoral Growth (pp. 292–302)',
    kind3D: 'econ_gdp',
    cards: [
      { yearOrTag: 'Formula', title: 'GDP = C + I + G + (X − M) & GNP = GDP + NFIA', detail: 'Total market value of final goods & services produced within domestic borders in one year (avoiding double counting of intermediate goods).', takeaway: 'Per Capita Income = National Income / Total Population.' },
      { yearOrTag: 'Three Sectors', title: 'Primary (Agri) · Secondary (Industry) · Tertiary (Services)', detail: 'India shifted from agrarian dominance toward Tertiary IT, Banking, Transport & Trade contributing >53% of GDP.', takeaway: 'Adjust the sliders below to lift each 3D sector tower live!' },
    ],
  },
  'social-economics-02': {
    header: 'Economics Unit 2 · Globalization, MNCs & World Trade Organization (pp. 303–310)',
    kind3D: 'econ_trade_clusters',
    cards: [
      { yearOrTag: '1991 LPG Reforms', title: 'Liberalisation, Privatisation & Globalisation', detail: 'Removed licensing barriers, encouraged Foreign Direct Investment (FDI), and integrated Indian industry with global supply chains.', takeaway: 'WTO (1995, Geneva) sets multilateral trade rules.' },
      { yearOrTag: 'Fair Trade', title: 'Balancing MNC Gains with Small-Producer Protection', detail: 'Consumers gain wider choice & tech transfer, while fair globalization protects local artisans, farmers & labour rights.', takeaway: 'Indian MNCs include Tata, Infosys, TVS, and Sun Pharma.' },
    ],
  },
  'social-economics-03': {
    header: 'Economics Unit 3 · Food Security, Buffer Stock & Nutrition (pp. 311–320)',
    kind3D: 'econ_gdp',
    cards: [
      { yearOrTag: '3 Pillars', title: 'Availability · Accessibility · Affordability of Food', detail: 'Green Revolution (HYV seeds, irrigation) lifted grain output; FCI procures grain at Minimum Support Price (MSP) for Buffer Stock.', takeaway: 'Tamil Nadu runs a Universal Public Distribution System (PDS) — no BPL exclusion!' },
      { yearOrTag: 'Nutrition Schemes', title: 'ICDS, Nutritious Noon Meal Scheme & NFSA (2013)', detail: 'Dr. Muthulakshmi Reddy Maternity Benefit & Chief Minister’s Noon Meal Scheme directly combat child malnutrition & anemia.', takeaway: 'Purchasing power depends on employment, wages & price stability.' },
    ],
  },
  'social-economics-04': {
    header: 'Economics Unit 4 · Government Revenue, Direct/Indirect Taxes & GST (pp. 321–327)',
    kind3D: 'econ_gdp',
    cards: [
      { yearOrTag: 'Direct Taxes', title: 'Income Tax, Corporate Tax & Wealth Tax', detail: 'Paid directly by the earner to the government; progressive in nature (higher income pays higher rate).', takeaway: 'Burden cannot be shifted onto another buyer.' },
      { yearOrTag: 'Indirect Taxes', title: 'Goods & Services Tax (GST · Implemented 1 July 2017)', detail: 'One-nation indirect tax replacing cascading sales/excise taxes (CGST, SGST, IGST) collected via sellers.', takeaway: 'Taxes fund schools, hospitals, roads, defence & social welfare.' },
    ],
  },
  'social-economics-05': {
    header: 'Economics Unit 5 · Industrial Clusters in Tamil Nadu (pp. 328–338)',
    kind3D: 'econ_trade_clusters',
    cards: [
      { yearOrTag: 'Detroit of Asia', title: 'Chennai–Sriperumbudur–Hosur Auto & IT Corridor', detail: 'Global hub for cars, two-wheelers, railway coaches (ICF), electronics, and TIDEL Park software exports.', takeaway: 'Supported by SIPCOT industrial estates, ports & skilled engineering colleges.' },
      { yearOrTag: 'Manchester & Clusters', title: 'Coimbatore (Textiles/Pumps) · Tiruppur (Knitwear) · Sivakasi · Salem', detail: 'Tiruppur drives India’s cotton knitwear exports; Sivakasi leads printing & matches; Ambur/Vaniyambadi lead leather; Karur leads bus-body & home textiles.', takeaway: 'Industrial clusters cut logistics costs and boost MSME entrepreneurship.' },
    ],
  },
};

export function Economics3DStudioLab({ sectionId, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const unitKey = sectionId.slice(0, 19); // social-economics-01..05
  const data = ECON_CHAPTERS[unitKey] ?? ECON_CHAPTERS['social-economics-01'];
  const [agri, setAgri] = useState(18);
  const [ind, setInd] = useState(28);
  const [serv, setServ] = useState(54);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 3D Economics Studio...</div>}>
          <CivicsEconomics3DCanvas kind={data.kind3D} gdpValues={[agri, ind, serv]} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
          <Scale className="w-4 h-4" />
          <span>{data.header}</span>
        </div>
        {data.kind3D === 'econ_gdp' && (
          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
            <label className="block font-bold text-[var(--ink)]">Primary / Agri Allocation: ₹{agri}L Cr<input type="range" min={10} max={80} value={agri} onChange={(e) => { setAgri(Number(e.target.value)); onInteract(); onComplete('Modelled 3D Economic Sector Towers!'); }} className="w-full accent-emerald-600 mt-1" /></label>
            <label className="block font-bold text-[var(--ink)]">Secondary / Industry: ₹{ind}L Cr<input type="range" min={10} max={80} value={ind} onChange={(e) => { setInd(Number(e.target.value)); onInteract(); }} className="w-full accent-amber-600 mt-1" /></label>
            <label className="block font-bold text-[var(--ink)]">Tertiary / Services &amp; Welfare: ₹{serv}L Cr<input type="range" min={10} max={100} value={serv} onChange={(e) => { setServ(Number(e.target.value)); onInteract(); }} className="w-full accent-sky-600 mt-1" /></label>
          </div>
        )}
        <div className="space-y-2">
          {data.cards.map((c) => (
            <div key={c.title} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
              <div className="text-[10px] font-bold uppercase text-[var(--social)]">{c.yearOrTag}</div>
              <div className="font-extrabold text-sm text-[var(--ink)]">{c.title}</div>
              <p className="text-[var(--text)] leading-relaxed">{c.detail}</p>
              <div className="text-[11px] font-semibold text-[var(--ink)] pt-1 border-t border-[var(--line)]">Exam Key: {c.takeaway}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HISTORY_UNITS_2_TO_10: Record<string, { title: string; events: StageCard[] }> = {
  'social-history-02': {
    title: 'History Unit 2 · The World Between Two World Wars (1919–1939 · pp. 16–26)',
    events: [
      { yearOrTag: '1929', title: 'The Great Depression (Wall Street Crash)', detail: 'Collapse of US stock market froze global loans, triggered mass unemployment, and caused farm prices in colonial India to plunge.', takeaway: 'FDR launched the New Deal to rebuild jobs & social security.' },
      { yearOrTag: '1922–1933', title: 'Rise of Fascism (Mussolini) & Nazism (Hitler)', detail: 'Economic distress and resentment over Versailles fueled authoritarian regimes in Italy and Germany.', takeaway: 'Weakness of the League of Nations failed to curb aggression.' },
      { yearOrTag: '1920s–1930s', title: 'Anti-Colonial Struggles in Asia & Africa', detail: 'Ho Chi Minh in Indo-China, nationalist movements in Egypt & South Africa challenged European imperial rule.', takeaway: 'Interwar crises accelerated global decolonisation.' },
    ],
  },
  'social-history-03': {
    title: 'History Unit 3 · World War II & Creation of the United Nations (1939–1945 · pp. 27–39)',
    events: [
      { yearOrTag: '1939–1941', title: 'Outbreak in Europe, Battle of Britain & Pearl Harbor', detail: 'Germany invaded Poland (1 Sep 1939); Japan attacked Pearl Harbor (7 Dec 1941), bringing the USA into the Allied coalition.', takeaway: 'Axis (Germany, Italy, Japan) vs Allies (Britain, France, USSR, USA).' },
      { yearOrTag: '1942–1945', title: 'Stalingrad, D-Day Normandy & End of War', detail: 'Soviet victory at Stalingrad and Allied Normandy landings turned the tide; atomic bombings of Hiroshima & Nagasaki ended war in August 1945.', takeaway: 'Humanitarian devastation led humanity to seek lasting peace institutions.' },
      { yearOrTag: '24 Oct 1945', title: 'United Nations, Bretton Woods (IMF/World Bank) & Welfare State', detail: 'UN Charter signed in San Francisco to protect human rights, prevent global wars, and foster economic stability.', takeaway: 'WHO, UNESCO, UNICEF, ILO & ICJ became core UN pillars.' },
    ],
  },
  'social-history-04': {
    title: 'History Unit 4 · The World After World War II (1945–1991 · pp. 40–52)',
    events: [
      { yearOrTag: '1949', title: 'Chinese Revolution (Mao Zedong)', detail: 'People’s Republic of China established on 1 October 1949 following civil war and land reform.', takeaway: 'Reshaped Asian geopolitics alongside independent India.' },
      { yearOrTag: '1947–1991', title: 'Cold War (NATO vs Warsaw Pact), NAM & End of USSR', detail: 'Ideological rivalry between USA and USSR saw Korean/Vietnam conflicts and Berlin Wall (1961–1989); NAM championed peace.', takeaway: 'Gorbachev’s Glasnost & Perestroika preceded USSR dissolution in 1991.' },
      { yearOrTag: '1955–1993', title: 'Bandung Conference, European Union & Decolonisation', detail: 'Afro-Asian solidarity at Bandung (1955) strengthened independence movements; Maastricht Treaty (1992) formed the EU.', takeaway: 'Shifted the world toward multipolar cooperation.' },
    ],
  },
  'social-history-05': {
    title: 'History Unit 5 · 19th-Century Social & Religious Reform Movements (pp. 53–62)',
    events: [
      { yearOrTag: '1828', title: 'Raja Rammohan Roy & Brahmo Samaj', detail: 'Campaigned against Sati (abolished 1829 under Bentinck), child marriage, and caste rigidity while promoting modern education.', takeaway: 'Followed by Ishwar Chandra Vidyasagar’s Widow Remarriage Act (1856).' },
      { yearOrTag: '1875–1897', title: 'Arya Samaj, Ramakrishna Mission & Jyotiba Phule', detail: 'Swami Vivekananda inspired youth at Chicago (1893); Jyotiba & Savitribai Phule founded Satyashodhak Samaj & girls’ schools in Pune.', takeaway: 'Narayana Guru & Ayyankali led transformative anti-caste reforms in Kerala.' },
      { yearOrTag: 'Tamil Nadu', title: 'Vallalar (Ramalinga Adigal) & Ayothidasar', detail: 'Vallalar preached Jeeva Karunya (compassion for all living beings) & opened Sathya Dharma Salai (Vadalur, 1867) feeding all without caste.', takeaway: 'Ayothidasar championed rationalism, education & Adi-Dravida dignity.' },
    ],
  },
  'social-history-06': {
    title: 'History Unit 6 · Early Revolts Against British Rule in Tamil Nadu (pp. 63–74)',
    events: [
      { yearOrTag: '1755–1780', title: 'Puli Thevar (Nerkattumseval) & Rani Velunachiyar (Sivagangai)', detail: 'Puli Thevar pioneered anti-British Palayakkarar resistance; Velunachiyar—helped by Marudhu Brothers & Kuyili—reclaimed Sivagangai in 1780!', takeaway: 'Velunachiyar was the first queen in India to fight and defeat British colonial rule.' },
      { yearOrTag: '1799–1801', title: 'Veerapandiya Kattabomman & Marudhu Brothers (Tiruchirappalli Proclamation)', detail: 'Kattabomman defied Company tribute at Panchalankurichi (executed 16 Oct 1799); Marudhu Brothers issued the 1801 Tiruchirappalli Proclamation uniting South India.', takeaway: 'Dheeran Chinnamalai also waged guerrilla resistance in Kongu Nadu.' },
      { yearOrTag: '10 July 1806', title: 'The Vellore Revolt (Forerunner of 1857)', detail: 'Indian sepoys at Vellore Fort rose against humiliating new dress codes (Agnew’s turban) and colonial rule, hoisting Tipu Sultan’s tiger flag.', takeaway: 'First large-scale sepoy uprising in Indian history — 51 years before 1857!' },
    ],
  },
  'social-history-07': {
    title: 'History Unit 7 · Anti-Colonial Movements & Birth of Nationalism (1857–1919 · pp. 75–88)',
    events: [
      { yearOrTag: '1857', title: 'The Great Rebellion of 1857', detail: 'Triggered by Doctrine of Lapse, economic drain & greased cartridges; led by Rani Lakshmibai, Nana Saheb, Kunwar Singh & Bahadur Shah II.', takeaway: 'Ended East India Company rule via Queen Victoria’s Proclamation (1858).' },
      { yearOrTag: '1885–1905', title: 'Indian National Congress (1885) & Swadeshi Movement (1905)', detail: 'Partition of Bengal (1905) sparked boycott of foreign goods, national education & Lal-Bal-Pal militant nationalism.', takeaway: 'Dadabhai Naoroji’s "Drain of Wealth" exposed colonial economic exploitation.' },
      { yearOrTag: '1916', title: 'Home Rule Movement (Annie Besant & Tilak) & Lucknow Pact', detail: 'Annie Besant launched Home Rule League from Adyar, Madras (1916); Lucknow Pact united Congress & Muslim League.', takeaway: 'Prepared mass political awakening ahead of Gandhi’s leadership.' },
    ],
  },
  'social-history-08': {
    title: 'History Unit 8 · Nationalism: Gandhian Phase (1919–1947 · pp. 89–104)',
    events: [
      { yearOrTag: '1917–1922', title: 'Champaran, Rowlatt Satyagraha, Jallianwala Bagh & Non-Cooperation', detail: 'Satyagraha & Ahimsa mobilized peasants and students nationwide; Chauri Chaura incident (1922) led Gandhi to suspend Non-Cooperation.', takeaway: 'Turned the freedom struggle into a true mass movement.' },
      { yearOrTag: '1930–1931', title: 'Lahore Purna Swaraj (1929) & Dandi Salt Satyagraha (12 Mar 1930)', detail: 'Gandhi marched 241 miles from Sabarmati to Dandi to break the unjust British Salt Law; Gandhi–Irwin Pact led to 2nd Round Table Conference.', takeaway: 'Poona Pact (1932) between Gandhi & Dr. Ambedkar ensured reserved constituencies.' },
      { yearOrTag: '1942–1947', title: 'Quit India ("Do or Die"), Subhas Chandra Bose (INA) & Independence', detail: 'Netaji’s INA rallied Indians abroad ("Delhi Chalo"); Royal Indian Navy Mutiny (1946) & Mountbatten Plan culminated in Independence on 15 August 1947.', takeaway: 'Combined mass non-violence, youth sacrifice & constitutional vision.' },
    ],
  },
  'social-history-09': {
    title: 'History Unit 9 · Freedom Struggle in Tamil Nadu (pp. 105–114)',
    events: [
      { yearOrTag: '1852–1908', title: 'Madras Native Association, Madras Mahajana Sabha & V.O.C. Swadeshi Steam', detail: 'V.O. Chidambaranar launched Swadeshi Steam Navigation Company (Galia & Lavo) at Thoothukudi challenging British shipping monopoly!', takeaway: 'Subramania Bharati’s fiery songs & India newspaper awakened Tamil patriotism.' },
      { yearOrTag: '1930', title: 'Vedaranyam Salt Satyagraha (Rajaji · April 1930)', detail: 'C. Rajagopalachari led 100 volunteers from Tiruchirappalli to Vedaranyam singing Namakkal Kavignar’s "Kathi Indri Ratham Indri".', takeaway: 'Rukmani Lakshmipathi became the first woman imprisoned in TN Salt Satyagraha.' },
      { yearOrTag: '1932–1942', title: 'Tiruppur Kumaran (Kodi Kaatha Kumaran) & Quit India in TN', detail: 'Kumaran held the national flag aloft even while fatally struck in 1932; Kamarajar, Sathyamurthi & Muthuramalinga Thevar strengthened mass mobilisation.', takeaway: 'Tamil Nadu’s grassroots participation spanned poets, women & workers.' },
    ],
  },
  'social-history-10': {
    title: 'History Unit 10 · Social Transformation in Tamil Nadu (pp. 115–128)',
    events: [
      { yearOrTag: '1800s–1916', title: 'Tamil Renaissance (U.Ve.Sa., Damotharanar, Maraimalai Adigal)', detail: 'Rediscovery and printing of Sangam palm-leaf classics proved Tamil’s classical antiquity; Maraimalai Adigal championed Pure Tamil Movement (Tani Tamil Iyakkam).', takeaway: 'First non-European language printed in India (Thambiran Vanakkam, 1578).' },
      { yearOrTag: '1916–1929', title: 'Justice Party & Periyar E.V.R.’s Self-Respect Movement (1925)', detail: 'Justice Party introduced Communal G.O., women’s voting rights (1921), and Midday Meal pilot; Periyar fought caste inequality, superstition & patriarchy.', takeaway: 'Periyar led the Vaikom Satyagraha (1924) earning the title "Vaikom Hero".' },
      { yearOrTag: 'Women Pioneers', title: 'Dr. Muthulakshmi Reddy & Moovalur Ramamirtham', detail: 'India’s first woman legislator abolished the Devadasi system, founded Avvai Home & Adyar Cancer Institute.', takeaway: 'Laid the social-justice foundation of modern Tamil Nadu.' },
    ],
  },
};

const HISTORY_GPS_PINS: Record<string, GlobePinSpec[]> = {
  'social-history-02': [
    { id: '0', label: 'New York (Wall St)', sub: '1929 Great Depression', lat: 40.71, lon: -74.0, color: 0xef4444 },
    { id: '1', label: 'Rome & Berlin', sub: 'Rise of Fascism & Nazism', lat: 46.5, lon: 13.0, color: 0xf59e0b },
    { id: '2', label: 'Hanoi & Cairo', sub: 'Anti-Colonial Struggles', lat: 21.0, lon: 105.8, color: 0x10b981 },
  ],
  'social-history-03': [
    { id: '0', label: 'Warsaw / Pearl Harbor', sub: '1939–1941 Outbreak', lat: 52.23, lon: 21.01, color: 0xef4444 },
    { id: '1', label: 'Stalingrad & Normandy', sub: '1942–1945 Turning Points', lat: 48.7, lon: 44.5, color: 0xf59e0b },
    { id: '2', label: 'San Francisco / UN HQ', sub: '24 Oct 1945 United Nations', lat: 40.75, lon: -73.97, color: 0x38bdf8 },
  ],
  'social-history-04': [
    { id: '0', label: 'Beijing (PRC 1949)', sub: 'Chinese Revolution', lat: 39.9, lon: 116.4, color: 0xef4444 },
    { id: '1', label: 'Berlin Wall (1961–89)', sub: 'Cold War Frontline', lat: 52.52, lon: 13.4, color: 0x38bdf8 },
    { id: '2', label: 'Bandung & Belgrade', sub: 'NAM & Global Solidarity', lat: -6.91, lon: 107.61, color: 0x10b981 },
  ],
  'social-history-05': [
    { id: '0', label: 'Calcutta (Brahmo Samaj)', sub: 'Rammohan Roy (1828)', lat: 22.57, lon: 88.36, color: 0x6366f1 },
    { id: '1', label: 'Pune (Satyashodhak)', sub: 'Jyotiba & Savitribai Phule', lat: 18.52, lon: 73.86, color: 0x10b981 },
    { id: '2', label: 'Vadalur (Tamil Nadu)', sub: 'Vallalar Dharma Salai (1867)', lat: 11.55, lon: 79.55, color: 0xfbbf24 },
  ],
  'social-history-06': [
    { id: '0', label: 'Sivagangai & Kalakadu', sub: 'Puli Thevar & Velunachiyar (1780)', lat: 9.85, lon: 78.48, color: 0xec4899 },
    { id: '1', label: 'Panchalankurichi & Trichy', sub: 'Kattabomman & Marudhu (1799–1801)', lat: 8.95, lon: 78.02, color: 0xf59e0b },
    { id: '2', label: 'Vellore Fort', sub: '10 July 1806 Sepoy Revolt', lat: 12.92, lon: 79.13, color: 0xef4444 },
  ],
  'social-history-07': [
    { id: '0', label: 'Meerut & Delhi (1857)', sub: 'The Great Rebellion', lat: 28.61, lon: 77.21, color: 0xef4444 },
    { id: '1', label: 'Bombay & Calcutta', sub: 'INC (1885) & Swadeshi (1905)', lat: 19.08, lon: 72.88, color: 0xf59e0b },
    { id: '2', label: 'Adyar, Madras (1916)', sub: 'Annie Besant Home Rule', lat: 13.0, lon: 80.25, color: 0x38bdf8 },
  ],
  'social-history-08': [
    { id: '0', label: 'Champaran & Amritsar', sub: 'Satyagraha & 1919 Awakening', lat: 26.65, lon: 84.91, color: 0x10b981 },
    { id: '1', label: 'Dandi (Gujarat)', sub: '12 Mar 1930 Salt Satyagraha', lat: 20.89, lon: 72.8, color: 0x38bdf8 },
    { id: '2', label: 'Mumbai & New Delhi', sub: 'Quit India (1942) → 15 Aug 1947', lat: 28.61, lon: 77.21, color: 0xfbbf24 },
  ],
  'social-history-09': [
    { id: '0', label: 'Thoothukudi (1906)', sub: 'V.O.C. Swadeshi Steamships', lat: 8.76, lon: 78.13, color: 0x38bdf8 },
    { id: '1', label: 'Vedaranyam (1930)', sub: 'Rajaji Salt Satyagraha', lat: 10.37, lon: 79.85, color: 0x10b981 },
    { id: '2', label: 'Tiruppur & Chennai', sub: 'Kodi Kaatha Kumaran & Mass Struggle', lat: 11.11, lon: 77.34, color: 0xf59e0b },
  ],
  'social-history-10': [
    { id: '0', label: 'Madras (Chennai)', sub: 'Tamil Print & Justice Party (1916)', lat: 13.08, lon: 80.27, color: 0x6366f1 },
    { id: '1', label: 'Erode & Vaikom', sub: 'Periyar Self-Respect Movement (1925)', lat: 11.34, lon: 77.72, color: 0xf59e0b },
    { id: '2', label: 'Adyar (Chennai)', sub: 'Dr. Muthulakshmi Reddy & Women’s Rights', lat: 13.01, lon: 80.26, color: 0xec4899 },
  ],
};

export function HistoryChapters3DStudio({ sectionId, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const unitKey = sectionId.slice(0, 17); // social-history-02 .. 10
  const data = HISTORY_UNITS_2_TO_10[unitKey] ?? HISTORY_UNITS_2_TO_10['social-history-06'];
  const pins = HISTORY_GPS_PINS[unitKey] ?? HISTORY_GPS_PINS['social-history-06'];
  const [idx, setIdx] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading 4K NASA Satellite 3D Earth...</div>}>
          <HistoryTheatre3DCanvas
            activeHotspot={String(idx)}
            showAllies={true}
            showCentral={true}
            customPins={pins}
            badgeTitle={`Real 4K NASA 3D Earth · ${data.title.split('·')[0].trim()}`}
            onSelectHotspot={() => {}}
            onSelectCustomPin={(pinId) => {
              const next = Number(pinId);
              if (!Number.isNaN(next)) setIdx(next % data.events.length);
              onInteract();
            }}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
          <Globe2 className="w-4 h-4" />
          <span>{data.title}</span>
        </div>
        <div className="space-y-2">
          {data.events.map((ev, i) => (
            <button
              key={ev.title}
              type="button"
              onClick={() => {
                setIdx(i);
                onInteract();
                onComplete(`Reviewed historical turning point: ${ev.title}`);
              }}
              className={`w-full p-3 rounded-xl border text-left transition-colors ${idx === i ? 'bg-[var(--social)] text-white border-[var(--social)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}
            >
              <div className={`text-[10px] font-bold uppercase ${idx === i ? 'text-amber-200' : 'text-[var(--social)]'}`}>{ev.yearOrTag}</div>
              <div className="font-extrabold text-sm mt-0.5">{ev.title}</div>
              <p className={`mt-1 leading-relaxed ${idx === i ? 'text-white/95' : 'text-[var(--text)]'}`}>{ev.detail}</p>
              <div className={`mt-1.5 pt-1.5 border-t text-[11px] font-semibold inline-flex items-center gap-1 ${idx === i ? 'border-white/20 text-amber-100' : 'border-[var(--line)] text-[var(--ink)]'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{ev.takeaway}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const GEO_UNITS_2_TO_7: Record<string, { title: string; cards: StageCard[] }> = {
  'social-geography-02': {
    title: 'Geography Unit 2 · Climate & Natural Vegetation of India (pp. 144–153)',
    cards: [
      { yearOrTag: 'Monsoon Drivers', title: 'Equable Climate, Jet Streams, Latitude & Altitude', detail: 'Tropic of Cancer divides India; Himalayas block cold Central Asian winds while SW Monsoon (June–Sep) brings 75% of India’s rainfall.', takeaway: 'Burst of Monsoon hits Kerala first; Mawsynram (Meghalaya) is world’s wettest place!' },
      { yearOrTag: '4 Seasons', title: 'Winter · Summer (Mango Showers) · SW Monsoon · NE Monsoon', detail: 'Retreating NE Monsoon picks up moisture from Bay of Bengal giving Coromandel Coast (Tamil Nadu) its primary Oct–Dec rains.', takeaway: 'Toggle the 3D SW Monsoon wind ribbons on the relief atlas!' },
      { yearOrTag: 'Forest Biomes', title: 'Evergreen · Tropical Deciduous · Thorn · Mangrove (Sundarbans)', detail: 'Project Tiger (1973) & 18 Biosphere Reserves (Nilgiri, Gulf of Mannar, Agasthyamalai) conserve endangered wildlife.', takeaway: 'Tropical Deciduous (Monsoon) forests are the most widespread in India.' },
    ],
  },
  'social-geography-03': {
    title: 'Geography Unit 3 · India — Soils, Irrigation & Agriculture (pp. 154–169)',
    cards: [
      { yearOrTag: '8 Soil Groups', title: 'Alluvial · Black (Regur) · Red · Laterite · Desert · Mountain', detail: 'Black soil (Deccan lava) retains moisture ideally for cotton; Alluvial plains grow rice, wheat & sugarcane.', takeaway: 'Red soil gets its colour from iron oxide; Laterite suits tea & coffee.' },
      { yearOrTag: 'Cropping Seasons', title: 'Kharif (June–Sep) · Rabi (Oct–Mar) · Zaid (Apr–June)', detail: 'Multipurpose projects like Bhakra Nangal, Hirakud, Damodar Valley & Mettur Dam supply irrigation + hydroelectricity.', takeaway: 'Green Revolution (M.S. Swaminathan), White Revolution (Milk), Blue Revolution (Fish).' },
    ],
  },
  'social-geography-04': {
    title: 'Geography Unit 4 · India — Minerals, Energy & Industries (pp. 170–185)',
    cards: [
      { yearOrTag: 'Mineral Belts', title: 'Chotanagpur Plateau ("Mineral Heartland") & Neyveli Lignite', detail: 'Iron ore (Jharkhand/Odisha/Salem), Bauxite (Aluminium), Mica, Copper, Coal (Gondwana), and Petroleum (Mumbai High, Digboi).', takeaway: 'Renewable Solar, Wind (Muppandal, TN) & Hydro power cut fossil emissions.' },
      { yearOrTag: 'Key Industries', title: 'Cotton Textiles (Mumbai "Cottonopolis") · Iron & Steel (TISCO) · IT', detail: 'Bengaluru ("Electronic Capital of India") & Chennai lead software exports; Coimbatore is the "Manchester of South India".', takeaway: 'Raw materials, power, transport & skilled labour drive industrial location.' },
    ],
  },
  'social-geography-05': {
    title: 'Geography Unit 5 · Population, Transport, Communication & Trade (pp. 186–199)',
    cards: [
      { yearOrTag: 'Transport Network', title: 'Golden Quadrilateral (5,846 km) · Railways · Waterways · Airways', detail: 'NH-44 (Srinagar–Kanyakumari) is India’s longest highway; Konkan Railway & Chennai Metro transform regional mobility.', takeaway: '13 Major Ports include Chennai, Ennore (Kamarajar) & Thoothukudi.' },
      { yearOrTag: 'Demographics', title: 'Census (Every 10 Years), Literacy & Balance of Trade', detail: 'Dense population clusters in fertile Ganga plains & deltas; digital telecom & ISRO satellites link remote villages.', takeaway: 'Exports > Imports = Favourable Balance of Trade.' },
    ],
  },
  'social-geography-06': {
    title: 'Geography Unit 6 · Physical Geography of Tamil Nadu (pp. 200–218)',
    cards: [
      { yearOrTag: 'Landforms', title: 'Western Ghats (Doddabetta 2,637 m) · Eastern Ghats · Plateaus · Plains', detail: 'Passes of Western Ghats: Palghat, Shencottah, Aralvaimozhi, Achankoil; Javadhu, Servarayan & Kolli Hills form Eastern Ghats.', takeaway: 'Marina Beach (Chennai, 13 km) is the 2nd longest urban beach in the world!' },
      { yearOrTag: 'Drainage', title: 'Kaveri ("Ganga of the South") · Palar · Thenpennai · Vaigai · Thamirabarani', detail: 'Thamirabarani is the only perennial river originating and flowing solely inside Tamil Nadu (Pothigai Hills → Gulf of Mannar).', takeaway: 'Mettur Dam (Stanley Reservoir) & Kallanai (Grand Anicut) anchor Kaveri delta.' },
    ],
  },
  'social-geography-07': {
    title: 'Geography Unit 7 · Human Geography of Tamil Nadu (pp. 219–238)',
    cards: [
      { yearOrTag: 'Agriculture', title: 'Thanjavur ("Rice Bowl of TN") · Nilgiris Tea · Erode Turmeric', detail: 'Three paddy seasons: Sornavari, Samba (main) & Navarai; Tamil Nadu leads India in bananas, coconuts, flowers & wind power.', takeaway: 'TNAU (Coimbatore) pioneers drought-tolerant crop varieties.' },
      { yearOrTag: 'Industry & Ports', title: 'Textiles · Automobiles · Leather · IT · Disaster Preparedness', detail: 'Chennai, Coimbatore, Madurai & Trichy drive urbanization; cyclone shelters & coastal mangroves protect eastern districts.', takeaway: 'Tamil Nadu has one of India’s highest literacy rates and multi-modal port networks.' },
    ],
  },
};

export function GeographyChapters3DStudio({ sectionId, reducedMotion, onInteract, onComplete }: TopicLabProps) {
  const unitKey = sectionId.slice(0, 19); // social-geography-02 .. 07
  const data = GEO_UNITS_2_TO_7[unitKey] ?? GEO_UNITS_2_TO_7['social-geography-02'];
  const isTamilNadu = unitKey.endsWith('06') || unitKey.endsWith('07');
  const [divId, setDivId] = useState<'himalayas' | 'northern_plains' | 'peninsular_plateau' | 'coastal_plains' | 'islands'>(
    isTamilNadu ? 'himalayas' : 'peninsular_plateau',
  );
  const [showMonsoon, setShowMonsoon] = useState(true);

  const btnSpecs: { id: 'himalayas' | 'northern_plains' | 'peninsular_plateau' | 'coastal_plains' | 'islands'; label: string }[] = isTamilNadu
    ? [
        { id: 'himalayas', label: 'Western Ghats' },
        { id: 'northern_plains', label: 'Kaveri Delta' },
        { id: 'peninsular_plateau', label: 'Plateaus' },
        { id: 'coastal_plains', label: 'Chennai Coast' },
        { id: 'islands', label: 'Kanyakumari' },
      ]
    : [
        { id: 'himalayas', label: 'Himalayas' },
        { id: 'northern_plains', label: 'Northern Plains' },
        { id: 'peninsular_plateau', label: 'Deccan Plateau' },
        { id: 'coastal_plains', label: 'Coastal Plains' },
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-6 space-y-2">
        <Suspense fallback={<div className="h-[310px] rounded-2xl bg-slate-950 flex items-center justify-center text-slate-300 text-sm">Loading Real NASA Satellite 3D Relief Atlas...</div>}>
          <IndiaRelief3DCanvas
            region={isTamilNadu ? 'tamil_nadu' : 'india'}
            selectedDivision={divId}
            showRivers={true}
            showMonsoon={showMonsoon}
            onSelectDivision={(d) => {
              setDivId(d);
              onInteract();
              onComplete(`Explored Real NASA 3D Satellite Terrain (${d}) for ${data.title}`);
            }}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button type="button" onClick={() => setShowMonsoon((m) => !m)} className={`px-3 py-1.5 rounded-lg font-bold border ${showMonsoon ? 'bg-violet-600 text-white border-violet-600' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
            {showMonsoon ? (isTamilNadu ? '✓ NE Monsoon Winds ON' : '✓ SW Monsoon Winds ON') : 'Monsoon Winds OFF'}
          </button>
          {btnSpecs.map((b) => (
            <button key={b.id} type="button" onClick={() => { setDivId(b.id); onInteract(); }} className={`px-2.5 py-1.5 rounded-lg font-bold border ${divId === b.id ? 'bg-[var(--social)] text-white border-[var(--social)]' : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'}`}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] space-y-3 text-xs">
        <div className="font-extrabold uppercase tracking-wider text-[var(--social)] inline-flex items-center gap-1.5">
          <Globe2 className="w-4 h-4" />
          <span>{data.title}</span>
        </div>
        <div className="space-y-2">
          {data.cards.map((c) => (
            <div key={c.title} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
              <div className="text-[10px] font-bold uppercase text-[var(--social)]">{c.yearOrTag}</div>
              <div className="font-extrabold text-sm text-[var(--ink)]">{c.title}</div>
              <p className="text-[var(--text)] leading-relaxed">{c.detail}</p>
              <div className="text-[11px] font-semibold text-[var(--ink)] pt-1 border-t border-[var(--line)]">Exam Key: {c.takeaway}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
