// Telegram WebApp init
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Глобальные переменные
    let userData = tg.initDataUnsafe.user || {};
    let telegramId = Number(userData.id) || 0;
    let balance = 0;
    let clickValue = 1; // стартовое значение: 1 доллар за клик
    let level = 1;
    let progress = 0;
    let totalClicks = 0;
    let companiesCount = 0;
    let masterId = null;
    let referralsCount = 0;
    let servantsCount = 0;
    let apiBase = 'https://dinod.ru/api';
    let currentCompanyId = null;
    let currentServantId = null;
    let currentAdId = null;
    let currentChannel = null;
    let currentSection = 'home';
    let marketCompanies = [];
    let marketServants = [];
    let anonymous = false;
    let claimedChannelBonus = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let producedShares = 0;
    let productionRatePerSecond = 0;
    let lastCollectTimestamp = null;
    let productionInterval = null;
    let lastClaimTime = 0;
    let lastSaveTime = 0;
    let pendingIncome = 0;
    let incomeInterval = null;
    const LOCAL_STORAGE_KEY = `user_data_${telegramId}`;
    const MAX_PRODUCTION = 50000;
    const MAX_PENDING_INCOME = 50000;

// Переключатель темы
const themeToggleBtn = document.getElementById('theme-toggle-btn');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Применяем тему при загрузке
function applyTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.className = 'fas fa-sun';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggleBtn.className = 'fas fa-moon';
    }
}

// Переключение темы
themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme();
});

// Применяем тему при старте
applyTheme();

    // Список типов персонала
