(() => {
    'use strict';

    const CATEGORY_ICONS = {
        'Clothes': '👕', 'Electronics': '📱', 'Furniture': '🪑', 'Books': '📚',
        'Toys': '🧸', 'Kitchen': '🍳', 'Shoes': '👟', 'Accessories': '🎒',
        'Sports': '⚽', 'Other': '📦'
    };

    // Internal values stay in English for compatibility with saved data and CSS classes.
    const CATEGORY_LABELS = {
        'Clothes': 'Roupas', 'Electronics': 'Eletrônicos', 'Furniture': 'Móveis', 'Books': 'Livros',
        'Toys': 'Brinquedos', 'Kitchen': 'Cozinha', 'Shoes': 'Calçados', 'Accessories': 'Acessórios',
        'Sports': 'Esportes', 'Other': 'Outros'
    };

    const CONDITION_LABELS = {
        'New': 'Novo', 'Like New': 'Seminovo', 'Good': 'Bom', 'Fair': 'Regular'
    };

    const STATUS_LABELS = {
        'Available': 'Disponível', 'Reserved': 'Reservado', 'Donated': 'Doado'
    };

    const REQUEST_TYPE_LABELS = {
        'Donation': 'Doação', 'Trade': 'Troca'
    };

    const REQUEST_STATUS_LABELS = {
        'Pending': 'Pendente', 'Accepted': 'Aceita', 'Rejected': 'Recusada', 'Completed': 'Concluída'
    };

    const categoryLabel = (value) => CATEGORY_LABELS[value] || value || '';
    const conditionLabel = (value) => CONDITION_LABELS[value] || value || '';
    const statusLabel = (value) => STATUS_LABELS[value] || value || '';
    const requestTypeLabel = (value) => REQUEST_TYPE_LABELS[value] || value || '';
    const requestStatusLabel = (value) => REQUEST_STATUS_LABELS[value] || value || '';

    const DB = {
        read: (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)),
        write: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        getUsers: () => DB.read('repassa_users', []),
        saveUsers: (users) => DB.write('repassa_users', users),
        getUser: (id) => DB.getUsers().find(u => u.id === id),
        getCurrentUser: () => JSON.parse(localStorage.getItem('repassa_current') || 'null'),
        setCurrentUser: (user) => localStorage.setItem('repassa_current', JSON.stringify(user)),
        getAllItems: () => DB.read('repassa_items', []),
        getItems: (userId) => DB.getAllItems().filter(i => i.userId === userId),
        saveItem: (item) => {
            const all = DB.getAllItems();
            const idx = all.findIndex(i => i.id === item.id);
            if (idx >= 0) {
                all[idx] = item;
            } else {
                all.push(item);
            }
            DB.write('repassa_items', all);
        },
        deleteItem: (id) => DB.write('repassa_items', DB.getAllItems().filter(i => i.id !== id)),
        getRequests: () => DB.read('repassa_requests', []),
        saveRequests: (requests) => DB.write('repassa_requests', requests),
        getConversations: () => DB.read('repassa_conversations', []),
        saveConversations: (conversations) => DB.write('repassa_conversations', conversations),
        getMessages: () => DB.read('repassa_messages', []),
        saveMessages: (messages) => DB.write('repassa_messages', messages),
        generateId: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    };

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);
    const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

    const screens = {
        login: $('#login-screen'),
        register: $('#register-screen'),
        home: $('#home-screen'),
        search: $('#search-screen'),
        categories: $('#categories-screen'),
        chat: $('#chat-screen')
    };

    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
        document.body.classList.toggle('authed',
            name === 'home' || name === 'search' || name === 'categories' || name === 'chat');
        if (name === 'home' || name === 'search' || name === 'categories' || name === 'chat') setActiveTab(name);
    }

    function setActiveTab(tab) {
        $$('#app-nav .nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    }

    const toastEl = $('#toast');
    let toastTimeout;
    function showToast(msg, type = 'success') {
        clearTimeout(toastTimeout);
        toastEl.textContent = msg;
        toastEl.className = `toast ${type} show`;
        toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 3000);
    }

    /* ========== AUTH ========== */

    function initAuth() {
        $('#go-register').addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('register');
        });

        $('#go-login').addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('login');
        });

        $('#login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = $('#login-email').value.trim();
            const password = $('#login-password').value;
            const users = DB.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                showToast('E-mail ou senha inválidos', 'error');
                return;
            }
            DB.setCurrentUser(user);
            showScreen('home');
            loadItems();
            updateChatBadge();
            showToast(`Bem-vindo(a), ${user.name.split(' ')[0]}!`);
        });

        $('#register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#reg-name').value.trim();
            const email = $('#reg-email').value.trim();
            const phone = $('#reg-phone').value.trim();
            const city = $('#reg-city').value.trim();
            const password = $('#reg-password').value;
            const confirm = $('#reg-confirm').value;

            if (password !== confirm) {
                showToast('As senhas não coincidem', 'error');
                return;
            }

            const users = DB.getUsers();
            if (users.find(u => u.email === email)) {
                showToast('E-mail já cadastrado', 'error');
                return;
            }

            const newUser = {
                id: DB.generateId(),
                name,
                email,
                phone,
                city,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            DB.saveUsers(users);
            DB.setCurrentUser(newUser);
            showScreen('home');
            loadItems();
            updateChatBadge();
            showToast('Conta criada com sucesso!');
        });

        $$('.btn-logout').forEach(btn => {
            btn.addEventListener('click', () => {
                DB.setCurrentUser(null);
                closeModal();
                closeDetail();
                closeRequest();
                closeChat();
                closeProfile();
                showScreen('login');
                $('#login-email').value = '';
                $('#login-password').value = '';
                $('#nav-chat-badge').style.display = 'none';
                setActiveTab('home');
                showToast('Sessão encerrada');
            });
        });
    }

    /* ========== NAVIGATION ========== */

    function initNav() {
        $$('#app-nav .nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                if (tab === 'add') {
                    openModal('Novo item para doação');
                    return;
                }
                if (tab === 'profile') {
                    openProfile();
                    return;
                }
                showScreen(tab);
                if (tab === 'home') loadItems();
                if (tab === 'search') runSearch();
                if (tab === 'categories') loadCategories();
                if (tab === 'chat') loadConversations();
            });
        });
    }

    /* ========== ITEM MODAL + CONFIRMATION ========== */

    const modal = $('#modal');
    const detailModal = $('#detail-modal');
    let pendingItem = null;

    function openModal(title) {
        $('#modal-title').textContent = title;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        $('#item-form').reset();
        $('#item-id').value = '';
        pendingItem = null;
        backToForm();
    }

    function openDetail(item) {
        const me = DB.getCurrentUser();
        const isOwner = me && item.userId === me.id;
        const icon = CATEGORY_ICONS[item.category] || '📦';
        const date = new Date(item.createdAt).toLocaleDateString('pt-BR');
        const owner = DB.getUser(item.userId);

        $('#detail-body').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Categoria</span>
                <span class="detail-value">${icon} ${esc(categoryLabel(item.category))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Nome do item</span>
                <span class="detail-value">${esc(item.title)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Condição</span>
                <span class="detail-value">${esc(conditionLabel(item.condition))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Descrição</span>
                <span class="detail-value">${esc(item.description || '—')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Cidade</span>
                <span class="detail-value">${esc(item.city)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Bairro</span>
                <span class="detail-value">${esc(item.neighborhood || '—')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Anunciante</span>
                <span class="detail-value">${esc(owner ? owner.name : 'Desconhecido')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Situação</span>
                <span class="detail-value"><span class="item-card-status ${item.status}">${esc(statusLabel(item.status))}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Cadastrado em</span>
                <span class="detail-value">${date}</span>
            </div>
        `;

        $('#detail-actions-own').style.display = isOwner ? 'flex' : 'none';
        $('#detail-actions-other').style.display = isOwner ? 'none' : 'flex';

        detailModal.classList.add('active');
        detailModal.dataset.id = item.id;
    }

    function closeDetail() {
        detailModal.classList.remove('active');
    }

    function initModal() {
        $('#modal-close').addEventListener('click', closeModal);
        $('#modal-close-btn').addEventListener('click', closeModal);
        $('#detail-close').addEventListener('click', closeDetail);
        $('#detail-close-btn').addEventListener('click', closeDetail);

        $('#btn-add').addEventListener('click', () => openModal('Novo item para doação'));

        $('#btn-confirm-back').addEventListener('click', backToForm);
        $('#btn-confirm-save').addEventListener('click', confirmItem);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeDetail();
        });
    }

    function loadItems() {
        const user = DB.getCurrentUser();
        if (!user) return;

        const items = DB.getItems(user.id);
        const list = $('#items-list');

        $('#stat-total').textContent = items.length;
        $('#stat-available').textContent = items.filter(i => i.status === 'Available').length;
        $('#stat-donated').textContent = items.filter(i => i.status === 'Donated').length;

        if (items.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Nenhum item cadastrado</p>
                    <span>Adicione seu primeiro item para doação!</span>
                </div>
            `;
            return;
        }

        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        list.innerHTML = items.map(item => {
            const icon = CATEGORY_ICONS[item.category] || '📦';
            const date = new Date(item.createdAt).toLocaleDateString('pt-BR');
            return `
                <div class="item-card status-${item.status}" data-id="${item.id}">
                    <div class="item-card-header">
                        <span class="item-card-title">${icon} ${esc(item.title)}</span>
                        <span class="item-card-status ${item.status}">${esc(statusLabel(item.status))}</span>
                    </div>
                    <div class="item-card-info">
                        <span>📍 ${esc(item.city)}${item.neighborhood ? ', ' + esc(item.neighborhood) : ''}</span>
                        <span>📅 ${date} · ${esc(conditionLabel(item.condition))}</span>
                    </div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const item = items.find(x => x.id === card.dataset.id);
                if (item) openDetail(item);
            });
        });
    }

    function buildItemFromForm() {
        const user = DB.getCurrentUser();
        const existingId = $('#item-id').value;
        const id = existingId || DB.generateId();
        const isNew = !existingId;
        const previous = DB.getAllItems().find(i => i.id === id);

        return {
            item: {
                id,
                userId: user.id,
                category: $('#item-category').value,
                title: $('#item-title').value.trim(),
                condition: $('#item-condition').value,
                description: $('#item-description').value.trim(),
                city: $('#item-city').value.trim(),
                neighborhood: $('#item-neighborhood').value.trim(),
                status: $('#item-status').value,
                createdAt: isNew ? new Date().toISOString() : (previous ? previous.createdAt : new Date().toISOString()),
                updatedAt: new Date().toISOString()
            },
            isNew
        };
    }

    function submitItemForm(e) {
        e.preventDefault();
        const user = DB.getCurrentUser();
        if (!user) return;

        const { item, isNew } = buildItemFromForm();

        if (!isNew) {
            saveItemRecord(item, isNew);
            return;
        }

        // "Adicionar item" -> "Inserir detalhes do item" -> "Confirmar cadastro do produto"
        pendingItem = item;
        renderItemConfirmation(item);
        $('#item-form').style.display = 'none';
        $('#item-confirm').style.display = 'block';
        $('#modal-title').textContent = 'Confirmar cadastro';
    }

    function renderItemConfirmation(item) {
        const icon = CATEGORY_ICONS[item.category] || '📦';
        $('#item-confirm-summary').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Categoria</span>
                <span class="detail-value">${icon} ${esc(categoryLabel(item.category))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Nome do item</span>
                <span class="detail-value">${esc(item.title)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Condição</span>
                <span class="detail-value">${esc(conditionLabel(item.condition))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Descrição</span>
                <span class="detail-value">${esc(item.description || '—')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Localização</span>
                <span class="detail-value">${esc(item.city)}${item.neighborhood ? ', ' + esc(item.neighborhood) : ''}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Situação</span>
                <span class="detail-value"><span class="item-card-status ${item.status}">${esc(statusLabel(item.status))}</span></span>
            </div>
        `;
    }

    function backToForm() {
        $('#item-form').style.display = 'block';
        $('#item-confirm').style.display = 'none';
        if (!pendingItem && !$('#item-id').value) {
            $('#modal-title').textContent = 'Novo item para doação';
        }
    }

    function confirmItem() {
        if (!pendingItem) return;
        saveItemRecord(pendingItem, true);
        pendingItem = null;
    }

    function saveItemRecord(item, isNew) {
        DB.saveItem(item);
        closeModal();
        loadItems();
        showToast(isNew ? 'Item cadastrado!' : 'Item atualizado!');
    }

    function deleteItem(id) {
        if (!confirm('Tem certeza de que deseja excluir este item?')) return;
        DB.deleteItem(id);
        closeDetail();
        loadItems();
        if (screens.search.classList.contains('active')) runSearch();
        showToast('Item excluído');
    }

    function initCrud() {
        $('#item-form').addEventListener('submit', submitItemForm);

        $('#btn-edit-detail').addEventListener('click', () => {
            const id = detailModal.dataset.id;
            const user = DB.getCurrentUser();
            const item = DB.getItems(user.id).find(i => i.id === id);
            if (!item) return;

            closeDetail();

            setTimeout(() => {
                $('#item-id').value = item.id;
                $('#item-category').value = item.category;
                $('#item-title').value = item.title;
                $('#item-condition').value = item.condition;
                $('#item-description').value = item.description || '';
                $('#item-city').value = item.city;
                $('#item-neighborhood').value = item.neighborhood || '';
                $('#item-status').value = item.status;
                openModal('Editar item');
            }, 300);
        });

        $('#btn-delete-detail').addEventListener('click', () => {
            deleteItem(detailModal.dataset.id);
        });
    }

    /* ========== SEARCH (Pesquisar produto) ========== */

    function runSearch() {
        const me = DB.getCurrentUser();
        if (!me) return;

        const keyword = $('#search-keyword').value.trim().toLowerCase();
        const category = $('#search-category').value;
        const city = $('#search-city').value.trim().toLowerCase();
        const condition = $('#search-condition').value;

        const results = DB.getAllItems().filter(item => {
            if (item.userId === me.id) return false;
            if (item.status !== 'Available') return false;
            if (category && item.category !== category) return false;
            if (condition && item.condition !== condition) return false;
            if (city && !(item.city || '').toLowerCase().includes(city)) return false;
            if (keyword) {
                const haystack = `${item.title} ${item.description || ''} ${item.neighborhood || ''}`.toLowerCase();
                if (!haystack.includes(keyword)) return false;
            }
            return true;
        });

        renderSearchResults(results);
    }

    function renderSearchResults(items) {
        const list = $('#search-results');

        if (items.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <p>Nenhum item encontrado</p>
                    <span>Tente outra palavra-chave ou categoria</span>
                </div>
            `;
            return;
        }

        list.innerHTML = items.map(item => {
            const icon = CATEGORY_ICONS[item.category] || '📦';
            const owner = DB.getUser(item.userId);
            const date = new Date(item.createdAt).toLocaleDateString('pt-BR');
            return `
                <div class="item-card status-${item.status}" data-id="${item.id}">
                    <div class="item-card-header">
                        <span class="item-card-title">${icon} ${esc(item.title)}</span>
                        <span class="item-card-status ${item.status}">${esc(statusLabel(item.status))}</span>
                    </div>
                    <div class="item-card-info">
                        <span>📍 ${esc(item.city)}${item.neighborhood ? ', ' + esc(item.neighborhood) : ''}</span>
                        <span>📅 ${date} · ${esc(conditionLabel(item.condition))}</span>
                    </div>
                    <div class="item-card-owner">👤 ${esc(owner ? owner.name : 'Desconhecido')}</div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const item = items.find(x => x.id === card.dataset.id);
                if (item) openDetail(item);
            });
        });
    }

    function initSearch() {
        $('#btn-search').addEventListener('click', runSearch);
        $('#search-keyword').addEventListener('input', runSearch);
        $('#search-city').addEventListener('input', runSearch);
        $('#search-category').addEventListener('change', runSearch);
        $('#search-condition').addEventListener('change', runSearch);
    }

    /* ========== CATEGORIES (Fluxo: pesquisar -> exibir -> selecionar -> detalhes -> retirada -> chat) ========== */

    let selectedCategory = null;

    function loadCategories() {
        const me = DB.getCurrentUser();
        if (!me) return;

        const query = ($('#category-search').value || '').trim().toLowerCase();
        const available = DB.getAllItems().filter(i => i.status === 'Available');

        const categories = Object.keys(CATEGORY_LABELS)
            .filter(key => !query || categoryLabel(key).toLowerCase().includes(query))
            .map(key => ({
                key,
                icon: CATEGORY_ICONS[key] || '📦',
                label: categoryLabel(key),
                count: available.filter(i => i.category === key).length
            }));

        const grid = $('#categories-grid');
        if (categories.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <p>Nenhuma categoria encontrada</p>
                    <span>Tente outra palavra-chave</span>
                </div>
            `;
            return;
        }

        grid.innerHTML = categories.map(cat => `
            <button type="button" class="category-card" data-category="${cat.key}">
                <span class="category-card-icon">${cat.icon}</span>
                <span class="category-card-name">${esc(cat.label)}</span>
                <span class="category-card-count">${cat.count} item${cat.count === 1 ? '' : 's'}</span>
            </button>
        `).join('');

        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => selectCategory(card.dataset.category));
        });
    }

    function selectCategory(category) {
        const me = DB.getCurrentUser();
        if (!me) return;

        selectedCategory = category;
        const items = DB.getAllItems()
            .filter(i => i.category === category && i.status === 'Available')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        $('#categories-header').style.display = 'none';
        $('#categories-grid').style.display = 'none';
        $('#category-items-panel').style.display = 'block';
        $('#category-items-title').textContent =
            `${CATEGORY_ICONS[category] || '📦'} ${categoryLabel(category)}`;

        const list = $('#category-items');
        if (items.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Nenhum item nesta categoria</p>
                    <span>Volte e escolha outra categoria</span>
                </div>
            `;
            return;
        }

        list.innerHTML = items.map(item => {
            const icon = CATEGORY_ICONS[item.category] || '📦';
            const owner = DB.getUser(item.userId);
            const date = new Date(item.createdAt).toLocaleDateString('pt-BR');
            return `
                <div class="item-card status-${item.status}" data-id="${item.id}">
                    <div class="item-card-header">
                        <span class="item-card-title">${icon} ${esc(item.title)}</span>
                        <span class="item-card-status ${item.status}">${esc(statusLabel(item.status))}</span>
                    </div>
                    <div class="item-card-info">
                        <span>📍 ${esc(item.city)}${item.neighborhood ? ', ' + esc(item.neighborhood) : ''}</span>
                        <span>📅 ${date} · ${esc(conditionLabel(item.condition))}</span>
                    </div>
                    <div class="item-card-owner">👤 ${esc(owner ? owner.name : 'Desconhecido')}</div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const item = DB.getAllItems().find(i => i.id === card.dataset.id);
                if (item) openDetail(item);
            });
        });
    }

    function backToCategories() {
        selectedCategory = null;
        $('#category-items-panel').style.display = 'none';
        $('#category-items').innerHTML = '';
        $('#categories-header').style.display = '';
        $('#categories-grid').style.display = '';
        loadCategories();
    }

    function initCategories() {
        $('#category-search').addEventListener('input', () => {
            if (selectedCategory) backToCategories();
            else loadCategories();
        });
        $('#btn-back-categories').addEventListener('click', backToCategories);
    }

    /* ========== REQUESTS (Solicitar doacao ou troca) ========== */

    const requestModal = $('#request-modal');

    function openRequest(item) {
        closeDetail();
        const me = DB.getCurrentUser();
        if (!me) {
            showToast('Faça login para solicitar um item', 'error');
            return;
        }
        const myItems = DB.getItems(me.id).filter(i => i.status === 'Available');
        const icon = CATEGORY_ICONS[item.category] || '📦';

        $('#request-item-id').value = item.id;
        $('#request-item-name').textContent = `${icon} ${item.title}`;
        $('#request-type').value = 'Donation';
        $('#request-message').value = '';
        $('#request-offered-item').innerHTML = myItems.length
            ? myItems.map(i => `<option value="${i.id}">${esc(i.title)}</option>`).join('')
            : '<option value="">Nenhum item disponível para oferecer</option>';
        toggleOfferedGroup();

        requestModal.classList.add('active');
    }

    function toggleOfferedGroup() {
        $('#offered-item-group').style.display = $('#request-type').value === 'Trade' ? 'block' : 'none';
    }

    function closeRequest() {
        requestModal.classList.remove('active');
    }

    function submitRequest(e) {
        e.preventDefault();
        const me = DB.getCurrentUser();
        if (!me) {
            showToast('Faça login para solicitar um item', 'error');
            return;
        }
        const itemId = $('#request-item-id').value;
        const item = DB.getAllItems().find(i => i.id === itemId);
        if (!item) return;

        const type = $('#request-type').value;
        const message = $('#request-message').value.trim();

        if (DB.getRequests().find(r => r.itemId === itemId && r.requesterId === me.id)) {
            showToast('Você já fez uma solicitação para este item', 'error');
            return;
        }

        let offered = null;
        if (type === 'Trade') {
            const offeredId = $('#request-offered-item').value;
            if (!offeredId) {
                showToast('Escolha um dos seus itens para oferecer na troca', 'error');
                return;
            }
            offered = DB.getAllItems().find(i => i.id === offeredId);
        }

        const owner = DB.getUser(item.userId);
        const request = {
            id: DB.generateId(),
            itemId: item.id,
            itemTitle: item.title,
            ownerId: item.userId,
            ownerName: owner ? owner.name : 'Anunciante',
            requesterId: me.id,
            requesterName: me.name,
            type,
            offeredItemId: offered ? offered.id : null,
            offeredItemTitle: offered ? offered.title : null,
            message,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        const requests = DB.getRequests();
        requests.push(request);
        DB.saveRequests(requests);

        // "Solicitar doacao ou troca" includes starting the chat with the announcer.
        const conversation = findOrCreateConversation(item);
        const intro = message || (type === 'Trade'
            ? 'Olá! Gostaria de trocar por este item.'
            : 'Olá! Gostaria de solicitar este item.');
        appendMessage(conversation, intro);

        closeRequest();
        showToast(type === 'Trade' ? 'Oferta de troca enviada!' : 'Solicitação de doação enviada!');
        openChat(conversation.id);
    }

    function initRequest() {
        $('#request-close-btn').addEventListener('click', closeRequest);
        $('#request-overlay').addEventListener('click', closeRequest);
        $('#request-type').addEventListener('change', toggleOfferedGroup);
        $('#request-form').addEventListener('submit', submitRequest);

        $('#btn-request-detail').addEventListener('click', () => {
            const item = DB.getAllItems().find(i => i.id === detailModal.dataset.id);
            if (item) openRequest(item);
        });

        $('#btn-chat-detail').addEventListener('click', () => {
            const item = DB.getAllItems().find(i => i.id === detailModal.dataset.id);
            if (!item) return;
            const conversation = findOrCreateConversation(item);
            closeDetail();
            openChat(conversation.id);
        });

        // Passo 5 do fluxo de categorias: selecionar produto para retirada.
        $('#btn-pickup-detail').addEventListener('click', () => {
            const me = DB.getCurrentUser();
            if (!me) {
                showToast('Faça login para retirar um item', 'error');
                return;
            }
            const item = DB.getAllItems().find(i => i.id === detailModal.dataset.id);
            if (!item) return;
            const conversation = findOrCreateConversation(item);
            if (conversationMessages(conversation.id).length === 0) {
                appendMessage(conversation, 'Olá! Tenho interesse em retirar este item. Quando podemos combinar?');
            }
            closeDetail();
            // Passo 6: o sistema exibe a tela de chat para contato.
            openChat(conversation.id);
        });
    }

    /* ========== CHAT (Conversar com anunciante) ========== */

    const chatModal = $('#chat-modal');

    function conversationOtherName(conv, me) {
        return conv.announcerId === me.id ? conv.interestedUserName : conv.announcerName;
    }

    function conversationMessages(conversationId) {
        return DB.getMessages()
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    function unreadCount(conversationId, me) {
        return DB.getMessages()
            .filter(m => m.conversationId === conversationId && m.senderId !== me.id && !m.read)
            .length;
    }

    function findOrCreateConversation(item) {
        const me = DB.getCurrentUser();
        if (!me) return null;
        const conversations = DB.getConversations();
        let conv = conversations.find(c =>
            c.itemId === item.id && c.announcerId === item.userId && c.interestedUserId === me.id);

        if (!conv) {
            const owner = DB.getUser(item.userId);
            conv = {
                id: DB.generateId(),
                itemId: item.id,
                itemTitle: item.title,
                announcerId: item.userId,
                announcerName: owner ? owner.name : 'Anunciante',
                interestedUserId: me.id,
                interestedUserName: me.name,
                createdAt: new Date().toISOString(),
                lastMessageAt: new Date().toISOString()
            };
            conversations.push(conv);
            DB.saveConversations(conversations);
        }

        return conv;
    }

    function appendMessage(conversation, content) {
        const me = DB.getCurrentUser();
        if (!me || !conversation) return;
        const messages = DB.getMessages();
        messages.push({
            id: DB.generateId(),
            conversationId: conversation.id,
            senderId: me.id,
            senderName: me.name,
            content,
            read: false,
            createdAt: new Date().toISOString()
        });
        DB.saveMessages(messages);

        const conversations = DB.getConversations();
        const idx = conversations.findIndex(c => c.id === conversation.id);
        if (idx >= 0) {
            conversations[idx] = { ...conversations[idx], lastMessageAt: new Date().toISOString() };
            DB.saveConversations(conversations);
        }
    }

    function loadConversations() {
        const me = DB.getCurrentUser();
        if (!me) return;

        const list = $('#conversations-list');
        const conversations = DB.getConversations()
            .filter(c => c.announcerId === me.id || c.interestedUserId === me.id)
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

        if (conversations.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <p>Nenhuma conversa</p>
                    <span>Abra um item em Explorar e converse com o anunciante!</span>
                </div>
            `;
            updateChatBadge();
            return;
        }

        list.innerHTML = conversations.map(conv => {
            const other = conversationOtherName(conv, me);
            const messages = conversationMessages(conv.id);
            const last = messages[messages.length - 1];
            const unread = unreadCount(conv.id, me);
            const date = new Date(conv.lastMessageAt).toLocaleDateString('pt-BR');

            return `
                <div class="item-card conversation-card" data-id="${conv.id}">
                    <div class="item-card-header">
                        <span class="item-card-title">💬 ${esc(other)}</span>
                        ${unread ? `<span class="unread-badge">${unread} nova${unread > 1 ? 's' : ''}</span>` : ''}
                    </div>
                    <div class="chat-item-title">Sobre: ${esc(conv.itemTitle)}</div>
                    <div class="item-card-info">
                        <span>${last ? esc(last.content) : 'Diga olá 👋'}</span>
                        <span>📅 ${date}</span>
                    </div>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.conversation-card').forEach(card => {
            card.addEventListener('click', () => openChat(card.dataset.id));
        });

        updateChatBadge();
    }

    function openChat(conversationId) {
        const me = DB.getCurrentUser();
        const conv = DB.getConversations().find(c => c.id === conversationId);
        if (!conv || !me) return;

        chatModal.dataset.id = conv.id;
        $('#chat-title').textContent = conversationOtherName(conv, me);
        $('#chat-subtitle').textContent = `Sobre: ${conv.itemTitle}`;

        markConversationRead(conv.id);
        renderMessages(conv.id);
        updateChatBadge();

        chatModal.classList.add('active');
        setTimeout(() => {
            const container = $('#chat-messages');
            container.scrollTop = container.scrollHeight;
            $('#chat-input').focus();
        }, 100);
    }

    function closeChat() {
        chatModal.classList.remove('active');
        chatModal.dataset.id = '';
        if (screens.chat.classList.contains('active')) loadConversations();
    }

    function renderMessages(conversationId) {
        const me = DB.getCurrentUser();
        const messages = conversationMessages(conversationId);
        const container = $('#chat-messages');

        container.innerHTML = messages.length
            ? messages.map(m => {
                const mine = m.senderId === me.id;
                const time = new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="chat-bubble ${mine ? 'mine' : 'theirs'}">
                        <p>${esc(m.content)}</p>
                        <span class="chat-time">${time}</span>
                    </div>
                `;
            }).join('')
            : '<div class="chat-empty">Comece a conversa 👋</div>';

        container.scrollTop = container.scrollHeight;
    }

    function sendMessage(e) {
        e.preventDefault();
        const content = $('#chat-input').value.trim();
        const conv = DB.getConversations().find(c => c.id === chatModal.dataset.id);
        if (!content || !conv) return;

        appendMessage(conv, content);
        $('#chat-input').value = '';
        renderMessages(conv.id);
        updateChatBadge();
    }

    function markConversationRead(conversationId) {
        const me = DB.getCurrentUser();
        const messages = DB.getMessages();
        let changed = false;

        messages.forEach(m => {
            if (m.conversationId === conversationId && m.senderId !== me.id && !m.read) {
                m.read = true;
                changed = true;
            }
        });

        if (changed) DB.saveMessages(messages);
    }

    function updateChatBadge() {
        const me = DB.getCurrentUser();
        const badge = $('#nav-chat-badge');
        if (!me) {
            badge.style.display = 'none';
            return;
        }

        const myConversations = DB.getConversations()
            .filter(c => c.announcerId === me.id || c.interestedUserId === me.id)
            .map(c => c.id);
        const unread = DB.getMessages()
            .filter(m => myConversations.includes(m.conversationId) && m.senderId !== me.id && !m.read)
            .length;

        if (unread > 0) {
            badge.textContent = unread > 9 ? '9+' : unread;
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    }

    function initChat() {
        $('#chat-close-btn').addEventListener('click', closeChat);
        $('#chat-overlay').addEventListener('click', closeChat);
        $('#chat-form').addEventListener('submit', sendMessage);
    }

    /* ========== PROFILE ========== */

    const profileModal = $('#profile-modal');

    function openProfile() {
        const me = DB.getCurrentUser();
        if (!me) return;

        const requests = DB.getRequests();
        const sent = requests.filter(r => r.requesterId === me.id);
        const received = requests.filter(r => r.ownerId === me.id);

        $('#profile-body').innerHTML = `
            <div class="profile-card">
                <div class="profile-name">${esc(me.name)}</div>
                <div class="profile-info">${esc(me.email)}</div>
                <div class="profile-info">${esc(me.phone || 'Sem telefone')} · ${esc(me.city || 'Sem cidade')}</div>
            </div>
            <div class="profile-section-title">Solicitações enviadas (${sent.length})</div>
            ${sent.length ? sent.map(requestCard).join('') : '<p class="empty-inline">Nenhuma solicitação enviada ainda. Explore itens e faça uma solicitação!</p>'}
            <div class="profile-section-title">Solicitações recebidas (${received.length})</div>
            ${received.length ? received.map(requestCard).join('') : '<p class="empty-inline">Nenhuma solicitação recebida ainda.</p>'}
        `;

        profileModal.classList.add('active');
    }

    function requestCard(r) {
        const icon = r.type === 'Trade' ? '🔄' : '🎁';
        const offered = r.type === 'Trade' && r.offeredItemTitle
            ? `<div class="request-meta">Oferecendo: ${esc(r.offeredItemTitle)}</div>`
            : '';
        const message = r.message ? `<div class="request-meta">"${esc(r.message)}"</div>` : '';

        return `
            <div class="request-card">
                <div class="request-card-header">
                    <span class="request-type">${icon} ${esc(requestTypeLabel(r.type))}</span>
                    <span class="request-status">${esc(requestStatusLabel(r.status))}</span>
                </div>
                <div>${esc(r.itemTitle)}</div>
                <div class="request-meta">De ${esc(r.requesterName)} para ${esc(r.ownerName)}</div>
                ${offered}
                ${message}
            </div>
        `;
    }

    function closeProfile() {
        profileModal.classList.remove('active');
    }

    function initProfile() {
        $('#profile-close-btn').addEventListener('click', closeProfile);
        $('#profile-overlay').addEventListener('click', closeProfile);
    }

    /* ========== DEMO SEED ========== */

    // Known seed items, also used to localize data created before this translation.
    const DEMO_ITEM_TRANSLATIONS = {
        'demo-item-0': {
            from: 'Winter Jacket',
            title: 'Jaqueta de inverno',
            description: 'Jaqueta de inverno azul, tamanho M. Aquece bem e está em ótimo estado.',
            city: 'São Paulo'
        },
        'demo-item-1': {
            from: 'Study Desk',
            title: 'Mesa de estudos',
            description: 'Mesa de estudos de madeira com duas gavetas.',
            city: 'São Paulo'
        },
        'demo-item-2': {
            from: 'Box of Books',
            title: 'Caixa de livros',
            description: 'Caixa com 12 romances e livros de estudo.',
            city: 'São Paulo'
        }
    };

    function seedDemoData() {
        if (DB.getUsers().length > 0) return;

        const maria = {
            id: 'demo-announcer',
            name: 'Maria Souza',
            email: 'maria@repassa.com',
            phone: '(11) 98888-7777',
            city: 'São Paulo',
            password: 'secret123',
            createdAt: new Date().toISOString()
        };
        DB.saveUsers([maria]);

        const now = Date.now();
        const demoItems = [
            {
                category: 'Clothes',
                title: 'Jaqueta de inverno',
                condition: 'Good',
                description: 'Jaqueta de inverno azul, tamanho M. Aquece bem e está em ótimo estado.',
                city: 'São Paulo',
                neighborhood: 'Pinheiros'
            },
            {
                category: 'Furniture',
                title: 'Mesa de estudos',
                condition: 'Fair',
                description: 'Mesa de estudos de madeira com duas gavetas.',
                city: 'São Paulo',
                neighborhood: 'Vila Madalena'
            },
            {
                category: 'Books',
                title: 'Caixa de livros',
                condition: 'Good',
                description: 'Caixa com 12 romances e livros de estudo.',
                city: 'São Paulo',
                neighborhood: 'Pinheiros'
            }
        ];

        demoItems.forEach((data, idx) => {
            DB.saveItem({
                id: `demo-item-${idx}`,
                userId: maria.id,
                status: 'Available',
                createdAt: new Date(now - idx * 86400000).toISOString(),
                updatedAt: new Date(now - idx * 86400000).toISOString(),
                ...data
            });
        });
    }

    // Updates the seeded demo records saved by older (English) versions.
    function localizeDemoData() {
        const items = DB.getAllItems();
        let itemsChanged = false;

        items.forEach(item => {
            const translation = DEMO_ITEM_TRANSLATIONS[item.id];
            if (!translation || item.title !== translation.from) return;
            item.title = translation.title;
            item.description = translation.description;
            item.city = translation.city;
            itemsChanged = true;
        });

        if (itemsChanged) DB.write('repassa_items', items);

        const requests = DB.getRequests();
        let requestsChanged = false;
        requests.forEach(request => {
            const translation = DEMO_ITEM_TRANSLATIONS[request.itemId];
            if (translation && request.itemTitle === translation.from) {
                request.itemTitle = translation.title;
                requestsChanged = true;
            }
        });
        if (requestsChanged) DB.saveRequests(requests);

        const conversations = DB.getConversations();
        let conversationsChanged = false;
        conversations.forEach(conversation => {
            const translation = DEMO_ITEM_TRANSLATIONS[conversation.itemId];
            if (translation && conversation.itemTitle === translation.from) {
                conversation.itemTitle = translation.title;
                conversationsChanged = true;
            }
        });
        if (conversationsChanged) DB.saveConversations(conversations);

        const users = DB.getUsers();
        let usersChanged = false;
        users.forEach(user => {
            if (user.id === 'demo-announcer' && user.city === 'Sao Paulo') {
                user.city = 'São Paulo';
                usersChanged = true;
            }
        });
        if (usersChanged) DB.saveUsers(users);

        const current = DB.getCurrentUser();
        if (current && current.id === 'demo-announcer' && current.city === 'Sao Paulo') {
            DB.setCurrentUser({ ...current, city: 'São Paulo' });
        }
    }

    // Second demo account so the pickup ("retirada") flow can be tried
    // against items belonging to someone else.
    function ensureDemoPartner() {
        const users = DB.getUsers();
        if (users.find(u => u.email === 'joao@repassa.com')) return;

        const joao = {
            id: 'demo-partner',
            name: 'João Pereira',
            email: 'joao@repassa.com',
            phone: '(11) 95555-4444',
            city: 'São Paulo',
            password: 'secret123',
            createdAt: new Date().toISOString()
        };
        DB.saveUsers([...users, joao]);

        const now = Date.now();
        const partnerItems = [
            {
                id: 'demo-partner-item-0',
                category: 'Electronics',
                title: 'Fone de ouvido sem fio',
                condition: 'Like New',
                description: 'Fone de ouvido bluetooth com estojo. Pouco uso, bateria ótima.',
                city: 'São Paulo',
                neighborhood: 'Moema'
            },
            {
                id: 'demo-partner-item-1',
                category: 'Kitchen',
                title: 'Jogo de panelas',
                condition: 'Good',
                description: 'Jogo de 5 panelas antiaderentes, todos com tampas.',
                city: 'São Paulo',
                neighborhood: 'Moema'
            }
        ];

        partnerItems.forEach((data, idx) => {
            DB.saveItem({
                ...data,
                userId: joao.id,
                status: 'Available',
                createdAt: new Date(now - (idx + 3) * 86400000).toISOString(),
                updatedAt: new Date(now - (idx + 3) * 86400000).toISOString()
            });
        });
    }

    /* ========== INIT ========== */

    function init() {
        seedDemoData();
        localizeDemoData();
        ensureDemoPartner();
        initAuth();
        initNav();
        initModal();
        initCrud();
        initSearch();
        initCategories();
        initRequest();
        initChat();
        initProfile();

        const user = DB.getCurrentUser();
        if (user) {
            showScreen('home');
            loadItems();
            updateChatBadge();
        } else {
            showScreen('login');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
