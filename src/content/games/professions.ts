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
 ['driving','lái xe','Водить машину','actions'], ['ask-job','Làm nghề gì?','Кем работаете?','actions'],
 ['ask-place','Làm việc ở đâu?','Где работаете?','actions'], ['doing','làm','Делать','actions'],
 ['work','công việc','Работа','actions'],
] as const;
export function workIndices(category: WorkCategory) { return professionWords.map((_, i) => i).filter(i => category === 'all' || professionWords[i][3] === category); }
export function workOptions(index: number, pool: number[]) { return shuffled([index, ...shuffled(pool.filter(i => i !== index)).slice(0, 5)]); }

export type WorkBlitzGroup = 'professions' | 'work';
export type WorkTask = { index: number; reverse: boolean };
export const workBlitzGroups = [
  { id: 'professions' as const, label: 'Профессии', words: 15 },
  { id: 'work' as const, label: 'Места, действия и вопросы', words: 14 },
];
export function workBlitzPool(group: WorkBlitzGroup) {
  return workIndices('all').filter(i => group === 'professions' ? professionWords[i][3] === 'people' : professionWords[i][3] !== 'people');
}
export function workBlitzTasks(group: WorkBlitzGroup): WorkTask[] {
  return shuffled(workBlitzPool(group).flatMap(index => [{ index, reverse: false }, { index, reverse: true }]));
}
export function workBlitzAnswer(task: WorkTask): string { return professionWords[task.index][task.reverse ? 2 : 1]; }
const questionDistractors = [
  ['Làm việc khi nào?', 'Когда работаете?'],
  ['Làm việc với ai?', 'С кем работаете?'],
] as const;
export function workBlitzOptions(task: WorkTask, group: WorkBlitzGroup): string[] {
  const word = professionWords[task.index];
  const correct = workBlitzAnswer(task);
  if (word[0] === 'ask-job' || word[0] === 'ask-place') {
    const other = professionWords.find(w => w[0] === (word[0] === 'ask-job' ? 'ask-place' : 'ask-job'))!;
    const candidates = [other[task.reverse ? 2 : 1], ...questionDistractors.map(w => w[task.reverse ? 1 : 0])];
    return shuffled([correct, ...shuffled(candidates).slice(0, 2)]);
  }
  const teachers = ['teacher', 'teacher-man', 'teacher-woman'];
  const candidates = workBlitzPool(group).filter(i => i !== task.index
    && !professionWords[i][0].startsWith('ask-')
    && !(teachers.includes(word[0]) && teachers.includes(professionWords[i][0])));
  return shuffled([correct, ...shuffled(candidates).slice(0, 2).map(i => professionWords[i][task.reverse ? 2 : 1])]);
}
