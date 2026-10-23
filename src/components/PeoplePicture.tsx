import { peopleWords } from '../content/games/people';
function Person({ x, female=false, muted=false }: {x:number;female?:boolean;muted?:boolean}) {return <g opacity={muted?.35:1} transform={`translate(${x} 0)`}>{female&&<path d="M-24 78Q-27 27 0 27Q28 27 24 78L26 110H-26Z" fill="#574337"/>}<path d="M-27 158Q-27 103 0 103Q27 103 27 158Z" fill={female?'#cc919e':'#5baaa5'}/><circle cy="75" r="24" fill="#efc7a4"/><path d="M-24 68Q-24 38 2 43Q26 43 24 68L7 56L-15 62Z" fill="#574337"/><circle cx="-8" cy="75" r="2"/><circle cx="8" cy="75" r="2"/><path d="M-7 88Q0 94 7 88" fill="none" stroke="#9d6355" strokeWidth="2"/></g>;}
export function PeoplePicture({id}:{id:string}) {
 const word=peopleWords.find(w=>w[0]===id);const vi=word?.[1]??'';
 const inclusive=vi.startsWith('chúng ta')||vi.startsWith('Chúng ta');
 const exclusive=vi.startsWith('chúng tôi')||vi.startsWith('Chúng tôi');
 const others=vi==='họ'||vi.startsWith('Họ');const all=vi.includes('đều');
 const group=inclusive||exclusive||others||all;
 const female=/chị ấy|cô ấy|Cô ấy/.test(vi);
 const question=vi.endsWith('?');
 let symbol=question?'?':vi.includes('Nga')?'🇷🇺':vi.includes('Pháp')?'🇫🇷':vi.includes('Mỹ')?'🇺🇸':vi.includes('Hàn Quốc')?'🇰🇷':vi.includes('học')?'📖':vi.includes('làm việc')?'💼':['vâng','dạ','có'].includes(vi)?'✓':vi.includes('sai')?'!':vi==='hội thoại'?'💬':'';
 return <svg className="family-picture" viewBox="0 0 320 200" role="img" aria-label={`Иллюстрация: ${word?.[2]??'Общение'}`}>
 <rect x="4" y="4" width="312" height="192" rx="28" fill="#eef8f6"/>
 {group?<><rect x={inclusive?43:32} y="31" width={inclusive?239:158} height="136" rx="22" fill="#ddede3" stroke="#6c9e80" strokeWidth="2"/><Person x={83}/><Person x={145} female/><Person x={244} muted={exclusive}/><text x="244" y="185" textAnchor="middle" fontSize="13" fill="#385464">{inclusive?'ты с нами':exclusive?'ты отдельно':'другие люди'}</text>{all&&<text x="160" y="25" textAnchor="middle" fontSize="16" fill="#246448">✓ Все / оба</text>}</>:<><Person x={140} female={female}/>{['tôi','mình','tớ','tao'].includes(vi)&&<path d="M215 113H169L180 101M169 113L180 125" stroke="#385464" strokeWidth="4" fill="none"/>}{vi==='mày'&&<path d="M203 113H248L237 101M248 113L237 125" stroke="#385464" strokeWidth="4" fill="none"/>}</>}
 {symbol&&<text x="260" y="49" fontSize="32" textAnchor="middle" fill="#385464">{symbol}</text>}
 </svg>;
}
