// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Estado global da aplicação
let currentUser = {
  id: 1,
  name: 'Jonatas Freire',
  email: 'jonatas@email.com',
  role: 'rural',
  city: 'Belo Horizonte',
  state: 'MG'
};
let authToken = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Inicializar aplicação
function initializeApp() {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedUser();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Create offer form
    const createOfferForm = document.getElementById('createOfferForm');
    if (createOfferForm) {
        createOfferForm.addEventListener('submit', handleCreateOffer);
    }

    // Negotiation form
    const negotiationForm = document.getElementById('negotiationForm');
    if (negotiationForm) {
        negotiationForm.addEventListener('submit', handleCreateNegotiation);
    }

    // Role selection
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.addEventListener('change', handleRoleChange);
    }

    // Search and filters
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', handleLocationFilter);
    }
}

// Verificar status de autenticação (temporariamente desabilitado)
async function checkAuthStatus() {
    // Temporariamente usando usuário padrão
    updateUIForLoggedUser();
}

// Atualizar UI para usuário logado
function updateUIForLoggedUser() {
    if (!currentUser) return;

    // Atualizar nome do usuário
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        el.textContent = currentUser.name;
    });

    // Atualizar informações do perfil
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.value = currentUser.name;
    }

    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.value = currentUser.email;
    }

    const profileCity = document.getElementById('profileCity');
    if (profileCity) {
        profileCity.value = currentUser.city || '';
    }

    const profileState = document.getElementById('profileState');
    if (profileState) {
        profileState.value = currentUser.state || '';
    }

    // Mostrar/ocultar elementos baseado no tipo de usuário
    if (currentUser.role === 'rural') {
        showRuralFeatures();
    } else if (currentUser.role === 'biocombustivel') {
        showBioFeatures();
    }

    // Carregar dados específicos da página
    loadPageData();
}

// Mostrar funcionalidades para produtor rural
function showRuralFeatures() {
    // Implementar lógica específica para produtor rural
    console.log('Mostrando funcionalidades para produtor rural');
}

// Mostrar funcionalidades para produtor de biocombustível
function showBioFeatures() {
    // Implementar lógica específica para produtor de biocombustível
    console.log('Mostrando funcionalidades para produtor de biocombustível');
}

// Carregar dados da página
async function loadPageData() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'perfil-rural.html':
        case 'perfil-bio.html':
            await loadUserProfile();
            await loadUserOffers();
            await loadUserNegotiations();
            break;
        case 'dashboard.html':
            await loadDashboardData();
            break;
        default:
            break;
    }
}

