// Глобальные переменные
let userData = {
    subjects: [],
    daysUntilExam: 0,
    dailyTime: 0,
    studyMode: '',
    noWeekends: false,
    priorities: {}
};

let currentStep = 0;

// Функция для полного сброса приложения 
function resetApp() {
    // Сбрасываем глобальные переменные
    userData = {
        subjects: [],
        daysUntilExam: 0,
        dailyTime: 0,
        studyMode: '',
        noWeekends: false,
        priorities: {}
    };
    
    window.currentPlan = null;
    currentStep = 0;
    
    // Сбрасываем форму
    document.querySelectorAll('input[name="subject"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('daysUntilExam').value = '';
    document.getElementById('dailyTime').value = '';
    
    document.querySelectorAll('input[name="studyMode"]').forEach(radio => {
        radio.checked = false;
    });
    
    document.querySelector('input[name="noWeekends"]').checked = false;
    
    // Переход к первому шагу
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => step.classList.remove('active'));
    formSteps[0].classList.add('active');
    
    // Обновляем прогресс-бар
    updateProgressBar();
    
    // Очищаем результаты
    document.getElementById('calendarView').innerHTML = '';
    document.getElementById('subjectsDetails').innerHTML = '';
    document.getElementById('summaryText').innerHTML = '';
    document.getElementById('scorePrediction').innerHTML = '';
}

// Делаем функцию доступной глобально
window.resetApp = resetApp;

// Функция инициализации приложения
function initApp() {
    // Элементы DOM
    const form = document.getElementById('planForm');
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const exportBtn = document.getElementById('exportBtn');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const newPlanBtn = document.getElementById('newPlanBtn');
    
    // Инициализация прогресс-бара
    updateProgressBar();
    
    // Обработчики для кнопок навигации
    nextBtns.forEach(btn => {
        btn.addEventListener('click', goToNextStep);
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', goToPrevStep);
    });
    
    // Обработчики для выбора предметов
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleSubjectSelection);
    });
    
    // Обработчики для распределения занятий
    const modeRadios = document.querySelectorAll('input[name="studyMode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', handleDistributionChange);
    });
    
    const weekendCheckbox = document.querySelector('input[name="noWeekends"]');
    weekendCheckbox.addEventListener('change', handleDistributionChange);
    
    // Обработчик для экспорта
    exportBtn.addEventListener('click', exportPlan);
    
    // Обработчик для сохранения плана
    savePlanBtn.addEventListener('click', async () => {
        if (window.currentPlan) {
            try {
                // Добавляем метку времени к плану
                window.currentPlan.savedAt = new Date().toISOString();
            
                await savePlan(window.currentPlan);
                alert('План успешно сохранен в облаке!');
            
                // Прячем кнопку загрузки плана, так как теперь план загружается автоматически
                const savedPlanSection = document.getElementById('savedPlanSection');
                if (savedPlanSection) {
                    savedPlanSection.style.display = 'none';
                }
            } catch (error) {
                alert('Ошибка при сохранении плана: ' + error.message);
            }
        } else {
            alert('Сначала создайте план');
        }
    });
    
    // Обработчик для создания нового плана
    newPlanBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите создать новый план? Текущий прогресс будет сброшен.')) {
            // Сброс данных
            userData = {
                subjects: [],
                daysUntilExam: 0,
                dailyTime: 0,
                studyMode: '',
                noWeekends: false,
                priorities: {}
            };
            
            // Сброс формы
            document.querySelectorAll('input[name="subject"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            document.getElementById('daysUntilExam').value = '';
            document.getElementById('dailyTime').value = '';
            
            document.querySelectorAll('input[name="studyMode"]').forEach(radio => {
                radio.checked = false;
            });
            
            document.querySelector('input[name="noWeekends"]').checked = false;
            
            // Переход к первому шагу
            const formSteps = document.querySelectorAll('.form-step');
            formSteps.forEach(step => step.classList.remove('active'));
            formSteps[0].classList.add('active');
            
            currentStep = 0;
            updateProgressBar();
        }
    });
    
    // Инициализация табов
    initTabs();
    
    // Добавляем обработчики для новых кнопок
    document.getElementById('printCalendarBtn').addEventListener('click', printCalendar);
    document.getElementById('exportCalendarPdfBtn').addEventListener('click', exportCalendarToPdf);
    document.getElementById('printDetailsBtn').addEventListener('click', printDetails);
    document.getElementById('exportDetailsPdfBtn').addEventListener('click', exportDetailsToPdf);
}

