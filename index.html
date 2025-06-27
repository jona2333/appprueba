'use strict';

// ==================== CONFIGURACIÓN Y CONSTANTES ====================
const STORAGE_KEY = 'dashboard_projects';
const SETTINGS_KEY = 'dashboard_settings';

// Estado global de la aplicación
let appState = {
    projects: [],
    nextId: 1,
    chart: null,
    isLoaded: false
};

// ==================== UTILIDADES BÁSICAS ====================
const utils = {
    // Generar ID único
    generateId() {
        return appState.nextId++;
    },

    // Formatear fecha
    formatDate(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Sanitizar texto
    sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Validar entrada
    validate(text, min = 1, max = 1000) {
        if (!text || typeof text !== 'string') return false;
        const trimmed = text.trim();
        return trimmed.length >= min && trimmed.length <= max;
    }
};

// ==================== SISTEMA DE ALMACENAMIENTO ====================
const storage = {
    // Guardar proyectos
    save() {
        try {
            const data = {
                projects: appState.projects,
                nextId: appState.nextId,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('✅ Datos guardados correctamente');
            showNotification('Datos guardados', 'success');
            return true;
        } catch (error) {
            console.error('❌ Error guardando:', error);
            showNotification('Error al guardar datos', 'error');
            return false;
        }
    },

    // Cargar proyectos
    load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                console.log('📝 No hay datos guardados, iniciando con datos de ejemplo');
                this.loadDefaultData();
                return;
            }

            const data = JSON.parse(saved);
            
            // Restaurar proyectos
            appState.projects = data.projects || [];
            appState.nextId = data.nextId || 1;
            
            // Convertir fechas de string a Date
            appState.projects.forEach(project => {
                if (project.createdAt) project.createdAt = new Date(project.createdAt);
                if (project.updatedAt) project.updatedAt = new Date(project.updatedAt);
            });

            console.log(`📂 Cargados ${appState.projects.length} proyectos`);
            console.log(`📅 Última vez guardado: ${data.lastSaved}`);
            
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            showNotification('Error al cargar datos guardados', 'error');
            this.loadDefaultData();
        }
    },

    // Cargar datos por defecto
    loadDefaultData() {
        appState.projects = [
            {
                id: 1,
                name: "Sistema de Inventario",
                description: "Sistema completo para gestión de inventarios",
                progress: 75,
                status: "En desarrollo",
                priority: "alta",
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date()
            },
            {
                id: 2,
                name: "App Móvil E-commerce",
                description: "Aplicación móvil para tienda en línea",
                progress: 45,
                status: "Diseño",
                priority: "media",
                createdAt: new Date('2024-02-01'),
                updatedAt: new Date()
            }
        ];
        appState.nextId = 3;
        this.save(); // Guardar datos por defecto
    },

    // Limpiar todos los datos
    clear() {
        if (confirm('⚠️ ¿Eliminar TODOS los datos?\n\nEsta acción no se puede deshacer.')) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(SETTINGS_KEY);
            appState.projects = [];
            appState.nextId = 1;
            renderProjects();
            updateStats();
            showNotification('Todos los datos eliminados', 'warning');
        }
    },

    // Exportar datos
    export() {
        const data = {
            projects: appState.projects,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Datos exportados correctamente', 'success');
    },

    // Importar datos
    import(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.projects && Array.isArray(data.projects)) {
                    appState.projects = data.projects.map(p => ({
                        ...p,
                        createdAt: new Date(p.createdAt),
                        updatedAt: new Date(p.updatedAt)
                    }));
                    
                    // Actualizar nextId
                    appState.nextId = Math.max(...appState.projects.map(p => p.id), 0) + 1;
                    
                    this.save();
                    renderProjects();
                    updateStats();
                    showNotification('Datos importados correctamente', 'success');
                } else {
                    throw new Error('Formato inválido');
                }
            } catch (error) {
                console.error('❌ Error importando:', error);
                showNotification('Error al importar archivo', 'error');
            }
        };
        reader.readAsText(file);
    }
};

