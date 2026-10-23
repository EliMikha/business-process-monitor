import { STATUS } from './statuses.js';

// Все процессы, этапы и имена являются условными учебными данными.
export const employees = [
  { id: 'employee-anna', name: 'Анна Сергеева' },
  { id: 'employee-mikhail', name: 'Михаил Орлов' },
  { id: 'employee-elena', name: 'Елена Соколова' },
];

export const initialProcesses = [
  {
    id: 'order',
    name: 'Обработка заказа',
    description: 'Контроль выполнения заказа от получения заявки до передачи клиенту.',
    responsible_id: 'employee-anna',
    stages: [
      { id: 'order-request', name: 'Получение заявки', description: 'Зарегистрировать поступившую заявку.', order: 1 },
      { id: 'order-confirmation', name: 'Подтверждение заказа', description: 'Уточнить состав и условия заказа.', order: 2 },
      { id: 'order-preparation', name: 'Подготовка к отправке', description: 'Подготовить заказ к передаче.', order: 3 },
      { id: 'order-delivery', name: 'Передача клиенту', description: 'Передать готовый заказ клиенту.', order: 4 },
    ],
    status: STATUS.IN_PROGRESS,
    progress: 50,
    current_stage_id: 'order-preparation',
  },
  {
    id: 'purchase',
    name: 'Согласование закупки',
    description: 'Контроль согласования заявки на приобретение товаров или услуг.',
    responsible_id: 'employee-mikhail',
    stages: [
      { id: 'purchase-request', name: 'Формирование заявки', description: 'Определить предмет и объём закупки.', order: 1 },
      { id: 'purchase-budget', name: 'Проверка бюджета', description: 'Проверить доступный бюджет.', order: 2 },
      { id: 'purchase-approval', name: 'Согласование', description: 'Согласовать подготовленную заявку.', order: 3 },
      { id: 'purchase-placement', name: 'Оформление закупки', description: 'Оформить согласованную закупку.', order: 4 },
    ],
    status: STATUS.BLOCKED,
    progress: 40,
    current_stage_id: 'purchase-budget',
  },
  {
    id: 'hire',
    name: 'Приём сотрудника',
    description: 'Контроль оформления и начала работы нового сотрудника.',
    responsible_id: 'employee-elena',
    stages: [
      { id: 'hire-documents', name: 'Подготовка документов', description: 'Подготовить документы для оформления.', order: 1 },
      { id: 'hire-contract', name: 'Оформление договора', description: 'Оформить необходимые договорённости.', order: 2 },
      { id: 'hire-start', name: 'Выход сотрудника', description: 'Организовать первый рабочий день.', order: 3 },
      { id: 'hire-adaptation', name: 'Завершение адаптации', description: 'Подвести итоги вводного периода.', order: 4 },
    ],
    status: STATUS.NOT_STARTED,
    progress: 0,
    current_stage_id: 'hire-documents',
  },
];

export function getEmployeeName(id) {
  return employees.find((employee) => employee.id === id)?.name ?? 'Ответственный не указан';
}
