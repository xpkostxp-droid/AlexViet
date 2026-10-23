import { shuffled } from './family';
export type WorkCategory = 'all' | 'people' | 'places' | 'actions';
export const workCategories: [WorkCategory, string][] = [['all', 'Всё вместе'], ['people', 'Профессии'], ['places', 'Места'], ['actions', 'Действия и вопросы']];
export const professionWords = [
 ['doctor','bác sĩ','Врач','people'], ['nurse','y tá','Медсестра / медбрат','people'],
 ['engineer','kỹ sư','Инженер','people'], ['driver','tài xế','Водитель','people'],
 ['teacher','giáo viên','Учитель / преподаватель','people'], ['teacher-woman','cô giáo','Учительница','people'],
 ['teacher-man','thầy giáo','Учитель (мужчина)','people'], ['student','sinh viên','Студент','people'],
 ['secretary','thư ký','Секретарь','people'], ['director','giám đốc','Директор','people'],
 ['boss','sếp','Начальник / босс','people'], ['employee','nhân viên','Сотрудник','people'],
 ['manager','quản lý','Менеджер / управляющий','people'], ['police','công an','Полицейский','people'],
 ['traffic-police','cảnh sát giao thông','Сотрудник дорожной полиции','people'],
 ['bank','ngân hàng','Банк','places'], ['company','công ty','Компания','places'],
 ['construction-company','công ty xây dựng','Строительная компания','places'], ['hospital','bệnh viện','Больница','places'],
 ['restaurant','nhà hàng','Ресторан','places'], ['school','trường','Школа / учебное заведение','places'],
 ['university','trường đại học','Университет','places'],
 ['working','làm việc','Работать','actions'], ['construction','xây dựng','Строительство / строить','actions'],
 ['driving','lái xe','Водить машину','actions'], ['ask-job','Anh làm nghề gì?','Кем вы работаете?','actions'],
 ['ask-place','Anh làm việc ở đâu?','Где вы работаете?','actions'], ['doing','làm','Делать','actions'],
 ['work','công việc','Работа','actions'],
] as const;
export function workIndices(category: WorkCategory) { return professionWords.map((_, i) => i).filter(i => category === 'all' || professionWords[i][3] === category); }
export function workOptions(index: number, pool: number[]) { return shuffled([index, ...shuffled(pool.filter(i => i !== index)).slice(0, 5)]); }