// ==================== SISTEMA DE NOTIFICACIONES ====================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.className = 'notification';
    notification.textContent = message;
    notification.classList.add('show', type);
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
    
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

// ==================== GESTIÓN DE PROYECTOS ====================
const projects = {
    // Crear nuevo proyecto
    create(data) {
        try {
            if (!utils.validate(data.name, 3, 100)) {
                showNotification('Nombre inválido (3-100 caracteres)', 'error');
                return false;
            }
            
            if (!utils.validate(data.description, 10, 500)) {
                showNotification('Descripción inválida (10-500 caracteres)', 'error');
                return false;
            }

            const project = {
                id: utils.generateId(),
                name: data.name.trim(),
                description: data.description.trim(),
                progress: 0,
                status: 'Planificación',
                priority: data.priority || 'media',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            appState.projects.unshift(project);
            
            if (storage.save()) {
                renderProjects();
                updateStats();
                showNotification(`Proyecto "${project.name}" creado`, 'success');
                return true;
            }
            return false;
            
        } catch (error) {
            console.error('❌ Error creando proyecto:', error);
            showNotification('Error al crear proyecto', 'error');
            return false;
        }
    },

    // Actualizar progreso
    updateProgress(id, change) {
        try {
            const project = appState.projects.find(p => p.id === id);
            if (!project) {
                showNotification('Proyecto no encontrado', 'error');
                return false;
            }

            const oldProgress = project.progress;
            project.progress = Math.max(0, Math.min(100, project.progress + change));
            project.updatedAt = new Date();

            // Actualizar estado automáticamente
            if (project.progress === 100) {
                project.status = 'Completado';
            } else if (project.progress >= 80) {
                project.status = 'Testing';
            } else if (project.progress >= 20) {
                project.status = 'En desarrollo';
            } else if (project.progress > 0) {
                project.status = 'Desarrollo';
            }

            if (storage.save()) {
                renderProjects();
                updateStats();
                const changeText = change > 0 ? `+${change}%` : `${change}%`;
                showNotification(`Progreso: ${oldProgress}% → ${project.progress}% (${changeText})`, 'success');
                return true;
            }
            return false;
            
        } catch (error) {
            console.error('❌ Error actualizando progreso:', error);
            showNotification('Error al actualizar progreso', 'error');
            return false;
        }
    },

    // Eliminar proyecto
    delete(id) {
        try {
            const project = appState.projects.find(p => p.id === id);
            if (!project) {
                showNotification('Proyecto no encontrado', 'error');
                return false;
            }

            if (confirm(`¿Eliminar "${project.name}"?\n\nEsta acción no se puede deshacer.`)) {
                appState.projects = appState.projects.filter(p => p.id !== id);
                
                if (storage.save()) {
                    renderProjects();
                    updateStats();
                    showNotification(`"${project.name}" eliminado`, 'warning');
                    return true;
                }
            }
            return false;
            
        } catch (error) {
            console.error('❌ Error eliminando proyecto:', error);
            showNotification('Error al eliminar proyecto', 'error');
            return false;
        }
    },

    // Editar proyecto
    edit(id) {
        try {
            const project = appState.projects.find(p => p.id === id);
            if (!project) {
                showNotification('Proyecto no encontrado', 'error');
                return false;
            }

            const newName = prompt('Nuevo nombre:', project.name);
            if (newName && newName.trim() && newName.trim() !== project.name) {
                if (utils.validate(newName.trim(), 3, 100)) {
                    project.name = newName.trim();
                    project.updatedAt = new Date();
                    
                    if (storage.save()) {
                        renderProjects();
                        showNotification(`Proyecto renombrado a "${project.name}"`, 'success');
                        return true;
                    }
                } else {
                    showNotification('Nombre inválido (3-100 caracteres)', 'error');
                }
            }
            return false;
            
        } catch (error) {
            console.error('❌ Error editando proyecto:', error);
            showNotification('Error al editar proyecto', 'error');
            return false;
        }
    }
};

// ==================== INTERFAZ DE USUARIO ====================
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (appState.projects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No hay proyectos. ¡Crea tu primer proyecto!</p>
            </div>
        `;
        return;
    }

    // Ordenar por fecha de actualización
    const sorted = [...appState.projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    container.innerHTML = sorted.map(project => {
        const priorityColors = {
            'alta': '#f44336',
            'media': '#ff9800', 
            'baja': '#4caf50'
        };
        
        const priorityIcons = {
            'alta': '🔴',
            'media': '🟡',
            'baja': '🟢'
        };

        const statusIcons = {
            'Completado': '✅',
            'Testing': '🧪',
            'En desarrollo': '⚡',
            'Desarrollo': '💻',
            'Diseño': '🎨',
            'Planificación': '📋'
        };

        return `
            <div class="project-item">
                <div class="project-header">
                    <div class="project-name" title="${utils.sanitize(project.description)}">
                        ${utils.sanitize(project.name)}
                    </div>
                    <div class="project-priority priority-${project.priority}">
                        ${priorityIcons[project.priority]} ${project.priority.toUpperCase()}
                    </div>
                </div>
                <div class="project-status">
                    ${statusIcons[project.status] || '📝'} ${project.status} • 
                    Creado: ${utils.formatDate(project.createdAt)}
                    ${project.updatedAt > project.createdAt ? ` • Actualizado: ${utils.formatDate(project.updatedAt)}` : ''}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%; background: ${priorityColors[project.priority]}"></div>
                </div>
                <div class="project-progress-text">
                    ${project.progress}% completado
                </div>
                <div class="project-actions">
                    <button onclick="updateProgress(${project.id}, 10)" class="btn-small">
                        <i class="fas fa-plus"></i> +10%
                    </button>
                    <button onclick="updateProgress(${project.id}, -10)" class="btn-small">
                        <i class="fas fa-minus"></i> -10%
                    </button>
                    <button onclick="editProject(${project.id})" class="btn-small">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="deleteProject(${project.id})" class="btn-small btn-danger">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Agregar controles de datos
    container.innerHTML += `
        <div style="text-align: center; margin-top: 20px; padding: 20px; border-top: 1px solid #eee;">
            <button onclick="storage.export()" class="btn-small" style="background: #2196F3; margin: 5px;">
                <i class="fas fa-download"></i> Exportar
            </button>
            <button onclick="document.getElementById('import-file').click()" class="btn-small" style="background: #4CAF50; margin: 5px;">
                <i class="fas fa-upload"></i> Importar
            </button>
            <button onclick="storage.clear()" class="btn-small btn-danger" style="margin: 5px;">
                <i class="fas fa-trash"></i> Limpiar Todo
            </button>
            <input type="file" id="import-file" accept=".json" style="display: none;" onchange="handleImport(this)">
            <br><small style="color: #666; margin-top: 10px; display: block;">
                Datos guardados automáticamente • ${appState.projects.length} proyectos
            </small>
        </div>
    `;
}

function updateStats() {
    try {
        const total = appState.projects.length;
        const completed = appState.projects.filter(p => p.status === 'Completado').length;
        const avgProgress = total > 0 ? 
            Math.round(appState.projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;

        const totalElement = document.getElementById('total-projects');
        const completedElement = document.getElementById('completed-projects');
        const avgElement = document.getElementById('avg-progress');

        if (totalElement) totalElement.textContent = total;
        if (completedElement) completedElement.textContent = completed;
        if (avgElement) avgElement.textContent = `${avgProgress}%`;

        updateChart();
        
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

function updateChart() {
    const ctx = document.getElementById('projectChart');
    if (!ctx || typeof Chart === 'undefined') return;

    try {
        if (appState.chart) {
            appState.chart.destroy();
        }

        const statusCounts = {};
        appState.projects.forEach(project => {
            statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
        });

        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);

        if (labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay datos para mostrar</p>';
            return;
        }

        appState.chart = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B', '#F44336'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Error actualizando gráfico:', error);
    }
}

// ==================== MANEJO DE TIEMPO ====================
function updateTime() {
    try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-MX');
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    } catch (error) {
        console.error('❌ Error actualizando tiempo:', error);
    }
}

// ==================== MANEJO DE FORMULARIOS ====================
function handleForm() {
    const form = document.getElementById('project-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('project-name'),
            description: formData.get('project-description'),
            priority: formData.get('project-priority')
        };

        if (projects.create(data)) {
            form.reset();
        }
    });
}

