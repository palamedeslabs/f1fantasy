import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AuthPage from "./AuthPage";

const DRIVERS = [
  { id: 1,  name: "Lando Norris",       team: "McLaren",         number: 1,  price: 27.2, fantasyPoints: 0, country: "GB", teamColor: "#FF8000" },
  { id: 2,  name: "Oscar Piastri",      team: "McLaren",         number: 81, price: 25.5, fantasyPoints: 0, country: "AU", teamColor: "#FF8000" },
  { id: 3,  name: "Kimi Antonelli",     team: "Mercedes",        number: 12, price: 23.2, fantasyPoints: 0, country: "IT", teamColor: "#27F4D2" },
  { id: 4,  name: "Charles Leclerc",    team: "Ferrari",         number: 16, price: 22.8, fantasyPoints: 0, country: "MC", teamColor: "#E8002D" },
  { id: 5,  name: "Lewis Hamilton",     team: "Ferrari",         number: 44, price: 22.5, fantasyPoints: 0, country: "GB", teamColor: "#E8002D" },
  { id: 6,  name: "Max Verstappen",     team: "Red Bull Racing", number: 3,  price: 27.7, fantasyPoints: 0, country: "NL", teamColor: "#3671C6" },
  { id: 7,  name: "George Russell",     team: "Mercedes",        number: 63, price: 27.4, fantasyPoints: 0, country: "GB", teamColor: "#27F4D2" },
  { id: 8,  name: "Isack Hadjar",       team: "Red Bull Racing", number: 6,  price: 15.1, fantasyPoints: 0, country: "FR", teamColor: "#3671C6" },
  { id: 9,  name: "Pierre Gasly",       team: "Alpine",          number: 10, price: 12.0, fantasyPoints: 0, country: "FR", teamColor: "#FF87BC" },
  { id: 10, name: "Carlos Sainz",       team: "Williams",        number: 55, price: 11.8, fantasyPoints: 0, country: "ES", teamColor: "#64C4FF" },
  { id: 11, name: "Alexander Albon",    team: "Williams",        number: 23, price: 11.6, fantasyPoints: 0, country: "TH", teamColor: "#64C4FF" },
  { id: 12, name: "Fernando Alonso",    team: "Aston Martin",    number: 14, price: 10.0, fantasyPoints: 0, country: "ES", teamColor: "#229971" },
  { id: 13, name: "Lance Stroll",       team: "Aston Martin",    number: 18, price: 8.0,  fantasyPoints: 0, country: "CA", teamColor: "#229971" },
  { id: 14, name: "Oliver Bearman",     team: "Haas",            number: 87, price: 7.4,  fantasyPoints: 0, country: "GB", teamColor: "#B6BABD" },
  { id: 15, name: "Esteban Ocon",       team: "Haas",            number: 31, price: 7.3,  fantasyPoints: 0, country: "FR", teamColor: "#B6BABD" },
  { id: 16, name: "Nico Hülkenberg",    team: "Audi",            number: 27, price: 6.8,  fantasyPoints: 0, country: "DE", teamColor: "#C60000" },
  { id: 17, name: "Liam Lawson",        team: "Racing Bulls",    number: 30, price: 6.5,  fantasyPoints: 0, country: "NZ", teamColor: "#6692FF" },
  { id: 18, name: "Gabriel Bortoleto",  team: "Audi",            number: 5,  price: 6.4,  fantasyPoints: 0, country: "BR", teamColor: "#C60000" },
  { id: 19, name: "Arvid Lindblad",     team: "Racing Bulls",    number: 41, price: 6.2,  fantasyPoints: 0, country: "GB", teamColor: "#6692FF" },
  { id: 20, name: "Franco Colapinto",   team: "Alpine",          number: 43, price: 6.2,  fantasyPoints: 0, country: "AR", teamColor: "#FF87BC" },
  { id: 21, name: "Sergio Pérez",       team: "Cadillac",        number: 11, price: 6.0,  fantasyPoints: 0, country: "MX", teamColor: "#CC1020" },
  { id: 22, name: "Valtteri Bottas",    team: "Cadillac",        number: 77, price: 5.9,  fantasyPoints: 0, country: "FI", teamColor: "#CC1020" },
];

const CONSTRUCTORS = [
  { id: 1,  name: "Mercedes",        price: 29.3, points: 0, color: "#27F4D2" },
  { id: 2,  name: "McLaren",         price: 28.9, points: 0, color: "#FF8000" },
  { id: 3,  name: "Red Bull Racing", price: 28.2, points: 0, color: "#3671C6" },
  { id: 4,  name: "Ferrari",         price: 23.3, points: 0, color: "#E8002D" },
  { id: 5,  name: "Alpine",          price: 12.5, points: 0, color: "#FF87BC" },
  { id: 6,  name: "Williams",        price: 12.0, points: 0, color: "#64C4FF" },
  { id: 7,  name: "Aston Martin",    price: 10.3, points: 0, color: "#229971" },
  { id: 8,  name: "Haas",            price: 7.4,  points: 0, color: "#B6BABD" },
  { id: 9,  name: "Audi",            price: 6.6,  points: 0, color: "#C60000" },
  { id: 10, name: "Racing Bulls",    price: 6.3,  points: 0, color: "#6692FF" },
  { id: 11, name: "Cadillac",        price: 6.0,  points: 0, color: "#CC1020" },
];

