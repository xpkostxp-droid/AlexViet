import { shuffled } from './family';
export type TravelCategory = 'all' | 'countries' | 'geography' | 'words';
export const travelCategories: [TravelCategory, string][] = [['all','Всё вместе'],['countries','Страны'],['geography','География и города'],['words','Слова и вопросы']];
export const travelWords = [
 ['vn','Việt Nam','Вьетнам','countries','🇻🇳'], ['ru','Nga','Россия','countries','🇷🇺'],
 ['cn','Trung Quốc','Китай','countries','🇨🇳'], ['kr','Hàn Quốc','Южная Корея','countries','🇰🇷'],
 ['jp','Nhật Bản','Япония','countries','🇯🇵'], ['la','Lào','Лаос','countries','🇱🇦'],
 ['kh','Campuchia','Камбоджа','countries','🇰🇭'], ['th','Thái Lan','Таиланд','countries','🇹🇭'],
 ['fr','Pháp','Франция','countries','🇫🇷'], ['de','Đức','Германия','countries','🇩🇪'],
 ['gb','Anh','Англия','countries','🇬🇧'], ['it','Ý','Италия','countries','🇮🇹'],
 ['es','Tây Ban Nha','Испания','countries','🇪🇸'], ['us','Mỹ','США','countries','🇺🇸'],
 ['au','Úc','Австралия','countries','🇦🇺'],
 ['asia','Châu Á','Азия','geography',''], ['europe','Châu Âu','Европа','geography',''],
 ['country','nước','Страна','geography',''], ['city','thành phố','Город','geography',''],
 ['capital','thủ đô','Столица','geography',''], ['hanoi','Hà Nội','Ханой','geography',''],
 ['dalat','Đà Lạt','Далат','geography',''],
 ['live','sống','Жить','words',''], ['travel','đi du lịch','Путешествовать','words',''],
 ['arrive','đến','Приезжать / прибывать','words',''], ['from','từ','Из / от','words',''],
 ['origin','đến từ','Быть родом из / приехать из','words',''], ['all','tất cả','Все','words',''],
 ['person','người','Человек','words',''], ['which','nào','Какой / какая','words',''],
 ['which-country','nước nào?','Какая страна?','words',''], ['which-city','thành phố nào?','Какой город?','words',''],
 ['ask-country','Anh đến từ nước nào?','Из какой страны ты приехал?','words',''],
 ['ask-city','Anh đến từ thành phố nào?','Из какого города ты приехал?','words',''],
 ['like-dalat','Em có thích Đà Lạt không?','Тебе нравится Далат?','words',''],
] as const;
export function travelIndices(category: TravelCategory) { return travelWords.map((_,i)=>i).filter(i=>category==='all'||travelWords[i][3]===category); }
export function travelOptions(index: number, pool: number[]) { return shuffled([index,...shuffled(pool.filter(i=>i!==index)).slice(0,5)]); }
