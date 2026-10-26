function House({ x, y, scale = 1, floors = 1, pretty = false, ugly = false }: { x: number; y: number; scale?: number; floors?: number; pretty?: boolean; ugly?: boolean }) {
  const h = 42 + Math.max(0, floors - 1) * 18;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x="-42" y={-h} width="84" height={h} rx="6" fill={ugly ? '#b8b1aa' : pretty ? '#ffd8bf' : '#f1c56d'} stroke="#36566d" strokeWidth="3"/>
    <path d={`M-49 ${-h} L0 ${-h-32} L49 ${-h}Z`} fill={ugly ? '#6f7478' : '#d76f70'} stroke="#36566d" strokeWidth="3"/>
    {Array.from({ length: floors }).map((_, row) => <g key={row}>
      <rect x="-29" y={-h + 11 + row * 18} width="15" height="11" rx="2" fill="#bfe2ed"/>
      <rect x="14" y={-h + 11 + row * 18} width="15" height="11" rx="2" fill="#bfe2ed"/>
    </g>)}
    <rect x="-8" y="-25" width="16" height="25" rx="2" fill="#8a6955"/>
    {pretty && <><circle cx="-52" cy="-5" r="9" fill="#76bb79"/><circle cx="52" cy="-5" r="9" fill="#76bb79"/><path d="M-28-8 Q0-25 28-8" fill="none" stroke="#f39aab" strokeWidth="4"/></>}
    {ugly && <><path d="M-31-30 l13 9 -10 8" fill="none" stroke="#775d52" strokeWidth="4"/><path d="M25-50 l-12 9 12 10" fill="none" stroke="#775d52" strokeWidth="4"/></>}
  </g>;
}

function Building({ x, y, floors = 5, scale = 1 }: { x: number; y: number; floors?: number; scale?: number }) {
  const h = 20 + floors * 18;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x="-45" y={-h} width="90" height={h} rx="5" fill="#9bcbbf" stroke="#36566d" strokeWidth="3"/>
    {Array.from({ length: floors }).map((_, row) => <g key={row}>
      {[-27, 0, 27].map(col => <rect key={col} x={col - 7} y={-h + 10 + row * 18} width="14" height="10" rx="2" fill="#d9f1f6"/>)}
    </g>)}
    <rect x="-8" y="-23" width="16" height="23" fill="#607d8b"/>
  </g>;
}

function Room({ kind, adjective }: { kind: string; adjective?: string }) {
  const bg = adjective === 'xấu' ? '#e4dfd8' : adjective === 'đẹp' ? '#fff1e7' : '#edf8f6';
  return <g>
    <rect x="36" y="42" width="248" height="116" rx="18" fill={bg} stroke="#bdd8d3" strokeWidth="3"/>
    <rect x="52" y="60" width="58" height="46" rx="4" fill="#bfe2ed"/><path d="M81 60V106M52 83H110" stroke="#fff" strokeWidth="3"/>
    {kind === 'bedroom' && <><rect x="128" y="108" width="112" height="32" rx="6" fill="#e8a8ba"/><rect x="128" y="98" width="112" height="16" rx="6" fill="#f5cddd"/><rect x="136" y="101" width="32" height="12" rx="5" fill="#fff"/></>}
    {kind === 'kitchen' && <><rect x="125" y="92" width="120" height="48" rx="4" fill="#efcf86"/><circle cx="154" cy="106" r="8" fill="#546e7a"/><circle cx="188" cy="106" r="8" fill="#546e7a"/><rect x="220" y="102" width="15" height="38" fill="#8bb6c8"/></>}
    {kind === 'living' && <><rect x="126" y="105" width="122" height="35" rx="12" fill={adjective === 'xấu' ? '#978d84' : '#e2a8b7'}/><rect x="113" y="112" width="24" height="28" rx="8" fill={adjective === 'xấu' ? '#827970' : '#cf879b'}/><rect x="237" y="112" width="24" height="28" rx="8" fill={adjective === 'xấu' ? '#827970' : '#cf879b'}/></>}
    {kind === 'office' && <><rect x="132" y="112" width="105" height="10" rx="3" fill="#b9936a"/><rect x="143" y="122" width="8" height="22" fill="#80664d"/><rect x="218" y="122" width="8" height="22" fill="#80664d"/><rect x="166" y="77" width="50" height="34" rx="4" fill="#8fb3d1"/></>}
    {kind === 'bathroom' && <><ellipse cx="180" cy="115" rx="42" ry="23" fill="#bce4e8"/><rect x="151" y="85" width="58" height="26" rx="5" fill="#d8eff1"/><path d="M225 84 v38" stroke="#4d8590" strokeWidth="5"/><path d="M225 84 h18" stroke="#4d8590" strokeWidth="5"/></>}
    {adjective === 'đẹp' && <><circle cx="72" cy="136" r="13" fill="#82bd7b"/><circle cx="250" cy="70" r="12" fill="#f3a7b6"/></>}
    {adjective === 'xấu' && <><path d="M70 128 l18 12 -16 10" fill="none" stroke="#7d6658" strokeWidth="5"/><path d="M245 64 l-14 11 17 10" fill="none" stroke="#7d6658" strokeWidth="5"/></>}
  </g>;
}