// Функция для получения данных о предмете
function getSubjectData(subjectId) {
    return subjectsData[subjectId];
}

// Функция для получения всех выбранных предметов
function getSelectedSubjects(selectedIds) {
    return selectedIds.map(id => subjectsData[id]);
}

// Конвертация первичного балла в тестовый
function convertPrimaryToTest(primaryScore, conversionTable) {
    // Округляем первичный балл вниз до целого числа
    const roundedScore = Math.floor(primaryScore);
    
    for (const range of conversionTable) {
        if (roundedScore >= range.min && roundedScore <= range.max) {
            return range.score;
        }
    }
    return 0;
}

// Обновление прогресс-бара
function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Переход к следующему шагу
function goToNextStep() {
    // Валидация текущего шага
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Сохранение данных с текущего шага
    saveStepData(currentStep);
    
    // Скрытие текущего шага
    const formSteps = document.querySelectorAll('.form-step');
    formSteps[currentStep].classList.remove('active');
    
    // Увеличение счетчика шага
    currentStep++;
    
    // Особые действия перед показом следующего шага
    if (currentStep === 3) { // Шаг приоритетов
        initPriorityStep();
    } else if (currentStep === 4) { // Шаг результатов
        generatePlan();
    }
    
    // Показ следующего шага
    formSteps[currentStep].classList.add('active');
    
    // Обновление прогресс-бара
    updateProgressBar();
}

// Переход к предыдущему шагу
function goToPrevStep() {
    // Скрытие текущего шага
    const formSteps = document.querySelectorAll('.form-step');
    formSteps[currentStep].classList.remove('active');
    
    // Уменьшение счетчика шага
    currentStep--;
    
    // Показ предыдущего шага
    formSteps[currentStep].classList.add('active');
    
    // Обновление прогресс-бара
    updateProgressBar();
}

// Валидация шага
function validateStep(stepIndex) {
    switch(stepIndex) {
        case 0: // Выбор предметов
            const selectedSubjects = document.querySelectorAll('input[name="subject"]:checked');
            if (selectedSubjects.length === 0) {
                alert('Пожалуйста, выберите хотя бы один предмет');
                return false;
            }
            return true;
            
        case 1: // Время подготовки
            const days = parseInt(document.getElementById('daysUntilExam').value);
            const dailyTime = parseFloat(document.getElementById('dailyTime').value);
            
            if (isNaN(days) || days < 1) {
                alert('Пожалуйста, введите корректное количество дней');
                return false;
            }
            
            if (isNaN(dailyTime) || dailyTime < 0.5) {
                alert('Пожалуйста, введите корректное количество времени в день');
                return false;
            }
            
            // Предупреждение о большом количестве часов
            if (dailyTime > 6) {
                if (!confirm('Вы указали больше 6 часов в день. Это может привести к переутомлению. Вы уверены?')) {
                    return false;
                }
            }
            
            if (days < 60) {
                if (!confirm('Рекомендуется планировать подготовку минимум за 2 месяца. Вы уверены, что хотите продолжить?')) {
                    return false;
                }
            }
            
            return true;
            
        case 2: // Распределение по дням
            const selectedMode = document.querySelector('input[name="studyMode"]:checked');
            const noWeekends = document.querySelector('input[name="noWeekends"]').checked;
            
            if (!selectedMode) {
                alert('Пожалуйста, выберите режим занятий');
                return false;
            }
            
            if (!noWeekends) {
                if (!confirm('Вы не исключили выходные дни. Это значит, что занятия будут запланированы и на выходные. Вы уверены?')) {
                    return false;
                }
            }
            
            return true;
            
        default:
            return true;
    }
}

