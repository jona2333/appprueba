// ==================== CONFIGURACIÓN Y DATOS ====================
const CONFIG = {
NOTIFICATION_DURATION: 3000,
ANIMATION_DURATION: 500,
CURSOR_EFFECT_DURATION: 500,
PRODUCTIVITY_THRESHOLDS: {
    EXCELLENT: 8,
    GOOD: 6,
    AVERAGE: 4
}
};

// Datos de ejemplo con estructura mejorada
let projects = [
{ 
    id: 1,
    name: "Sistema de Inventario", 
    progress: 75, 
    status: "En desarrollo", 
    priority: "alta",
    createdAt: new Date('2024-01-15')
},
{ 
    id: 2,
    name: "App Móvil Tienda", 
    progress: 45, 
    status: "Diseño", 
    priority: "media",
    createdAt: new Date('2024-02-01')
},
{ 
    id: 3,
    name: "Dashboard Analytics", 
    progress: 90, 
    status: "Testing", 
    priority: "alta",
    createdAt: new Date('2024-01-20')
},
{ 
    id: 4,
    name: "API REST Usuarios", 
    progress: 60, 
    status: "Desarrollo", 
    priority: "media",
    createdAt: new Date('2024-02-10')
},
{ 
    id: 5,
    name: "Landing Page", 
    progress: 100, 
    status: "Completado", 
    priority: "baja",
    createdAt: new Date('2024-01-10')
}
];

// ==================== UTILIDADES ====================
const Utils = {
generateId: () => Date.now() + Math.random(),

formatDate: (date) => {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
},

validateInput: (value, minLength = 1) => {
    return value && value.trim().length >= minLength;
},

debounce: (func, wait) => {
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
};

// ==================== SISTEMA DE NOTIFICACIONES ====================
const NotificationSystem = {
show: (message, type = 'success') => {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    notification.style.background = type === 'success' ? '#4CAF50' : '#f44336';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, CONFIG.NOTIFICATION_DURATION);
},

success: (message) => NotificationSystem.show(message, 'success'),
error: (message) => NotificationSystem.show(message, 'error'),
warning: (message) => NotificationSystem.show(message, 'warning')
};

// ==================== GESTIÓN DE TIEMPO ====================
const TimeManager = {
updateTime: () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
},

init: () => {
    TimeManager.updateTime();
    setInterval(TimeManager.updateTime, 1000);
}
};

// ==================== GESTIÓN DE PROYECTOS ====================
const ProjectManager = {
render: () => {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        projectElement.setAttribute('data-priority', project.priority);
        
        const priorityColor = ProjectManager.getPriorityColor(project.priority);
        const statusIcon = ProjectManager.getStatusIcon(project.status);
        
        projectElement.innerHTML = `
            <div class="project-header">
                <div class="project-name">${project.name}</div>
                <div class="project-priority" style="color: ${priorityColor}">
                    ${project.priority.toUpperCase()}
                </div>
            </div>
            <div class="project-status">
                ${statusIcon} ${project.status} • Creado: ${Utils.formatDate(project.createdAt)}
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%; background: ${priorityColor}"></div>
            </div>
            <div class="project-progress-text">
                ${project.progress}% completado
            </div>
            <div class="project-actions">
                <button onclick="ProjectManager.updateProgress(${project.id}, 10)" class="btn-small">+10%</button>
                <button onclick="ProjectManager.updateProgress(${project.id}, -10)" class="btn-small">-10%</button>
                <button onclick="ProjectManager.delete(${project.id})" class="btn-small btn-danger">Eliminar</button>
            </div>
        `;
        
        container.appendChild(projectElement);
    });
    
    ProjectManager.updateStats();
    // Actualizar gráfico después de renderizar
    ChartManager.update();
},

getPriorityColor: (priority) => {
    const colors = {
        'alta': '#f44336',
        'media': '#ff9800',
        'baja': '#4caf50'
    };
    return colors[priority] || '#667eea';
},

getStatusIcon: (status) => {
    const icons = {
        'Completado': '✅',
        'Testing': '🧪',
        'En desarrollo': '⚡',
        'Desarrollo': '💻',
        'Diseño': '🎨',
        'Planificación': '📋'
    };
    return icons[status] || '📝';
},

create: (projectData) => {
    const newProject = {
        id: Utils.generateId(),
        name: projectData.name,
        progress: 0,
        status: 'Planificación',
        priority: projectData.priority,
        createdAt: new Date()
    };
    
    projects.unshift(newProject);
    ProjectManager.render();
    NotificationSystem.success('¡Proyecto creado exitosamente!');
},

updateProgress: (id, change) => {
    const project = projects.find(p => p.id === id);
    if (project) {
        project.progress = Math.max(0, Math.min(100, project.progress + change));
        
        if (project.progress === 100) {
            project.status = 'Completado';
        } else if (project.progress >= 80) {
            project.status = 'Testing';
        } else if (project.progress >= 20) {
            project.status = 'En desarrollo';
        }
        
        ProjectManager.render();
        NotificationSystem.success(`Progreso actualizado: ${project.progress}%`);
    }
},

delete: (id) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
        projects = projects.filter(p => p.id !== id);
        ProjectManager.render();
        NotificationSystem.warning('Proyecto eliminado');
    }
},

updateStats: () => {
    const totalElement = document.getElementById('total-projects');
    const completedElement = document.getElementById('completed-tasks');
    
    if (totalElement) totalElement.textContent = projects.length;
    
    const completed = projects.filter(p => p.status === 'Completado').length;
    if (completedElement) completedElement.textContent = completed;
}
};

