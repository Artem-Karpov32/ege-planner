// Данные по предметам ЕГЭ
const subjectsData = {
  math: {
    name: "Математика (профиль)",
    maxScore: 32,
    topics: [
      {
        id: "math-01",
        name: "Геометрия на плоскости (планиметрия)",
        link: "https://3.shkolkovo.online/catalog/142",
        score: 1,
        timeRequired: 120,
        difficulty: 1
      },
      {
        id: "math-02",
        name: "Задачи на векторы",
        link: "https://3.shkolkovo.online/catalog/7781",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "math-03",
        name: "Геометрия в пространстве (стереометрия)",
        link: "https://3.shkolkovo.online/catalog/84",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "math-04",
        name: "Введение в теорию вероятностей",
        link: "https://3.shkolkovo.online/catalog/7778",
        score: 1,
        timeRequired: 120,
        difficulty: 1
      },
      {
        id: "math-05",
        name: "Задачи на теорию вероятностей",
        link: "https://3.shkolkovo.online/catalog/6776",
        score: 1,
        timeRequired: 120,
        difficulty: 1
      },
      {
        id: "math-06",
        name: "Решение уравнений",
        link: "https://3.shkolkovo.online/catalog/7779",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "math-07",
        name: "Преобразование числовых и буквенных выражений",
        link: "https://3.shkolkovo.online/catalog/7790",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "math-08",
        name: "Взаимосвязь функции и ее производной",
        link: "https://3.shkolkovo.online/catalog/6775",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "math-09",
        name: "Задачи прикладного характера",
        link: "https://3.shkolkovo.online/catalog/6774",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "math-10",
        name: "Сюжетные текстовые задачи",
        link: "https://3.shkolkovo.online/catalog/7801",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "math-11",
        name: "Задачи на свойства графиков функций",
        link: "https://3.shkolkovo.online/catalog/6778",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "math-12",
        name: "Исследование функций с помощью производной",
        link: "https://3.shkolkovo.online/catalog/111",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "math-13",
        name: "Решение уравнений",
        link: "https://3.shkolkovo.online/catalog/112",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "math-14",
        name: "Задачи по стереометрии",
        link: "https://3.shkolkovo.online/catalog/155",
        score: 3,
        timeRequired: 240,
        difficulty: 4
      },
      {
        id: "math-15",
        name: "Решение неравенств",
        link: "https://3.shkolkovo.online/catalog/122",
        score: 2,
        timeRequired: 65,
        difficulty: 2
      },
      {
        id: "math-16",
        name: "Сложные задачи прикладного характера",
        link: "https://3.shkolkovo.online/catalog/131",
        score: 2,
        timeRequired: 360,
        difficulty: 5
      },
      {
        id: "math-17",
        name: "Задачи по планиметрии",
        link: "https://3.shkolkovo.online/catalog/135",
        score: 3,
        timeRequired: 300,
        difficulty: 4
      },
      {
        id: "math-18",
        name: "Задачи с параметром",
        link: "https://3.shkolkovo.online/catalog/136",
        score: 4,
        timeRequired: 360,
        difficulty: 5
      },
      {
        id: "math-19",
        name: "Задачи на теорию чисел",
        link: "https://3.shkolkovo.online/catalog/203",
        score: 4,
        timeRequired: 420,
        difficulty: 5
      }
    ],
    conversionTable: [
      { min: 0, max: 6, score: 0 },
      { min: 7, max: 11, score: 20 },
      { min: 12, max: 16, score: 40 },
      { min: 17, max: 20, score: 60 },
      { min: 21, max: 25, score: 70 },
      { min: 26, max: 28, score: 80 },
      { min: 29, max: 31, score: 90 },
      { min: 32, max: 32, score: 100 }
    ]
  },

  physics: {
    name: "Физика",
    maxScore: 45,
    topics: [
      {
        id: "physics-01",
        name: "Кинематика",
        link: "https://3.shkolkovo.online/catalog/1655",
        score: 1,
        timeRequired: 60,
        difficulty: 1
      },
      {
        id: "physics-02",
        name: "Динамика",
        link: "https://3.shkolkovo.online/catalog/1660",
        score: 1,
        timeRequired: 120,
        difficulty: 1
      },
      {
        id: "physics-03",
        name: "Импульс. Законы сохранения в механике",
        link: "https://3.shkolkovo.online/catalog/1666",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-04",
        name: "Статика. Гидростатика. Механические колебания и волны",
        link: "https://3.shkolkovo.online/catalog/1674",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-05",
        name: "Механика (анализ физических процессов - выбор верных утверждений)",
        link: "https://3.shkolkovo.online/catalog/1680",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-06",
        name: "Механика (изменение физических величин в процессах и установление соответствия)",
        link: "https://3.shkolkovo.online/catalog/1687",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-07",
        name: "Молекулярная физика",
        link: "https://3.shkolkovo.online/catalog/1701",
        score: 1,
        timeRequired: 60,
        difficulty: 1
      },
      {
        id: "physics-08",
        name: "Термодинамика",
        link: "https://3.shkolkovo.online/catalog/1706",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-09",
        name: "МКТ и Термодинамика (анализ физических процессов - выбор верных утверждений)",
        link: "https://3.shkolkovo.online/catalog/1714",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-10",
        name: "МКТ и Термодинамика (изменение физических величин в процессах, установление соответствия)",
        link: "https://3.shkolkovo.online/catalog/1719",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-11",
        name: "Электрическое поле. Законы постоянного тока",
        link: "https://3.shkolkovo.online/catalog/1724",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-12",
        name: "Магнитное поле. Электромагнитная индукция",
        link: "https://3.shkolkovo.online/catalog/1730",
        score: 1,
        timeRequired: 75,
        difficulty: 1
      },
      {
        id: "physics-13",
        name: "Оптика. Электромагнитные колебания и волны",
        link: "https://3.shkolkovo.online/catalog/1735",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-14",
        name: "Электродинамика (аналир физических процессов - выбор верных утверждений)",
        link: "https://3.shkolkovo.online/catalog/1741",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-15",
        name: "Электродинамика (изменение физических величин в процессах и установление соответствия)",
        link: "https://3.shkolkovo.online/catalog/1745",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-16",
        name: "Квантовая физика",
        link: "https://3.shkolkovo.online/catalog/1754",
        score: 1,
        timeRequired: 85,
        difficulty: 1
      },
      {
        id: "physics-17",
        name: "Квантовая физика (изменение физических величин в процессах, установление соответствия)",
        link: "https://3.shkolkovo.online/catalog/1761",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-18",
        name: "Выбор верных утверждений. Физический смысл физических величин, законов и закономерностей",
        link: "https://3.shkolkovo.online/catalog/1652",
        score: 1,
        timeRequired: 70,
        difficulty: 1
      },
      {
        id: "physics-19",
        name: "Определение показаний измерительных приборов",
        link: "https://3.shkolkovo.online/catalog/1767",
        score: 1,
        timeRequired: 70,
        difficulty: 1
      },
      {
        id: "physics-20",
        name: "Планирование эксперимента",
        link: "https://3.shkolkovo.online/catalog/1770",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-21",
        name: "Качественная задача",
        link: "https://3.shkolkovo.online/catalog/1773",
        score: 2,
        timeRequired: 60,
        difficulty: 1
      },
      {
        id: "physics-22",
        name: "Механика. МКТ и термодинамика (Расчетная задача)",
        link: "https://3.shkolkovo.online/catalog/7695",
        score: 2,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-23",
        name: "МКТ и Термодинамика. Электродинамика (Расчетная задача)",
        link: "https://3.shkolkovo.online/catalog/1784",
        score: 3,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "physics-24",
        name: "МКТ. Термодинамика (Расчетная задача высокого уровня сложности)",
        link: "https://3.shkolkovo.online/catalog/1795",
        score: 3,
        timeRequired: 240,
        difficulty: 5
      },
      {
        id: "physics-25",
        name: "Электродинамика (Расчетная задача высокого уровня сложности)",
        link: "https://3.shkolkovo.online/catalog/1801",
        score: 3,
        timeRequired: 180,
        difficulty: 4
      },
      {
        id: "physics-26",
        name: "Механика (Расчетная задача высокого уровня сложности+обоснование)",
        link: "https://3.shkolkovo.online/catalog/1817",
        score: 4,
        timeRequired: 360,
        difficulty: 5
      }
    ],
    conversionTable: [
      { min: 0, max: 10, score: 0 },
      { min: 11, max: 20, score: 30 },
      { min: 21, max: 30, score: 50 },
      { min: 31, max: 40, score: 70 },
      { min: 41, max: 45, score: 100 }
    ]
  },

  informatics: {
    name: "Информатика",
    maxScore: 29,
    topics: [
      {
        id: "informatics-01",
        name: "Графы – матрица смежности",
        link: "https://3.shkolkovo.online/catalog/4411",
        score: 1,
        timeRequired: 60,
        difficulty: 1
      },
      {
        id: "informatics-02",
        name: "Алгебра логики – таблицы истинности",
        link: "https://3.shkolkovo.online/catalog/5594",
        score: 1,
        timeRequired: 75,
        difficulty: 1
      },
      {
        id: "informatics-03",
        name: "Поиск информации в базе данных",
        link: "https://3.shkolkovo.online/catalog/5596",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "informatics-04",
        name: "Кодирование и декодирование – условие Фано",
        link: "https://3.shkolkovo.online/catalog/4414",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "informatics-05",
        name: "Алгоритмы – анализ простейших алгоритмов",
        link: "https://3.shkolkovo.online/catalog/4433",
        score: 1,
        timeRequired: 80,
        difficulty: 1
      },
      {
        id: "informatics-06",
        name: "Алгоритмы – определение результата",
        link: "https://3.shkolkovo.online/catalog/5606",
        score: 1,
        timeRequired: 160,
        difficulty: 3
      },
      {
        id: "informatics-07",
        name: "Кодирование и декодирование – передача и хранение информации",
        link: "https://3.shkolkovo.online/catalog/4358",
        score: 1,
        timeRequired: 60,
        difficulty: 1
      },
      {
        id: "informatics-08",
        name: "Комбинаторика",
        link: "https://3.shkolkovo.online/catalog/4425",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "informatics-09",
        name: "Работа с электронными таблицами",
        link: "https://3.shkolkovo.online/catalog/4518",
        score: 1,
        timeRequired: 60,
        difficulty: 1
      },
      {
        id: "informatics-10",
        name: "Поиск информации в текстовом документе",
        link: "https://3.shkolkovo.online/catalog/4417",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "informatics-11",
        name: "Кодирование и декодирование – вычисление количества информации",
        link: "https://3.shkolkovo.online/catalog/4365",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "informatics-12",
        name: "Алгоритмы – анализ сложных алгоритмов",
        link: "https://3.shkolkovo.online/catalog/4522",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "informatics-13",
        name: "Организация компьютерных сетей",
        link: "https://3.shkolkovo.online/catalog/6404",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "informatics-14",
        name: "Системы счисления",
        link: "https://3.shkolkovo.online/catalog/4435",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "informatics-15",
        name: "Алгебра логики – преобразование логических выражений",
        link: "https://3.shkolkovo.online/catalog/4445",
        score: 1,
        timeRequired: 120,
        difficulty: 2
      },
      {
        id: "informatics-16",
        name: "Рекурсивные алгоритмы",
        link: "https://3.shkolkovo.online/catalog/4419",
        score: 1,
        timeRequired: 60,
        difficulty: 2
      },
      {
        id: "informatics-17",
        name: "Обработка числовой последовательности",
        link: "https://3.shkolkovo.online/catalog/4498",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "informatics-18",
        name: "Работа с электронными таблицами",
        link: "https://3.shkolkovo.online/catalog/4397",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "informatics-19",
        name: "Теория игр 1",
        link: "https://3.shkolkovo.online/catalog/4499",
        score: 1,
        timeRequired: 45,
        difficulty: 1
      },
      {
        id: "informatics-20",
        name: "Теория игр 2",
        link: "https://3.shkolkovo.online/catalog/6758",
        score: 1,
        timeRequired: 45,
        difficulty: 1
      },
      {
        id: "informatics-21",
        name: "Теория игр 3",
        link: "https://3.shkolkovo.online/catalog/6759",
        score: 1,
        timeRequired: 45,
        difficulty: 1
      },
      {
        id: "informatics-22",
        name: "Многопроцессорные системы",
        link: "https://3.shkolkovo.online/catalog/5626",
        score: 1,
        timeRequired: 180,
        difficulty: 3
      },
      {
        id: "informatics-23",
        name: "Оператор присваивания и ветвления",
        link: "https://3.shkolkovo.online/catalog/4493",
        score: 1,
        timeRequired: 75,
        difficulty: 1
      },
      {
        id: "informatics-24",
        name: "Обработка символьной информации",
        link: "https://3.shkolkovo.online/catalog/4306",
        score: 1,
        timeRequired: 300,
        difficulty: 4
      },
      {
        id: "informatics-25",
        name: "Обработка целочисленной информации",
        link: "https://3.shkolkovo.online/catalog/4450",
        score: 1,
        timeRequired: 120,
        difficulty: 4
      },
      {
        id: "informatics-26",
        name: "Обработка целочисленной информации с использованием сортировки",
        link: "https://3.shkolkovo.online/catalog/4400",
        score: 2,
        timeRequired: 180,
        difficulty: 4
      },
      {
        id: "informatics-27",
        name: "Анализ данных",
        link: "https://3.shkolkovo.online/catalog/7830",
        score: 2,
        timeRequired: 120,
        difficulty: 4
      }
    ],
    conversionTable: [
      { min: 0, max: 5, score: 0 },
      { min: 6, max: 11, score: 30 },
      { min: 12, max: 17, score: 50 },
      { min: 18, max: 22, score: 70 },
      { min: 23, max: 29, score: 100 }
    ]
  }
};

// Функция для получения данных о предмете
function getSubjectData(subjectId) {
  return subjectsData[subjectId];
}

// Функция для получения всех выбранных предметов
function getSelectedSubjects(selectedIds) {
  return selectedIds.map(id => subjectsData[id]);
}