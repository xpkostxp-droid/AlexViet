import type { ReactNode } from 'react';
const ink = '#385464';
function Worker({ kind }: { kind: string }) {
 const female = ['nurse', 'teacher-woman', 'secretary'].includes(kind);
 const medical = ['doctor', 'nurse'].includes(kind);
 const police = kind.includes('police');
 return <g>
  <path d="M97 177Q98 114 160 115Q222 114 223 177Z" fill={medical ? '#fff' : police ? '#759574' : '#58aaa8'} stroke={ink} strokeWidth="3"/>
  {female && <path d="M126 72Q124 25 160 26Q197 25 195 79L199 121H121Z" fill="#574137"/>}
  <ellipse cx="160" cy="77" rx="32" ry="38" fill="#f0c8a4"/>
  <path d={female ? 'M129 65Q125 24 163 30Q194 30 193 67L168 46Q151 66 129 65' : 'M129 64L130 46Q155 20 184 40L192 65L175 51L143 53Z'} fill="#574137"/>
  <circle cx="148" cy="77" r="2.5" fill={ink}/><circle cx="172" cy="77" r="2.5" fill={ink}/>
  <path d="M151 94Q160 102 169 94" fill="none" stroke="#ad6656" strokeWidth="2.5"/>
  {medical && <><path d="M143 119V140Q160 161 177 140V119" fill="none" stroke={ink} strokeWidth="4"/><circle cx="177" cy="143" r="5" fill={ink}/><path d="M126 47V28H194V47" fill="white" stroke={ink} strokeWidth="2"/><path d="M155 29H165V34H170V43H165V48H155V43H150V34H155Z" fill="#dc7776"/></>}
  {['engineer', 'construction'].includes(kind) && <><path d="M122 51Q122 17 160 17Q198 17 198 51Z" fill="#eac461" stroke={ink} strokeWidth="2"/><path d="M116 51H204M160 19V48" stroke={ink} strokeWidth="4"/></>}
  {police && <><path d="M125 48L119 27L160 16L201 27L195 48Z" fill={kind === 'traffic-police' ? '#e5cc87' : '#668c67'} stroke={ink} strokeWidth="2"/><path d="M125 48H195" stroke={ink} strokeWidth="7"/><path d="M160 24L164 33L174 34L166 41L168 51L160 46L152 51L154 41L146 34L156 33Z" fill="#efc95e"/></>}
  {['director','boss','manager','employee'].includes(kind) && <path d="M153 117H167L163 128L170 151L160 162L150 151L157 128Z" fill="#ecbf75" stroke={ink} strokeWidth="1.5"/>}
  {kind === 'student' && <><path d="M120 40L160 20L200 40L160 58Z" fill={ink}/><path d="M199 40V75" stroke="#e5bc62" strokeWidth="3"/></>}
 </g>;
}
function Building({ kind }: { kind: string }) {
 return <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
  <rect x="73" y="64" width="174" height="113" rx="5" fill="#fff7e7"/>
  {kind === 'bank' || kind === 'university' ? <><path d="M57 65L160 21L263 65Z" fill="#82b9b4"/>{[100,150,200].map(x=><rect key={x} x={x} y="81" width="20" height="91" fill="#daeae5"/>)}<path d="M58 180H262" strokeWidth="8"/></> : <>{[94,132,170,208].map(x=><g key={x}><rect x={x} y="83" width="18" height="23" fill="#bddfdc"/><rect x={x} y="119" width="18" height="23" fill="#bddfdc"/></g>)}<rect x="145" y="147" width="30" height="30" fill="#82b9b4"/></>}
  {kind === 'hospital' && <path d="M149 33H171V43H181V61H171V72H149V61H139V43H149Z" fill="#df7d78" stroke="none"/>}
  {kind === 'restaurant' && <><path d="M68 65H252L264 89H56Z" fill="#e6a494"/>{[80,120,160,200,240].map(x=><path key={x} d={`M${x} 65l-7 24`} stroke="#fff7e7" strokeWidth="16"/>)}</>}
  {kind === 'school' && <><path d="M67 64L160 30L253 64Z" fill="#e4b56d"/><circle cx="160" cy="81" r="12" fill="white"/><path d="M160 73V81H168"/></>}
  {kind === 'construction-company' && <><path d="M265 177V26H195M265 38L200 26M222 26V88" fill="none" stroke="#d7a746" strokeWidth="5"/><path d="M218 88Q218 99 228 94" fill="none"/></>}
 </g>;
}
function Car() { return <g stroke={ink} strokeWidth="3"><path d="M67 152V117L93 109L116 80H208L232 109L253 119V152Z" fill="#e4b86d"/><path d="M108 108L123 88H199L216 108Z" fill="#d6edeb"/><circle cx="109" cy="151" r="17" fill={ink}/><circle cx="213" cy="151" r="17" fill={ink}/><circle cx="109" cy="151" r="7" fill="white"/><circle cx="213" cy="151" r="7" fill="white"/></g>; }
function Desk({ doing = false }: { doing?: boolean }) { return <g stroke={ink} strokeWidth="3"><path d="M66 153H254M83 154V184M237 154V184"/><rect x="103" y="91" width="105" height="57" rx="5" fill="#82b9b4"/><path d="M97 148H217" strokeWidth="7"/>{doing ? <><path d="M235 78L245 89L226 109L216 98Z" fill="#e5b56e"/><path d="M216 98L211 115L226 109" fill="#f0c8a4"/></> : <path d="M131 105H180M131 117H168M131 129H176" stroke="white"/>}</g>; }
export function ProfessionPicture({ id }: { id: string }) {
 const places = ['bank','company','construction-company','hospital','restaurant','school','university'];
 let scene: ReactNode;
 if (places.includes(id)) scene = <Building kind={id}/>;
 else if (['driver','driving'].includes(id)) scene = <><g transform="translate(78 12) scale(.5)"><Worker kind="driver"/></g><Car/></>;
 else if (id === 'ask-place') scene = <><g transform="translate(-20 25) scale(.75)"><Building kind="company"/></g><text x="239" y="88" fontSize="58" fill={ink}>?</text></>;
 else if (id === 'ask-job') scene = <><Worker kind="employee"/><text x="231" y="81" fontSize="58" fill={ink}>?</text></>;
 else if (id === 'construction') scene = <><Worker kind="construction"/><path d="M221 140h45v35h-45zM221 157h45M244 140v17M232 157v18" fill="#dfac82" stroke={ink} strokeWidth="2"/></>;
 else if (['working','doing','work'].includes(id)) scene = <>{id !== 'work' && <g transform="translate(63 0) scale(.6)"><Worker kind="employee"/></g>}<Desk doing={id === 'doing'}/>{id === 'work' && <path d="M230 72V61H251V72M220 73H262V103H220Z" fill="#e5b56e" stroke={ink} strokeWidth="3"/>}</>;
 else scene = <><Worker kind={id}/>{id.startsWith('teacher') && <g stroke={ink} strokeWidth="2"><rect x="208" y="74" width="65" height="50" rx="3" fill="#568e7c"/><path d="M221 89H259M221 102H246" stroke="white"/></g>}{id === 'engineer' && <path d="M211 125H272V173H211ZM217 160L238 135L263 160Z" fill="#d3e9ed" stroke={ink} strokeWidth="2"/>}{['secretary','manager','employee'].includes(id) && <g transform="translate(155 80) scale(.35)"><Desk/></g>}{id === 'boss' && <path d="M213 137V113H255V137M214 139H259V171H214Z" fill="#b68d67" stroke={ink} strokeWidth="3"/>}</>;
 return <svg className="family-picture" viewBox="0 0 320 200" role="img" aria-label="Иллюстрация профессии или места работы"><rect x="4" y="4" width="312" height="192" rx="28" fill="#eef8f6"/><ellipse cx="160" cy="180" rx="120" ry="8" fill="#d5eae5"/>{scene}</svg>;
}