// Сохранение данных шага
function saveStepData(stepIndex) {
    switch(stepIndex) {
        case 0: // Выбор предметов
            userData.subjects = Array.from(document.querySelectorAll('input[name="subject"]:checked'))
                .map(checkbox => checkbox.value);
            break;
            
        case 1: // Время подготовки
            userData.daysUntilExam = parseInt(document.getElementById('daysUntilExam').value);
            userData.dailyTime = parseFloat(document.getElementById('dailyTime').value);
            break;
            
        case 2: // Распределение по дням
            userData.studyMode = document.querySelector('input[name="studyMode"]:checked').value;
            userData.noWeekends = document.querySelector('input[name="noWeekends"]').checked;
            break;
            
        case 3: // Приоритеты
            const prioritySliders = document.querySelectorAll('.priority-slider');
            prioritySliders.forEach(slider => {
                userData.priorities[slider.dataset.subject] = parseInt(slider.value);
            });
            break;
    }
}

// Обработчик выбора предметов
function handleSubjectSelection() {
    const selectedCount = document.querySelectorAll('input[name="subject"]:checked').length;
    
    // Обновление UI в зависимости от количества выбранных предметов
    if (selectedCount > 3) {
        alert('Рекомендуется выбирать не более 3 предметов для эффективной подготовки');
    }
}

// Обработчик изменения распределения
function handleDistributionChange() {
    // Можно добавить логику для динамического обновления UI
}

// Инициализация шага приоритетов
function initPriorityStep() {
    const priorityContainer = document.getElementById('prioritySubjects');
    priorityContainer.innerHTML = '';
    
    userData.subjects.forEach(subjectId => {
        const subjectData = getSubjectData(subjectId);
        
        const priorityItem = document.createElement('div');
        priorityItem.className = 'priority-item';
        priorityItem.innerHTML = `
            <input type="checkbox" id="priority-${subjectId}" name="priority" value="${subjectId}">
            <label for="priority-${subjectId}">${subjectData.name}</label>
            <input type="range" class="priority-slider" data-subject="${subjectId}" min="1" max="5" value="3">
            <span class="priority-value">3</span>
        `;
        
        priorityContainer.appendChild(priorityItem);
    });
    
    // Обработчики для ползунков приоритетов
    const sliders = document.querySelectorAll('.priority-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            this.nextElementSibling.textContent = this.value;
        });
    });
}

// Расчет общего доступного времени
function calculateTotalAvailableTime() {
    let totalDays = userData.daysUntilExam;
    
    // Учет выходных дней
    if (userData.noWeekends) {
        const fullWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        let weekendDays = fullWeeks * 2;
        
        // Учет оставшихся дней
        if (remainingDays > 0) {
            const firstDay = new Date();
            const firstDayOfWeek = firstDay.getDay();
            
            for (let i = 1; i <= remainingDays; i++) {
                const dayOfWeek = (firstDayOfWeek + i) % 7;
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    weekendDays++;
                }
            }
        }
        
        totalDays -= weekendDays;
    }
    
    return totalDays * userData.dailyTime * 60; // в минутах
}

// Распределение времени между предметами
function allocateTimeToSubjects(totalTime) {
    const allocation = {};
    const subjects = userData.subjects;
    
    // Рассчитываем общее необходимое время для всех выбранных предметов
    let totalRequiredTime = 0;
    const subjectRequiredTimes = {};
    
    subjects.forEach(subjectId => {
        const subjectData = getSubjectData(subjectId);
        const requiredTime = subjectData.topics.reduce((sum, topic) => sum + topic.timeRequired, 0);
        subjectRequiredTimes[subjectId] = requiredTime;
        totalRequiredTime += requiredTime;
    });
    
    // Распределяем время пропорционально необходимому для каждого предмета
    subjects.forEach(subjectId => {
        const requiredTime = subjectRequiredTimes[subjectId];
        const proportionalTime = totalTime * (requiredTime / totalRequiredTime);
        
        allocation[subjectId] = {
            time: proportionalTime,
            subjectData: getSubjectData(subjectId),
            requiredTime: requiredTime
        };
    });
    
    // Корректировка based on приоритетов
    if (Object.keys(userData.priorities).length > 0) {
        let totalPriority = 0;
        
        // Суммируем приоритеты
        subjects.forEach(subjectId => {
            totalPriority += userData.priorities[subjectId] || 3;
        });
        
        // Перераспределяем время based on приоритетов
        subjects.forEach(subjectId => {
            const priority = userData.priorities[subjectId] || 3;
            allocation[subjectId].time = totalTime * (priority / totalPriority);
        });
    }
    
    return allocation;
}