const RACES = [
  { round: 1, name: "Bahrain GP", circuit: "Bahrain International Circuit", date: "Mar 2", status: "completed", winner: "Verstappen" },
  { round: 2, name: "Saudi Arabian GP", circuit: "Jeddah Corniche Circuit", date: "Mar 9", status: "completed", winner: "Norris" },
  { round: 3, name: "Australian GP", circuit: "Albert Park Circuit", date: "Mar 23", status: "completed", winner: "Leclerc" },
  { round: 4, name: "Japanese GP", circuit: "Suzuka International Racing Course", date: "Apr 6", status: "upcoming", winner: null },
  { round: 5, name: "Chinese GP", circuit: "Shanghai International Circuit", date: "Apr 20", status: "upcoming", winner: null },
  { round: 6, name: "Miami GP", circuit: "Miami International Autodrome", date: "May 4", status: "upcoming", winner: null },
];

const TEAM_ABBR = {
  "Red Bull Racing": "RBR",
  "Ferrari": "SF",
  "McLaren": "MCL",
  "Mercedes": "AMG",
  "Aston Martin": "AMR",
  "Audi": "ADI",
  "Racing Bulls": "RB",
  "Alpine": "ALP",
  "Williams": "WIL",
  "Haas": "HAA",
  "Cadillac": "CAD",
};

const FLAG_MAP = { NL: "🇳🇱", MX: "🇲🇽", GB: "🇬🇧", MC: "🇲🇨", AU: "🇦🇺", IT: "🇮🇹", ES: "🇪🇸", CA: "🇨🇦", DE: "🇩🇪", FI: "🇫🇮", FR: "🇫🇷", JP: "🇯🇵", TH: "🇹🇭", NZ: "🇳🇿", BR: "🇧🇷", AR: "🇦🇷" };

const TeamLogo = ({ team, size = 26 }) => {
  const s = size;
  const logos = {
    "McLaren": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#FF800018"/>
        {/* Speed arch — McLaren's iconic swoosh */}
        <path d="M4 19 Q13 5 22 19" stroke="#FF8000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <line x1="4" y1="19" x2="22" y2="19" stroke="#FF8000" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    "Mercedes": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#27F4D218"/>
        {/* Three-pointed star */}
        <circle cx="13" cy="13" r="9" stroke="#27F4D2" strokeWidth="1.5"/>
        <line x1="13" y1="4" x2="13" y2="13" stroke="#27F4D2" strokeWidth="2" strokeLinecap="round"/>
        <line x1="13" y1="13" x2="6" y2="20" stroke="#27F4D2" strokeWidth="2" strokeLinecap="round"/>
        <line x1="13" y1="13" x2="20" y2="20" stroke="#27F4D2" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    "Ferrari": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#E8002D18"/>
        {/* Scuderia shield */}
        <path d="M13 3 L21 7 L21 17 L13 23 L5 17 L5 7 Z" fill="#E8002D" opacity="0.85"/>
        <rect x="11" y="9" width="4" height="8" fill="#FFD700"/>
        <rect x="8" y="12" width="10" height="3" fill="#FFD700"/>
      </svg>
    ),
    "Red Bull Racing": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#3671C618"/>
        {/* Bull horns */}
        <path d="M5 10 Q4 5 9 5 Q13 5 13 9" stroke="#3671C6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M21 10 Q22 5 17 5 Q13 5 13 9" stroke="#CC1800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="13" cy="16" rx="6" ry="5" fill="#3671C6" opacity="0.85"/>
        <circle cx="11" cy="15" r="1.2" fill="#fff" opacity="0.9"/>
        <circle cx="15" cy="15" r="1.2" fill="#fff" opacity="0.9"/>
      </svg>
    ),
    "Williams": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#64C4FF18"/>
        {/* W */}
        <path d="M4 8 L7.5 18 L13 11 L18.5 18 L22 8" stroke="#64C4FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "Aston Martin": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#22997118"/>
        {/* Wings */}
        <path d="M2 13 Q7 7 13 13 Q19 19 24 13" stroke="#229971" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M2 13 Q7 19 13 13 Q19 7 24 13" stroke="#229971" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
        <circle cx="13" cy="13" r="2.5" fill="#229971"/>
      </svg>
    ),
    "Alpine": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#FF87BC18"/>
        {/* A with alpine peak */}
        <path d="M13 4 L22 20 H4 Z" stroke="#FF87BC" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8.5" y1="14.5" x2="17.5" y2="14.5" stroke="#4B91FF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    "Haas": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#B6BABD18"/>
        {/* H */}
        <line x1="7" y1="7" x2="7" y2="19" stroke="#B6BABD" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="19" y1="7" x2="19" y2="19" stroke="#B6BABD" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="7" y1="13" x2="19" y2="13" stroke="#B6BABD" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    "Audi": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#C6000018"/>
        {/* Four rings */}
        <circle cx="5.5" cy="13" r="3.5" stroke="#C60000" strokeWidth="1.8" fill="none"/>
        <circle cx="10.5" cy="13" r="3.5" stroke="#C60000" strokeWidth="1.8" fill="none"/>
        <circle cx="15.5" cy="13" r="3.5" stroke="#C60000" strokeWidth="1.8" fill="none"/>
        <circle cx="20.5" cy="13" r="3.5" stroke="#C60000" strokeWidth="1.8" fill="none"/>
      </svg>
    ),
    "Racing Bulls": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#6692FF18"/>
        {/* Bull horns (compact) */}
        <path d="M6 11 Q5 6 10 6 Q13 6 13 10" stroke="#6692FF" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M20 11 Q21 6 16 6 Q13 6 13 10" stroke="#6692FF" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <ellipse cx="13" cy="16" rx="5.5" ry="4.5" fill="#6692FF" opacity="0.82"/>
        <circle cx="11" cy="15" r="1" fill="#fff" opacity="0.9"/>
        <circle cx="15" cy="15" r="1" fill="#fff" opacity="0.9"/>
      </svg>
    ),
    "Cadillac": (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
        <rect width="26" height="26" rx="4" fill="#CC102018"/>
        {/* Crest */}
        <path d="M13 3 L21 7.5 L21 18.5 L13 23 L5 18.5 L5 7.5 Z" stroke="#CC1020" strokeWidth="1.5" fill="#CC102012"/>
        <line x1="8" y1="10" x2="18" y2="10" stroke="#CC1020" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="13" x2="18" y2="13" stroke="#CC1020" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="16" x2="18" y2="16" stroke="#CC1020" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  };
  return logos[team] || <svg width={s} height={s} viewBox="0 0 26 26"><rect width="26" height="26" rx="4" fill="#22222220"/></svg>;
};

