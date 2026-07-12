// Centralized State Management with Multi-Tenancy for Nexus CRM
let state = {
    currentEnv: "", // Set after login
    environments: {} // Tenant data
};

// Default Catalogs
const defaultProducts = [
    { id: "p1", name: "Criação de Site Profissional", description: "Landing page ou site institucional de alto desempenho, responsivo e otimizado para SEO.", price: 3500.00, type: "single" },
    { id: "p2", name: "Desenvolvimento E-commerce", description: "Loja virtual completa com meios de pagamento integrados e gerenciador de estoque.", price: 7500.00, type: "single" },
    { id: "p3", name: "Gestão de Google Ads", description: "Campanhas otimizadas de tráfego pago no Google para captação diária de leads qualificados.", price: 1200.00, type: "monthly" },
    { id: "p4", name: "Otimização de Velocidade & SEO", description: "Otimização técnica para carregar em <1s e subir no ranking de buscas do Google.", price: 1800.00, type: "single" },
    { id: "p5", name: "Suporte & Manutenção Mensal", description: "Backups semanais, atualizações de segurança e suporte para alterações no site.", price: 3500.00, type: "monthly" }
];

const defaultContacts = [
    { id: "c1", name: "João Silva", company: "Inova Tech", email: "joao@inovatech.com.br", phone: "(11) 98765-4321", value: 3500.00, status: "negotiating", notes: "Interessado em Criação de Site e SEO.", createdAt: "2026-07-05T14:30:00.000Z", timeline: [{ id: "act1", type: "note", description: "Contato cadastrado no sistema.", timestamp: "2026-07-05T14:30:00.000Z" }] },
    { id: "c2", name: "Maria Oliveira", company: "Giga Corp", email: "maria.oliveira@gigacorp.com", phone: "(21) 99888-7766", value: 8700.00, status: "won", notes: "Compra fechada de Site + Google Ads.", createdAt: "2026-07-01T09:15:00.000Z", timeline: [{ id: "act2", type: "note", description: "Lead convertido em cliente.", timestamp: "2026-07-09T18:12:00.000Z" }] },
    { id: "c3", name: "Carlos Souza", company: "Acme Ltda", email: "carlos@acmelimitada.com", phone: "(31) 97777-6655", value: 1200.00, status: "proposal", notes: "Aguardando resposta da proposta de Google Ads.", createdAt: "2026-07-08T11:00:00.000Z", timeline: [] },
    { id: "c4", name: "Ana Costa", company: "Tech Soluções", email: "ana@techsolucoes.tech", phone: "(11) 96543-2109", value: 3200.00, status: "lead", notes: "Lead do Google Ads. Quer fazer site novo.", createdAt: "2026-07-12T10:00:00.000Z", timeline: [] }
];

