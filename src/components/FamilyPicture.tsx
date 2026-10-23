function Person({ x, y, size = 1, female = false, old = false, color = '#37aaa9' }: { x: number; y: number; size?: number; female?: boolean; old?: boolean; color?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}>
    <path d="M-34 85 Q-32 42 0 42 Q32 42 34 85Z" fill={color}/>
    {female ? <>
      {old && <circle cx="19" cy="-23" r="12" fill="#c9c6c3"/>}
      <path d="M-27 5 Q-30-32 0-32 Q32-32 27 13 L29 42 L-29 42Z" fill={old ? '#c9c6c3' : '#42342f'}/>
    </> : <>
      <ellipse cx="-24" cy="6" rx="4" ry="7" fill="#f2c8a3"/><ellipse cx="24" cy="6" rx="4" ry="7" fill="#f2c8a3"/>
      <path d="M-25 5 L-25-13 Q-21-33 0-32 Q26-31 25-9 L24 5 L17-10 L-17-10Z" fill={old ? '#c9c6c3' : '#42342f'}/>
    </>}
    <ellipse cy="5" rx="23" ry="29" fill="#f2c8a3"/>
    <path d={female ? "M-23-6 Q-16-35 15-20 L25-3 Q5-8-2-19 Q-9-6-23-6" : "M-23-6 L-22-17 Q-4-35 17-21 L24-7 L12-14 L-4-12 L-12-17Z"} fill={old ? '#c9c6c3' : '#42342f'}/>
    <circle cx="-8" cy="5" r="2" fill="#42342f"/><circle cx="8" cy="5" r="2" fill="#42342f"/>
    <path d="M-6 16 Q0 22 6 16" fill="none" stroke="#9b5747" strokeWidth="2" strokeLinecap="round"/>
    {old && <g fill="none" stroke="#746b63" strokeWidth="1.5"><rect x="-18" y="-1" width="14" height="12" rx="4"/><rect x="4" y="-1" width="14" height="12" rx="4"/><path d="M-4 3H4"/></g>}
    {female && <><circle cx="-24" cy="13" r="3" fill="#e5ad48"/><circle cx="24" cy="13" r="3" fill="#e5ad48"/></>}
  </g>;
}
export function FamilyPicture({ id }: { id: string }) {
  const group = ['family', 'all-family', 'children'].includes(id);
  const female = ['grandma-dad', 'grandma-mom', 'mom', 'sister-older', 'sister-younger', 'wife', 'daughter'].includes(id);
  const young = /younger|son|daughter/.test(id);
  return <svg className="family-picture" viewBox="0 0 320 200" role="img" aria-label="Иллюстрация семьи">
    <rect x="4" y="4" width="312" height="192" rx="28" fill="#eef8f6"/>
    <ellipse cx="160" cy="175" rx="120" ry="10" fill="#d5eae5"/>
    {group ? <>
      {id !== 'children' && <><Person x={65} y={75} size={.85} old color="#8b9cbd"/><Person x={255} y={75} size={.85} old female color="#c78d9c"/><Person x={115} y={70} size={.9}/><Person x={205} y={70} size={.9} female color="#dbad64"/></>}
      <Person x={135} y={126} size={.6} color="#739bc7"/><Person x={185} y={126} size={.6} female color="#d394a4"/>
      {id === 'all-family' && <path d="M145 30 C125 7 109 37 160 55 C211 37 195 7 175 30 Q160 47 145 30" fill="#e6a0a2"/>}
    </> : id.startsWith('who') ? <><Person x={145} y={88} color="#91adba"/><text x="220" y="80" fontSize="55" fill="#258d8b" fontWeight="700">?</text>{id === 'who-this' && <path d="M225 130H190l12-10m-12 10 12 10" fill="none" stroke="#258d8b" strokeWidth="5" strokeLinecap="round"/>}</> : <Person x={160} y={young ? 105 : 80} size={young ? .8 : 1.1} female={female} old={id.startsWith('grand')} color={female ? '#cb8e9f' : id.endsWith('mom') ? '#8e9fc0' : '#37aaa9'}/>}
  </svg>;
}