// F1 Fantasy 2026 Scoring
// Race: P1=25, P2=18, P3=15, P4=12, P5=10, P6=8, P7=6, P8=4, P9=2, P10=1
// Qualifying: P1=10, P2=9, P3=8... P10=1
// +1 per position gained vs grid, -1 per position lost
// +5 fastest lap (if finishing in top 10)
// +3 driver of the day
// DNF: -20, DSQ: -25
// Constructor: sum of both drivers' race points + pit bonus

const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const QUALI_POINTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

// Map driver number → driver id in our DRIVERS array
const DRIVER_NUMBER_MAP = Object.fromEntries(
  DRIVERS.map(d => [d.number, d.id])
);

function calcFantasyPoints(raceResult, qualiResult) {
  // raceResult: [{driver_number, position, grid_position, fastest_lap, dnf, dsq}]
  // qualiResult: [{driver_number, position}]
  const pts = {};

  // Qualifying points
  if (qualiResult) {
    qualiResult.forEach(q => {
      const id = DRIVER_NUMBER_MAP[q.driver_number];
      if (!id) return;
      pts[id] = (pts[id] || 0) + (QUALI_POINTS[q.position - 1] || 0);
    });
  }

  // Race points
  if (raceResult) {
    raceResult.forEach(r => {
      const id = DRIVER_NUMBER_MAP[r.driver_number];
      if (!id) return;
      if (!pts[id]) pts[id] = 0;

      if (r.dsq) { pts[id] -= 25; return; }
      if (r.dnf) { pts[id] -= 20; return; }

      pts[id] += RACE_POINTS[r.position - 1] || 0;
      // Positions gained/lost vs grid
      if (r.grid_position && r.position) {
        pts[id] += r.grid_position - r.position;
      }
      if (r.fastest_lap && r.position <= 10) pts[id] += 5;
    });
  }

  return pts; // { driverId: points }
}

async function fetchOpenF1ViaAI(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  return text;
}

const BUDGET = 100.0;
const MAX_DRIVERS = 5;

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <AuthPage />;
  return <F1Fantasy user={session.user} />;
}