// Создание расписания по дням
function createSchedule(timeAllocation) {
    const schedule = [];
    const startDate = new Date();
    const maxDailyTime = userData.dailyTime * 60; // в минутах
    
    // Для каждого дня создаем запись
    for (let i = 0; i < userData.daysUntilExam; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Пропускаем выходные, если отмечена опция
        if (userData.noWeekends) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                continue;
            }
        }
        
        const daySchedule = {
            date: new Date(currentDate),
            dayOfWeek: currentDate.toLocaleDateString('ru-RU', { weekday: 'long' }),
            subjects: []
        };
        
        // Определяем, какие предметы изучаются в этот день
        let subjectsForDay = [];
        
        switch(userData.studyMode) {
            case 'daily':
                subjectsForDay = userData.subjects;
                break;
                
            case 'alternate':
                const subjectIndex = i % userData.subjects.length;
                subjectsForDay = [userData.subjects[subjectIndex]];
                break;
                
            case 'twiceWeek':
                // Сложная логика распределения по дням недели
                // Для простоты чередуем предметы
                const cycles = Math.floor(i / (userData.subjects.length * 2));
                const positionInCycle = i % (userData.subjects.length * 2);
                const subjectIdx = Math.floor(positionInCycle / 2);
                subjectsForDay = [userData.subjects[subjectIdx]];
                break;
        }
        
        // Распределяем время для каждого предмета в этот день
        let totalDayTime = 0;
        
        subjectsForDay.forEach(subjectId => {
            const subjectAllocation = timeAllocation[subjectId];
            const dailyTime = subjectAllocation.time / userData.daysUntilExam;
            
            // Округляем до ближайших 15 минут для удобства
            let roundedTime = Math.round(dailyTime / 15) * 15;
            
            // Проверяем, не превышает ли общее время дня лимит
            if (totalDayTime + roundedTime > maxDailyTime) {
                roundedTime = maxDailyTime - totalDayTime;
            }
            
            // Добавляем информацию о предмете для этого дня
            if (roundedTime > 0) {
                daySchedule.subjects.push({
                    id: subjectId,
                    name: subjectAllocation.subjectData.name,
                    time: roundedTime
                });
                
                totalDayTime += roundedTime;
            }
        });
        
        schedule.push(daySchedule);
    }
    
    return schedule;
}