const defaultCustomers = [
    { id: "cust1", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", productName: "Desenvolvimento E-commerce", value: 7500.00, type: "single", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust2", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", productName: "Gestão de Google Ads", value: 1200.00, type: "monthly", status: "active", createdAt: "2026-07-09T18:12:00.000Z" }
];

const defaultTasks = [
    { id: "t1", title: "Enviar escopo do site para João Silva", contactId: "c1", dueDate: "2026-07-14", priority: "high", completed: false },
    { id: "t2", title: "Ligar para Carlos Souza sobre proposta", contactId: "c3", dueDate: "2026-07-15", priority: "medium", completed: false }
];

// Helper to get active environment data
function getEnv() {
    const env = state.currentEnv || "webco";
    if (!state.environments[env]) {
        state.environments[env] = {
            contacts: [...defaultContacts],
            tasks: [...defaultTasks],
            products: [...defaultProducts],
            customers: [...defaultCustomers]
        };
    }
    return state.environments[env];
}

// Initialize & Load
function init() {
    const savedState = localStorage.getItem("nexus_crm_multitenant_state");
    if (savedState) {
        state = JSON.parse(savedState);
    }
    
    // Check session login
    const loggedIn = sessionStorage.getItem("nexus_crm_logged_in");
    const loggedEnv = sessionStorage.getItem("nexus_crm_env");
    
    if (loggedIn === "true" && loggedEnv) {
        state.currentEnv = loggedEnv;
        document.getElementById("loginOverlay").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("hidden");
        document.getElementById("sidebarUsername").innerText = "Admin";
        
        // Setup initial view
        renderAll();
    } else {
        document.getElementById("loginOverlay").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("hidden");
    }
}

function saveState() {
    localStorage.setItem("nexus_crm_multitenant_state", JSON.stringify(state));
}

// Chart Instances
let salesChart = null;
let pipelineChart = null;

// Helpers & Formatting
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateStr) => {
    if (!dateStr) return "Nenhum";
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const getDaysSince = (dateStr) => {
    const start = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? "Hoje/Ontem" : `Há ${diffDays} dias`;
};

// UI Rendering Functions
function renderAll() {
    if (!state.currentEnv) return;
    
    renderDashboard();
    renderContacts();
    renderKanban();
    renderCustomers();
    renderProducts();
    renderTasks();
    populateContactDropdowns();
    populateConversionProductsDropdown();
    lucide.createIcons();
}

// 1. Dashboard Render
function renderDashboard() {
    const env = getEnv();
    
    // KPIs: calculate LTV from customers
    const totalSalesLTV = env.customers.reduce((sum, cust) => {
        // LTV: One-off products + 6 months estimated recurring contracts
        if (cust.status === "active") {
            return sum + (cust.type === "monthly" ? cust.value * 6 : cust.type === "yearly" ? cust.value : cust.value);
        }
        return sum + (cust.type === "single" ? cust.value : 0); // only count single sales if inactive
    }, 0);

    const activePipelineValue = env.contacts.filter(c => ['contacted', 'proposal', 'negotiating'].includes(c.status)).reduce((sum, c) => sum + c.value, 0);
    const totalDeals = env.contacts.length;
    const wonDeals = env.contacts.filter(c => c.status === 'won').length;
    const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;
    const pendingTasksCount = env.tasks.filter(t => !t.completed).length;

    document.getElementById("kpiTotalSales").innerText = formatCurrency(totalSalesLTV);
    document.getElementById("kpiActivePipeline").innerText = formatCurrency(activePipelineValue);
    document.getElementById("kpiConversionRate").innerText = `${conversionRate}%`;
    document.getElementById("kpiPendingTasks").innerText = pendingTasksCount;

    // Update Conversion Badge Description
    const conversionBadge = document.getElementById("kpiConversionBadge");
    if (conversionRate >= 25) {
        conversionBadge.innerText = "Alta Conversão";
        conversionBadge.className = "kpi-badge positive";
    } else {
        conversionBadge.innerText = "Trabalhar Leads";
        conversionBadge.className = "kpi-badge warning";
    }

    // Update Pending Task Badge text
    const badge = document.getElementById("kpiTaskStatusBadge");
    if (pendingTasksCount === 0) {
        badge.innerText = "Tudo em dia";
        badge.className = "kpi-badge positive";
    } else {
        badge.innerText = "Ações pendentes";
        badge.className = "kpi-badge warning";
    }

    // Render Recent Leads Table
    const recentLeads = [...env.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const tbody = document.getElementById("recentLeadsTableBody");
    tbody.innerHTML = "";
    recentLeads.forEach(lead => {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => openContactDetails(lead.id));
        tr.innerHTML = `
            <td>
                <div class="col-contact-info">
                    <div class="contact-avatar">${getInitials(lead.name)}</div>
                    <span>${lead.name}</span>
                </div>
            </td>
            <td>${lead.company || "-"}</td>
            <td><strong>${formatCurrency(lead.value)}</strong></td>
            <td><span class="status-badge ${lead.status}">${translateStatus(lead.status)}</span></td>
        `;
        tbody.appendChild(tr);
    });

    // Render Urgent Tasks List (top 4 uncompleted tasks)
    const urgentTasks = env.tasks.filter(t => !t.completed).sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority];
    }).slice(0, 4);

    const urgentTasksContainer = document.getElementById("urgentTasksList");
    urgentTasksContainer.innerHTML = "";
    if (urgentTasks.length === 0) {
        urgentTasksContainer.innerHTML = `<div class="table-empty-state"><p>Nenhuma tarefa pendente!</p></div>`;
    } else {
        urgentTasks.forEach(task => {
            const contactName = task.contactId ? (env.contacts.find(c => c.id === task.contactId)?.name || "") : "";
            const div = document.createElement("div");
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-toggle-btn" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-checkbox"></div>
                </label>
                <div class="task-content">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        ${contactName ? `<span>👤 ${contactName}</span>` : ""}
                        <span>📅 ${formatDate(task.dueDate)}</span>
                        <span class="task-priority-badge ${task.priority}">${task.priority}</span>
                    </div>
                </div>
            `;
            div.querySelector("input").addEventListener("change", (e) => {
                toggleTaskComplete(task.id, e.target.checked);
            });
            urgentTasksContainer.appendChild(div);
        });
    }

    renderCharts();
}

function translateStatus(status) {
    const trans = {
        lead: "Novo Lead",
        contacted: "Contatado",
        proposal: "Proposta Enviada",
        negotiating: "Em Negociação",
        won: "Ganho",
        lost: "Perdido"
    };
    return trans[status] || status;
}

// Charts rendering
function renderCharts() {
    const env = getEnv();
    if (salesChart) salesChart.destroy();
    if (pipelineChart) pipelineChart.destroy();

    const wonTotal = env.contacts.filter(c => c.status === 'won').reduce((sum, c) => sum + c.value, 0);
    const negTotal = env.contacts.filter(c => c.status === 'negotiating').reduce((sum, c) => sum + c.value, 0);
    const propTotal = env.contacts.filter(c => c.status === 'proposal').reduce((sum, c) => sum + c.value, 0);
    const contTotal = env.contacts.filter(c => c.status === 'contacted').reduce((sum, c) => sum + c.value, 0);

    const ctxSales = document.getElementById('salesTrendChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    const chartLabelColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2a2a40' : '#e5e7eb';

    salesChart = new Chart(ctxSales, {
        type: 'bar',
        data: {
            labels: ['Contatado', 'Proposta', 'Em Negociação', 'Ganho (Won)'],
            datasets: [{
                label: 'Receita (R$)',
                data: [contTotal, propTotal, negTotal, wonTotal],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.65)',
                    'rgba(6, 182, 212, 0.65)',
                    'rgba(245, 158, 11, 0.65)',
                    'rgba(16, 185, 129, 0.65)'
                ],
                borderColor: [
                    '#6366f1',
                    '#06b6d4',
                    '#f59e0b',
                    '#10b981'
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: chartLabelColor } },
                y: { grid: { color: gridColor }, ticks: { color: chartLabelColor, callback: (v) => formatCurrency(v) } }
            }
        }
    });

    const stages = ['lead', 'contacted', 'proposal', 'negotiating', 'won', 'lost'];
    const stageCounts = stages.map(s => env.contacts.filter(c => c.status === s).length);

    const ctxPipeline = document.getElementById('pipelineDistributionChart').getContext('2d');
    pipelineChart = new Chart(ctxPipeline, {
        type: 'doughnut',
        data: {
            labels: ['Novo Lead', 'Contatado', 'Proposta', 'Negociação', 'Ganho', 'Perdido'],
            datasets: [{
                data: stageCounts,
                backgroundColor: [
                    'rgba(107, 114, 128, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(6, 182, 212, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: chartLabelColor, font: { size: 10 } }
                }
            }
        }
    });
}

// 2. Contacts Management Render
function renderContacts() {
    const env = getEnv();
    const filterStatus = document.getElementById("filterStatus").value;
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();

    let filtered = [...env.contacts];

    if (filterStatus !== "all") {
        filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (searchVal) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchVal) ||
            (c.company && c.company.toLowerCase().includes(searchVal)) ||
            c.email.toLowerCase().includes(searchVal)
        );
    }

    const tbody = document.getElementById("contactsTableBody");
    const emptyState = document.getElementById("contactsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("contactsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("contactsTable").classList.remove("hidden");

        filtered.forEach(c => {
            const lastTimelineItem = c.timeline && c.timeline.length > 0 
                ? c.timeline[c.timeline.length - 1] 
                : null;
            
            const lastInteractionText = lastTimelineItem 
                ? `${lastTimelineItem.type === 'call' ? '📞' : lastTimelineItem.type === 'email' ? '✉️' : lastTimelineItem.type === 'meeting' ? '🤝' : '📝'} ${lastTimelineItem.description.substring(0, 20)}...`
                : "Sem interações";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="col-contact-info">
                        <div class="contact-avatar">${getInitials(c.name)}</div>
                        <div class="contact-name-company">
                            <span class="contact-name-val">${c.name}</span>
                            <span class="contact-company-sub">${c.company || "-"}</span>
                        </div>
                    </div>
                </td>
                <td>${c.company || "-"}</td>
                <td>
                    <div class="contact-comm-info">
                        <span>${c.email}</span>
                        <span>${c.phone || "-"}</span>
                    </div>
                </td>
                <td><strong>${formatCurrency(c.value)}</strong></td>
                <td><span class="status-badge ${c.status}">${translateStatus(c.status)}</span></td>
                <td>
                    <div class="contact-comm-info">
                        <span>${lastInteractionText}</span>
                        <span>${lastTimelineItem ? formatDate(lastTimelineItem.timestamp) : ""}</span>
                    </div>
                </td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-view" title="Ver Detalhes"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-edit" title="Editar"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-view").addEventListener("click", () => openContactDetails(c.id));
            tr.querySelector(".btn-edit").addEventListener("click", () => openEditContact(c.id));
            tr.querySelector(".btn-delete").addEventListener("click", () => deleteContact(c.id));

            tbody.appendChild(tr);
        });
    }
}

// 3. Kanban Pipeline Render
function renderKanban() {
    const env = getEnv();
    const stages = ['lead', 'contacted', 'proposal', 'negotiating', 'won', 'lost'];
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    stages.forEach(stage => {
        const columnContainer = document.getElementById(`kanban-${stage}`);
        const countBadge = document.getElementById(`count-${stage}`);
        columnContainer.innerHTML = "";

        let contactsInStage = env.contacts.filter(c => c.status === stage);
        
        if (searchVal) {
            contactsInStage = contactsInStage.filter(c => 
                c.name.toLowerCase().includes(searchVal) || 
                (c.company && c.company.toLowerCase().includes(searchVal))
            );
        }

        countBadge.innerText = contactsInStage.length;

        contactsInStage.forEach(c => {
            const card = document.createElement("div");
            card.className = "kanban-card";
            card.setAttribute("draggable", "true");
            card.setAttribute("data-id", c.id);
            card.setAttribute("data-status", c.status);
            
            card.innerHTML = `
                <h4 class="kanban-card-title">${c.name}</h4>
                <div class="kanban-card-company">${c.company || "Sem Empresa"}</div>
                <div class="kanban-card-footer">
                    <span class="kanban-card-value">${formatCurrency(c.value)}</span>
                    <span class="kanban-card-days">${getDaysSince(c.createdAt)}</span>
                </div>
            `;

            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", c.id);
                card.style.opacity = "0.5";
            });

            card.addEventListener("dragend", () => {
                card.style.opacity = "1";
            });

            card.addEventListener("dblclick", () => openContactDetails(c.id));

            columnContainer.appendChild(card);
        });
    });

    // Make columns drop targets
    document.querySelectorAll(".kanban-column").forEach(column => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            column.style.backgroundColor = "var(--bg-card-hover)";
        });

        column.addEventListener("dragleave", () => {
            column.style.backgroundColor = "var(--bg-sidebar)";
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.style.backgroundColor = "var(--bg-sidebar)";
            const id = e.dataTransfer.getData("text/plain");
            const newStatus = column.getAttribute("data-status");
            
            updateContactStatus(id, newStatus);
        });
    });
}

function updateContactStatus(id, newStatus) {
    const env = getEnv();
    const contact = env.contacts.find(c => c.id === id);
    if (contact && contact.status !== newStatus) {
        if (newStatus === "won") {
            // Open product conversion modal first
            openConversionModal(contact.id);
        } else {
            const oldStatusText = translateStatus(contact.status);
            const newStatusText = translateStatus(newStatus);
            contact.status = newStatus;
            
            contact.timeline.push({
                id: "act_" + Date.now(),
                type: "note",
                description: `Funil atualizado de [${oldStatusText}] para [${newStatusText}]`,
                timestamp: new Date().toISOString()
            });

            saveState();
            renderAll();
        }
    }
}

// 4. Customers Management Render
function renderCustomers() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.customers];
    
    if (searchVal) {
        filtered = filtered.filter(cust => 
            cust.name.toLowerCase().includes(searchVal) ||
            (cust.company && cust.company.toLowerCase().includes(searchVal)) ||
            cust.productName.toLowerCase().includes(searchVal)
        );
    }
    
    // Financials calculations
    const activeCustomers = filtered.filter(c => c.status === "active");
    const mrrTotal = activeCustomers
        .filter(c => c.type === "monthly")
        .reduce((sum, c) => sum + c.value, 0);

    const ltvTotal = filtered.reduce((sum, cust) => {
        if (cust.status === "active") {
            return sum + (cust.type === "monthly" ? cust.value * 6 : cust.type === "yearly" ? cust.value : cust.value);
        }
        return sum + (cust.type === "single" ? cust.value : 0);
    }, 0);

    // Update DOM
    document.getElementById("kpiMRR").innerText = formatCurrency(mrrTotal);
    document.getElementById("kpiCustomerLTV").innerText = formatCurrency(ltvTotal);
    document.getElementById("kpiActiveCustomers").innerText = activeCustomers.length;

    const tbody = document.getElementById("customersTableBody");
    const emptyState = document.getElementById("customersEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("customersTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("customersTable").classList.remove("hidden");

        filtered.forEach(cust => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="col-contact-info">
                        <div class="contact-avatar">${getInitials(cust.name)}</div>
                        <span>${cust.name}</span>
                    </div>
                </td>
                <td>${cust.company || "-"}</td>
                <td>${cust.productName}</td>
                <td>
                    <span class="badge-recurrence ${cust.type}">
                        ${cust.type === 'monthly' ? 'Mensal' : cust.type === 'yearly' ? 'Anual' : 'Único'}
                    </span>
                </td>
                <td><strong>${formatCurrency(cust.value)}</strong></td>
                <td>
                    <span class="badge-status ${cust.status}">
                        ${cust.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-toggle-status" title="Alternar Status"><i data-lucide="refresh-cw" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-customer" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-toggle-status").addEventListener("click", () => toggleCustomerStatus(cust.id));
            tr.querySelector(".btn-delete-customer").addEventListener("click", () => deleteCustomer(cust.id));

            tbody.appendChild(tr);
        });
    }
}

function toggleCustomerStatus(id) {
    const env = getEnv();
    const cust = env.customers.find(c => c.id === id);
    if (cust) {
        cust.status = cust.status === "active" ? "inactive" : "active";
        saveState();
        renderAll();
    }
}

function deleteCustomer(id) {
    if (confirm("Deseja realmente remover este registro de faturamento/cliente?")) {
        const env = getEnv();
        env.customers = env.customers.filter(c => c.id !== id);
        saveState();
        renderAll();
    }
}

// 5. Products Management Render
function renderProducts() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.products];
    
    if (searchVal) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchVal) ||
            p.description.toLowerCase().includes(searchVal)
        );
    }

    const tbody = document.getElementById("productsTableBody");
    const emptyState = document.getElementById("productsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("productsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("productsTable").classList.remove("hidden");

        filtered.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${p.name}</strong></td>
                <td>${p.description || "-"}</td>
                <td>${formatCurrency(p.price)}</td>
                <td>
                    <span class="badge-recurrence ${p.type}">
                        ${p.type === 'monthly' ? 'Recorrente Mensal' : p.type === 'yearly' ? 'Recorrente Anual' : 'Cobrança Única'}
                    </span>
                </td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-edit-product" title="Editar"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-product" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-edit-product").addEventListener("click", () => openEditProduct(p.id));
            tr.querySelector(".btn-delete-product").addEventListener("click", () => deleteProduct(p.id));

            tbody.appendChild(tr);
        });
    }
}

function openEditProduct(id) {
    const env = getEnv();
    const p = env.products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("productId").value = p.id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productDescription").value = p.description || "";
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productType").value = p.type;

    document.getElementById("productModalTitle").innerText = "Editar Produto";
    document.getElementById("productModal").classList.add("active");
}

function deleteProduct(id) {
    if (confirm("Deseja realmente remover este produto do catálogo?")) {
        const env = getEnv();
        env.products = env.products.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

// 6. Tasks Management Render
function renderTasks() {
    const env = getEnv();
    const activeFilter = document.querySelector(".tasks-filters li.active").getAttribute("data-task-filter");
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.tasks];

    if (activeFilter === "pending") {
        filtered = filtered.filter(t => !t.completed);
    } else if (activeFilter === "completed") {
        filtered = filtered.filter(t => t.completed);
    }

    if (searchVal) {
        filtered = filtered.filter(t => t.title.toLowerCase().includes(searchVal));
    }

    const container = document.getElementById("tasksListContainer");
    const emptyState = document.getElementById("tasksEmptyState");
    container.innerHTML = "";

    document.getElementById("tasksBadgeAll").innerText = env.tasks.length;
    document.getElementById("tasksBadgePending").innerText = env.tasks.filter(t => !t.completed).length;
    document.getElementById("tasksBadgeCompleted").innerText = env.tasks.filter(t => t.completed).length;

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        
        filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const p = { high: 3, medium: 2, low: 1 };
            if (p[b.priority] !== p[a.priority]) return p[b.priority] - p[a.priority];
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        filtered.forEach(task => {
            const contactName = task.contactId ? (env.contacts.find(c => c.id === task.contactId)?.name || "") : "";
            const div = document.createElement("div");
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-checkbox"></div>
                </label>
                <div class="task-content">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        ${contactName ? `<span>👤 ${contactName}</span>` : ""}
                        <span>📅 ${formatDate(task.dueDate)}</span>
                        <span class="task-priority-badge ${task.priority}">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                    </div>
                </div>
                <button class="btn-icon-only btn-delete-task" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
            `;

            div.querySelector(".task-toggle").addEventListener("change", (e) => {
                toggleTaskComplete(task.id, e.target.checked);
            });
            div.querySelector(".btn-delete-task").addEventListener("click", () => {
                deleteTask(task.id);
            });

            container.appendChild(div);
        });
    }
}

