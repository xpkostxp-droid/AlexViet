import { restaurantWords } from '../content/games/restaurant';
export function RestaurantPicture({id}:{id:string}) {
 const word=restaurantWords.find(w=>w[0]===id);const vi=word?.[1]??'';
 const glass=vi==='ly rượu vang'||vi.includes('ly để uống');
 const table=vi==='bàn';const napkin=vi.includes('khăn');
 return <svg className="family-picture" viewBox="0 0 320 200" role="img" aria-label={`Иллюстрация: ${word?.[2]??'Ресторан'}`}>
 <rect x="4" y="4" width="312" height="192" rx="28" fill="#eef8f6"/>
 <ellipse cx="160" cy="176" rx="101" ry="8" fill="#d5eae5"/>
 {glass?<g stroke="#385464" strokeWidth="4" fill="none"><path d="M128 35H192L196 80Q196 116 160 116Q124 116 124 80ZM160 116V166M137 167H183"/></g>:table?<g stroke="#385464" strokeWidth="5" fill="#dfba86"><path d="M71 98L115 69H241L268 98Z"/><path d="M85 99V170M252 99V170M121 71V142"/></g>:napkin?<g stroke="#385464" strokeWidth="3"><rect x="97" y="78" width="126" height="85" rx="12" fill={vi==='khăn ướt'?'#9dceca':'#e7c79b'}/><path d="M123 86L113 41L165 54L186 37L199 86Z" fill="white"/><path d="M132 91H186"/>{vi==='khăn ướt'&&<path d="M218 36Q194 69 218 71Q242 69 218 36" fill="#9dcfdf"/>}</g>:<text x="160" y="131" textAnchor="middle" fontSize="88">{word?.[4]??'🍽️'}</text>}
 {(vi.startsWith('Không')||vi==='Không đá nhé.')&&<path d="M100 50L220 151" stroke="#c36c66" strokeWidth="9" strokeLinecap="round"/>}
 {vi.endsWith('?')&&<text x="261" y="52" textAnchor="middle" fontSize="40" fill="#385464">?</text>}
 </svg>;
}