// Прогнозирование баллов (более реалистичное)
function predictScores(timeAllocation) {
    const predictions = {};
    
    for (const subjectId in timeAllocation) {
        const allocation = timeAllocation[subjectId];
        const subjectData = getSubjectData(subjectId);
        
        // Общее время, необходимое для изучения всех тем
        const totalTimeRequired = subjectData.topics.reduce((sum, topic) => sum + topic.timeRequired, 0);
        
        // Коэффициент эффективности обучения (0.6-0.8) - учитывает усталость, забывание и т.д.
        const efficiencyFactor = 0.7;
        
        // Фактор сложности предмета (чем сложнее предмет, тем ниже эффективность)
        const difficultyFactor = {
            'math': 0.9,
            'physics': 0.8,
            'informatics': 0.85
        }[subjectId] || 0.8;
        
        // Фактор распределения времени (интенсивная подготовка менее эффективна)
        const timeDistributionFactor = Math.min(1, 1 - (0.0005 * (userData.dailyTime - 3))); // Снижение эффективности при >3 часов в день
        
        // Комбинированный коэффициент эффективности
        const combinedEfficiency = efficiencyFactor * difficultyFactor * timeDistributionFactor;
        
        // Эффективное время с учетом всех факторов
        const effectiveTime = allocation.time * combinedEfficiency;
        
        // Процент изученного материал с учетом кривой обучения
        let rawCoverage = effectiveTime / totalTimeRequired;
        
        // Нелинейная функция для более реалистичного прогноза
        // Сначала прогресс быстрый, затем замедляется
        const effectiveCoverage = 1 - Math.exp(-1.5 * rawCoverage);
        
        // Прогнозируемый балл с учетом сложности заданий
        let predictedScore = 0;
        let remainingTime = effectiveTime;
        
        // Сортируем темы по сложности (от простых к сложным)
        const sortedTopics = [...subjectData.topics].sort((a, b) => a.difficulty - b.difficulty);
        
        // Проходим по темам от простых к сложным
        for (const topic of sortedTopics) {
            if (remainingTime <= 0) break;
            
            // Время, необходимое для изучения темы с учетом ее сложности
            const timeForTopic = topic.timeRequired * (1 + (topic.difficulty - 1) * 0.5);
            
            if (remainingTime >= timeForTopic) {
                // Полностью изучаем тему
                predictedScore += topic.score;
                remainingTime -= timeForTopic;
            } else {
                // Частично изучаем тему
                const partialCoverage = remainingTime / timeForTopic;
                
                // Эффективность частичного изучения зависит от сложности темы
                const partialEfficiency = Math.max(0.2, 1 - topic.difficulty * 0.3);
                
                predictedScore += topic.score * partialCoverage * partialEfficiency;
                remainingTime = 0;
            }
        }
        
        // Обеспечиваем, чтобы predictedScore не превышал maxScore
        predictedScore = Math.min(predictedScore, subjectData.maxScore);
        
        // Добавляем случайную погрешность (±5%) для учета внешних факторов
        const errorMargin = 1 + (Math.random() * 0.1 - 0.05);
        predictedScore = predictedScore * errorMargin;
        
        // Используем функцию для конвертации
        const secondaryScore = convertPrimaryToTest(predictedScore, subjectData.conversionTable);
        
        predictions[subjectId] = {
            primaryScore: Math.round(predictedScore * 10) / 10,
            secondaryScore: secondaryScore,
            coverage: effectiveCoverage,
            efficiency: combinedEfficiency
        };
    }
    
    return predictions;
}

// Генерация плана
function generatePlan() {
    // Если план уже был сгенерирован и сохранен, используем его данные
    if (window.currentPlan && window.currentPlan.generatedAt) {
        displayResults(window.currentPlan.schedule, window.currentPlan.scorePredictions);
        return;
    }
    // 1. Расчет общего доступного времени
    const totalAvailableTime = calculateTotalAvailableTime();
    
    // 2. Распределение времени между предметами
    const subjectTimeAllocation = allocateTimeToSubjects(totalAvailableTime);
    
    // 3. Создание расписания по дням
    const schedule = createSchedule(subjectTimeAllocation);
    
    // 4. Прогнозирование баллов
    const scorePredictions = predictScores(subjectTimeAllocation);
    
    // 5. Отображение результатов
    displayResults(schedule, scorePredictions);
    
    // Сохраняем данные плана для возможного сохранения
    const planData = {
        userData: userData,
        schedule: schedule,
        scorePredictions: scorePredictions,
        generatedAt: new Date().toISOString()
    };
    
    // Делаем план доступным для сохранения
    window.currentPlan = planData;
}

// Отображение результатов
function displayResults(schedule, scorePredictions) {
    // 1. Общая информация
    displaySummaryInfo(schedule);
    
    // 2. Прогноз баллов
    displayScorePredictions(scorePredictions);
    
    // 3. Календарь занятий
    displayCalendar(schedule);
    
    // 4. Детали по предметам
    displaySubjectDetails(scorePredictions);
}

// Отображение общей информации
function displaySummaryInfo(schedule) {
    const summaryText = document.getElementById('summaryText');
    
    const subjectNames = userData.subjects.map(id => getSubjectData(id).name).join(', ');
    const totalDays = schedule.length;
    const totalHours = Math.round(totalDays * userData.dailyTime * 10) / 10;
    
    summaryText.innerHTML = `
        <p><strong>Выбранные предметы:</strong> ${subjectNames}</p>
        <p><strong>Дней до экзамена:</strong> ${userData.daysUntilExam}</p>
        <p><strong>Дней с занятиями:</strong> ${totalDays}</p>
        <p><strong>Ежедневное время:</strong> ${userData.dailyTime} ч.</p>
        <p><strong>Общее время подготовки:</strong> ${totalHours} ч.</p>
    `;
}