function toggleTaskComplete(id, completed) {
    const env = getEnv();
    const task = env.tasks.find(t => t.id === id);
    if (task) {
        task.completed = completed;
        saveState();
        renderAll();
    }
}

function deleteTask(id) {
    if (confirm("Deseja realmente remover esta tarefa?")) {
        const env = getEnv();
        env.tasks = env.tasks.filter(t => t.id !== id);
        saveState();
        renderAll();
    }
}

// Populate UI selector dropdowns
function populateContactDropdowns() {
    const env = getEnv();
    const select = document.getElementById("taskContact");
    select.innerHTML = `<option value="">Nenhum Contato</option>`;
    
    const sorted = [...env.contacts].sort((a,b) => a.name.localeCompare(b.name));
    sorted.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        select.appendChild(option);
    });
}

function populateConversionProductsDropdown() {
    const env = getEnv();
    const select = document.getElementById("conversionProduct");
    select.innerHTML = "";
    
    env.products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.innerText = `${p.name} (Ref: ${formatCurrency(p.price)})`;
        select.appendChild(option);
    });
    
    // Set change listener to pre-populate values on product change
    select.addEventListener("change", (e) => {
        const prod = env.products.find(p => p.id === e.target.value);
        if (prod) {
            document.getElementById("conversionPrice").value = prod.price;
            document.getElementById("conversionType").value = prod.type;
        }
    });
}

