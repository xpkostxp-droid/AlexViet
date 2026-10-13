const dimensions: Record<number, { width: number; height: number; front: [number, number]; back: [number, number] }> = {
  100: { width:600,height:608,front:[16,279],back:[335,576] },
  200: { width:649,height:653,front:[17,304],back:[360,635] },
  500: { width:655,height:646,front:[17,302],back:[356,627] },
  1000: { width:399,height:394,front:[16,183],back:[218,374] },
  2000: { width:399,height:390,front:[16,180],back:[215,377] },
  5000: { width:682,height:646,front:[14,300],back:[356,619] },
  10000: { width:779,height:771,front:[0,348],back:[425,771] },
  20000: { width:803,height:841,front:[0,380],back:[463,841] },
  50000: { width:829,height:835,front:[0,378],back:[460,835] },
  100000: { width:855,height:838,front:[0,378],back:[461,838] },
  200000: { width:850,height:813,front:[0,366],back:[448,813] },
  500000: { width:850,height:773,front:[0,351],back:[426,773] },
};
// Viewports show the two faces of the unchanged source scan separately.
export function BanknoteFaces({ value, flipped = false }: { value: number; flipped?: boolean }) {
  const size = dimensions[value];
  return <span className="banknote-view" style={{ aspectRatio: `${size.width} / ${size.front[1] - size.front[0]}` }} aria-hidden="true">
    <span className={`banknote-flipper${flipped ? ' banknote-flipped' : ''}`}>
      {(['front', 'back'] as const).map(face => {
        const [top, bottom] = size[face]; const height = bottom - top;
        return <span key={face} className={`banknote-face banknote-${face}`}>
          <img src={`${import.meta.env.BASE_URL}images/banknotes/${value}.jpg`} alt="" draggable={false}
            style={{ top: `${-top / height * 100}%`, height: `${size.height / height * 100}%` }} />
        </span>;
      })}
    </span>
  </span>;
}
