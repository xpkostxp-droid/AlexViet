import { shuffled } from './family';
export type RestaurantCategory = 'all' | 'items' | 'order' | 'phrases';
export const restaurantCategories: [RestaurantCategory,string][] = [['items','Посуда и предметы'],['order','Еда и заказ'],['phrases','Фразы в ресторане']];
export const restaurantWords = [
 [
  "restaurant-1",
  "bát",
  "Миска / пиала",
  "items",
  "🥣"
 ],
 [
  "restaurant-2",
  "đĩa",
  "Тарелка",
  "items",
  "🍽️"
 ],
 [
  "restaurant-3",
  "đũa",
  "Палочки для еды",
  "items",
  "🥢"
 ],
 [
  "restaurant-4",
  "nĩa",
  "Вилка",
  "items",
  "🍴"
 ],
 [
  "restaurant-5",
  "thìa / muỗng",
  "Ложка",
  "items",
  "🥄"
 ],
 [
  "restaurant-6",
  "dao",
  "Нож",
  "items",
  "🔪"
 ],
 [
  "restaurant-7",
  "cốc / ly",
  "Стакан",
  "items",
  "🥛"
 ],
 [
  "restaurant-8",
  "ly rượu vang",
  "Бокал для вина",
  "items",
  "🍷"
 ],
 [
  "restaurant-9",
  "chai",
  "Бутылка",
  "items",
  "🍾"
 ],
 [
  "restaurant-10",
  "ấm",
  "Чайник",
  "items",
  "🫖"
 ],
 [
  "restaurant-11",
  "khăn giấy",
  "Бумажная салфетка",
  "items",
  "🧻"
 ],
 [
  "restaurant-12",
  "khăn ướt",
  "Влажная салфетка",
  "items",
  "💧"
 ],
 [
  "restaurant-13",
  "bàn",
  "Стол",
  "items",
  "🪑"
 ],
 [
  "restaurant-14",
  "ghế",
  "Стул",
  "items",
  "🪑"
 ],
 [
  "restaurant-15",
  "thực đơn",
  "Меню",
  "items",
  "📋"
 ],
 [
  "restaurant-16",
  "hóa đơn",
  "Счёт / чек",
  "items",
  "🧾"
 ],
 [
  "restaurant-17",
  "nhà hàng",
  "Ресторан",
  "order",
  "🍽️"
 ],
 [
  "restaurant-18",
  "nhân viên phục vụ",
  "Официант",
  "order",
  "🧑‍💼"
 ],
 [
  "restaurant-19",
  "đầu bếp",
  "Повар",
  "order",
  "🧑‍🍳"
 ],
 [
  "restaurant-20",
  "món ăn",
  "Блюдо",
  "order",
  "🍲"
 ],
 [
  "restaurant-21",
  "gọi món",
  "Заказывать еду",
  "order",
  "📋"
 ],
 [
  "restaurant-22",
  "ăn",
  "Есть",
  "order",
  "🍜"
 ],
 [
  "restaurant-23",
  "uống",
  "Пить",
  "order",
  "🥤"
 ],
 [
  "restaurant-24",
  "nước lọc",
  "Питьевая вода без добавок",
  "order",
  "💧"
 ],
 [
  "restaurant-25",
  "đá",
  "Лёд",
  "order",
  "🧊"
 ],
 [
  "restaurant-26",
  "rượu vang",
  "Вино",
  "order",
  "🍷"
 ],
 [
  "restaurant-27",
  "rượu vang đỏ",
  "Красное вино",
  "order",
  "🍷"
 ],
 [
  "restaurant-28",
  "rượu vang trắng",
  "Белое вино",
  "order",
  "🥂"
 ],
 [
  "restaurant-29",
  "chai rượu vang",
  "Бутылка вина",
  "order",
  "🍾"
 ],
 [
  "restaurant-30",
  "muối",
  "Соль",
  "order",
  "🧂"
 ],
 [
  "restaurant-31",
  "tiêu",
  "Перец — приправа",
  "order",
  "⚫"
 ],
 [
  "restaurant-32",
  "ớt",
  "Перец чили",
  "order",
  "🌶️"
 ],
 [
  "restaurant-33",
  "nước mắm",
  "Рыбный соус",
  "order",
  "🐟"
 ],
 [
  "restaurant-34",
  "ngon",
  "Вкусный",
  "order",
  "😋"
 ],
 [
  "restaurant-35",
  "cay",
  "Острый",
  "order",
  "🌶️"
 ],
 [
  "restaurant-36",
  "nóng",
  "Горячий",
  "order",
  "♨️"
 ],
 [
  "restaurant-37",
  "lạnh",
  "Холодный",
  "order",
  "❄️"
 ],
 [
  "restaurant-38",
  "tính tiền",
  "Рассчитываться / просить расчёт",
  "order",
  "🧾"
 ],
 [
  "restaurant-39",
  "thanh toán",
  "Оплачивать",
  "order",
  "💳"
 ],
 [
  "restaurant-40",
  "mang về",
  "С собой / унести домой",
  "order",
  "🛍️"
 ],
 [
  "restaurant-41",
  "gói lại",
  "Упаковать",
  "order",
  "📦"
 ],
 [
  "restaurant-42",
  "Cho tôi xem thực đơn.",
  "Покажите мне меню.",
  "phrases",
  "📋"
 ],
 [
  "restaurant-43",
  "Cho tôi một cốc nước.",
  "Дайте мне стакан воды.",
  "phrases",
  "💧"
 ],
 [
  "restaurant-44",
  "Cho tôi thêm đá, làm ơn.",
  "Принесите ещё льда, пожалуйста.",
  "phrases",
  "🧊"
 ],
 [
  "restaurant-45",
  "Cho tôi xin muối và tiêu.",
  "Принесите соль и перец, пожалуйста.",
  "phrases",
  "🧂"
 ],
 [
  "restaurant-46",
  "Không cay nhé.",
  "Не остро, пожалуйста.",
  "phrases",
  "🌶️"
 ],
 [
  "restaurant-47",
  "Không đá nhé.",
  "Без льда, пожалуйста.",
  "phrases",
  "🧊"
 ],
 [
  "restaurant-48",
  "Cho tôi thêm một đôi đũa.",
  "Дайте мне ещё одну пару палочек.",
  "phrases",
  "🥢"
 ],
 [
  "restaurant-49",
  "Cho tôi một ly rượu vang.",
  "Мне бокал вина, пожалуйста.",
  "phrases",
  "🍷"
 ],
 [
  "restaurant-50",
  "Cho tôi xin một ly để uống rượu vang.",
  "Принесите бокал для вина, пожалуйста.",
  "phrases",
  "🍷"
 ],
 [
  "restaurant-51",
  "Nhà hàng có những loại rượu vang nào?",
  "Какие виды вина у вас есть?",
  "phrases",
  "🍾"
 ],
 [
  "restaurant-52",
  "Có rượu vang đỏ không?",
  "Есть красное вино?",
  "phrases",
  "🍷"
 ],
 [
  "restaurant-53",
  "Một chai này giá bao nhiêu?",
  "Сколько стоит эта бутылка?",
  "phrases",
  "🍾"
 ],
 [
  "restaurant-54",
  "Nhà vệ sinh ở đâu?",
  "Где туалет?",
  "phrases",
  "🚻"
 ],
 [
  "restaurant-55",
  "Cho tôi tính tiền.",
  "Рассчитайте меня, пожалуйста.",
  "phrases",
  "🧾"
 ],
 [
  "restaurant-56",
  "Cho tôi xin hóa đơn.",
  "Принесите счёт / чек, пожалуйста.",
  "phrases",
  "🧾"
 ],
 [
  "restaurant-57",
  "Cho tôi mang về.",
  "Мне с собой, пожалуйста.",
  "phrases",
  "🛍️"
 ],
 [
  "restaurant-58",
  "Mang về nhé.",
  "С собой, пожалуйста.",
  "phrases",
  "🛍️"
 ],
 [
  "restaurant-59",
  "Gói lại giúp tôi.",
  "Упакуйте, пожалуйста.",
  "phrases",
  "📦"
 ],
 [
  "restaurant-60",
  "Gói món này cho tôi mang về.",
  "Упакуйте это блюдо мне с собой.",
  "phrases",
  "🥡"
 ]
] as const;
export function restaurantIndices(category: RestaurantCategory) { return restaurantWords.map((_,i)=>i).filter(i=>category==='all'||restaurantWords[i][3]===category); }
const synonyms = [['Cho tôi mang về.', 'Mang về nhé.'], ['Gói lại giúp tôi.', 'Gói món này cho tôi mang về.']];
export function restaurantOptions(index:number,pool:number[]) { const vi=restaurantWords[index][1];return shuffled([index,...shuffled(pool.filter(i=>i!==index&&!synonyms.some(g=>g.includes(vi)&&g.includes(restaurantWords[i][1])))).slice(0,5)]); }
export function restaurantSpeech(index:number) { return restaurantWords[index][1].split(' / ')[0]; }