// 7. Modals Toggles and Actions
// Contact forms
function openAddContact() {
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = "";
    document.getElementById("contactModalTitle").innerText = "Adicionar Contato";
    document.getElementById("contactModal").classList.add("active");
}

function openEditContact(id) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === id);
    if (!c) return;

    document.getElementById("contactId").value = c.id;
    document.getElementById("contactName").value = c.name;
    document.getElementById("contactCompany").value = c.company || "";
    document.getElementById("contactEmail").value = c.email;
    document.getElementById("contactPhone").value = c.phone || "";
    document.getElementById("contactValue").value = c.value || 0;
    document.getElementById("contactStatus").value = c.status;
    document.getElementById("contactNotes").value = c.notes || "";

    document.getElementById("contactModalTitle").innerText = "Editar Contato";
    document.getElementById("contactModal").classList.add("active");
}

function deleteContact(id) {
    if (confirm("Tem certeza que deseja excluir este contato? Esta ação apagará também o histórico de atividades.")) {
        const env = getEnv();
        env.contacts = env.contacts.filter(c => c.id !== id);
        env.tasks = env.tasks.filter(t => t.contactId !== id);
        saveState();
        renderAll();
    }
}

// Contact details and activities logs
function openContactDetails(id) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === id);
    if (!c) return;

    document.getElementById("activityContactId").value = c.id;
    document.getElementById("detailInitials").innerText = getInitials(c.name);
    document.getElementById("detailName").innerText = c.name;
    document.getElementById("detailCompany").innerText = c.company || "Sem Empresa";
    document.getElementById("detailEmail").innerText = c.email;
    document.getElementById("detailPhone").innerText = c.phone || "Não cadastrado";
    document.getElementById("detailValue").innerText = formatCurrency(c.value);
    
    const badge = document.getElementById("detailBadgeStatus");
    badge.className = `status-badge ${c.status}`;
    badge.innerText = translateStatus(c.status);

    renderTimeline(c);
    
    document.getElementById("contactDetailsModal").classList.add("active");
    lucide.createIcons();
}