function F1Fantasy({ user }) {
  const [activeTab, setActiveTab] = useState("team");
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState(null);
  const [captain, setCaptain] = useState(null);
  const [filterTeam, setFilterTeam] = useState("All");
  const [sortBy, setSortBy] = useState("price");
  const [searchQuery, setSearchQuery] = useState("");
  const [driverView, setDriverView] = useState("drivers");
  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [drivers, setDrivers] = useState(DRIVERS);
  const [syncStatus, setSyncStatus] = useState(null); // null | "loading" | "success" | "error"
  const [lastSynced, setLastSynced] = useState(null);
  const [raceLog, setRaceLog] = useState([]);

  // Load saved team on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        if (data.driver_ids) setSelectedDrivers(DRIVERS.filter(d => data.driver_ids.includes(d.id)));
        if (data.constructor_id) setSelectedConstructor(CONSTRUCTORS.find(c => c.id === data.constructor_id) || null);
        if (data.captain_id) setCaptain(DRIVERS.find(d => d.id === data.captain_id) || null);
      });
  }, [user]);

  async function saveTeam() {
    const { error } = await supabase
      .from('teams')
      .upsert({
        user_id: user.id,
        driver_ids: selectedDrivers.map(d => d.id),
        constructor_id: selectedConstructor?.id || null,
        captain_id: captain?.id || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    if (error) alert('Failed to save: ' + error.message);
    else alert('Team saved! 🏁');
  }

  async function syncResults() {
    setSyncStatus("loading");
    try {
      const aiResponse = await fetchOpenF1ViaAI(
        `Use web search to find the most recent 2026 Formula 1 race results. 
        I need BOTH the race finishing order AND the qualifying order for that race.
        Return ONLY a JSON object (no markdown, no explanation) in exactly this format:
        {
          "race_name": "Australian GP",
          "round": 1,
          "race": [
            {"driver_number": 4, "position": 1, "grid_position": 3, "fastest_lap": false, "dnf": false, "dsq": false},
            ...all 20 drivers...
          ],
          "qualifying": [
            {"driver_number": 4, "position": 1},
            ...all 20 drivers...
          ]
        }
        Use these driver numbers: Norris=1, Piastri=81, Antonelli=12, Leclerc=16, Hamilton=44, Verstappen=3, Russell=63, Hadjar=6, Gasly=10, Sainz=55, Albon=23, Alonso=14, Stroll=18, Bearman=87, Ocon=31, Hulkenberg=27, Lawson=30, Bortoleto=5, Lindblad=41, Colapinto=43, Perez=11, Bottas=77.
        If a driver did not participate, omit them. Only return the JSON.`
      );

      // Strip any markdown fences
      const clean = aiResponse.replace(/```json|```/g, "").trim();
      const json = JSON.parse(clean);

      const pts = calcFantasyPoints(json.race, json.qualifying);

      setDrivers(prev => prev.map(d => ({
        ...d,
        fantasyPoints: (d.fantasyPoints || 0) + (pts[d.id] || 0)
      })));

      setRaceLog(prev => [...prev, { name: json.race_name, round: json.round, pts }]);
      setLastSynced(new Date().toLocaleTimeString());
      setSyncStatus("success");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error(e);
      setSyncStatus("error");
      setTimeout(() => setSyncStatus(null), 4000);
    }
  }

  const spent = selectedDrivers.reduce((s, d) => s + d.price, 0) + (selectedConstructor?.price || 0);
  const remaining = Math.max(0, BUDGET - spent);
  const totalPoints = selectedDrivers.reduce((s, d) => {
    const live = drivers.find(ld => ld.id === d.id) || d;
    const pts = live.id === captain?.id ? live.fantasyPoints * 2 : live.fantasyPoints;
    return s + pts;
  }, 0) + (selectedConstructor?.points || 0);

  const budgetAfterRemoving = (driver) => BUDGET - (spent - driver.price);
  const canAddDriver = (driver) => BUDGET - spent >= driver.price;
  const canSwapConstructor = (c) => BUDGET - spent + (selectedConstructor?.price || 0) >= c.price;

  const teams = ["All", ...new Set(drivers.map(d => d.team))].sort();

  const filtered = drivers
    .filter(d => filterTeam === "All" || d.team === filterTeam)
    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.team.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === "points" ? b.fantasyPoints - a.fantasyPoints : b.price - a.price);

  function toggleDriver(driver) {
    if (selectedDrivers.find(d => d.id === driver.id)) {
      setSelectedDrivers(selectedDrivers.filter(d => d.id !== driver.id));
      if (captain?.id === driver.id) setCaptain(null);
    } else {
      if (selectedDrivers.length >= MAX_DRIVERS) return;
      if (!canAddDriver(driver)) return;
      setSelectedDrivers([...selectedDrivers, driver]);
    }
  }

  function toggleConstructor(c) {
    if (selectedConstructor?.id === c.id) {
      setSelectedConstructor(null);
    } else {
      if (!canSwapConstructor(c)) return;
      setSelectedConstructor(c);
    }
  }

  const isDriverSelected = (d) => !!selectedDrivers.find(s => s.id === d.id);
  const canAfford = (price) => remaining >= price;

  return (
    <div style={{
      fontFamily: "'Formula1', 'Titillium Web', 'Barlow Condensed', sans-serif",
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700;900&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #e10600; border-radius: 2px; }
        
        .nav-btn { 
          background: none; border: none; color: #888; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; padding: 12px 20px;
          border-bottom: 3px solid transparent; transition: all 0.2s;
        }
        .nav-btn:hover { color: #fff; }
        .nav-btn.active { color: #fff; border-bottom-color: #e10600; }
        
        .driver-card {
          background: #161616;
          border: 1px solid #222;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .driver-card:hover { border-color: #444; transform: translateY(-1px); }
        .driver-card.selected { border-color: #e10600; background: #1a0808; }
        .driver-card.selected::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #e10600;
        }
        .driver-card.disabled { opacity: 0.4; cursor: not-allowed; }
        
        .team-slot {
          background: #161616;
          border: 2px dashed #333;
          border-radius: 8px;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .team-slot.filled {
          border-style: solid;
          border-color: #333;
        }
        .team-slot.captain-slot {
          border-color: #f5a623;
        }
        
        .btn-primary {
          background: #e10600;
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: #ff1a14; }
        .btn-primary:disabled { background: #333; cursor: not-allowed; }
        
        .btn-ghost {
          background: transparent;
          color: #888;
          border: 1px solid #333;
          padding: 8px 16px;
          border-radius: 4px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: #888; color: #fff; }
        .btn-ghost.active { border-color: #e10600; color: #e10600; }
        
        .stats-bar {
          animation: slideIn 0.4s ease-out;
        }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        .grid-checker {
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }
        
        .tag {
          display: inline-flex; align-items: center;
          background: #222; border-radius: 3px;
          padding: 2px 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        input[type="text"] {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #fff;
          padding: 10px 14px;
          border-radius: 6px;
          font-family: 'Titillium Web', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type="text"]:focus { border-color: #e10600; }
        input[type="text"]::placeholder { color: #444; }

        select {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #fff;
          padding: 10px 14px;
          border-radius: 6px;
          font-family: 'Titillium Web', sans-serif;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          appearance: none;
        }
        
        .race-row { transition: background 0.15s; }
        .race-row:hover { background: #161616; }
        
        .leaderboard-row {
          border-bottom: 1px solid #1a1a1a;
          transition: background 0.15s;
        }
        .leaderboard-row:hover { background: #161616; }
        
        .progress-bar-bg { background: #1e1e1e; border-radius: 2px; height: 4px; }
        .progress-bar-fill { background: #e10600; border-radius: 2px; height: 100%; transition: width 0.5s ease; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e1e1e", background: "#0d0d0d", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, background: "#e10600", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-1px" }}>F1</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>Fantasy</div>
                  <div style={{ fontSize: 9, color: "#e10600", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginTop: -2 }}>2026 Season</div>
                </div>
              </div>
            </div>

            <nav style={{ display: "flex" }}>
              {["team", "transfers", "leagues", "races", "stats"].map(tab => (
                <button key={tab} className={`nav-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase" }}>Total Pts</div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: "#e10600" }}>{totalPoints.toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#888", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  style={{ background: "none", border: "1px solid #333", borderRadius: 4, color: "#888", fontSize: 11, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Budget Bar */}
      <div className="stats-bar" style={{ background: "#111", borderBottom: "1px solid #1a1a1a", padding: "8px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
            <div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Budget</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16 }}>
                <span style={{ color: remaining <= 0 ? "#e10600" : remaining < 10 ? "#f5a623" : "#0fd679" }}>${remaining.toFixed(1)}M</span>
                <span style={{ color: "#333", fontSize: 13 }}> / ${BUDGET}M</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: 200 }}>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${Math.min((spent / BUDGET) * 100, 100)}%`, background: remaining <= 0 ? "#e10600" : remaining < 10 ? "#f5a623" : "#0fd679" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>{selectedDrivers.length}</span>/{MAX_DRIVERS} Drivers
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>{selectedConstructor ? 1 : 0}</span>/1 Constructor
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Captain: <span style={{ color: captain ? "#f5a623" : "#666", fontWeight: 700 }}>{captain ? captain.name.split(" ").pop() : "—"}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => { setSelectedDrivers([]); setSelectedConstructor(null); setCaptain(null); }}>
              Clear
            </button>
            <button
              className="btn-primary"
              disabled={selectedDrivers.length < MAX_DRIVERS || !selectedConstructor || !captain}
              onClick={saveTeam}
            >
              Save Team
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        
        {/* TEAM TAB */}
        {activeTab === "team" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
            
            {/* Left: Player Pool */}
            <div>
              {/* Toggle Drivers / Constructors */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button className={`btn-ghost ${driverView === "drivers" ? "active" : ""}`} onClick={() => setDriverView("drivers")}>Drivers</button>
                <button className={`btn-ghost ${driverView === "constructors" ? "active" : ""}`} onClick={() => setDriverView("constructors")}>Constructors</button>
              </div>

              {driverView === "drivers" && (
                <>
                  {/* Filters */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                    <input type="text" placeholder="Search drivers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 110 }}>
                      <option value="price">Price ↓</option>
                      <option value="points">Points ↓</option>
                    </select>
                  </div>

                  {/* Team filter strip */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                    <button
                      onClick={() => setFilterTeam("All")}
                      style={{
                        flexShrink: 0, padding: "4px 10px", borderRadius: 4,
                        background: filterTeam === "All" ? "#e10600" : "#1a1a1a",
                        border: `1px solid ${filterTeam === "All" ? "#e10600" : "#2a2a2a"}`,
                        color: filterTeam === "All" ? "#fff" : "#666",
                        fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase",
                        cursor: "pointer", transition: "all 0.15s", fontFamily: "'Barlow Condensed', sans-serif"
                      }}
                    >ALL</button>
                    {CONSTRUCTORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setFilterTeam(filterTeam === c.name ? "All" : c.name)}
                        title={c.name}
                        style={{
                          flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                          padding: "4px 8px", borderRadius: 4,
                          background: filterTeam === c.name ? c.color + "22" : "#1a1a1a",
                          border: `1px solid ${filterTeam === c.name ? c.color : "#2a2a2a"}`,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                        <span style={{
                          fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
                          color: filterTeam === c.name ? c.color : "#555",
                          fontFamily: "'Barlow Condensed', sans-serif"
                        }}>{TEAM_ABBR[c.name]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Column headers */}
                  <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", marginBottom: 8, gap: 8 }}>
                    <div style={{ flex: 1, fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase" }}>Driver</div>
                    <div style={{ width: 44, fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", textAlign: "center", flexShrink: 0 }}>F. Pts</div>
                    <div style={{ width: 52, fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", textAlign: "center", flexShrink: 0 }}>Price</div>
                    <div style={{ width: 32, flexShrink: 0 }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 580, overflowY: "auto", paddingRight: 4 }}>
                    {filtered.map(driver => {
                      const selected = isDriverSelected(driver);
                      const atMax = selectedDrivers.length >= MAX_DRIVERS && !selected;
                      const disabled = (!selected && (atMax || !canAddDriver(driver)));
                      return (
                        <div
                          key={driver.id}
                          className={`driver-card ${disabled ? "disabled" : ""}`}
                          onClick={() => !disabled && toggleDriver(driver)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
                            borderColor: selected ? driver.teamColor + "99" : "#1e1e1e",
                            background: selected ? driver.teamColor + "12" : "#161616",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                            <div style={{ width: 3, height: 44, background: driver.teamColor, borderRadius: 2, flexShrink: 0, boxShadow: selected ? `0 0 6px ${driver.teamColor}88` : "none", transition: "box-shadow 0.2s" }} />
                            <div style={{ flexShrink: 0, width: 48, height: 48 }}>
                              <img src={`/drivers/driver-${driver.id}.png`} alt={driver.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 10, color: "#666", fontWeight: 600, letterSpacing: 0.3, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {FLAG_MAP[driver.country]} {driver.name.split(" ")[0]}
                              </div>
                              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 0.3, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {driver.name.split(" ").slice(1).join(" ")}
                              </div>
                              <div style={{ marginTop: 3, display: "inline-block", fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: driver.teamColor, background: driver.teamColor + "20", padding: "1px 5px", borderRadius: 2 }}>
                                {TEAM_ABBR[driver.team]}
                              </div>
                            </div>
                          </div>
                          <div style={{ width: 44, textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0, color: selected ? "#fff" : "#888" }}>{driver.fantasyPoints}</div>
                          <div style={{ width: 52, textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: "#0fd679", flexShrink: 0 }}>${driver.price}M</div>
                          <div style={{ width: 32, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                            <div style={{
                              width: 26, height: 26, borderRadius: "50%",
                              background: selected ? driver.teamColor : "transparent",
                              border: `2px solid ${selected ? driver.teamColor : "#333"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, transition: "all 0.15s", fontWeight: 800,
                              color: selected ? "#fff" : "#555"
                            }}>
                              {selected ? "✓" : "+"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {driverView === "constructors" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 8, padding: "6px 12px", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase" }}>Constructor</div>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", textAlign: "center" }}>Pts</div>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", textAlign: "center" }}>Price</div>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", textAlign: "center" }}>Select</div>
                  </div>
                  {CONSTRUCTORS.map(c => {
                    const selected = selectedConstructor?.id === c.id;
                    const canSelect = selected || canSwapConstructor(c);
                    return (
                      <div
                        key={c.id}
                        className={`driver-card ${selected ? "selected" : ""} ${!canSelect && !selected ? "disabled" : ""}`}
                        onClick={() => canSelect && toggleConstructor(c)}
                        style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", alignItems: "center", gap: 8 }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 6, background: c.color + "22", border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: c.color }} />
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: "#555" }}>Constructor</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15 }}>{c.points}</div>
                        <div style={{ textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: "#0fd679" }}>${c.price}M</div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ width: 28, height: 28, borderRadius: 4, margin: "0 auto", background: selected ? "#e10600" : "#222", border: `2px solid ${selected ? "#e10600" : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                            {selected ? "✓" : "+"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: My Team */}
            <div>
              <div style={{ position: "sticky", top: 120 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: 1, textTransform: "uppercase" }}>My Team</h2>
                  {selectedDrivers.length === MAX_DRIVERS && selectedConstructor && !captain && (
                    <button className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => setShowCaptainModal(true)}>
                      ⭐ Pick Captain
                    </button>
                  )}
                </div>

                {/* Circuit track-style layout */}
                <div className="grid-checker" style={{ background: "#111", borderRadius: 12, padding: 16, border: "1px solid #1e1e1e" }}>
                  
                  {/* Driver slots */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Drivers</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {Array.from({ length: MAX_DRIVERS }).map((_, i) => {
                        const d = selectedDrivers[i];
                        const isCap = d && captain?.id === d.id;
                        return (
                          <div key={i} className={`team-slot ${d ? "filled" : ""} ${isCap ? "captain-slot" : ""}`} style={{ padding: d ? "10px 14px" : 12, minHeight: 56, borderColor: d ? (isCap ? "#f5a623" : (d.teamColor + "55")) : "#1e1e1e" }}>
                            {d ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                                <div style={{ width: 3, height: 36, background: d.teamColor, borderRadius: 2 }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14 }}>{FLAG_MAP[d.country]} {d.name}</span>
                                    {isCap && <span style={{ fontSize: 10, background: "#f5a623", color: "#000", padding: "1px 6px", borderRadius: 2, fontWeight: 800, letterSpacing: 1 }}>CAPTAIN ×2</span>}
                                  </div>
                                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                                    <span style={{ fontSize: 11, color: "#555" }}>{d.team}</span>
                                    <span style={{ fontSize: 11, color: "#e10600", fontWeight: 700 }}>{isCap ? d.fantasyPoints * 2 : d.fantasyPoints} pts</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                  {!isCap && (
                                    <button onClick={() => setCaptain(d)} style={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: "#f5a623" }} title="Make captain">⭐</button>
                                  )}
                                  <button onClick={() => toggleDriver(d)} style={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: "#888" }}>✕</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid #272727", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#2e2e2e", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", flexShrink: 0 }}>
                                  {i + 1}
                                </div>
                                <div style={{ color: "#2a2a2a", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                                  Add Driver
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Constructor slot */}
                  <div>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Constructor</div>
                    <div className={`team-slot ${selectedConstructor ? "filled" : ""}`} style={{ padding: selectedConstructor ? "10px 14px" : 12, minHeight: 56, borderColor: selectedConstructor ? (selectedConstructor.color + "55") : "#1e1e1e" }}>
                      {selectedConstructor ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 6, background: selectedConstructor.color + "22", border: `1px solid ${selectedConstructor.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: selectedConstructor.color }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14 }}>{selectedConstructor.name}</div>
                            <span style={{ fontSize: 11, color: "#e10600", fontWeight: 700 }}>{selectedConstructor.points} pts</span>
                          </div>
                          <button onClick={() => setSelectedConstructor(null)} style={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: "#888" }}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid #272727", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#2e2e2e", flexShrink: 0 }}>⚙</div>
                          <div style={{ color: "#2a2a2a", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Add Constructor</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Points summary */}
                  {(selectedDrivers.length > 0 || selectedConstructor) && (
                    <div style={{ marginTop: 16, padding: "12px 14px", background: "#0d0d0d", borderRadius: 8, border: "1px solid #1a1a1a" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Projected Points</span>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: "#e10600" }}>{totalPoints.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                        <span style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Team Value</span>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: "#0fd679" }}>${spent.toFixed(1)}M</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RACES TAB */}
        {activeTab === "races" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: 1, textTransform: "uppercase" }}>
                  2026 Race Calendar
                </h2>
                {lastSynced && <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Last synced: {lastSynced}</div>}
              </div>
              <button
                className="btn-primary"
                onClick={syncResults}
                disabled={syncStatus === "loading"}
                style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160, justifyContent: "center" }}
              >
                {syncStatus === "loading" ? (
                  <><span className="pulse">⏳</span> Fetching results...</>
                ) : syncStatus === "success" ? (
                  <>✅ Points updated!</>
                ) : syncStatus === "error" ? (
                  <>❌ Sync failed</>
                ) : (
                  <>🔄 Sync Latest Results</>
                )}
              </button>
            </div>

            {syncStatus === "loading" && (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13, color: "#666" }}>
                Fetching latest race results via OpenF1 and calculating fantasy points for all 22 drivers…
              </div>
            )}

            {raceLog.length > 0 && (
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Points Applied From</div>
                {raceLog.map((r, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#888", padding: "4px 0", borderBottom: "1px solid #1a1a1a" }}>
                    ✅ <span style={{ color: "#fff", fontWeight: 600 }}>Round {r.round}: {r.name}</span>
                    <span style={{ color: "#555", marginLeft: 8 }}>— points applied to {Object.keys(r.pts).length} drivers</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RACES.map(race => (
                <div key={race.round} className="race-row" style={{ display: "grid", gridTemplateColumns: "40px 1fr 160px 120px 120px", gap: 16, alignItems: "center", padding: "16px 20px", background: "#111", borderRadius: 8, border: "1px solid #1a1a1a" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: "#333" }}>
                    {String(race.round).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16 }}>{race.name}</div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{race.circuit}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>{race.date}, 2026</div>
                  <div>
                    <span className="tag" style={{ background: race.status === "completed" ? "#0fd67922" : "#f5a62322", color: race.status === "completed" ? "#0fd679" : "#f5a623" }}>
                      {race.status === "completed" ? "✓ Completed" : "⏱ Upcoming"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "#888", fontSize: 13 }}>
                    {race.winner ? `🏆 ${race.winner}` : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEAGUES TAB */}
        {activeTab === "leagues" && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: 1, textTransform: "uppercase" }}>My Leagues</h2>
              <button className="btn-primary">+ Create League</button>
            </div>

            {/* Mini league */}
            {[
              { name: "Race Day Boys", rank: 2, total: 8, pts: totalPoints, code: "RDB2026" },
              { name: "Global F1 Fantasy", rank: 14821, total: 250000, pts: totalPoints, code: "PUBLIC" },
            ].map(league => (
              <div key={league.name} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18 }}>{league.name}</div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Code: <span style={{ color: "#e10600", fontWeight: 700 }}>{league.code}</span></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: "#e10600" }}>{league.rank.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#555" }}>of {league.total.toLocaleString()}</div>
                  </div>
                </div>

                {/* Fake leaderboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { pos: 1, name: "SpeedKing99", pts: totalPoints + 180 },
                    { pos: 2, name: "You", pts: totalPoints, isMe: true },
                    { pos: 3, name: "PitStopPro", pts: totalPoints - 45 },
                  ].slice(0, league.total < 20 ? 3 : 1).map(entry => (
                    <div key={entry.pos} className="leaderboard-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: entry.isMe ? 6 : 0, background: entry.isMe ? "#1a0808" : "transparent", border: entry.isMe ? "1px solid #e1060022" : "none" }}>
                      <div style={{ width: 24, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: entry.pos === 1 ? "#f5a623" : "#444", textAlign: "center" }}>
                        {entry.pos}
                      </div>
                      <div style={{ flex: 1, fontWeight: entry.isMe ? 700 : 400, fontSize: 14 }}>
                        {entry.isMe ? "⭐ " : ""}{entry.name}
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: entry.isMe ? "#e10600" : "#fff" }}>
                        {entry.pts.toLocaleString()} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: 20, background: "#111", border: "1px dashed #222", borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#444", marginBottom: 12 }}>Join a league with an invite code</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <input type="text" placeholder="Enter league code..." style={{ width: 200 }} />
                <button className="btn-primary">Join</button>
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
              Driver Stats
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {DRIVERS.sort((a,b) => b.points - a.points).map((d, i) => (
                <div key={d.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: d.teamColor }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: "#333", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif" }}>#{i + 1}</span>
                    <span style={{ fontSize: 10, color: "#555" }}>{d.team}</span>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                    {FLAG_MAP[d.country]} {d.name}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>Points</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: "#e10600" }}>{d.points}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>Price</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: "#0fd679" }}>${d.price}M</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div className="progress-bar-bg" style={{ marginTop: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${(d.points / 287) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSFERS TAB */}
        {activeTab === "transfers" && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              Transfers
            </h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>
              You have <span style={{ color: "#f5a623", fontWeight: 700 }}>3 free transfers</span> available before Gameweek 4. Additional transfers cost 10 pts each.
            </p>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Transfer Window</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a1a1a" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Transfer Out</div>
                  <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "10px 14px", border: "1px solid #e1060044" }}>
                    <div style={{ fontSize: 13, color: "#e10600" }}>Select from your team</div>
                  </div>
                </div>
                <div style={{ color: "#333", fontWeight: 800, fontSize: 20 }}>⇄</div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Transfer In</div>
                  <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "10px 14px", border: "1px solid #0fd67944" }}>
                    <div style={{ fontSize: 13, color: "#0fd679" }}>Select replacement</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <button className="btn-primary" disabled>Confirm Transfer</button>
              </div>
            </div>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Transfer History</div>
              <div style={{ color: "#333", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No transfers made yet this season.</div>
            </div>
          </div>
        )}
      </main>

      {/* Captain Modal */}
      {showCaptainModal && (
        <div className="modal-overlay" onClick={() => setShowCaptainModal(false)}>
          <div style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 12, padding: 24, width: 400, maxHeight: "80vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Choose Your Captain</h3>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Your captain scores double points this race weekend.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedDrivers.map(d => (
                <button key={d.id} onClick={() => { setCaptain(d); setShowCaptainModal(false); }} style={{ background: captain?.id === d.id ? "#1a0808" : "#111", border: `1px solid ${captain?.id === d.id ? "#e10600" : "#222"}`, borderRadius: 8, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ width: 3, height: 36, background: d.teamColor, borderRadius: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15 }}>{FLAG_MAP[d.country]} {d.name}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>{d.team}</div>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: "#e10600" }}>{d.fantasyPoints * 2} pts</div>
                  <div style={{ fontSize: 20 }}>⭐</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}