// Отображение прогноза баллов
function displayScorePredictions(predictions) {
    const predictionContainer = document.getElementById('scorePrediction');
    predictionContainer.innerHTML = '';
    
    for (const subjectId in predictions) {
        const prediction = predictions[subjectId];
        const subjectData = getSubjectData(subjectId);
        
        const predictionElement = document.createElement('div');
        predictionElement.className = 'score-prediction';
        predictionElement.innerHTML = `
            <h4>${subjectData.name}</h4>
            <div class="score-meter">
                <div class="score-progress" style="width: ${prediction.coverage * 100}%"></div>
            </div>
            <p>Первичный балл: ${prediction.primaryScore} из ${subjectData.maxScore}</p>
            <p>Тестовый балл: ${prediction.secondaryScore}</p>
            <p class="efficiency-info">Эффективность подготовки: ${Math.round(prediction.efficiency * 100)}%</p>
        `;
        
        predictionContainer.appendChild(predictionElement);
    }
}

// Отображение календаря занятий
function displayCalendar(schedule) {
    const calendarContainer = document.getElementById('calendarView');
    calendarContainer.innerHTML = '';
    
    schedule.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-card';
        
        const dateStr = day.date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            weekday: 'long'
        });
        
        let sessionsHTML = '';
        day.subjects.forEach(subject => {
            // Пропускаем предметы с нулевым временем
            if (subject.time <= 0) return;
            
            // Форматируем время в удобочитаемый вид
            const hours = Math.floor(subject.time / 60);
            const minutes = subject.time % 60;
            let timeString = '';
            
            if (hours > 0) {
                timeString += `${hours} ч `;
            }
            if (minutes > 0) {
                timeString += `${minutes} мин`;
            }
            
            sessionsHTML += `
                <div class="subject-session">
                    <div class="subject-name">${subject.name}</div>
                    <div class="session-time">${timeString}</div>
                </div>
            `;
        });
        
        dayElement.innerHTML = `
            <div class="day-header">
                <span class="day-number">День ${schedule.indexOf(day) + 1}</span>
                <span class="day-date">${dateStr}</span>
            </div>
            <div class="day-content">
                ${sessionsHTML}
            </div>
        `;
        
        calendarContainer.appendChild(dayElement);
    });
}

// Отображение деталей по предметам
function displaySubjectDetails(predictions) {
    const detailsContainer = document.getElementById('subjectsDetails');
    detailsContainer.innerHTML = '';
    
    for (const subjectId in predictions) {
        const prediction = predictions[subjectId];
        const subjectData = getSubjectData(subjectId);
        
        const detailElement = document.createElement('div');
        detailElement.className = 'subject-details';
        
        // Создание списка тем
        let topicsHTML = '<ul class="topic-list">';
        const topicsToCover = Math.floor(subjectData.topics.length * prediction.coverage);
        
        subjectData.topics.slice(0, topicsToCover).forEach(topic => {
            topicsHTML += `
                <li class="topic-item">
                    <a href="${topic.link}" target="_blank" class="topic-link">${topic.name}</a>
                    <span class="topic-score">${topic.score} балл</span>
                </li>
            `;
        });
        
        topicsHTML += '</ul>';
        
        detailElement.innerHTML = `
            <div class="detail-header">
                <h3>${subjectData.name}</h3>
                <span>Покрытие: ${Math.round(prediction.coverage * 100)}%</span>
            </div>
            <div class="detail-content">
                ${topicsHTML}
            </div>
        `;
        
        detailsContainer.appendChild(detailElement);
    }
}

// Инициализация табов
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок и контента
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс к текуной кнопке
            btn.classList.add('active');
            
            // Находим соответствующий контент и делаем его активным
            const tabId = btn.dataset.tab + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Экспорт плана