function renderTimeline(contact) {
    const container = document.getElementById("contactTimeline");
    container.innerHTML = "";
    
    if (!contact.timeline || contact.timeline.length === 0) {
        container.innerHTML = `<p style="font-size:13px;color:var(--text-muted);text-align:center;padding:20px;">Nenhuma interação registrada.</p>`;
        return;
    }

    const sortedTimeline = [...contact.timeline].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedTimeline.forEach(act => {
        const item = document.createElement("div");
        item.className = `timeline-item ${act.type}`;
        
        let typeEmoji = "📝";
        let typeTitle = "Nota";
        if (act.type === 'call') { typeEmoji = "📞"; typeTitle = "Ligação"; }
        else if (act.type === 'email') { typeEmoji = "✉️"; typeTitle = "E-mail"; }
        else if (act.type === 'meeting') { typeEmoji = "🤝"; typeTitle = "Reunião"; }

        item.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-title">${typeEmoji} ${typeTitle}</span>
                <span class="timeline-time">${formatDate(act.timestamp)}</span>
            </div>
            <p class="timeline-desc">${act.description}</p>
        `;
        container.appendChild(item);
    });
}

// Products form
document.getElementById("btnCreateProduct").addEventListener("click", () => {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productModalTitle").innerText = "Adicionar Produto";
    document.getElementById("productModal").classList.add("active");
});
document.getElementById("btnCloseProductModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
});
document.getElementById("btnCancelProductModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
});

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = parseFloat(document.getElementById("productPrice").value) || 0;
    const type = document.getElementById("productType").value;

    if (id) {
        const p = env.products.find(x => x.id === id);
        if (p) {
            p.name = name;
            p.description = description;
            p.price = price;
            p.type = type;
        }
    } else {
        const newProd = {
            id: "p_" + Date.now(),
            name,
            description,
            price,
            type
        };
        env.products.push(newProd);
    }
    
    saveState();
    document.getElementById("productModal").classList.remove("active");
    renderAll();
});

// Conversion Modal triggers
function openConversionModal(contactId) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === contactId);
    if (!c) return;

    document.getElementById("conversionContactId").value = c.id;
    
    // Set initial product field selection
    const select = document.getElementById("conversionProduct");
    if (env.products.length > 0) {
        select.value = env.products[0].id;
        document.getElementById("conversionPrice").value = env.products[0].price;
        document.getElementById("conversionType").value = env.products[0].type;
    } else {
        document.getElementById("conversionPrice").value = c.value;
        document.getElementById("conversionType").value = "single";
    }

    document.getElementById("conversionModal").classList.add("active");
}

document.getElementById("btnCloseConversionModal").addEventListener("click", () => {
    document.getElementById("conversionModal").classList.remove("active");
});
document.getElementById("btnCancelConversionModal").addEventListener("click", () => {
    // Just skip adding to customers but close modal and complete deal status won
    const env = getEnv();
    const id = document.getElementById("conversionContactId").value;
    const contact = env.contacts.find(c => c.id === id);
    if (contact) {
        const oldStatus = contact.status;
        contact.status = "won";
        contact.timeline.push({
            id: "act_" + Date.now(),
            type: "note",
            description: `Funil atualizado de [${translateStatus(oldStatus)}] para [Ganho] (faturamento não registrado)`,
            timestamp: new Date().toISOString()
        });
        saveState();
    }
    document.getElementById("conversionModal").classList.remove("active");
    renderAll();
});

document.getElementById("conversionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const contactId = document.getElementById("conversionContactId").value;
    const productId = document.getElementById("conversionProduct").value;
    const finalPrice = parseFloat(document.getElementById("conversionPrice").value) || 0;
    const billingType = document.getElementById("conversionType").value;

    const contact = env.contacts.find(c => c.id === contactId);
    const product = env.products.find(p => p.id === productId);

    if (contact && product) {
        const oldStatus = contact.status;
        contact.status = "won";
        contact.value = finalPrice;
        contact.timeline.push({
            id: "act_" + Date.now(),
            type: "note",
            description: `Venda concluída! Produto: ${product.name}. Valor acordado: ${formatCurrency(finalPrice)}.`,
            timestamp: new Date().toISOString()
        });

        // Add to Customers list
        const newCust = {
            id: "cust_" + Date.now(),
            contactId: contact.id,
            name: contact.name,
            company: contact.company,
            productName: product.name,
            value: finalPrice,
            type: billingType,
            status: "active",
            createdAt: new Date().toISOString()
        };
        env.customers.push(newCust);

        saveState();
    }

    document.getElementById("conversionModal").classList.remove("active");
    renderAll();
});

// Import Modal Triggers
document.getElementById("btnOpenImport").addEventListener("click", () => {
    document.getElementById("importText").value = "";
    document.getElementById("importLogsPanel").classList.add("hidden");
    document.getElementById("importLogsTableBody").innerHTML = "";
    document.getElementById("importFileName").innerText = "Nenhum arquivo selecionado";
    document.getElementById("importModal").classList.add("active");
});
document.getElementById("btnCloseImportModal").addEventListener("click", () => {
    document.getElementById("importModal").classList.remove("active");
});
document.getElementById("btnCancelImportModal").addEventListener("click", () => {
    document.getElementById("importModal").classList.remove("active");
});

// Execute Lead Import (CSV parsing and duplicate check)
document.getElementById("btnExecuteImport").addEventListener("click", () => {
    const env = getEnv();
    const textData = document.getElementById("importText").value.trim();
    const logTableBody = document.getElementById("importLogsTableBody");
    logTableBody.innerHTML = "";
    
    if (!textData) {
        alert("Por favor, cole os dados CSV na caixa de texto.");
        return;
    }

    const lines = textData.split("\n");
    if (lines.length <= 1) {
        alert("O CSV inserido não possui registros suficientes.");
        return;
    }

    // Identify header line
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const records = lines.slice(1);
    
    let successCount = 0;
    let ignoredCount = 0;
    
    document.getElementById("importLogsPanel").classList.remove("hidden");

    records.forEach((record, index) => {
        const lineNum = index + 2;
        if (!record.trim()) return;

        const cells = record.split(",").map(c => c.trim());
        
        // Map fields
        const name = cells[0] || "";
        const company = cells[1] || "";
        const email = cells[2] || "";
        const phone = cells[3] || "";
        const value = parseFloat(cells[4]) || 0;
        const notes = cells[5] || "";

        if (!name || !email) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum}</td>
                <td><span class="badge-status inactive">Ignorado</span></td>
                <td>Nome ou E-mail ausentes no registro.</td>
            `;
            logTableBody.appendChild(tr);
            ignoredCount++;
            return;
        }

        // Duplicate checks (Email or Phone)
        const duplicateEmail = env.contacts.some(c => c.email.toLowerCase() === email.toLowerCase());
        const duplicatePhone = phone && env.contacts.some(c => c.phone && c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));

        if (duplicateEmail) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum} (${name})</td>
                <td><span class="badge-status inactive">Duplicado</span></td>
                <td>O e-mail '${email}' já existe no ambiente.</td>
            `;
            logTableBody.appendChild(tr);
            ignoredCount++;
            return;
        }

        if (duplicatePhone) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum} (${name})</td>
                <td><span class="badge-status inactive">Duplicado</span></td>
                <td>O telefone '${phone}' já está cadastrado.</td>
            `;
            logTableBody.appendChild(tr);
            ignoredCount++;
            return;
        }

        // Create Contact
        const newContact = {
            id: "c_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            name,
            company,
            email,
            phone,
            value,
            status: "lead",
            notes,
            createdAt: new Date().toISOString(),
            timeline: [
                { id: "act_" + Date.now(), type: "note", description: "Contato importado via planilha CSV.", timestamp: new Date().toISOString() }
            ]
        };

        env.contacts.push(newContact);
        successCount++;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>Linha ${lineNum} (${name})</td>
            <td><span class="badge-status active">Sucesso</span></td>
            <td>Lead importado com sucesso.</td>
        `;
        logTableBody.appendChild(tr);
    });

    saveState();
    renderAll();
    alert(`Importação concluída. ${successCount} importados, ${ignoredCount} ignorados.`);
});

// File reader parser
document.getElementById("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("importFileName").innerText = file.name;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        if (file.name.endsWith(".json")) {
            try {
                const arr = JSON.parse(content);
                if (Array.isArray(arr)) {
                    // Convert back to CSV text or process array directly
                    // To keep things simple, let's write them directly into the textarea as CSV formatted text for processing
                    let csvText = "Nome,Empresa,Email,Telefone,Valor,Notas\n";
                    arr.forEach(item => {
                        csvText += `${item.name || ""},${item.company || ""},${item.email || ""},${item.phone || ""},${item.value || 0},${item.notes || ""}\n`;
                    });
                    document.getElementById("importText").value = csvText;
                } else {
                    alert("JSON inválido: deve ser uma lista de objetos.");
                }
            } catch (err) {
                alert("Erro ao ler JSON: " + err.message);
            }
        } else {
            // Paste CSV contents directly
            document.getElementById("importText").value = content;
        }
    };
    reader.readAsText(file);
});

// Login overlay Form submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const errorMsg = document.getElementById("loginErrorMsg");

    // Login parameters check
    if (user === "Admin" && pass === "080125") {
        sessionStorage.setItem("nexus_crm_logged_in", "true");
        sessionStorage.setItem("nexus_crm_env", "webco");
        state.currentEnv = "webco";
        
        errorMsg.classList.add("hidden");
        document.getElementById("loginOverlay").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("hidden");
        document.getElementById("sidebarUsername").innerText = "Admin";
        
        renderAll();
    } else {
        errorMsg.classList.remove("hidden");
        // Shake card effect
        const card = document.querySelector(".login-card");
        card.style.animation = "shake 0.3s ease-in-out";
        setTimeout(() => card.style.animation = "", 300);
    }
});

// Logout handler
document.getElementById("btnLogout").addEventListener("click", () => {
    sessionStorage.removeItem("nexus_crm_logged_in");
    sessionStorage.removeItem("nexus_crm_env");
    state.currentEnv = "";
    document.getElementById("loginOverlay").classList.remove("hidden");
    document.getElementById("appContainer").classList.add("hidden");
    document.getElementById("loginForm").reset();
});

// Navigation & Tab Switching
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view-section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetView = item.getAttribute("data-view");
        
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        views.forEach(view => {
            if (view.id === `${targetView}View`) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        
        renderAll();
    });
});

// Link quick buttons
document.getElementById("btnViewAllContacts").addEventListener("click", () => {
    document.querySelector('[data-view="contacts"]').click();
});
document.getElementById("btnViewAllTasks").addEventListener("click", () => {
    document.querySelector('[data-view="tasks"]').click();
});

// Search input handler
const searchInput = document.getElementById("globalSearch");
searchInput.addEventListener("input", () => {
    const activeTab = document.querySelector(".nav-item.active").getAttribute("data-view");
    if (activeTab === "contacts") renderContacts();
    else if (activeTab === "kanban") renderKanban();
    else if (activeTab === "tasks") renderTasks();
    else if (activeTab === "dashboard") renderDashboard();
    else if (activeTab === "customers") renderCustomers();
    else if (activeTab === "products") renderProducts();
});

// Modals Trigger Handlers
document.getElementById("btnQuickAddContact").addEventListener("click", openAddContact);
document.getElementById("btnAddContact").addEventListener("click", openAddContact);
document.getElementById("btnCloseContactModal").addEventListener("click", () => {
    document.getElementById("contactModal").classList.remove("active");
});
document.getElementById("btnCancelContactModal").addEventListener("click", () => {
    document.getElementById("contactModal").classList.remove("active");
});
document.getElementById("btnCloseDetailsModal").addEventListener("click", () => {
    document.getElementById("contactDetailsModal").classList.remove("active");
});

// Add Task Modal Toggle
document.getElementById("btnAddTask").addEventListener("click", () => {
    document.getElementById("taskForm").reset();
    document.getElementById("taskModal").classList.add("active");
});
document.getElementById("btnCloseTaskModal").addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("active");
});
document.getElementById("btnCancelTaskModal").addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("active");
});

// Task Filter Tabs Navigation
document.querySelectorAll(".tasks-filters li").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tasks-filters li").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderTasks();
    });
});

// Form Submission Handlers
// Contact Form
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("contactName").value;
    const company = document.getElementById("contactCompany").value;
    const email = document.getElementById("contactEmail").value;
    const phone = document.getElementById("contactPhone").value;
    const value = parseFloat(document.getElementById("contactValue").value) || 0;
    const status = document.getElementById("contactStatus").value;
    const notes = document.getElementById("contactNotes").value;

    if (id) {
        const contact = env.contacts.find(c => c.id === id);
        if (contact) {
            const oldStatusText = translateStatus(contact.status);
            const newStatusText = translateStatus(status);
            
            contact.name = name;
            contact.company = company;
            contact.email = email;
            contact.phone = phone;
            contact.value = value;
            
            if (contact.status !== status) {
                if (status === "won") {
                    document.getElementById("contactModal").classList.remove("active");
                    openConversionModal(contact.id);
                    return;
                } else {
                    contact.status = status;
                    contact.timeline.push({
                        id: "act_" + Date.now(),
                        type: "note",
                        description: `Funil atualizado de [${oldStatusText}] para [${newStatusText}]`,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            contact.notes = notes;
        }
    } else {
        const newContact = {
            id: "c_" + Date.now(),
            name,
            company,
            email,
            phone,
            value,
            status,
            notes,
            createdAt: new Date().toISOString(),
            timeline: [
                { id: "act_" + Date.now(), type: "note", description: "Contato cadastrado no sistema.", timestamp: new Date().toISOString() }
            ]
        };
        env.contacts.push(newContact);
        
        if (status === "won") {
            saveState();
            document.getElementById("contactModal").classList.remove("active");
            openConversionModal(newContact.id);
            return;
        }
    }

    saveState();
    document.getElementById("contactModal").classList.remove("active");
    renderAll();
});

// Activity Form
document.getElementById("activityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const contactId = document.getElementById("activityContactId").value;
    const type = document.getElementById("activityType").value;
    const description = document.getElementById("activityDescription").value;

    const contact = env.contacts.find(c => c.id === contactId);
    if (contact) {
        contact.timeline.push({
            id: "act_" + Date.now(),
            type,
            description,
            timestamp: new Date().toISOString()
        });
        saveState();
        renderTimeline(contact);
        document.getElementById("activityForm").reset();
        renderAll();
    }
});

// Task Form
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const title = document.getElementById("taskTitle").value;
    const contactId = document.getElementById("taskContact").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;

    const newTask = {
        id: "t_" + Date.now(),
        title,
        contactId,
        dueDate,
        priority,
        completed: false
    };

    env.tasks.push(newTask);
    saveState();
    document.getElementById("taskModal").classList.remove("active");
    renderAll();
});

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    if (isDark) {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        themeToggleBtn.querySelector("span").innerText = "Modo Escuro";
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        themeToggleBtn.querySelector("span").innerText = "Modo Claro";
    }
    renderCharts();
});

// Boot Setup
window.addEventListener("DOMContentLoaded", () => {
    init();
});