function Balcony({ long = false, short = false }: { long?: boolean; short?: boolean }) {
  const x1 = long ? 45 : short ? 105 : 75;
  const x2 = long ? 275 : short ? 215 : 245;
  return <g><rect x="36" y="42" width="248" height="116" rx="18" fill="#eef8f6"/><rect x="92" y="53" width="136" height="72" rx="4" fill="#bfe2ed"/><path d={`M${x1} 124 H${x2} V151 H${x1}Z`} fill="#d9d2c6" stroke="#55717e" strokeWidth="3"/>{Array.from({length:6}).map((_,i)=><path key={i} d={`M${x1+10+i*(x2-x1-20)/5} 126V149`} stroke="#55717e" strokeWidth="2"/>)}</g>;
}

function Quality({ level }: { level: 'good'|'poor'|'high' }) {
  return <g><rect x="58" y="55" width="204" height="96" rx="18" fill="#fff7e5" stroke="#ddc891" strokeWidth="3"/>
    <rect x="88" y="84" width="64" height="45" rx="5" fill={level === 'poor' ? '#a9a09a' : '#d4b071'}/>
    <rect x="165" y="76" width="66" height="53" rx="5" fill={level === 'poor' ? '#8e8782' : level === 'high' ? '#79b78a' : '#9cc38a'}/>
    {level === 'poor' ? <path d="M96 91 l18 12 -11 13 M179 84 l19 17 -14 17" fill="none" stroke="#765b50" strokeWidth="5"/> : <><path d="M102 104 l13 13 25-29" fill="none" stroke="#278b67" strokeWidth="7"/><path d="M178 103 l13 13 25-29" fill="none" stroke="#278b67" strokeWidth="7"/></>}
    {level === 'high' && <><path d="M248 127V70" stroke="#d25d68" strokeWidth="5"/><path d="M238 81 l10-12 10 12" fill="none" stroke="#d25d68" strokeWidth="5"/></>}
  </g>;
}

