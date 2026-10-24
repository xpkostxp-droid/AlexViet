import { restaurantWords } from '../content/games/restaurant';
function SingleUtensil({kind}:{kind:string}) {
 const color='#385464';
 return <g data-object={kind} stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="#d6e3e7">
 {kind==='nĩa' && <><path d="M139 35V70Q139 91 160 91Q181 91 181 70V35M153 35V74M167 35V74" fill="none"/><path d="M154 91H166L170 163Q160 176 150 163Z"/></>}
 {kind==='thìa / muỗng' && <><ellipse cx="160" cy="65" rx="25" ry="36"/><path d="M154 101H166L171 164Q160 177 149 164Z"/></>}
 {kind==='dao' && <><path d="M168 32Q133 62 139 111H168Z"/><path d="M145 111H169V165Q157 176 145 165Z" fill="#b88e69"/></>}
 {kind==='đĩa' && <><ellipse cx="160" cy="101" rx="77" ry="65" fill="#fffdf8"/><ellipse cx="160" cy="101" rx="59" ry="48" fill="none" stroke="#82b6a8"/></>}
 {kind==='bát' && <><path d="M88 87Q91 145 143 154H177Q229 145 232 87" fill="#fffdf8"/><ellipse cx="160" cy="87" rx="72" ry="20" fill="#d5e8e3"/><path d="M142 154V162H178V154" fill="#fffdf8"/></>}
 {kind==='đũa' && <><path d="M132 32L151 166L157 165L142 31Z" fill="#d9ad73"/><path d="M173 31L163 166L169 167L183 32Z" fill="#d9ad73"/></>}
 {kind==='cốc / ly' && <><path d="M124 43L134 160Q160 174 186 160L196 43" fill="#e2f1f2"/><ellipse cx="160" cy="43" rx="36" ry="10" fill="#f9ffff"/></>}
 {kind==='chai' && <><path d="M148 32H172V69L187 88V163Q160 175 133 163V88L148 69Z" fill="#a6c7ac"/><path d="M148 32H172V45H148Z" fill="#d6b27d"/></>}
 </g>;
}
export function RestaurantPicture({id}:{id:string}) {
 const word=restaurantWords.find(w=>w[0]===id);const vi=word?.[1]??'';
 const glass=vi==='ly rượu vang'||vi.includes('ly để uống');
 const utensil=['nĩa','thìa / muỗng','dao','đĩa','bát','đũa','cốc / ly','chai'].includes(vi);
 const table=vi==='bàn';const napkin=vi.includes('khăn');
 return <svg className="family-picture" viewBox="0 0 320 200" role="img" aria-label={`Иллюстрация: ${word?.[2]??'Ресторан'}`}>
 <rect x="4" y="4" width="312" height="192" rx="28" fill="#eef8f6"/>
 <ellipse cx="160" cy="176" rx="101" ry="8" fill="#d5eae5"/>
 {utensil?<SingleUtensil kind={vi}/>:glass?<g stroke="#385464" strokeWidth="4" fill="none"><path d="M128 35H192L196 80Q196 116 160 116Q124 116 124 80ZM160 116V166M137 167H183"/></g>:table?<g stroke="#385464" strokeWidth="5" fill="#dfba86"><path d="M71 98L115 69H241L268 98Z"/><path d="M85 99V170M252 99V170M121 71V142"/></g>:napkin?<g stroke="#385464" strokeWidth="3"><rect x="97" y="78" width="126" height="85" rx="12" fill={vi==='khăn ướt'?'#9dceca':'#e7c79b'}/><path d="M123 86L113 41L165 54L186 37L199 86Z" fill="white"/><path d="M132 91H186"/>{vi==='khăn ướt'&&<path d="M218 36Q194 69 218 71Q242 69 218 36" fill="#9dcfdf"/>}</g>:<text x="160" y="131" textAnchor="middle" fontSize="88">{word?.[4]??'🍽️'}</text>}
 {(vi.startsWith('Không')||vi==='Không đá nhé.')&&<path d="M100 50L220 151" stroke="#c36c66" strokeWidth="9" strokeLinecap="round"/>}
 {vi.endsWith('?')&&<text x="261" y="52" textAnchor="middle" fontSize="40" fill="#385464">?</text>}
 </svg>;
}