// ==================== SISTEMA DE GRÁFICOS ====================
const ChartManager = {
chart: null,

create: () => {
    const ctx = document.getElementById('projectChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    if (ChartManager.chart) {
        ChartManager.chart.destroy();
    }
    
    const statusCounts = ChartManager.getStatusCounts();
    
    ChartManager.chart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0',
                    '#607D8B'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
},

getStatusCounts: () => {
    const counts = {};
    projects.forEach(project => {
        counts[project.status] = (counts[project.status] || 0) + 1;
    });
    return counts;
},

update: () => {
    if (ChartManager.chart) {
        const statusCounts = ChartManager.getStatusCounts();
        ChartManager.chart.data.labels = Object.keys(statusCounts);
        ChartManager.chart.data.datasets[0].data = Object.values(statusCounts);
        ChartManager.chart.update();
    }
}
};

// ==================== CALCULADORA DE PRODUCTIVIDAD ====================
const ProductivityCalculator = {
calculate: () => {
    const hoursInput = document.getElementById('hours-worked');
    const tasksInput = document.getElementById('tasks-completed');
    const resultElement = document.getElementById('productivity-result');
    
    if (!hoursInput || !tasksInput || !resultElement) return;
    
    const hours = parseInt(hoursInput.value) || 0;
    const tasks = parseInt(tasksInput.value) || 0;
    
    if (hours <= 0) {
        resultElement.innerHTML = '⏰ Ingresa las horas trabajadas para calcular';
        return;
    }
    
    const productivity = (tasks / hours) * 10;
    const { message, color } = ProductivityCalculator.getProductivityMessage(productivity);
    
    resultElement.innerHTML = `
        <div style="color: ${color}; font-weight: bold;">
            ${message}
        </div>
        <div style="font-size: 0.9rem; margin-top: 5px;">
            Tareas por hora: ${(tasks/hours).toFixed(2)}
        </div>
    `;
},

getProductivityMessage: (productivity) => {
    const { EXCELLENT, GOOD, AVERAGE } = CONFIG.PRODUCTIVITY_THRESHOLDS;
    
    if (productivity >= EXCELLENT) {
        return {
            message: `🚀 ¡Excelente! Productividad: ${productivity.toFixed(1)}/10`,
            color: '#4CAF50'
        };
    } else if (productivity >= GOOD) {
        return {
            message: `👍 Buen trabajo. Productividad: ${productivity.toFixed(1)}/10`,
            color: '#2196F3'
        };
    } else if (productivity >= AVERAGE) {
        return {
            message: `⚡ Puedes mejorar. Productividad: ${productivity.toFixed(1)}/10`,
            color: '#FF9800'
        };
    } else {
        return {
            message: `💪 ¡Vamos por más! Productividad: ${productivity.toFixed(1)}/10`,
            color: '#f44336'
        };
    }
}
};

// ==================== EFECTOS VISUALES ====================
const VisualEffects = {
animateNumbers: () => {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(number => {
        const finalValue = parseInt(number.textContent);
        if (isNaN(finalValue)) return;
        
        let currentValue = 0;
        const increment = finalValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                number.textContent = finalValue;
                clearInterval(timer);
            } else {
                number.textContent = Math.floor(currentValue);
            }
        }, 30);
    });
},

addAnimationStyles: () => {
    const style = document.createElement('style');
    style.textContent = `
        .project-item {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .project-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .btn-small {
            padding: 4px 8px;
            margin: 2px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            background: #667eea;
            color: white;
            transition: background-color 0.2s ease;
        }
        
        .btn-small:hover {
            background: #5a67d8;
        }
        
        .btn-danger {
            background-color: #f44336 !important;
        }
        
        .btn-danger:hover {
            background-color: #d32f2f !important;
        }
        
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .project-priority {
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .project-progress-text {
            font-size: 0.9rem;
            color: #666;
            margin-top: 5px;
        }
        
        .project-actions {
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
}
};

// ==================== GESTIÓN DE FORMULARIOS ====================
const FormManager = {
init: () => {
    const form = document.getElementById('project-form');
    if (!form) return;
    
    form.addEventListener('submit', FormManager.handleProjectSubmit);
},

handleProjectSubmit: (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('project-name')?.trim();
    const description = formData.get('project-description')?.trim();
    const priority = formData.get('project-priority');
    
    if (!Utils.validateInput(name, 3)) {
        NotificationSystem.error('El nombre debe tener al menos 3 caracteres');
        return;
    }
    
    ProjectManager.create({ name, description, priority });
    e.target.reset();
}
};

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================
const App = {
init: () => {
    console.log('🚀 Iniciando Dashboard...');
    
    // Inicializar módulos en orden
    TimeManager.init();
    VisualEffects.addAnimationStyles();
    FormManager.init();
    
    // Renderizar contenido
    ProjectManager.render();
    ChartManager.create();
    
    // Efectos con delay
    setTimeout(() => {
        VisualEffects.animateNumbers();
        NotificationSystem.success('¡Dashboard cargado correctamente!');
    }, CONFIG.ANIMATION_DURATION);
    
    console.log('✅ Dashboard inicializado correctamente');
}
};

// ==================== EVENTOS GLOBALES ====================
document.addEventListener('DOMContentLoaded', App.init);

// Exponer funciones globales necesarias
window.calculateProductivity = ProductivityCalculator.calculate;
window.ProjectManager = ProjectManager;