function exportPlan() {
    // Создаем текстовое представление плана
    let exportText = 'План подготовки к ЕГЭ\n';
    exportText += '=====================\n\n';
    
    // Добавляем общую информацию
    const subjectNames = userData.subjects.map(id => getSubjectData(id).name).join(', ');
    exportText += `Предметы: ${subjectNames}\n`;
    exportText += `Дней до экзамена: ${userData.daysUntilExam}\n`;
    exportText += `Ежедневное время: ${userData.dailyTime} ч.\n\n`;
    
    // Добавляем расписание
    exportText += 'РАСПИСАНИЕ ЗАНЯТИЙ:\n';
    exportText += '===================\n\n';
    
    const totalAvailableTime = calculateTotalAvailableTime();
    const subjectTimeAllocation = allocateTimeToSubjects(totalAvailableTime);
    const schedule = createSchedule(subjectTimeAllocation);
    
    schedule.forEach(day => {
        const dateStr = day.date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            weekday: 'long'
        });
        
        exportText += `${dateStr}:\n`;
        
        day.subjects.forEach(subject => {
            if (subject.time <= 0) return;
            
            const hours = Math.floor(subject.time / 60);
            const minutes = subject.time % 60;
            let timeString = '';
            
            if (hours > 0) {
                timeString += `${hours} ч `;
            }
            if (minutes > 0) {
                timeString += `${minutes} мин`;
            }
            
            exportText += `  - ${subject.name}: ${timeString}\n`;
        });
        
        exportText += '\n';
    });
    
    // Добавляем детали по предметам
    exportText += '\nДЕТАЛИ ПО ПРЕДМЕТАМ:\n';
    exportText += '====================\n\n';
    
    const scorePredictions = predictScores(subjectTimeAllocation);
    
    for (const subjectId in scorePredictions) {
        const prediction = scorePredictions[subjectId];
        const subjectData = getSubjectData(subjectId);
        
        exportText += `${subjectData.name}:\n`;
        exportText += `Прогнозируемый балл: ${prediction.primaryScore} из ${subjectData.maxScore}\n`;
        exportText += `Покрытие материала: ${Math.round(prediction.coverage * 100)}%\n\n`;
        
        const topicsToCover = Math.floor(subjectData.topics.length * prediction.coverage);
        
        subjectData.topics.slice(0, topicsToCover).forEach(topic => {
            exportText += `- ${topic.name} (${topic.score} баллов)\n`;
            exportText += `  Ссылка: ${topic.link}\n\n`;
        });
        
        exportText += '\n';
    }
    
    // Создаем blob и ссылку для скачивания
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'план_подготовки_ЕГЭ.txt';
    document.body.appendChild(a);
    a.click();
    
    // Очистка
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Функция для печати календаря
function printCalendar() {
    const calendarContent = document.getElementById('calendarView').innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Календарь занятий для подготовки к ЕГЭ</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: white;
                    color: black;
                }
                .day-card { 
                    margin-bottom: 20px; 
                    border: 1px solid #ddd; 
                    padding: 15px; 
                    border-radius: 5px;
                    background: white;
                }
                .day-header { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 10px; 
                    font-weight: bold; 
                }
                .subject-session { 
                    margin: 10px 0; 
                    padding: 10px; 
                    background-color: #f9f9f9; 
                    border-radius: 5px; 
                }
                @media print {
                    body { 
                        background: white !important;
                        color: black !important;
                    }
                    .day-card { 
                        break-inside: avoid; 
                        background: white !important;
                        border: 1px solid #000;
                    }
                    .subject-session {
                        background-color: #f0f0f0 !important;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Календарь занятий для подготовки к ЕГЭ</h1>
            <div>${calendarContent}</div>
            <script>
                window.onload = function() {
                    window.print();
                }
            <\/script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Функция для экспорта календаря в PDF
function exportCalendarToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const calendarContent = document.getElementById('calendarView');
    
    // Временно изменяем стили для лучшего отображения в PDF
    const originalStyles = {
        background: calendarContent.style.background,
        color: calendarContent.style.color
    };
    
    calendarContent.style.background = 'white';
    calendarContent.style.color = 'black';
    
    html2canvas(calendarContent, {
        scale: 2,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Восстанавливаем оригинальные стили
        calendarContent.style.background = originalStyles.background;
        calendarContent.style.color = originalStyles.color;
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        doc.save('календарь_занятий_ЕГЭ.pdf');
    });
}

// Функция для печати деталей по предметам
function printDetails() {
    const detailsContent = document.getElementById('subjectsDetails').innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Детали подготовки к ЕГЭ по предметам</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px;
                    background: white;
                    color: black;
                }
                .subject-details { 
                    margin-bottom: 30px; 
                }
                .detail-header { 
                    background-color: #4361ee; 
                    color: white; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin-bottom: 15px; 
                }
                .topic-list { 
                    list-style-type: none; 
                    padding: 0; 
                }
                .topic-item { 
                    padding: 10px; 
                    border-bottom: 1px solid #eee; 
                }
                .topic-link { 
                    color: #4361ee; 
                    text-decoration: none; 
                }
                .topic-score {
                    background-color: #50c878;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    font-weight: bold;
                }
                @media print {
                    body { 
                        background: white !important;
                        color: black !important;
                    }
                    .subject-details { 
                        break-inside: avoid; 
                    }
                    .detail-header {
                        background-color: #3a3a3a !important;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Детали подготовки к ЕГЭ по предметам</h1>
            <div>${detailsContent}</div>
            <script>
                window.onload = function() {
                    window.print();
                }
            <\/script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Функция для экспорта деталей в PDF
function exportDetailsToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const detailsContent = document.getElementById('subjectsDetails');
    
    // Временно изменяем стили для лучшего отображения в PDF
    const originalStyles = {
        background: detailsContent.style.background,
        color: detailsContent.style.color
    };
    
    detailsContent.style.background = 'white';
    detailsContent.style.color = 'black';
    
    html2canvas(detailsContent, {
        scale: 2,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Восстанавливаем оригинальные стили
        detailsContent.style.background = originalStyles.background;
        detailsContent.style.color = originalStyles.color;
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        doc.save('детали_подготовки_ЕГЭ.pdf');
    });
}

// Функция для загрузки сохраненного плана
async function loadPlan(planData) {
    try {
        // Проверяем, что planData существует и содержит необходимые данные
        if (!planData || !planData.userData) {
            console.log("План не найден или данные повреждены");
            return;
        }

        // Заполняем данные пользователя
        userData = planData.userData;
        
        // Восстанавливаем выбор предметов
        document.querySelectorAll('input[name="subject"]').forEach(checkbox => {
            checkbox.checked = userData.subjects.includes(checkbox.value);
        });
        
        // Восстанавливаем другие поля
        if (userData.daysUntilExam) {
            document.getElementById('daysUntilExam').value = userData.daysUntilExam;
        }
        
        if (userData.dailyTime) {
            document.getElementById('dailyTime').value = userData.dailyTime;
        }
        
        // Восстанавливаем режим занятий
        if (userData.studyMode) {
            const radio = document.querySelector(`input[name="studyMode"][value="${userData.studyMode}"]`);
            if (radio) {
                radio.checked = true;
            }
        }
        
        if (userData.noWeekends !== undefined) {
            document.querySelector('input[name="noWeekends"]').checked = userData.noWeekends;
        }
        
        // Переходим сразу к шагу с планом
        const formSteps = document.querySelectorAll('.form-step');
        formSteps.forEach(step => step.classList.remove('active'));
        
        // Показываем шаг с результатами
        document.getElementById('step5').classList.add('active');
        
        // Обновляем прогресс-бар
        currentStep = 4;
        updateProgressBar();
        
        // Генерируем и отображаем план
        generatePlan();
        
        // Сохраняем текущий план
        window.currentPlan = planData;
        
    } catch (error) {
        console.error("Ошибка загрузки плана:", error);
        // Не показываем alert, так как это может быть просто отсутствие плана
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('authPage').classList.contains('active')) {
        // Инициализация аутентификации уже выполнена в auth.js
        // Основное приложение будет инициализировано после входа
    } else {
        initApp();
    }
});