const staffTypes = [
  { type: 'director', name: 'Директор', icon: 'fa-crown' },
  { type: 'accountant', name: 'Бухгалтер', icon: 'fa-file-invoice-dollar' },
  { type: 'marketer', name: 'Маркетолог', icon: 'fa-bullhorn' },
  { type: 'secretary', name: 'Секретарь', icon: 'fa-users' },
  { type: 'sales_manager', name: 'Менеджер по продажам', icon: 'fa-chart-line' },
  { type: 'lawyer', name: 'Юрист', icon: 'fa-gavel' }
];

    // DOM элементы
    const companyAvailableMarketEl = document.getElementById('company-available-market');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const tapCircle = document.getElementById('tap-circle');
    const clickerArea = document.getElementById('clicker-area');
    const cardBalanceEl = document.getElementById('card-balance');
    const cardLevelEl = document.getElementById('card-level');
    const progressFillEl = document.getElementById('progress-fill');
    const progressTextEl = document.getElementById('progress-text');
    const progressPercentEl = document.getElementById('progress-percent');
    const walletBalanceEl = document.getElementById('wallet-balance');
    const profileLevelEl = document.getElementById('profile-level');
    const totalClicksEl = document.getElementById('total-clicks');
    const profileAvatarEl = document.getElementById('profile-avatar');
    const profileNameEl = document.getElementById('profile-name');
    const profileUsernameEl = document.getElementById('profile-username');
    const playerIdEl = document.getElementById('player-id');
    const avatarImgEl = document.getElementById('avatar-img');
    const createCompanyBtn = document.getElementById('create-company-btn');
    const companyNameInput = document.getElementById('company-name-input');
    const createCompanyCost = document.getElementById('create-company-cost');
    const userCompaniesList = document.getElementById('user-companies-list');
    const marketList = document.getElementById('market-list');
    const holdingsList = document.getElementById('holdings-list');
    const companyNameEl = document.getElementById('company-name');
    const companyClientsEl = document.getElementById('company-clients');
    const companyIssuedEl = document.getElementById('company-issued');
    const companyAvailableIssueEl = document.getElementById('company-available-issue');
    const issueAmountInput = document.getElementById('issue-amount-input');
    const issueSharesBtn = document.getElementById('issue-shares-btn');
    const backToBusinessBtn = document.getElementById('back-to-business-btn');
    const buyCompanyNameEl = document.getElementById('buy-company-name');
    const buyCompanyOwnerEl = document.getElementById('buy-company-owner');
    const buyCompanyClientsEl = document.getElementById('buy-company-clients');
    const buyCompanyPriceEl = document.getElementById('buy-company-price');
    const buyCompanyAvailableEl = document.getElementById('buy-company-available');
    const buyAmountInput = document.getElementById('buy-amount-input');
    const buySharesBtn = document.getElementById('buy-shares-btn');
    const backToMarketBtn = document.getElementById('back-to-market-btn');
    const sellCompanyNameEl = document.getElementById('sell-company-name');
    const sellCompanySharesEl = document.getElementById('sell-company-shares');
    const sellCompanyPriceEl = document.getElementById('sell-company-price');
    const sellAmountInput = document.getElementById('sell-amount-input');
    const sellSharesBtn = document.getElementById('sell-shares-btn');
    const backToWalletBtn = document.getElementById('back-to-wallet-btn');
    const staffGrid = document.getElementById('staff-grid');
    const copyRefLink = document.getElementById('copy-ref-link');
    const refLinkText = document.getElementById('ref-link-text');
    const servantStatusEl = document.getElementById('servant-status');
    const freeSelfBtnContainer = document.getElementById('free-self-btn-container');
    const secIncomeEl = document.getElementById('sec-income');
    const dailyTaxEl = document.getElementById('daily-tax');
    const servantsList = document.getElementById('servants-list');
    const servantMarketList = document.getElementById('servant-market-list');
    const buyServantUsernameEl = document.getElementById('buy-servant-username');
    const buyServantPriceEl = document.getElementById('buy-servant-price');
    const buyServantBtn = document.getElementById('buy-servant-btn');
    const backToMarketServantBtn = document.getElementById('back-to-market-servant-btn');
    const searchStocks = document.getElementById('search-stocks');
    const searchServants = document.getElementById('search-servants');
    const toggleAnonymousBtn = document.getElementById('toggle-anonymous-btn');
    const checkSubBtn = document.getElementById('check-sub');
    const claimBonusBtn = document.getElementById('claim-bonus');
    const bonusStatusEl = document.getElementById('bonus-status');
    const topPlayersList = document.getElementById('top-players-list');
    const marketSection = document.getElementById('market-section');
    const marketNavItem = document.querySelector('.nav-item[data-section="market"]');
    const producedSharesEl = document.getElementById('produced-shares');
    const collectSharesBtn = document.getElementById('collect-shares-btn');
    const pendingIncomeEl = document.getElementById('pending-income');
    const claimIncomeBtn = document.getElementById('claim-income-btn');
    const createAdBtn = document.getElementById('create-ad-btn');
    const createAdSubmit = document.getElementById('create-ad-submit');
    const confirmBotAdded = document.getElementById('confirm-bot-added');
    const publishBotPost = document.getElementById('publish-bot-post');
    const publishAd = document.getElementById('publish-ad');
    const backToAdsBtn = document.getElementById('back-to-ads-btn');
    const myAdsList = document.getElementById('my-ads-list');
    const adsList = document.getElementById('ads-list');
    const claimChannel = document.getElementById('claim-channel');
    const subscribeLink = document.getElementById('subscribe-link');
    const checkSubscribed = document.getElementById('check-subscribed');
    const claimReward = document.getElementById('claim-reward');
    const backToAdsFromClaimBtn = document.getElementById('back-to-ads-from-claim-btn');
    const showMyAdsBtn = document.getElementById('show-my-ads-btn');

    // helper для безопасной работы с числами в элементах
    function parseNumFromEl(el) {
      if (!el) return 0;
      const raw = el.dataset.raw ?? el.textContent ?? '';
      return Number(String(raw).replace(/[^0-9\.\-]/g, '')) || 0;
    }
    function setNumToEl(el, num) {
      const n = Number(num) || 0;
      el.dataset.raw = String(n);
      el.textContent = n.toLocaleString('en-US');
    }

    // Периодическая проверка на сохранение
    setInterval(() => {
      if (Date.now() - lastSaveTime > 3000) {
        saveUserToLocal();
        lastSaveTime = Date.now();
      }
    }, 1000);

    // Сохранять при скрытии приложения
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        saveUserToLocal();
        syncUserData();
      }
    });

    // Переключение разделов
    function switchToSection(sectionId) {
      sections.forEach(section => section.classList.remove('active'));
      navItems.forEach(item => item.classList.remove('active'));

      const targetSection = document.getElementById(`${sectionId}-section`);
      if (targetSection) targetSection.classList.add('active');
      // Скрываем навигацию для секции настроек (она не в bottom-nav)
  if (sectionId === 'settings') {
    document.querySelector('.bottom-nav').style.display = 'none';
  } else {
    document.querySelector('.bottom-nav').style.display = 'flex';
  }
      const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
      if (navItem) navItem.classList.add('active');

      currentSection = sectionId;
      loadSectionData();
      updateUI();
      if (sectionId !== 'company-dashboard') {
        clearInterval(productionInterval);
      } else {
        productionInterval = setInterval(updateProducedShares, 1000);
      }
      if (sectionId !== 'wallet') {
        clearInterval(incomeInterval);
      } else {
        const activeTab = document.querySelector('#wallet-section .tab.active').dataset.tab;
        if (activeTab === 'servants' && servantsCount > 0) {
          incomeInterval = setInterval(updatePendingIncome, 1000);
        }
      }
      if (sectionId === 'create-ad') {
        document.getElementById('ad-form').style.display = 'block';
        document.getElementById('ad-step2').style.display = 'none';
      }
      if (sectionId === 'claim-ad') {
        loadClaimAd();
      }
      if (sectionId === 'market') {
        myAdsList.classList.add('hidden');
      }
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        switchToSection(sectionId);
      });
    });

    // Переключение табов
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabsContainer = tab.parentElement;
        tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabContents = tabsContainer.nextElementSibling.parentElement.querySelectorAll('.tab-content');
        tabContents.forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(`${tab.dataset.tab}-${tabsContainer.parentElement.id.split('-')[0]}-content`) || document.getElementById(`${tab.dataset.tab}-content`);
        if (targetContent) targetContent.classList.add('active');
        loadSectionData();
        if (tab.parentElement.parentElement.id === 'wallet-section' && tab.dataset.tab === 'servants' && servantsCount > 0) {
          clearInterval(incomeInterval);
          incomeInterval = setInterval(updatePendingIncome, 1000);
        } else {
          clearInterval(incomeInterval);
        }
      });
    });

    // Копирование реферальной ссылки
    copyRefLink.addEventListener('click', () => {
      const refLink = `https://t.me/GoldEmpireGameBot?start=${telegramId}`;
      navigator.clipboard.writeText(refLink);
      showToast('Ссылка скопирована!');
    });

    // Загрузка данных для секции
    async function loadSectionData() {
      if (currentSection === 'business') {
        await loadUserCompanies();
        const refLink = `https://t.me/GoldEmpireGameBot?start=${telegramId}`;
        refLinkText.textContent = refLink;
        await loadBonusStatus();
      } else if (currentSection === 'market') {
        const activeTab = document.querySelector('#market-section .tab.active').dataset.tab;
        if (activeTab === 'stocks') {
          await loadMarket();
        } else if (activeTab === 'servants') {
          await loadServantMarket();
        } else if (activeTab === 'top') {
          await loadTopPlayers();
        } else if (activeTab === 'ads') {
          await loadAds();
        }
      } else if (currentSection === 'wallet') {
        const activeTab = document.querySelector('#wallet-section .tab.active').dataset.tab;
        if (activeTab === 'stocks') {
          await loadHoldings();
        } else {
          await loadServants();
        }
      } else if (currentSection === 'company-dashboard') {
        await loadCompanyDashboard();
      } else if (currentSection === 'stock-buy') {
        await loadStockBuy();
      } else if (currentSection === 'servant-buy') {
        await loadServantBuy();
      } else if (currentSection === 'stock-sell') {
        await loadStockSell();
      } else if (currentSection === 'profile') {
        await loadProfileServantInfo();
        await loadAnonymousStatus();
      }
    }

    async function loadBonusStatus() {
      if (claimedChannelBonus) {
        bonusStatusEl.textContent = 'Награда уже получена';
        checkSubBtn.style.display = 'none';
        claimBonusBtn.style.display = 'none';
      } else {
        bonusStatusEl.textContent = '';
        checkSubBtn.style.display = 'block';
        claimBonusBtn.style.display = 'block';
        claimBonusBtn.classList.add('disabled');
        claimBonusBtn.classList.remove('btn-green');
      }
    }

    checkSubBtn.addEventListener('click', async () => {
  if (checkSubBtn.classList.contains('waiting')) return;

  // Блокируем кнопку на 10 секунд
  checkSubBtn.classList.add('waiting');
  const originalText = checkSubBtn.textContent;
  checkSubBtn.textContent = 'Проверяем... 10 сек';

  // Блокируем другие кнопки
  claimBonusBtn.classList.add('disabled');

  try {
    const response = await fetch(`${apiBase}/check_channel_sub/${telegramId}`);
    const data = await response.json();

    // Ждем 10 секунд перед показом результата
    setTimeout(() => {
      if (data.subscribed) {
        claimBonusBtn.classList.remove('disabled');
        claimBonusBtn.classList.add('btn-green');
        showToast('Подписка подтверждена!');
      } else {
        showToast('Вы не подписаны на канал');
      }

      // Разблокируем кнопку
      checkSubBtn.classList.remove('waiting');
      checkSubBtn.textContent = originalText;
    }, 10000);

    // Обратный отсчет
    let secondsLeft = 10;
    const countdown = setInterval(() => {
      secondsLeft--;
      checkSubBtn.textContent = `Проверяем... ${secondsLeft} сек`;
      if (secondsLeft <= 0) {
        clearInterval(countdown);
        checkSubBtn.textContent = 'Проверка завершена';
      }
    }, 1000);

  } catch (err) {
    showToast('Ошибка проверки подписки');
    checkSubBtn.classList.remove('waiting');
    checkSubBtn.textContent = originalText;
  }
});

    claimBonusBtn.addEventListener('click', async (e) => {
      if (e.target.classList.contains('disabled')) return;
      try {
        const response = await fetch(`${apiBase}/claim_channel_bonus/${telegramId}`, { method: 'POST' });
        const data = await response.json();

        if (response.ok && data.balance) {
          balance = Number(data.balance);
          claimedChannelBonus = true;
          updateUI();
          loadBonusStatus();
          saveUserToLocal();
          showToast('Награда получена!');
          await syncUserData();
        } else if (data.error === 'already_claimed') {
          claimedChannelBonus = true;
          loadBonusStatus();
          showToast('Награда уже получена');
        } else {
          showToast('Ошибка: ' + (data.error || 'неизвестно'));
        }
      } catch (err) {
        showToast('Ошибка соединения');
      }
    });

    async function loadTopPlayers() {
      try {
        const balanceRes = await fetch(`${apiBase}/top_players?type=balance`);
        const topPlayers = await balanceRes.json();
        renderTopList(topPlayersList, topPlayers);
      } catch (err) {
        console.error('Load top players error:', err);
      }
    }

   function renderTopList(listEl, players) {
  listEl.innerHTML = '';

  players.forEach((player, index) => {
    const card = document.createElement('div');
    card.classList.add('top-player-card');

    if (player.telegram_id === telegramId) {
      card.classList.add('highlighted');
    }

    card.innerHTML = `
      <div class="top-player-header">
        <div class="top-player-rank">${index + 1}</div>
        <div class="top-player-name">
          ${player.username || `Игрок #${player.telegram_id}`}
          ${player.anonymous ? '🕵️' : ''}
        </div>
        <div class="top-player-balance">$${Number(player.balance).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      </div>

      <div class="top-player-details">
        <div class="detail-item">
          <span class="detail-label">Уровень</span>
          <span class="detail-value">${player.level}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Баланс</span>
          <span class="detail-value">$${Number(player.balance).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
        </div>
      </div>
    `;

    listEl.appendChild(card);
  });
}

    async function loadAnonymousStatus() {
      toggleAnonymousBtn.textContent = anonymous ? 'Вы анонимны. Отключить анонимность?' : 'Хотите быть полностью анонимным? Чтобы никто не видел ваш юзернейм нигде в игре?';
    }

    toggleAnonymousBtn.addEventListener('click', async () => {
      try {
        const newStatus = !anonymous;
        await fetch(`${apiBase}/set_anonymous/${telegramId}/${newStatus ? 'true' : 'false'}`, { method: 'POST' });
        anonymous = newStatus;
        loadAnonymousStatus();
        saveUserToLocal();
        showToast(newStatus ? 'Анонимность включена' : 'Анонимность отключена');
      } catch (err) {
        showToast('Ошибка изменения анонимности');
      }
    });

    // Обработка клика
    function handleClick() {
    if (!telegramId) return;

    totalClicks = Number(totalClicks) + 1;
    balance = Number(balance) + Number(clickValue); // +1$ на первом уровне
    progress = Number(progress) + Number(clickValue);

    const nextThreshold = Number(level) * 1000; // или просто 1000
    if (progress >= nextThreshold) {
        level = Number(level) + 1;
        progress = Number(progress) - nextThreshold;
        clickValue = 1 + Number(level); // НОВАЯ ФОРМУЛА: 1$ + уровень
    }

    updateUI();

    // Анимация
    tapCircle.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' }
    ], { duration: 200 });
}

    clickerArea.addEventListener('click', handleClick);

    // Обновление UI с форматированием
    function updateUI() {
      const formattedBalance = '$ ' + Number(balance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace('.', ',');
      cardBalanceEl.textContent = formattedBalance;
      walletBalanceEl.textContent = formattedBalance;
      cardLevelEl.textContent = level;
      profileLevelEl.textContent = level;

      const nextThreshold = Number(level) * 1000;
      const progressPercent = Math.min(100, Math.round((Number(progress) / nextThreshold) * 100));
      progressFillEl.style.width = `${progressPercent}%`;
      progressTextEl.textContent = `$${Number(progress).toLocaleString('en-US', {minimumFractionDigits: 0})} / $${nextThreshold.toLocaleString('en-US', {minimumFractionDigits: 0})}`;
      progressPercentEl.textContent = `${progressPercent}%`;

      totalClicksEl.textContent = Number(totalClicks).toLocaleString('en-US');
    }

    // Toast уведомления
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Обновление информации пользователя
    async function updateUserInfo() {
      try {
        await fetch(`${apiBase}/user/${telegramId}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            username: userData.username || '',
            avatar_url: userData.photo_url || null
          })
        });
      } catch (err) {
        console.error('Update user info error:', err);
      }
    }

    // Синхронизация с сервером
    async function syncUserData() {
      try {
        const response = await fetch(`${apiBase}/sync/${telegramId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total_clicks: Number(totalClicks),
            balance: Number(balance),
            level: Number(level),
            progress: Number(progress)
          })
        });

        if (response.ok) {
          console.log('✅ Данные синхронизированы');
        } else if (response.status === 403) {
          showToast('Аккаунт заблокирован');
        } else {
          console.warn('Sync failed');
        }
      } catch (err) {
        console.warn('Sync error:', err);
      }
    }

    // Сохранение в localStorage
    function saveUserToLocal() {
      const user = {
        balance: Number(balance),
        level: Number(level),
        progress: Number(progress),
        total_clicks: Number(totalClicks),
        companies_count: Number(companiesCount),
        master_id: masterId,
        referrals_count: Number(referralsCount),
        servants_count: Number(servantsCount),
        anonymous,
        claimed_channel_bonus: claimedChannelBonus,
        last_claim: new Date(lastClaimTime).toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ timestamp: Date.now(), user }));
    }

    // Загрузка из localStorage
    function loadFromLocal() {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const { timestamp, user } = JSON.parse(stored);
        if (Date.now() - timestamp < 60000) {
          balance = Number(user.balance);
          level = Number(user.level);
          progress = Number(user.progress);
          totalClicks = Number(user.total_clicks);
          companiesCount = Number(user.companies_count) || 0;
          masterId = user.master_id;
          referralsCount = Number(user.referrals_count);
          servantsCount = Number(user.servants_count);
          anonymous = user.anonymous;
          claimedChannelBonus = user.claimed_channel_bonus;
          lastClaimTime = new Date(user.last_claim).getTime();
          clickValue = 1 + Number(level); // 1$ + уровень
          updateUI();
          updateCreateCompanyArea();
          return true;
        }
      }
      return false;
    }

    // Инициализация пользователя
    async function initUser() {
      if (!telegramId) return;

      const loadedFromLocal = loadFromLocal();

      try {
        let response = await fetch(`${apiBase}/user/${telegramId}`);
        let user = await response.json();
        if (user) {
          balance = Number(user.balance);
          level = Number(user.level);
          progress = Number(user.progress);
          totalClicks = Number(user.total_clicks);
          companiesCount = Number(user.companies_count) || 0;
          masterId = user.master_id;
          referralsCount = Number(user.referrals_count);
          servantsCount = Number(user.servants_count);
          anonymous = user.anonymous;
          claimedChannelBonus = user.claimed_channel_bonus;
          lastClaimTime = new Date(user.last_claim).getTime();
          clickValue = 1 + Number(level);

          if (masterId) {
            response = await fetch(`${apiBase}/apply_tax/${telegramId}`, { method: 'POST' });
            user = await response.json();
            balance = Number(user.balance);
          }

          response = await fetch(`${apiBase}/claim_income/${telegramId}`, { method: 'POST' });
          user = await response.json();
          balance = Number(user.balance);
          lastClaimTime = Date.now();

          if (user.first_name === 'Unknown' || !user.username) {
            await updateUserInfo();
            const updatedResponse = await fetch(`${apiBase}/user/${telegramId}`);
            const updatedUser = await updatedResponse.json();
            user.first_name = updatedUser.first_name;
            user.last_name = updatedUser.last_name;
            user.username = updatedUser.username;
            user.avatar_url = updatedUser.avatar_url;
          }

          profileNameEl.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Gold Empire Player';
          profileUsernameEl.textContent = user.username ? `@${user.username}` : '@username';
          playerIdEl.textContent = `#${telegramId}`;

          if (user.avatar_url) {
            avatarImgEl.src = user.avatar_url;
            avatarImgEl.style.display = 'block';
          }

          saveUserToLocal();
        }
      } catch (err) {
        console.error('Init user error:', err);
        if (!loadedFromLocal) {
          showToast('Ошибка загрузки данных');
        }
      }

      updateCreateCompanyArea();
      updateUI();

      setInterval(syncUserData, 30000);
    }

    // Загрузка статуса слуги
    async function loadProfileServantInfo() {
      servantStatusEl.innerHTML = '';
      freeSelfBtnContainer.innerHTML = '';
      if (masterId) {
        try {
          const response = await fetch(`${apiBase}/user_username/${masterId}`);
          const { username } = await response.json();
          servantStatusEl.textContent = `Вы являетесь слугой @${username}. Пригласи 10 человек и ты можешь освободиться из под рабства.`;
          if (referralsCount >= 10) {
            const btn = document.createElement('div');
            btn.classList.add('btn');
            btn.textContent = 'Освободиться';
            btn.addEventListener('click', async () => {
              await fetch(`${apiBase}/free_self/${telegramId}`, { method: 'POST' });
              showToast('Вы освобождены!');
              masterId = null;
              saveUserToLocal();
              loadProfileServantInfo();
            });
            freeSelfBtnContainer.appendChild(btn);
          }
        } catch (err) {
          console.error('Load master username error:', err);
        }
      }
    }

    // Обновление области создания компании
    function updateCreateCompanyArea() {
      const createArea = document.getElementById('create-company-area');
      if (companiesCount >= 2) {
        createArea.style.display = 'none';
      } else {
        createArea.style.display = 'block';
        createCompanyCost.textContent = companiesCount === 0 ? 'Первая компания бесплатно' : 'Вторая компания за $1,000,000';
      }
    }

    // Создание компании
    async function createCompany() {
      const name = companyNameInput.value.trim();
      if (!name.match(/^[a-zA-Z]+$/)) {
        showToast('Название должно содержать только английские буквы');
        return;
      }

      try {
        const response = await fetch(`${apiBase}/company/${telegramId}/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        if (!response.ok) {
          const error = await response.json();
          showToast(error.error || 'Ошибка создания компании');
          return;
        }
        const newCompany = await response.json();
        companiesCount = Number(companiesCount) + 1;
        saveUserToLocal();
        updateCreateCompanyArea();
        companyNameInput.value = '';
        showToast('Компания создана успешно');
        await loadUserCompanies();
      } catch (err) {
        showToast('Ошибка создания компании');
      }
    }

    createCompanyBtn.addEventListener('click', createCompany);

    // Загрузка компаний пользователя
    async function loadUserCompanies() {
      try {
        const response = await fetch(`${apiBase}/companies/user/${telegramId}`);
        const companies = await response.json();
        userCompaniesList.innerHTML = '';
        companies.forEach(company => {
          const btn = document.createElement('div');
          btn.classList.add('btn');
          btn.textContent = company.name;
          btn.addEventListener('click', () => {
            currentCompanyId = company.id;
            switchToSection('company-dashboard');
          });
          userCompaniesList.appendChild(btn);
        });
      } catch (err) {
        console.error('Load companies error:', err);
      }
    }

    // Загрузка кабинета компании
async function loadCompanyDashboard() {
  if (!currentCompanyId) return;

  try {
    const response = await fetch(`${apiBase}/company/${currentCompanyId}`);
    const company = await response.json();

    // Обновляем данные компании
    companyNameEl.textContent = company.name;
    companyClientsEl.textContent = Number(company.clients_count).toLocaleString('en-US');
    setNumToEl(companyIssuedEl, company.issued_shares);
    companyAvailableIssueEl.textContent = Number(company.available_to_issue).toLocaleString('en-US');
    companyAvailableMarketEl.textContent = Number(company.available).toLocaleString('en-US');

    productionRatePerSecond = Number(company.production_rate_per_second) || 0;
    lastCollectTimestamp = new Date(company.last_collect).getTime();
    updateProducedShares();

    // --- ОБНОВЛЁННЫЙ РЕНДЕР ПЕРСОНАЛА ---
    staffGrid.innerHTML = '';

    const staffTypesWithIcons = [
      { type: 'director', name: 'Директор', icon: 'fa-crown' },
      { type: 'accountant', name: 'Бухгалтер', icon: 'fa-file-invoice-dollar' },
      { type: 'marketer', name: 'Маркетолог', icon: 'fa-bullhorn' },
      { type: 'secretary', name: 'Секретарь', icon: 'fa-users' },
      { type: 'sales_manager', name: 'Менеджер по продажам', icon: 'fa-chart-line' },
      { type: 'lawyer', name: 'Юрист', icon: 'fa-gavel' }
    ];

    staffTypesWithIcons.forEach(staff => {
      const staffCard = document.createElement('div');
      staffCard.classList.add('staff-card');

      const currentLevel = Number(company[`staff_${staff.type}_level`]) || 1;
      const cost = 500 * currentLevel;

      staffCard.innerHTML = `
        <div class="staff-icon">
          <i class="fas ${staff.icon}"></i>
        </div>
        <div class="staff-name">${staff.name}</div>
        <div class="staff-level">Уровень ${currentLevel}</div>
        <button class="btn-upgrade" onclick="upgradeStaff('${staff.type}')">
          <i class="fas fa-arrow-up"></i> Улучшить ($${cost.toLocaleString('en-US')})
        </button>
      `;

      staffGrid.appendChild(staffCard);
    });

    // Сетка 2 колонки
staffGrid.style.display = "grid";
staffGrid.style.gridTemplateColumns = "repeat(2, 1fr)";
staffGrid.style.gap = "12px";

  } catch (err) {
    console.error('Load dashboard error:', err);
  }
}


    // Обновление произведенных акций с лимитом
    function updateProducedShares() {
  if (productionRatePerSecond > 0) {
    const elapsed = (Date.now() - lastCollectTimestamp) / 1000;
    // ДОБАВЬ ВТОРОЙ ЛИМИТ 50000
    producedShares = Math.min(
      Math.floor(elapsed * productionRatePerSecond),
      MAX_PRODUCTION,
      50000  // ← ДОБАВЬ ЭТУ СТРОКУ
    );
    setNumToEl(producedSharesEl, producedShares);
  } else {
    producedShares = 0;
    setNumToEl(producedSharesEl, 0);
  }
}

    // Сбор акций
    // Сбор акций
async function collectShares() {
  // ДОБАВЬ ПРОВЕРКУ ПЕРЕД ОТПРАВКОЙ - В САМОМ НАЧАЛЕ ФУНКЦИИ!
  if (producedShares > 50000) {
    showToast("Слишком много акций для сбора! Собирайте чаще.");
    return;
  }

  try {
    const response = await fetch(`${apiBase}/company/${currentCompanyId}/collect`, {
      method: 'POST'
    });

    if (!response.ok) {
      const error = await response.json();
      showToast(error.error || 'Ошибка сбора акций');
      return;
    }

    const updated = await response.json();

    // ⚡️ ВАЖНО: ПЕРЕЗАГРУЖАЕМ данные компании!
    await loadCompanyDashboard();

    // Обновляем локальные переменные
    lastCollectTimestamp = Date.now();
    producedShares = 0;
    updateProducedShares();

    showToast(updated.message || `Собрано акций успешно!`);
  } catch (err) {
    showToast('Ошибка сбора акций');
  }
}
    collectSharesBtn.addEventListener('click', collectShares);

    // Улучшение персонала
    async function upgradeStaff(type) {
      try {
        const response = await fetch(`${apiBase}/company/${currentCompanyId}/upgrade_staff/${telegramId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staff_type: type })
        });
        if (!response.ok) {
          const error = await response.json();
          showToast(error.error || 'Ошибка улучшения');
          return;
        }
        const updated = await response.json();
        balance = Number(updated.balance);
        productionRatePerSecond = Number(updated.production_rate_per_second) || productionRatePerSecond;
        saveUserToLocal();
        showToast('Персонал улучшен успешно');
        updateUI();
        await loadCompanyDashboard();
      } catch (err) {
        showToast('Ошибка улучшения');
      }
    }

    // Выпуск акций
    async function issueShares() {
      const amount = Number(issueAmountInput.value);
      if (isNaN(amount) || amount <= 0) {
        showToast('Введите положительное количество');
        return;
      }

      try {
        const response = await fetch(`${apiBase}/company/${currentCompanyId}/issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        if (!response.ok) {
          const error = await response.json();
          showToast(error.error || 'Ошибка выпуска акций');
          return;
        }
        issueAmountInput.value = '';
        showToast('Акции выпущены успешно');
        await loadCompanyDashboard();
      } catch (err) {
        showToast('Ошибка выпуска акций');
      }
    }

    issueSharesBtn.addEventListener('click', issueShares);

    backToBusinessBtn.addEventListener('click', () => switchToSection('business'));

    // Загрузка рынка акций
    async function loadMarket(refresh = false) {
      try {
        const response = await fetch(`${apiBase}/companies`);
        marketCompanies = await response.json();
        renderMarketList(marketCompanies);
        if (refresh) showToast('Данные обновлены');
      } catch (err) {
        console.error('Load market error:', err);
      }
    }

    // Рендер рынка акций
function renderMarketList(companies) {
  marketList.innerHTML = '';
  companies.forEach(company => {
    const card = document.createElement('div');
    card.classList.add('market-card', 'compact'); // ← ДОБАВИЛ 'compact' ЗДЕСЬ

    card.innerHTML = `
      <div class="market-card-header">
        <div class="company-info">
          <div class="fixed-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="company-details">
            <div class="company-name">${company.name}</div>
            <div class="company-owner">@${company.owner_username}</div>
          </div>
        </div>
        <div class="stock-price">+$${Number(company.price).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
      </div>

      <div class="market-card-stats">
        <div class="market-stat-item">
          <span class="market-stat-label">Клиентов</span>
          <span class="market-stat-value">${Number(company.clients_count).toLocaleString('en-US')}</span>
        </div>
        <div class="market-stat-item price-item">
          <span class="market-stat-label">Цена</span>
          <span class="market-stat-value">$${Number(company.price).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
        </div>
      </div>

      <div class="market-card-footer">
        <!-- 🔥 НОВЫЙ СТАТУС ДОСТУПНОСТИ -->
        <div class="availability-status">
          <div class="status-indicator available">
            <i class="fas fa-check-circle"></i>
            <span>Акции доступны</span>
          </div>
        </div>
        <button class="buy-btn">Купить</button>
      </div>
    `;

    // Обработчики кликов остаются
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('buy-btn')) {
        currentCompanyId = company.id;
        switchToSection('stock-buy');
      }
    });

    card.querySelector('.buy-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      currentCompanyId = company.id;
      switchToSection('stock-buy');
    });

    marketList.appendChild(card);
  });
}

    searchStocks.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = marketCompanies.filter(c => c.name.toLowerCase().includes(query));
      renderMarketList(filtered);
    });

    // Загрузка рынка слуг
    async function loadServantMarket(refresh = false) {
      try {
        const response = await fetch(`${apiBase}/servant_market`);
        marketServants = await response.json();
        renderServantMarketList(marketServants);
        if (refresh) showToast('Данные обновлены');
      } catch (err) {
        console.error('Load servant market error:', err);
      }
    }

    // Рендер рынка слуг
    function renderServantMarketList(servants) {
      servantMarketList.innerHTML = '';
      servants.forEach(servant => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <div>Слуга: @${servant.username}</div>
          <div>Цена: $${Number(servant.price).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        `;
        card.addEventListener('click', () => {
          currentServantId = servant.servant_id;
          switchToSection('servant-buy');
        });
        servantMarketList.appendChild(card);
      });
    }

    searchServants.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = marketServants.filter(s => s.username.toLowerCase().includes(query));
      renderServantMarketList(filtered);
    });

    // Загрузка своих объявлений
    async function loadMyAds() {
      try {
        const response = await fetch(`${apiBase}/my_ads/${telegramId}`);
        const myAds = await response.json();
        myAdsList.innerHTML = '';
        myAds.forEach(ad => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <div>Канал: @${ad.channel_username}</div>
            <div>Награда: $${Number(ad.reward).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
            <div>Бюджет: $${Number(ad.budget).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
            <div>Остаток: $${Number(ad.remaining).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
            <div>Опубликовано: ${ad.published ? 'Да' : 'Нет'}</div>
            <div>Активно: ${ad.active ? 'Да' : 'Нет'}</div>
          `;
          myAdsList.appendChild(card);
        });
      } catch (err) {
        console.error('Load my ads error:', err);
      }
    }

    showMyAdsBtn.addEventListener('click', () => {
      myAdsList.classList.toggle('hidden');
      loadMyAds();
    });

    // Загрузка объявлений
    async function loadAds() {
  try {
    const response = await fetch(`${apiBase}/ads`);
    const ads = await response.json();
    adsList.innerHTML = '';

    ads.forEach(ad => {
      const progressPercent = (ad.remaining / ad.budget) * 100;

      const card = document.createElement('div');
      card.classList.add('ad-card');
      card.innerHTML = `
        <div class="ad-header">
          <div class="ad-creator">@${ad.creator_username}</div>
          <div class="ad-reward">$${Number(ad.reward).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
        <div class="ad-details">
          <div class="ad-detail-item">
            <span class="detail-label">Бюджет</span>
            <span class="detail-value">$${Number(ad.budget).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
          </div>
          <div class="ad-detail-item">
            <span class="detail-label">Осталось</span>
            <span class="detail-value">$${Number(ad.remaining).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      `;

      card.addEventListener('click', () => {
        currentAdId = ad.id;
        currentChannel = ad.channel_username;
        switchToSection('claim-ad');
      });
      adsList.appendChild(card);
    });
  } catch (err) {
    console.error('Load ads error:', err);
  }
}

    createAdBtn.addEventListener('click', () => switchToSection('create-ad'));

    createAdSubmit.addEventListener('click', async () => {
      const channel = document.getElementById('channel-input').value.trim();
      const reward = Number(document.getElementById('reward-input').value);
      const budget = Number(document.getElementById('budget-input').value);
      if (!channel || isNaN(reward) || isNaN(budget) || reward <= 0 || budget <= 0 || reward > budget) {
        showToast('Неверные данные');
        return;
      }
      try {
        const res = await fetch(`${apiBase}/ad/create/${telegramId}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({channel_username: channel, reward, budget})
        });
        if (!res.ok) {
          const err = await res.json();
          showToast(err.error);
          return;
        }
        const ad = await res.json();
        currentAdId = ad.id;
        balance = Number(balance) - budget;
        updateUI();
        saveUserToLocal();
        document.getElementById('ad-form').style.display = 'none';
        document.getElementById('ad-step2').style.display = 'block';
        showToast('Объявление создано, перейдите к шагу 2');
      } catch (e) {
        showToast('Ошибка');
      }
    });

    confirmBotAdded.addEventListener('click', async () => {
      try {
        const res = await fetch(`${apiBase}/ad/${currentAdId}/is_bot_admin/${telegramId}`);
        const data = await res.json();
        if (data.is_admin) {
          publishBotPost.classList.remove('disabled');
          showToast('Бот добавлен');
        } else {
          showToast('Бот не добавлен или без прав');
        }
      } catch (e) {
        showToast('Ошибка');
      }
    });

    publishBotPost.addEventListener('click', async (e) => {
      if (e.target.classList.contains('disabled')) return;
      try {
        const res = await fetch(`${apiBase}/ad/${currentAdId}/publish_post/${telegramId}`, {method: 'POST'});
        if (res.ok) {
          publishAd.classList.remove('disabled');
          showToast('Пост опубликован');
        } else {
          showToast('Ошибка публикации поста');
        }
      } catch (e) {
        showToast('Ошибка');
      }
    });

    publishAd.addEventListener('click', async (e) => {
      if (e.target.classList.contains('disabled')) return;
      try {
        const res = await fetch(`${apiBase}/ad/${currentAdId}/publish/${telegramId}`, {method: 'POST'});
        if (res.ok) {
          showToast('Объявление опубликовано');
          switchToSection('market');
        } else {
          showToast('Ошибка');
        }
      } catch (e) {
        showToast('Ошибка');
      }
    });

    backToAdsBtn.addEventListener('click', () => switchToSection('market'));

    // Если хочешь разделить информацию, замени в loadClaimAd():
async function loadClaimAd() {
  try {
    const response = await fetch(`${apiBase}/ad/${currentAdId}?telegram_id=${telegramId}`);
    if (!response.ok) throw new Error('Ошибка загрузки');

    const ad = await response.json();
    const progressPercent = (ad.remaining / ad.budget) * 100;

    const claimSection = document.getElementById('claim-ad-section');
    claimSection.innerHTML = `
      <h2 class="section-title">Рекламная кампания</h2>

      <div class="ad-detail-card">
        <div class="ad-detail-header">
          <div class="ad-detail-title">@${ad.channel_username}</div>
        </div>

        <div class="ad-detail-stats">
          <div class="stat-card">
            <div class="stat-value reward">$${Number(ad.reward).toLocaleString('en-US', {minimumFractionDigits: 0})}</div>
            <div class="stat-label">Награда</div>
          </div>
          <div class="stat-card">
            <div class="stat-value budget">$${Number(ad.budget).toLocaleString('en-US', {minimumFractionDigits: 0})}</div>
            <div class="stat-label">Бюджет</div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: var(--text-secondary);">Прогресс бюджета</span>
            <span style="font-weight: 600;">${progressPercent.toFixed(1)}%</span>
          </div>
          <div class="progress-container">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="budget-info">
            <span>Осталось: $${Number(ad.remaining).toLocaleString('en-US', {minimumFractionDigits: 0})}</span>
            <span>Было: $${Number(ad.budget).toLocaleString('en-US', {minimumFractionDigits: 0})}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <a href="https://t.me/${ad.channel_username}" class="btn" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; font-size: 14px;">
            <i class="fab fa-telegram"></i>
            Подписаться
          </a>
          <div class="btn" id="check-subscribed" style="padding: 10px; font-size: 14px;">Я подписался</div>
        </div>

        <div class="btn disabled" id="claim-reward" style="margin-bottom: 12px; padding: 12px; font-size: 14px;">Получить награду</div>
      </div>

      <div class="btn" id="back-to-ads-from-claim-btn" style="padding: 12px;">Назад к объявлениям</div>
    `;

    // Перепривязываем события
    document.getElementById('check-subscribed').addEventListener('click', checkSubscribedHandler);
    document.getElementById('claim-reward').addEventListener('click', claimRewardHandler);
    document.getElementById('back-to-ads-from-claim-btn').addEventListener('click', () => switchToSection('market'));

  } catch (err) {
    console.error('Ошибка загрузки объявления:', err);
    showToast('Ошибка загрузки данных объявления');
  }
}

// Выносим обработчики в отдельные функции для переиспользования
async function checkSubscribedHandler() {
  try {
    const res = await fetch(`${apiBase}/ad/${currentAdId}/check_subscribed/${telegramId}`);
    const data = await res.json();
    if (data.subscribed) {
      const claimBtn = document.getElementById('claim-reward');
      claimBtn.classList.remove('disabled');
      claimBtn.classList.add('btn-green');
      showToast('Подписка подтверждена!');
    } else {
      showToast('Вы не подписаны на канал');
    }
  } catch (e) {
    showToast('Ошибка проверки подписки');
  }
}

async function claimRewardHandler(e) {
  if (e.target.classList.contains('disabled')) return;

  const claimBtn = document.getElementById('claim-reward');
  claimBtn.classList.add('disabled');
  const originalText = claimBtn.textContent;
  claimBtn.textContent = 'Обработка...';

  try {
    const res = await fetch(`${apiBase}/ad/${currentAdId}/claim/${telegramId}`, {
      method: 'POST'
    });

    if (res.ok) {
      const data = await res.json();
      balance = Number(data.balance);
      updateUI();
      saveUserToLocal();
      showToast(data.message || 'Награда получена успешно!');
      await syncUserData();
      switchToSection('market');
    } else {
      const errorData = await res.json().catch(() => ({ error: 'unknown' }));
      showToast(errorData.error || 'Ошибка получения награды');
      await loadClaimAd();
    }
  } catch (err) {
    console.error('Claim error:', err);
    showToast('Ошибка сети. Попробуйте позже.');
    await loadClaimAd();
  } finally {
    claimBtn.textContent = originalText;
  }
}

    backToAdsFromClaimBtn.addEventListener('click', () => switchToSection('market'));

    // Загрузка страницы покупки акций
    async function loadStockBuy() {
      if (!currentCompanyId) return;

      try {
        const response = await fetch(`${apiBase}/company/${currentCompanyId}`);
        const company = await response.json();
        buyCompanyNameEl.textContent = company.name;
buyCompanyOwnerEl.textContent = `@${company.owner_username}`;
buyCompanyClientsEl.textContent = Number(company.clients_count).toLocaleString('en-US');
buyCompanyPriceEl.textContent = `$${Number(company.price).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
buyCompanyAvailableEl.textContent = Number(company.available).toLocaleString('en-US');
      } catch (err) {
        console.error('Load buy error:', err);
      }
    }

    // Загрузка страницы продажи акций
async function loadStockSell() {
  if (!currentCompanyId) return;

  try {
    const response = await fetch(`${apiBase}/holding/${telegramId}/${currentCompanyId}`);
    const holding = await response.json();

    const companyResponse = await fetch(`${apiBase}/company/${currentCompanyId}`);
    const company = await companyResponse.json();

    sellCompanyNameEl.textContent = holding.name || company.name;
    sellCompanySharesEl.textContent = Number(holding.shares).toLocaleString('en-US');
    sellCompanyPriceEl.textContent = `$${Number(company.price).toLocaleString('en-US', {minimumFractionDigits: 2})}`;

  } catch (err) {
    console.error('Load stock sell error:', err);
    showToast('Ошибка загрузки данных');
  }
}

    // Загрузка страницы покупки слуги
    async function loadServantBuy() {
      if (!currentServantId) return;

      try {
        const response = await fetch(`${apiBase}/servant_market/${currentServantId}`);
        const servant = await response.json();
        buyServantUsernameEl.textContent = `@${servant.username}`;
        buyServantPriceEl.textContent = `$${Number(servant.price).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      } catch (err) {
        console.error('Load servant buy error:', err);
      }
    }


    // Покупка акций
async function buyShares() {
  // 🔴 ЖЕСТКАЯ ВАЛИДАЦИЯ ВВОДА
  const inputValue = String(buyAmountInput.value).trim();
  const amount = parseInt(inputValue, 10);

  console.log('🔍 DEBUG: Input value:', inputValue, 'Parsed amount:', amount);

  // 🔴 ПРОВЕРКА 1: Корректность числа
  if (isNaN(amount) || !Number.isInteger(amount)) {
    showToast('Введите целое число');
    return;
  }

  // 🔴 ПРОВЕРКА 2: Положительное значение
  if (amount <= 0) {
    showToast('Введите положительное количество');
    return;
  }

  // 🔴 ПРОВЕРКА 3: Максимум за покупку
  if (amount > 10000) {
    showToast('Максимум 10,000 акций за покупку');
    return;
  }

  // 🔴 ПРОВЕРКА 4: Защита от переполнения
  if (inputValue !== amount.toString()) {
    showToast('Обнаружена ошибка ввода. Введите число от 1 до 10000');
    return;
  }

  // 🔴 ПРОВЕРКА 5: Проверяем текущие акции и лимит
  try {
    const holdingRes = await fetch(`${apiBase}/holding/${telegramId}/${currentCompanyId}`);
    if (holdingRes.ok) {
      const holding = await holdingRes.json();
      const currentShares = Number(holding.shares) || 0;

      if (currentShares + amount > 3000) {
        const canBuy = 3000 - currentShares;
        showToast(`Лимит 3,000 акций! У вас: ${currentShares}. Можете купить: ${canBuy}`);
        return;
      }
    }
  } catch (err) {
    console.log('Холдинг не найден, можно покупать');
  }

  // 🔴 ПРОВЕРКА 6: Проверяем доступные акции на рынке
  try {
    const companyRes = await fetch(`${apiBase}/company/${currentCompanyId}`);
    if (companyRes.ok) {
      const company = await companyRes.json();
      const available = Number(company.available) || 0;

      if (amount > available) {
        showToast(`На рынке только ${available} акций`);
        return;
      }
    }
  } catch (err) {
    console.log('Ошибка проверки доступных акций');
  }

  // ✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ - ПОКУПАЕМ
  try {
    console.log('🛒 FINAL: Отправляем на сервер amount =', amount);

    const response = await fetch(`${apiBase}/buy/${telegramId}/${currentCompanyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount }) // 🔴 Явно передаем число
    });

    if (!response.ok) {
      const error = await response.json();
      showToast(error.error || 'Ошибка покупки');
      return;
    }

    const updated = await response.json();
    balance = Number(updated.balance);
    saveUserToLocal();
    buyAmountInput.value = '';

    // Расчет стоимости
    const priceText = buyCompanyPriceEl.textContent.replace('$', '').replace(/,/g, '');
    const price = parseFloat(priceText);
    const cost = amount * price;

    showToast(`Куплено ${amount} акций за $${cost.toLocaleString()}`);
    updateUI();
    await loadStockBuy();

  } catch (err) {
    console.error('❌ Ошибка покупки:', err);
    showToast('Ошибка соединения с сервером');
  }
}

    buySharesBtn.addEventListener('click', buyShares);

// Продажа акций
async function sellShares() {
  const amount = Number(sellAmountInput.value);
  if (isNaN(amount) || amount <= 0) {
    showToast('Введите положительное количество');
    return;
  }

  try {
    const response = await fetch(`${apiBase}/sell/${telegramId}/${currentCompanyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      const error = await response.json();
      showToast(error.error || 'Ошибка продажи');
      return;
    }

    const updated = await response.json();
    balance = Number(updated.balance);
    saveUserToLocal();
    sellAmountInput.value = '';
    showToast('Акции проданы успешно');
    updateUI();
    await loadStockSell(); // Перезагружаем данные
  } catch (err) {
    showToast('Ошибка продажи');
  }
}
    // Покупка слуги
    async function buyServant() {
      try {
        const response = await fetch(`${apiBase}/buy_servant/${telegramId}/${currentServantId}`, {
          method: 'POST'
        });
        if (!response.ok) {
          const error = await response.json();
          showToast(error.error || 'Ошибка покупки');
          return;
        }
        const updated = await response.json();
        balance = Number(updated.balance);
        servantsCount = Number(updated.servants_count);
        saveUserToLocal();
        showToast('Слуга куплен успешно');
        updateUI();
        switchToSection('market');
      } catch (err) {
        showToast('Ошибка покупки');
      }
    }

    buyServantBtn.addEventListener('click', buyServant);

    backToWalletBtn.addEventListener('click', () => switchToSection('wallet'));

    // ДОБАВЬ ЭТУ СТРОКУ:
    sellSharesBtn.addEventListener('click', sellShares);

    backToMarketBtn.addEventListener('click', () => switchToSection('market'));
    backToMarketServantBtn.addEventListener('click', () => switchToSection('market'));


    // Загрузка холдингов
    // Загрузка холдингов - FIXED VERSION
// Загрузка холдингов - ОБНОВЛЕННАЯ ВЕРСИЯ
async function loadHoldings() {
  try {
    const response = await fetch(`${apiBase}/holdings/${telegramId}`);
    const holdings = await response.json();
    holdingsList.innerHTML = '';

    holdings.forEach(holding => {
      const card = document.createElement('div');
      card.classList.add('card');

      // Используем BigInt для больших чисел
      const shares = BigInt(holding.shares);
      const avgPrice = parseFloat(holding.avg_price);
      const currentPrice = parseFloat(holding.current_price);

      // Безопасный расчет дохода
      let profit = 0;
      try {
        // Для очень больших чисел используем BigInt
        if (shares > 1000000000) {
          const priceDiff = BigInt(Math.floor(currentPrice * 100)) - BigInt(Math.floor(avgPrice * 100));
          profit = Number((priceDiff * shares) / 100n);
        } else {
          // Для обычных чисел обычная арифметика
          profit = (currentPrice - avgPrice) * Number(shares);
        }
      } catch (e) {
        console.error('Profit calculation error:', e);
        profit = 0;
      }

      card.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <div style="font-size: 18px; font-weight: bold;">${holding.name}</div>
    <div style="font-size: 20px; font-weight: bold; color: var(--accent-success);">+$${profit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
  </div>

  <div style="margin-bottom: 15px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; width: 48%;">
        <div style="font-size: 14px; font-weight: 600; color: var(--text-secondary);">Акций</div>
        <div style="font-size: 14px; font-weight: bold;">${shares.toLocaleString('en-US')}</div>
      </div>
      <div style="display: flex; justify-content: space-between; width: 48%;">
        <div style="font-size: 14px; font-weight: 600; color: var(--text-secondary);">Цена покупки</div>
        <div style="font-size: 14px; font-weight: bold;">$${avgPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex; justify-content: space-between; width: 48%;">
        <div style="font-size: 14px; font-weight: 600; color: var(--text-secondary);">Текущая цена</div>
        <div style="font-size: 14px; font-weight: bold;">$${currentPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
      <div style="display: flex; justify-content: space-between; width: 48%;">
        <div style="font-size: 14px; font-weight: 600; color: var(--text-secondary);">Доход</div>
        <div style="font-size: 14px; font-weight: bold;">$${profit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
    <div class="btn" data-action="buy-more">Купить еще</div>
    <div class="btn" data-action="sell">Продать</div>
  </div>
`;

      card.querySelector('[data-action="buy-more"]').addEventListener('click', () => {
        currentCompanyId = holding.company_id;
        switchToSection('stock-buy');
      });

      card.querySelector('[data-action="sell"]').addEventListener('click', () => {
        currentCompanyId = holding.company_id;
        switchToSection('stock-sell');
      });

      holdingsList.appendChild(card);
    });
  } catch (err) {
    console.error('Load holdings error:', err);
  }
}

    // Загрузка слуг
    async function loadServants() {
      try {
        const response = await fetch(`${apiBase}/servants/${telegramId}`);
        const servants = await response.json();
        let totalSec = 0;
        let totalTax = 0;
        if (servants.length > 0) {
          totalSec = Number(servants.length) * 1;
        }
        servantsList.innerHTML = '';
        servants.forEach(serv => {
          totalTax = Number(totalTax) + (0.05 * Number(serv.balance));
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <div>Слуга: @${serv.username}</div>
            <div>Ежесекундный доход: $1</div>
            <div class="btn" data-action="free">Освободить</div>
            <div class="btn" data-action="sell">Продать</div>
          `;
          card.querySelector('[data-action="free"]').addEventListener('click', async () => {
            if (confirm('Освободить слугу?')) {
              await fetch(`${apiBase}/free_servant/${telegramId}/${serv.telegram_id}`, { method: 'POST' });
              showToast('Слуга освобожден');
              loadServants();
            }
          });
          card.querySelector('[data-action="sell"]').addEventListener('click', async () => {
            const price = prompt('Сумма продажи');
            if (price && !isNaN(Number(price))) {
              await fetch(`${apiBase}/sell_servant/${telegramId}/${serv.telegram_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: Number(price) })
              });
              showToast('Слуга выставлен на продажу');
              loadServants();
            }
          });
          servantsList.appendChild(card);
        });
        secIncomeEl.textContent = totalSec.toLocaleString('en-US');
        dailyTaxEl.textContent = totalTax.toLocaleString('en-US', {minimumFractionDigits: 2});
      } catch (err) {
        console.error('Load servants error:', err);
      }
      updatePendingIncome();
    }

    // Обновление накопленного дохода с лимитом
    function updatePendingIncome() {
      if (servantsCount === 0) {
        pendingIncome = 0;
      } else {
        const now = Date.now();
        const elapsed = (now - lastClaimTime) / 1000;
        pendingIncome = Math.min(servantsCount * elapsed, MAX_PENDING_INCOME);
      }
      pendingIncomeEl.textContent = Number(pendingIncome).toLocaleString('en-US', {minimumFractionDigits: 2});
    }

    // Заявка дохода
    async function claimIncome() {
      try {
        const response = await fetch(`${apiBase}/claim_income/${telegramId}`, { method: 'POST' });
        if (!response.ok) {
          const error = await response.json();
          showToast(error.error || 'Ошибка заявки дохода');
          return;
        }
        const updated = await response.json();
        balance = Number(updated.balance);
        lastClaimTime = Date.now();
        pendingIncome = 0;
        saveUserToLocal();
        updateUI();
        updatePendingIncome();
        showToast('Доход заявлен успешно');
      } catch (err) {
        showToast('Ошибка заявки дохода');
      }
    }

    claimIncomeBtn.addEventListener('click', claimIncome);

    // Pull-to-refresh для market
    marketSection.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });

    marketSection.addEventListener('touchmove', (e) => {
      touchEndY = e.touches[0].clientY;
    });

    marketSection.addEventListener('touchend', () => {
      if (touchEndY - touchStartY > 100 && window.scrollY === 0) {
        const activeTab = document.querySelector('#market-section .tab.active').dataset.tab;
        if (activeTab === 'stocks') {
          loadMarket(true);
        } else if (activeTab === 'servants') {
          loadServantMarket(true);
        } else if (activeTab === 'top') {
          loadTopPlayers();
          showToast('Данные обновлены');
        } else if (activeTab === 'ads') {
          loadAds();
          showToast('Данные обновлены');
        }
      }
    });

    let clickCount = 0;
    marketNavItem.addEventListener('click', () => {
      clickCount++;
      setTimeout(() => { clickCount = 0; }, 300);
      if (clickCount === 2) {
        const activeTab = document.querySelector('#market-section .tab.active').dataset.tab;
        if (activeTab === 'stocks') {
          loadMarket(true);
        } else if (activeTab === 'servants') {
          loadServantMarket(true);
        } else if (activeTab === 'top') {
          loadTopPlayers();
          showToast('Данные обновлены');
        } else if (activeTab === 'ads') {
          loadAds();
          showToast('Данные обновлены');
        }
      }
    });

    // Магазин
    const shopBtn = document.getElementById('shop-btn');
    shopBtn.addEventListener('click', () => switchToSection('shop'));
    // Настройки
const settingsBtn = document.getElementById('settings-btn');
settingsBtn.addEventListener('click', () => switchToSection('settings'));

    async function buyPackage(packageId) {
      try {
        const res = await fetch(`${apiBase}/create_invoice/${telegramId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_id: packageId })
        });
        const data = await res.json();
        if (data.pay_url) {
          window.Telegram.WebApp.openTelegramLink(data.pay_url);
        } else {
          showToast("Ошибка при создании платежа");
        }
      } catch (err) {
        console.error(err);
        showToast("Ошибка сети");
      }
    }

    // Синхронизация при выходе
    window.addEventListener('beforeunload', syncUserData);

    // Инициализация
    initUser();


