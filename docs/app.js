(() => {
    'use strict';

    const DB = {
        getUsers: () => JSON.parse(localStorage.getItem('repassa_users') || '[]'),
        saveUsers: (users) => localStorage.setItem('repassa_users', JSON.stringify(users)),
        getCurrentUser: () => JSON.parse(localStorage.getItem('repassa_current') || 'null'),
        setCurrentUser: (user) => localStorage.setItem('repassa_current', JSON.stringify(user)),
        getItems: (userId) => {
            const all = JSON.parse(localStorage.getItem('repassa_items') || '[]');
            return all.filter(i => i.userId === userId);
        },
        saveItem: (item) => {
            const all = JSON.parse(localStorage.getItem('repassa_items') || '[]');
            const idx = all.findIndex(i => i.id === item.id);
            if (idx >= 0) {
                all[idx] = item;
            } else {
                all.push(item);
            }
            localStorage.setItem('repassa_items', JSON.stringify(all));
        },
        deleteItem: (id) => {
            const all = JSON.parse(localStorage.getItem('repassa_items') || '[]');
            localStorage.setItem('repassa_items', JSON.stringify(all.filter(i => i.id !== id)));
        },
        generateId: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    };

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const screens = {
        login: $('#login-screen'),
        register: $('#register-screen'),
        home: $('#home-screen')
    };

    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
    }

    const toastEl = $('#toast');
    let toastTimeout;
    function showToast(msg, type = 'success') {
        clearTimeout(toastTimeout);
        toastEl.textContent = msg;
        toastEl.className = `toast ${type} show`;
        toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 3000);
    }

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
                showToast('Invalid email or password', 'error');
                return;
            }
            DB.setCurrentUser(user);
            showScreen('home');
            loadItems();
            showToast(`Welcome, ${user.name.split(' ')[0]}!`);
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
                showToast('Passwords do not match', 'error');
                return;
            }

            const users = DB.getUsers();
            if (users.find(u => u.email === email)) {
                showToast('Email already registered', 'error');
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
            showToast('Account created successfully!');
        });

        $('#btn-logout').addEventListener('click', () => {
            DB.setCurrentUser(null);
            showScreen('login');
            $('#login-email').value = '';
            $('#login-password').value = '';
            showToast('Session ended');
        });
    }

    const modal = $('#modal');
    const detailModal = $('#detail-modal');

    function openModal(title) {
        $('#modal-title').textContent = title;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        $('#item-form').reset();
        $('#item-id').value = '';
    }

    function openDetail(item) {
        const categoryIcons = {
            'Clothes': '👕', 'Electronics': '📱', 'Furniture': '🪑', 'Books': '📚',
            'Toys': '🧸', 'Kitchen': '🍳', 'Shoes': '👟', 'Accessories': '🎒',
            'Sports': '⚽', 'Other': '📦'
        };
        const icon = categoryIcons[item.category] || '📦';
        const date = new Date(item.createdAt).toLocaleDateString('en-US');

        $('#detail-body').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Category</span>
                <span class="detail-value">${icon} ${item.category}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item Name</span>
                <span class="detail-value">${item.title}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Condition</span>
                <span class="detail-value">${item.condition}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Description</span>
                <span class="detail-value">${item.description || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">City</span>
                <span class="detail-value">${item.city}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Neighborhood</span>
                <span class="detail-value">${item.neighborhood || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value"><span class="item-card-status ${item.status}">${item.status}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Registered on</span>
                <span class="detail-value">${date}</span>
            </div>
        `;

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

        $('#btn-add').addEventListener('click', () => openModal('New Donation Item'));
        $('#nav-add').addEventListener('click', () => openModal('New Donation Item'));

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
                    <p>No items registered</p>
                    <span>Add your first donation item!</span>
                </div>
            `;
            return;
        }

        const categoryIcons = {
            'Clothes': '👕', 'Electronics': '📱', 'Furniture': '🪑', 'Books': '📚',
            'Toys': '🧸', 'Kitchen': '🍳', 'Shoes': '👟', 'Accessories': '🎒',
            'Sports': '⚽', 'Other': '📦'
        };

        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        list.innerHTML = items.map(item => {
            const icon = categoryIcons[item.category] || '📦';
            const date = new Date(item.createdAt).toLocaleDateString('en-US');
            return `
                <div class="item-card status-${item.status}" data-id="${item.id}">
                    <div class="item-card-header">
                        <span class="item-card-title">${icon} ${item.title}</span>
                        <span class="item-card-status ${item.status}">${item.status}</span>
                    </div>
                    <div class="item-card-info">
                        <span>📍 ${item.city}${item.neighborhood ? ', ' + item.neighborhood : ''}</span>
                        <span>📅 ${date} · ${item.condition}</span>
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

    function saveItem(e) {
        e.preventDefault();
        const user = DB.getCurrentUser();
        if (!user) return;

        const id = $('#item-id').value || DB.generateId();
        const isNew = !$('#item-id').value;

        const item = {
            id,
            userId: user.id,
            category: $('#item-category').value,
            title: $('#item-title').value.trim(),
            condition: $('#item-condition').value,
            description: $('#item-description').value.trim(),
            city: $('#item-city').value.trim(),
            neighborhood: $('#item-neighborhood').value.trim(),
            status: $('#item-status').value,
            createdAt: isNew ? new Date().toISOString() : (JSON.parse(localStorage.getItem('repassa_items') || '[]').find(i => i.id === id)?.createdAt || new Date().toISOString()),
            updatedAt: new Date().toISOString()
        };

        DB.saveItem(item);
        closeModal();
        loadItems();
        showToast(isNew ? 'Item registered!' : 'Item updated!');
    }

    function deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) return;
        DB.deleteItem(id);
        closeDetail();
        loadItems();
        showToast('Item deleted');
    }

    function initCrud() {
        $('#item-form').addEventListener('submit', saveItem);

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
                openModal('Edit Item');
            }, 300);
        });

        $('#btn-delete-detail').addEventListener('click', () => {
            deleteItem(detailModal.dataset.id);
        });

        $('#nav-profile').addEventListener('click', () => {
            const user = DB.getCurrentUser();
            if (user) {
                showToast(`${user.name} · ${user.email}`);
            }
        });
    }

    function init() {
        initAuth();
        initModal();
        initCrud();

        const user = DB.getCurrentUser();
        if (user) {
            showScreen('home');
            loadItems();
        } else {
            showScreen('login');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