// ==================== CALCULADORA DE PRODUCTIVIDAD ====================
function calculateProductivity() {
    try {
        const hoursInput = document.getElementById('hours-worked');
        const tasksInput = document.getElementById('tasks-completed');
        const resultElement = document.getElementById('productivity-result');
        
        if (!hoursInput || !tasksInput || !resultElement) return;
        
        const hours = parseFloat(hoursInput.value) || 0;
        const tasks = parseInt(tasksInput.value) || 0;
        
        if (hours <= 0) {
            resultElement.innerHTML = `
                <div style="color: #666; text-align: center; padding: 20px;">
                    <i class="fas fa-clock" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Ingresa las horas trabajadas</p>
                </div>
            `;
            return;
        }
        
        const tasksPerHour = tasks / hours;
        const productivity = Math.min(tasksPerHour * 2, 10);
        
        let message, color, icon;
        if (productivity >= 8) {
            message = '¡Excelente productividad!';
            color = '#4CAF50';
            icon = '🚀';
        } else if (productivity >= 6) {
            message = 'Buen nivel de productividad';
            color = '#2196F3';
            icon = '👍';
        } else if (productivity >= 4) {
            message = 'Productividad promedio';
            color = '#FF9800';
            icon = '⚡';
        } else {
            message = '¡Puedes mejorar!';
            color = '#f44336';
            icon = '💪';
        }
        
        resultElement.innerHTML = `
            <div style="background: ${color}15; border-radius: 10px; padding: 20px; text-align: center; border-left: 4px solid ${color};">
                <div style="font-size: 2rem; margin-bottom: 10px;">${icon}</div>
                <div style="color: ${color}; font-weight: bold; font-size: 1.1rem; margin-bottom: 8px;">${message}</div>
                <div style="color: #666; font-size: 0.9rem;">
                    <strong>Puntuación:</strong> ${productivity.toFixed(1)}/10<br>
                    <strong>Tareas por hora:</strong> ${tasksPerHour.toFixed(2)}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Error calculando productividad:', error);
        showNotification('Error al calcular productividad', 'error');
    }
}

// ==================== FUNCIONES GLOBALES ====================
function updateProgress(id, change) {
    projects.updateProgress(id, change);
}

function deleteProject(id) {
    projects.delete(id);
}

function editProject(id) {
    projects.edit(id);
}

function handleImport(input) {
    if (input.files && input.files[0]) {
        storage.import(input.files[0]);
    }
}

// ==================== INICIALIZACIÓN ====================
function init() {
    console.log('🚀 Iniciando Dashboard...');
    
    try {
        // Cargar datos guardados
        storage.load();
        
        // Configurar interfaz
        renderProjects();
        updateStats();
        handleForm();
        
        // Iniciar reloj
        updateTime();
        setInterval(updateTime, 1000);
        
        // Marcar como cargado
        appState.isLoaded = true;
        
        showNotification('Dashboard cargado correctamente', 'success');
        console.log('✅ Dashboard inicializado');
        
    } catch (error) {
        console.error('❌ Error inicializando:', error);
        showNotification('Error al inicializar', 'error');
    }
}

// ==================== EVENTOS ====================
document.addEventListener('DOMContentLoaded', init);

// Guardar antes de cerrar
window.addEventListener('beforeunload', () => {
    if (appState.isLoaded) {
        storage.save();
    }
});

// Debugging
window.dashboardDebug = {
    appState,
    storage,
    projects,
    utils
};

console.log('📝 Script cargado - Dashboard listo para inicializar');