// Handlers de formulários
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Login realizado com sucesso!', 'success');
            closeModal('loginModal');
            updateUIForLoggedUser();
            
            // Redirecionar baseado no tipo de usuário
            if (data.user.role === 'rural') {
                window.location.href = 'perfil-rural.html';
            } else {
                window.location.href = 'perfil-bio.html';
            }
        } else {
            showNotification(data.error || 'Erro no login', 'error');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showNotification('Erro de conexão', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value,
        city: document.getElementById('registerCity').value,
        state: document.getElementById('registerState').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Cadastro realizado com sucesso!', 'success');
            closeModal('registerModal');
            updateUIForLoggedUser();
            
            // Redirecionar baseado no tipo de usuário
            if (data.user.role === 'rural') {
                window.location.href = 'perfil-rural.html';
            } else {
                window.location.href = 'perfil-bio.html';
            }
        } else {
            showNotification(data.error || 'Erro no cadastro', 'error');
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showNotification('Erro de conexão', 'error');
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = {
        user_id: currentUser.id,
        name: document.getElementById('profileName').value,
        city: document.getElementById('profileCity').value,
        state: document.getElementById('profileState').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = { ...currentUser, ...data.user };
            showNotification('Perfil atualizado com sucesso!', 'success');
            updateUIForLoggedUser();
        } else {
            showNotification(data.error || 'Erro ao atualizar perfil', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showNotification('Erro de conexão', 'error');
    }
}

async function handleCreateOffer(e) {
    e.preventDefault();
    
    const formData = {
        user_id: currentUser.id, // Adicionar user_id
        title: document.getElementById('offerTitle').value,
        description: document.getElementById('offerDescription').value,
        quantity: parseFloat(document.getElementById('offerQuantity').value) || null,
        unit: document.getElementById('offerUnit').value,
        location_city: document.getElementById('offerCity').value,
        location_state: document.getElementById('offerState').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/residues`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Oferta criada com sucesso!', 'success');
            closeModal('createOfferModal');
            loadUserOffers();
            // Limpar formulário
            e.target.reset();
        } else {
            showNotification(data.error || 'Erro ao criar oferta', 'error');
        }
    } catch (error) {
        console.error('Erro ao criar oferta:', error);
        showNotification('Erro de conexão', 'error');
    }
}

async function handleCreateNegotiation(e) {
    e.preventDefault();
    
    const message = document.getElementById('negotiationMessage').value;
    const residueId = e.target.dataset.residueId;

    try {
        const response = await fetch(`${API_BASE_URL}/negotiations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                buyer_id: currentUser.id,
                residue_id: residueId, 
                message 
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Negociação iniciada com sucesso!', 'success');
            closeModal('negotiationModal');
            loadUserNegotiations();
        } else {
            showNotification(data.error || 'Erro ao iniciar negociação', 'error');
        }
    } catch (error) {
        console.error('Erro ao iniciar negociação:', error);
        showNotification('Erro de conexão', 'error');
    }
}

// Handlers de mudança de role
function handleRoleChange(e) {
    const role = e.target.value;
    const roleInfo = document.getElementById('roleInfo');
    const ruralInfo = document.getElementById('ruralInfo');
    const bioInfo = document.getElementById('bioInfo');

    if (roleInfo) {
        roleInfo.style.display = 'block';
    }

    if (ruralInfo && bioInfo) {
        ruralInfo.classList.toggle('active', role === 'rural');
        bioInfo.classList.toggle('active', role === 'biocombustivel');
    }
}

// Handlers de busca e filtros
function handleSearch(e) {
    const query = e.target.value;
    // Implementar busca
    console.log('Buscar:', query);
}

function handleLocationFilter(e) {
    const location = e.target.value;
    // Implementar filtro por localização
    console.log('Filtrar por:', location);
}

// Carregar perfil do usuário
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/me?user_id=${currentUser.id}`);

        if (response.ok) {
            const user = await response.json();
            updateProfileInfo(user);
            updateProfileStats(user);
        } else {
            // Usar dados padrão se não conseguir carregar
            updateProfileInfo(currentUser);
            updateProfileStats(currentUser);
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        // Usar dados padrão em caso de erro
        updateProfileInfo(currentUser);
        updateProfileStats(currentUser);
    }
}

// Atualizar informações do perfil
function updateProfileInfo(user) {
    // Atualizar nome
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = user.name;
    }

    // Atualizar localização
    const profileLocation = document.querySelector('.profile-location');
    if (profileLocation) {
        const location = user.city && user.state ? `${user.city}, ${user.state}` : 'Localização não informada';
        profileLocation.textContent = location;
    }

    // Atualizar campos do formulário
    const formName = document.querySelector('#profileForm input[name="name"]');
    if (formName) {
        formName.value = user.name;
    }

    const formCity = document.querySelector('#profileForm input[name="city"]');
    if (formCity) {
        formCity.value = user.city || '';
    }

    const formState = document.querySelector('#profileForm input[name="state"]');
    if (formState) {
        formState.value = user.state || '';
    }
}

// Atualizar estatísticas do perfil
function updateProfileStats(user) {
    // As estatísticas serão atualizadas quando carregarmos as ofertas e negociações
    // Por enquanto, vamos zerar os valores mockados
    const totalOffers = document.getElementById('totalOffers');
    if (totalOffers) {
        totalOffers.textContent = '0';
    }

    const totalNegotiations = document.getElementById('totalNegotiations');
    if (totalNegotiations) {
        totalNegotiations.textContent = '0';
    }

    const totalRevenue = document.getElementById('totalRevenue');
    if (totalRevenue) {
        totalRevenue.textContent = 'R$ 0';
    }
}

// Carregar ofertas do usuário
async function loadUserOffers() {
    try {
        const response = await fetch(`${API_BASE_URL}/residues`);

        if (response.ok) {
            const offers = await response.json();
            
            // Filtrar ofertas baseado no tipo de usuário
            if (currentUser && currentUser.role === 'biocombustivel') {
                // Para produtores de biocombustível, mostrar todas as ofertas (de outros usuários)
                displayOffers(offers);
            } else {
                // Para produtores rurais, mostrar apenas suas próprias ofertas
                const userOffers = offers.filter(offer => offer.user_id === currentUser.id);
                displayOffers(userOffers);
                updateOffersStats(userOffers);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
    }
}

// Carregar negociações do usuário
async function loadUserNegotiations() {
    try {
        const response = await fetch(`${API_BASE_URL}/negotiations?user_id=${currentUser.id}`);

        if (response.ok) {
            const negotiations = await response.json();
            displayNegotiations(negotiations);
            updateNegotiationsStats(negotiations);
        }
    } catch (error) {
        console.error('Erro ao carregar negociações:', error);
    }
}

// Atualizar estatísticas das negociações
function updateNegotiationsStats(negotiations) {
    const totalNegotiations = document.getElementById('totalNegotiations');
    if (totalNegotiations) {
        totalNegotiations.textContent = negotiations.length;
    }

    // Atualizar estatísticas no dashboard
    const dashboardNegotiations = document.getElementById('totalNegotiations');
    if (dashboardNegotiations) {
        dashboardNegotiations.textContent = negotiations.length;
    }
}

// Carregar dados do dashboard
async function loadDashboardData() {
    await loadUserOffers();
    await loadUserNegotiations();
}

// Atualizar estatísticas das ofertas
function updateOffersStats(offers) {
    const totalOffers = document.getElementById('totalOffers');
    if (totalOffers) {
        totalOffers.textContent = offers.length;
    }

    // Atualizar estatísticas no dashboard
    const dashboardOffers = document.getElementById('totalOffers');
    if (dashboardOffers) {
        dashboardOffers.textContent = offers.length;
    }
}

// Exibir ofertas
function displayOffers(offers) {
    const offersGrid = document.getElementById('offersGrid');
    const recentOffersList = document.getElementById('recentOffersList');
    
    const targetElement = offersGrid || recentOffersList;
    if (!targetElement) return;

    if (offers.length === 0) {
        targetElement.innerHTML = '<p class="text-center">Nenhuma oferta encontrada.</p>';
        return;
    }

    // Para a seção de ofertas recentes, mostrar apenas as 3 mais recentes
    const offersToShow = recentOffersList ? offers.slice(0, 3) : offers;

    targetElement.innerHTML = offersToShow.map(offer => `
        <div class="offer-item">
            <div class="offer-info">
                <h4>${offer.title}</h4>
                <p>${offer.quantity ? `${offer.quantity} ${offer.unit || ''} disponíveis` : 'Quantidade não informada'}</p>
                <span class="offer-status ${offer.status || 'active'}">${offer.status || 'Ativa'}</span>
            </div>
            <div class="offer-actions">
                ${currentUser && currentUser.role === 'biocombustivel' ? 
                    `<button class="btn btn-sm btn-primary" onclick="showNegotiationModal(${offer.id})">Negociar</button>` : 
                    `<button class="btn btn-sm btn-outline" onclick="editOffer(${offer.id})">Editar</button>`
                }
                <button class="btn btn-sm btn-outline" onclick="viewOfferDetails(${offer.id})">Ver Detalhes</button>
            </div>
        </div>
    `).join('');

    // Se estamos na aba de ofertas, mostrar todas as ofertas em formato de grid
    if (offersGrid) {
        offersGrid.innerHTML = offers.map(offer => `
            <div class="offer-card">
                <div class="offer-header">
                    <h3>${offer.title}</h3>
                    <span class="offer-status ${offer.status || 'active'}">${offer.status || 'Ativa'}</span>
                </div>
                <div class="offer-body">
                    <p>${offer.description || 'Sem descrição'}</p>
                    ${offer.quantity ? `<p><strong>Quantidade:</strong> ${offer.quantity} ${offer.unit || ''}</p>` : ''}
                    ${offer.location_city ? `<p><strong>Localização:</strong> ${offer.location_city}, ${offer.location_state}</p>` : ''}
                    <p><strong>Proprietário:</strong> ${offer.owner_name}</p>
                </div>
                <div class="offer-actions">
                    ${currentUser && currentUser.role === 'biocombustivel' ? 
                        `<button class="btn btn-primary btn-sm" onclick="showNegotiationModal(${offer.id})">Negociar</button>` : 
                        `<button class="btn btn-outline btn-sm" onclick="editOffer(${offer.id})">Editar</button>`
                    }
                    <button class="btn btn-outline btn-sm" onclick="viewOfferDetails(${offer.id})">Ver Detalhes</button>
                </div>
            </div>
        `).join('');
    }
}

// Exibir negociações
function displayNegotiations(negotiations) {
    const negotiationsList = document.getElementById('negotiationsList');
    const recentNegotiationsList = document.getElementById('recentNegotiationsList');
    
    const targetElement = negotiationsList || recentNegotiationsList;
    if (!targetElement) return;

    if (negotiations.length === 0) {
        targetElement.innerHTML = '<p class="text-center">Nenhuma negociação encontrada.</p>';
        return;
    }

    // Para a seção de negociações recentes, mostrar apenas as 3 mais recentes
    const negotiationsToShow = recentNegotiationsList ? negotiations.slice(0, 3) : negotiations;

    targetElement.innerHTML = negotiationsToShow.map(negotiation => `
        <div class="negotiation-item">
            <div class="negotiation-info">
                <h4>${negotiation.buyer_name || negotiation.seller_name}</h4>
                <p>Interessado em: ${negotiation.residue_title}</p>
                <span class="negotiation-status ${negotiation.status}">${getStatusText(negotiation.status)}</span>
            </div>
            <div class="negotiation-actions">
                <button class="btn btn-sm btn-outline" onclick="viewNegotiationDetails(${negotiation.id})">Ver Detalhes</button>
                ${negotiation.status === 'pending' ? 
                    `<button class="btn btn-sm btn-success" onclick="updateNegotiationStatus(${negotiation.id}, 'accepted')">Aceitar</button>
                     <button class="btn btn-sm btn-danger" onclick="updateNegotiationStatus(${negotiation.id}, 'rejected')">Recusar</button>` : 
                    ''
                }
            </div>
        </div>
    `).join('');
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'accepted': 'Aceita',
        'rejected': 'Recusada',
        'completed': 'Concluída'
    };
    return statusMap[status] || status;
}

// Funções de modal
function showLogin() {
    showModal('loginModal');
}

function showRegister() {
    showModal('registerModal');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    showModal(toModal);
}

function showCreateOfferModal() {
    showModal('createOfferModal');
}

function showNegotiationModal(residueId) {
    const modal = document.getElementById('negotiationModal');
    const form = document.getElementById('negotiationForm');
    if (modal && form) {
        form.dataset.residueId = residueId;
        showModal('negotiationModal');
    }
}

// Funções de navegação
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Funções de abas
function showTab(tabId) {
    // Ocultar todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Desativar todos os botões de aba
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Mostrar aba selecionada
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ativar botão da aba
    const selectedBtn = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

// Funções de negociação
async function updateNegotiationStatus(negotiationId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/negotiations/${negotiationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: currentUser.id,
                status 
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Status atualizado com sucesso!', 'success');
            loadUserNegotiations();
        } else {
            showNotification(data.error || 'Erro ao atualizar status', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showNotification('Erro de conexão', 'error');
    }
}

// Funções de oferta
function editOffer(offerId) {
    // Implementar edição de oferta
    console.log('Editar oferta:', offerId);
}

function viewOfferDetails(offerId) {
    // Implementar visualização de detalhes
    console.log('Ver detalhes da oferta:', offerId);
}

function viewNegotiationDetails(negotiationId) {
    // Implementar visualização de detalhes da negociação
    console.log('Ver detalhes da negociação:', negotiationId);
}

// Logout
async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            currentUser = null;
            localStorage.removeItem('user');
            showNotification('Logout realizado com sucesso!', 'success');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro no logout:', error);
        // Mesmo com erro, limpar dados locais
        currentUser = null;
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Adicionar estilos se não existirem
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .notification-success { border-left: 4px solid #2a9d8f; }
            .notification-error { border-left: 4px solid #e76f51; }
            .notification-info { border-left: 4px solid #2d5a27; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #6c757d;
                padding: 0.25rem;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Função debounce para otimizar buscas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fechar modais ao clicar fora
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Fechar modais com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});