function Concept({ id }: { id: string }) {
  if (id === 'house' || id === 'private-house') return <House x={160} y={155} scale={1.1}/>;
  if (id === 'hotel') return <g><Building x={160} y={158} floors={5} scale={.92}/><text x="160" y="35" textAnchor="middle" fontSize="18" fontWeight="700" fill="#d45f68">HOTEL</text></g>;
  if (id === 'apartment') return <Building x={160} y={158} floors={6} scale={.9}/>;
  if (id === 'floor') return <Building x={160} y={158} floors={4} scale={.9}/>;
  if (id === 'stairs') return <g fill="#c6b08e" stroke="#6f665a" strokeWidth="2">{Array.from({length:6}).map((_,i)=><rect key={i} x={68+i*28} y={140-i*15} width="28" height={18+i*15}/>)}</g>;
  if (id === 'elevator') return <g><rect x="100" y="38" width="120" height="120" rx="7" fill="#aebbc2" stroke="#4f6772" strokeWidth="4"/><path d="M160 42V154" stroke="#607d8b" strokeWidth="3"/><path d="M244 76 l12-12 12 12 M244 122 l12 12 12-12" fill="none" stroke="#d45f68" strokeWidth="5"/></g>;
  if (id === 'bedroom') return <Room kind="bedroom"/>;
  if (id === 'bathroom') return <Room kind="bathroom"/>;
  if (id === 'kitchen') return <Room kind="kitchen"/>;
  if (id === 'living-room') return <Room kind="living"/>;
  if (id === 'office') return <Room kind="office"/>;
  if (id === 'balcony') return <Balcony/>;
  if (id === 'room') return <g><rect x="58" y="45" width="204" height="108" rx="16" fill="#edf8f6" stroke="#77a8a0" strokeWidth="4"/><path d="M160 45V153M58 100H262" stroke="#b5d6d0" strokeWidth="4"/></g>;
  if (id === 'land') return <g><path d="M35 130 Q90 95 150 122 Q220 92 285 128 V165 H35Z" fill="#84bb75"/><path d="M65 130 Q100 113 137 125" fill="none" stroke="#675746" strokeWidth="3"/></g>;
  if (id === 'rent') return <g><House x={125} y={155} scale={.8}/><rect x="190" y="72" width="82" height="52" rx="9" fill="#fff" stroke="#d45f68" strokeWidth="4"/><path d="M206 92 h50 M206 105 h36" stroke="#65818f" strokeWidth="4"/><circle cx="238" cy="136" r="16" fill="#e8b95d"/><text x="238" y="142" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">$</text></g>;
  if (id === 'landlord') return <g><House x={205} y={155} scale={.72}/><circle cx="100" cy="87" r="32" fill="#f0c59f"/><path d="M69 86 Q74 49 101 53 Q132 53 132 88" fill="#675246"/><rect x="74" y="118" width="53" height="38" rx="15" fill="#3ca5a0"/><circle cx="143" cy="108" r="10" fill="none" stroke="#d6a42c" strokeWidth="5"/><path d="M153 108 h28 l8 8 -8 8 -8-8 -8 8" fill="none" stroke="#d6a42c" strokeWidth="5"/></g>;
  if (id === 'cheap') return <g><House x={160} y={155} scale={.9}/><circle cx="250" cy="63" r="32" fill="#55a77d"/><text x="250" y="70" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff">$</text><path d="M240 100 q10 12 20 0" fill="none" stroke="#55a77d" strokeWidth="5"/></g>;
  const adjective: Record<string, JSX.Element> = {
    big: <House x={160} y={160} scale={1.35}/>, small: <House x={160} y={155} scale={.65}/>,
    high: <Building x={160} y={162} floors={6} scale={.92}/>, low: <House x={160} y={155} scale={.95}/>,
    long: <Balcony long/>, short: <Balcony short/>, many: <g>{[70,125,180,235].map((x,i)=><rect key={x} x={x} y={70+(i%2)*35} width="42" height="30" rx="5" fill="#bcded8" stroke="#5e8e87" strokeWidth="2"/>)}</g>,
    few: <g>{[110,170].map(x=><rect key={x} x={x} y="86" width="42" height="30" rx="5" fill="#bcded8" stroke="#5e8e87" strokeWidth="2"/>)}</g>,
    beautiful: <House x={160} y={155} scale={1} pretty/>, ugly: <House x={160} y={155} scale={1} ugly/>,
    good: <Quality level="good"/>, poor: <Quality level="poor"/>, substance: <g><rect x="82" y="96" width="60" height="48" rx="5" fill="#c6a06d"/><circle cx="195" cy="111" r="30" fill="#adb9bf"/><rect x="224" y="72" width="28" height="72" fill="#8b6f55"/></g>,
    amount: <g>{[70,105,140,175,210].map((x,i)=><circle key={x} cx={x} cy={100+(i%2)*26} r="17" fill="#87b8ad"/>)}</g>,
    quality: <Quality level="good"/>, 'quality-good': <Quality level="good"/>, 'quality-poor': <Quality level="poor"/>, 'quality-high': <Quality level="high"/>, 'product-quality-high': <Quality level="high"/>,
  };
  if (adjective[id]) return adjective[id];

  if (id === 'blitz-apartment-high' || id === 'blitz-apartment-many-floors') return <Building x={160} y={162} floors={7} scale={.9}/>;
  if (id === 'blitz-private-big') return <House x={160} y={160} scale={1.3}/>;
  if (id === 'blitz-private-beautiful') return <House x={160} y={155} scale={1} pretty/>;
  if (id === 'blitz-house-small') return <House x={160} y={155} scale={.65}/>;
  if (id === 'blitz-house-cheap') return <g><House x={145} y={155} scale={.85}/><circle cx="245" cy="75" r="28" fill="#55a77d"/><text x="245" y="82" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff">$</text></g>;
  if (id === 'blitz-many-rooms') return <g>{[[55,55],[165,55],[55,112],[165,112]].map(([x,y])=><rect key={x+'-'+y} x={x} y={y} width="100" height="44" rx="7" fill="#d9efea" stroke="#6faaa0" strokeWidth="3"/>)}</g>;
  if (id === 'blitz-few-rooms') return <g><rect x="55" y="72" width="95" height="68" rx="8" fill="#d9efea" stroke="#6faaa0" strokeWidth="3"/><rect x="170" y="72" width="95" height="68" rx="8" fill="#d9efea" stroke="#6faaa0" strokeWidth="3"/></g>;
  if (id === 'blitz-bedroom-small') return <g transform="translate(60 25) scale(.72)"><Room kind="bedroom"/></g>;
  if (id === 'blitz-bathroom-small') return <g transform="translate(60 25) scale(.72)"><Room kind="bathroom"/></g>;
  if (id === 'blitz-kitchen-beautiful') return <Room kind="kitchen" adjective="đẹp"/>;
  if (id === 'blitz-living-ugly') return <Room kind="living" adjective="xấu"/>;
  if (id === 'blitz-office-big') return <g transform="translate(-18 -8) scale(1.12)"><Room kind="office"/></g>;
  if (id === 'blitz-balcony-long') return <Balcony long/>;
  if (id === 'blitz-balcony-short') return <Balcony short/>;
  if (id === 'blitz-hotel-high') return <Building x={160} y={162} floors={7} scale={.88}/>;
  if (id === 'blitz-land-cheap') return <g><path d="M35 130 Q90 95 150 122 Q220 92 285 128 V165 H35Z" fill="#84bb75"/><circle cx="248" cy="70" r="28" fill="#55a77d"/><text x="248" y="77" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff">$</text></g>;
  if (id === 'blitz-quality-good') return <Quality level="good"/>;
  if (id === 'blitz-quality-poor') return <Quality level="poor"/>;
  if (id === 'blitz-quality-high') return <Quality level="high"/>;

  return <House x={160} y={155}/>;
}

export function HousePicture({ id }: { id: string }) {
  return <svg className="family-picture" viewBox="0 0 320 200" role="img" aria-label="Иллюстрация дома и прилагательного">
    <rect x="4" y="4" width="312" height="192" rx="28" fill="#eef8f6"/>
    <ellipse cx="160" cy="172" rx="122" ry="9" fill="#d8eae6"/>
    <Concept id={id}/>
  </svg>;
}
