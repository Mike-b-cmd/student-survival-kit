// Конфигурационный объект с уровнями бюджета и сценариями
// Вы можете легко добавлять, менять или удалять сценарии выживания здесь
const BUDGET_DATA = [
    {
        min: 0,
        max: 100,
        title: "РЕЖИМ БОМЖА-ЭКСТРЕМАЛА 🚨",
        plans: [
            "Пойти в парк кормить голубей крошками от бесплатного хлеба взятого в столовой.",
            "Попить элитной фильтрованной воды из кулера в главном корпусе вуза.",
            "Устроить экскурсию в ближайший супермаркет, чтобы постоять у обогревателя на входе.",
            "Найти в куртке старый счастливый проездной и надеяться, что на нём осталась одна поездка."
        ]
    },
    {
        min: 101,
        max: 300,
        title: "СРЕДНИЙ КЛАСС ОБЩЕЖИТИЯ 🪙",
        plans: [
            "Взять одну шаурму на двоих и хирургически точно поделить её пополам линейкой.",
            "Заварить чай в пакетиках из дома и пить его на лавочке, имитируя поход в кофейню.",
            "Купить пачку сухариков и устроить рейд в поисках бесплатного концерта самодеятельности в соседнем общежитии.",
            "Купить пачку бюджетных пельменей и уповать, чтобы они не разварились в однородное тесто."
        ]
    },
    {
        min: 301,
        max: 600,
        title: "ШИКУЕМ ПО-КРУПНОМУ 💸",
        plans: [
            "Купить две шаурмы! Каждому своя, никаких компромиссов и делений.",
            "Сходить на бесплатную лекцию/концерт в вузе. Остаток бюджета с гордостью потратить на автобус, чтобы не идти пешком 5 км.",
            "Взять чипсы по акции и устроить вечер элитного кинопросмотра прямо со смартфона соседа.",
            "Купить пачку нормального печенья и зайти в гости к отличнику, у которого точно есть сахар."
        ]
    },
    {
        min: 601,
        max: 1000,
        title: "ОБЩАЖНАЯ ЭЛИТА 👑",
        plans: [
            "Покупка пачки макарон, БАНКИ НАСТОЯЩЕЙ ТУШЕНКИ и лука. Царская готовка на общей кухне под завистливые вздохи этажа.",
            "Организовать совместный просмотр пиратского ужастика на ноутбуке с чаем и целой пачкой пряников.",
            "Закупиться колой и сухариками, пригласить друзей и заявить, что вы празднуете день взятия Бастилии."
        ]
    },
    {
        min: 1001,
        max: 2000,
        title: "ОЛИГАРХИ ИЗ МЕСТНОГО МАСШТАБА 🎰",
        plans: [
            "Сходить в платный музей по студенческому билету со скидкой 50%. Почувствовать себя интеллигенцией.",
            "Купить кофе в зернах (самый дешевый) и высокомерно варить его в турке на кухне.",
            "Купить большую пиццу по промокоду «НОВИЧОК» и смотреть на всех, как на подданных."
        ]
    }
];

// Селекторы элементов UI
const screenAlarm = document.getElementById('screen-alarm');
const screenCalc = document.getElementById('screen-calc');
const btnAlarm = document.getElementById('btn-alarm');
const budgetSlider = document.getElementById('budget-slider');
const budgetValue = document.getElementById('budget-value');
const verdictTitle = document.getElementById('verdict-title');
const verdictText = document.getElementById('verdict-text');
const btnRandom = document.getElementById('btn-random');
const btnSave = document.getElementById('btn-save');
const savedPlanBox = document.getElementById('saved-plan-box');
const savedPlanText = document.getElementById('saved-plan-text');

// Переменная для хранения текущего сгенерированного текста
let currentActivePlan = "";

// Логика 1-го экрана: Клик по кнопке паники
btnAlarm.addEventListener('click', () => {
    // Воспроизведение синтезированного звука сирены средствами Web Audio API (без внешних файлов)
    playAlarmSound();

    // Визуальный эффект вспышки экрана
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);

    // Переключение экранов
    screenAlarm.classList.remove('active');
    screenCalc.classList.add('active');

    // Инициализация калькулятора (устанавливаем 500 рублей дефолтом)
    updateCalculator(budgetSlider.value);
});

// Слушатель изменения положения ползунка калькулятора
budgetSlider.addEventListener('input', (e) => {
    updateCalculator(e.target.value);
});

// Основная функция обновления калькулятора
function updateCalculator(value) {
    budgetValue.textContent = `[ ${value} РУБЛЕЙ ]`;
    
    // Поиск нужного диапазона в массиве данных
    const currentLevel = BUDGET_DATA.find(level => value >= level.min && value <= level.max);
    
    if (currentLevel) {
        verdictTitle.textContent = `СТАТУС: ${currentLevel.title}`;
        
        // По умолчанию выводим все активности этого уровня в виде списка
        const listItems = currentLevel.plans.map(plan => `• ${plan}`).join('<br><br>');
        verdictText.innerHTML = listItems;
        currentActivePlan = listItems; // Запоминаем текущий блок планов
    }
}

// Логика кнопки "Мне лень думать, выбери за меня" (Генератор случайного плана)
btnRandom.addEventListener('click', () => {
    const value = budgetSlider.value;
    const currentLevel = BUDGET_DATA.find(level => value >= level.min && value <= level.max);
    
    if (currentLevel) {
        // Случайный выбор одного элемента из доступных для текущего бюджета
        const randomIndex = Math.floor(Math.random() * currentLevel.plans.length);
        const randomPlan = currentLevel.plans[randomIndex];
        
        verdictTitle.textContent = `🎰 СЛУЧАЙНЫЙ ПЛАН ВЫЖИВАНИЯ:`;
        verdictText.innerHTML = `🔥 <strong>Индивидуальный приказ:</strong> <br>${randomPlan}`;
        currentActivePlan = randomPlan; // Запоминаем именно эту выбранную активность
    }
});

// Работа с LocalStorage: Сохранение текущего плана
btnSave.addEventListener('click', () => {
    if (!currentActivePlan) return;
    
    const money = budgetSlider.value;
    const fullPlanString = `Бюджет: ${money} руб. Назначение: ${currentActivePlan.replace(/<br>/g, ' ')}`;
    
    localStorage.setItem('saved_student_plan', fullPlanString);
    renderSavedPlan();
    
    // Лёгкая нотификация на кнопке
    const originalText = btnSave.textContent;
    btnSave.textContent = "✅ ЗАПИСАНО В БУНКЕР!";
    btnSave.style.backgroundColor = "#5af75a";
    setTimeout(() => {
        btnSave.textContent = originalText;
        btnSave.style.backgroundColor = "";
    }, 1500);
});

// Отрисовка сохраненного из localStorage плана при наличии
function renderSavedPlan() {
    const saved = localStorage.getItem('saved_student_plan');
    if (saved) {
        savedPlanBox.classList.remove('hidden');
        savedPlanText.innerHTML = saved;
    }
}

// Генерация звука сирены бункера через AudioContext
function playAlarmSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Осциллятор для звука
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth'; // Пилообразная волна для жесткого звука
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        // Эффект нарастания/сирены по частоте
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.log("AudioContext не поддерживается до первого взаимодействия пользователя.");
    }
}

// Загрузка сохраненного плана при старте страницы (если есть)
renderSavedPlan();
