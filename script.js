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
  // Generar ID único
  generateId: () => Date.now() + Math.random(),
  
  // Formatear fecha
  formatDate: (date) => {
      return new Intl.DateTimeFormat('es-MX', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      }).format(date);
  },
  
  // Validar entrada
  validateInput: (value, minLength = 1) => {
      return value && value.trim().length >= minLength;
  },
  
  // Debounce para optimizar eventos
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
  // Renderizar proyectos con mejoras
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
  },
  
  // Obtener color según prioridad
  getPriorityColor: (priority) => {
      const colors = {
          'alta': '#f44336',
          'media': '#ff9800',
          'baja': '#4caf50'
      };
      return colors[priority] || '#667eea';
  },
  
  // Obtener icono según estado
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
  
  // Crear nuevo proyecto
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
  
  // Actualizar progreso
  updateProgress: (id, change) => {
      const project = projects.find(p => p.id === id);
      if (project) {
          project.progress = Math.max(0, Math.min(100, project.progress + change));
          
          // Actualizar estado automáticamente
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
  
  // Eliminar proyecto
  delete: (id) => {
      if (confirm('¿Estás seguro de eliminar este proyecto?')) {
          projects = projects.filter(p => p.id !== id);
          ProjectManager.render();
          NotificationSystem.warning('Proyecto eliminado');
      }
  },
  
  // Actualizar estadísticas
  updateStats: () => {
      const totalElement = document.getElementById('total-projects');
      const completedElement = document.getElementById('completed-projects');
      const avgProgressElement = document.getElementById('avg-progress');
      
      if (totalElement) totalElement.textContent = projects.length;
      
      const completed = projects.filter(p => p.status === 'Completado').length;
      if (completedElement) completedElement.textContent = completed;
      
      const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
      if (avgProgressElement) avgProgressElement.textContent = Math.round(avgProgress) + '%';
  }
};

// ==================== SISTEMA DE GRÁFICOS ====================
const ChartManager = {
  chart: null,
  
  create: () => {
      const ctx = document.getElementById('projectChart');
      if (!ctx) return;
      
      // Destruir gráfico anterior si existe
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
                      '#4CAF50', // Completados
                      '#2196F3', // En Desarrollo
                      '#FF9800', // Diseño
                      '#9C27B0', // Testing
                      '#607D8B'  // Planificación
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
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              const percentage = ((context.parsed / projects.length) * 100).toFixed(1);
                              return `${context.label}: ${context.parsed} (${percentage}%)`;
                          }
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
  // Animación de números mejorada
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
  
  // Efecto de cursor optimizado
  initCursorEffect: () => {
      let isThrottled = false;
      
      document.addEventListener('mousemove', function(e) {
          if (isThrottled) return;
          
          isThrottled = true;
          setTimeout(() => { isThrottled = false; }, 50);
          
          const cursor = document.createElement('div');
          cursor.className = 'cursor-effect';
          cursor.style.cssText = `
              position: fixed;
              width: 8px;
              height: 8px;
              background: rgba(102, 126, 234, 0.4);
              border-radius: 50%;
              pointer-events: none;
              left: ${e.clientX - 4}px;
              top: ${e.clientY - 4}px;
              z-index: 9999;
              animation: cursorFade 0.6s ease-out forwards;
          `;
          
          document.body.appendChild(cursor);
          setTimeout(() => cursor.remove(), 600);
      });
  },
  
  // Añadir animaciones CSS
  addAnimationStyles: () => {
      const style = document.createElement('style');
      style.textContent = `
          @keyframes cursorFade {
              0% { opacity: 1; transform: scale(1); }
              100% { opacity: 0; transform: scale(2); }
          }
          
          .project-item {
              transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .project-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .notification {
              transition: all 0.3s ease;
          }
          
          .btn-small {
              padding: 4px 8px;
              margin: 2px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.8rem;
              transition: background-color 0.2s ease;
          }
          
          .btn-danger {
              background-color: #f44336;
              color: white;
          }
          
          .btn-danger:hover {
              background-color: #d32f2f;
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
      
      // Auto-save en localStorage
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
          input.addEventListener('input', Utils.debounce(() => {
              FormManager.saveFormData();
          }, 500));
      });
      
      FormManager.loadFormData();
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
      
      if (!Utils.validateInput(description, 10)) {
          NotificationSystem.error('La descripción debe tener al menos 10 caracteres');
          return;
      }
      
      ProjectManager.create({ name, description, priority });
      
      e.target.reset();
      FormManager.clearFormData();
  },
  
  saveFormData: () => {
      const form = document.getElementById('project-form');
      if (!form) return;
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      localStorage.setItem('dashboardFormData', JSON.stringify(data));
  },
  
  loadFormData: () => {
      const savedData = localStorage.getItem('dashboardFormData');
      if (!savedData) return;
      
      try {
          const data = JSON.parse(savedData);
          Object.entries(data).forEach(([key, value]) => {
              const input = document.querySelector(`[name="${key}"]`);
              if (input) input.value = value;
          });
      } catch (error) {
          console.warn('Error loading form data:', error);
      }
  },
  
  clearFormData: () => {
      localStorage.removeItem('dashboardFormData');
  }
};

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================
const App = {
  init: () => {
      // Verificar dependencias
      if (typeof Chart === 'undefined') {
          console.warn('Chart.js no está cargado. El gráfico no funcionará.');
      }
      
      // Inicializar módulos
      TimeManager.init();
      ProjectManager.render();
      ChartManager.create();
      FormManager.init();
      VisualEffects.addAnimationStyles();
      VisualEffects.initCursorEffect();
      
      // Efectos con delay
      setTimeout(() => {
          VisualEffects.animateNumbers();
          NotificationSystem.success('¡Dashboard cargado correctamente!');
      }, CONFIG.ANIMATION_DURATION);
      
      // Actualizar gráfico cuando cambien los proyectos
      const originalRender = ProjectManager.render;
      ProjectManager.render = function() {
          originalRender.call(this);
          ChartManager.update();
      };
      
      console.log('🚀 Dashboard inicializado correctamente');
  }
};

// ==================== EVENTOS GLOBALES ====================
document.addEventListener('DOMContentLoaded', App.init);

// Exponer funciones globales necesarias
window.calculateProductivity = ProductivityCalculator.calculate;
window.ProjectManager = ProjectManager;