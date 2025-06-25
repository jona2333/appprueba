'use strict';

// ==================== CONFIGURACIÓN GLOBAL ====================
const CONFIG = {
  NOTIFICATION_DURATION: 4000,
  ANIMATION_DURATION: 600,
  CHART_COLORS: [
      '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', 
      '#607D8B', '#F44336', '#00BCD4', '#8BC34A'
  ],
  PRODUCTIVITY_THRESHOLDS: {
      EXCELLENT: 8,
      GOOD: 6,
      AVERAGE: 4
  },
  AUTO_SAVE_DELAY: 1000
};

// ==================== ESTADO GLOBAL ====================
let state = {
  projects: [
      { 
          id: 1,
          name: "Sistema de Inventario Avanzado", 
          progress: 75, 
          status: "En desarrollo", 
          priority: "alta",
          description: "Sistema completo para gestión de inventarios con reportes en tiempo real",
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
      },
      { 
          id: 2,
          name: "App Móvil E-commerce", 
          progress: 45, 
          status: "Diseño", 
          priority: "media",
          description: "Aplicación móvil para tienda en línea con carrito de compras",
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date()
      },
      { 
          id: 3,
          name: "Dashboard de Analytics", 
          progress: 90, 
          status: "Testing", 
          priority: "alta",
          description: "Panel de control con métricas y análisis de datos empresariales",
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date()
      },
      { 
          id: 4,
          name: "API REST de Usuarios", 
          progress: 60, 
          status: "Desarrollo", 
          priority: "media",
          description: "API para gestión de usuarios con autenticación JWT",
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date()
      }
  ],
  chart: null,
  timers: {
      clock: null,
      autoSave: null
  }
};

// ==================== UTILIDADES ====================
const Utils = {
  // Generar ID único
  generateId: () => Date.now() + Math.random().toString(36).substr(2, 9),
  
  // Formatear fecha
  formatDate: (date) => {
      return new Intl.DateTimeFormat('es-MX', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      }).format(date);
  },
  
  // Formatear fecha y hora
  formatDateTime: (date) => {
      return new Intl.DateTimeFormat('es-MX', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      }).format(date);
  },
  
  // Validar entrada
  validateInput: (value, minLength = 1, maxLength = 1000) => {
      if (!value || typeof value !== 'string') return false;
      const trimmed = value.trim();
      return trimmed.length >= minLength && trimmed.length <= maxLength;
  },
  
  // Debounce para optimización
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
  },
  
  // Sanitizar HTML
  sanitizeHTML: (str) => {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
  },
  
  // Calcular porcentaje
  calculatePercentage: (value, total) => {
      return total > 0 ? Math.round((value / total) * 100) : 0;
  }
};

// ==================== SISTEMA DE NOTIFICACIONES ====================
const NotificationSystem = {
  show: (message, type = 'success', duration = CONFIG.NOTIFICATION_DURATION) => {
      const notification = document.getElementById('notification');
      if (!notification) return;
      
      // Limpiar clases anteriores
      notification.className = 'notification';
      
      // Configurar contenido y estilo
      notification.textContent = message;
      notification.classList.add('show', type);
      
      // Auto-ocultar
      setTimeout(() => {
          notification.classList.remove('show');
      }, duration);
      
      console.log(`📢 ${type.toUpperCase()}: ${message}`);
  },
  
  success: (message) => NotificationSystem.show(message, 'success'),
  error: (message) => NotificationSystem.show(message, 'error'),
  warning: (message) => NotificationSystem.show(message, 'warning'),
  info: (message) => NotificationSystem.show(message, 'info')
};

// ==================== GESTIÓN DE TIEMPO ====================
const TimeManager = {
  updateTime: () => {
      try {
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
      } catch (error) {
          console.error('❌ Error actualizando tiempo:', error);
      }
  },
  
  init: () => {
      TimeManager.updateTime();
      state.timers.clock = setInterval(TimeManager.updateTime, 1000);
      console.log('⏰ Reloj inicializado');
  },
  
  destroy: () => {
      if (state.timers.clock) {
          clearInterval(state.timers.clock);
          state.timers.clock = null;
      }
  }
};

// ==================== GESTIÓN DE PROYECTOS ====================
const ProjectManager = {
  // Obtener colores por prioridad
  getPriorityConfig: (priority) => {
      const configs = {
          'alta': { color: '#f44336', class: 'priority-alta', icon: '🔴' },
          'media': { color: '#ff9800', class: 'priority-media', icon: '🟡' },
          'baja': { color: '#4caf50', class: 'priority-baja', icon: '🟢' }
      };
      return configs[priority] || configs['media'];
  },
  
  // Obtener iconos por estado
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
  
  // Renderizar proyectos
  render: () => {
      const container = document.getElementById('projects-container');
      if (!container) return;
      
      try {
          container.innerHTML = '';
          
          if (state.projects.length === 0) {
              container.innerHTML = `
                  <div class="text-center" style="padding: 40px; color: #666;">
                      <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                      <p>No hay proyectos aún. ¡Crea tu primer proyecto!</p>
                  </div>
              `;
              return;
          }
          
          state.projects.forEach((project, index) => {
              const projectElement = document.createElement('div');
              projectElement.className = 'project-item fade-in-up';
              projectElement.style.animationDelay = `${index * 0.1}s`;
              
              const priorityConfig = ProjectManager.getPriorityConfig(project.priority);
              const statusIcon = ProjectManager.getStatusIcon(project.status);
              
              projectElement.innerHTML = `
                  <div class="project-header">
                      <div class="project-name" title="${Utils.sanitizeHTML(project.description)}">
                          ${Utils.sanitizeHTML(project.name)}
                      </div>
                      <div class="project-priority ${priorityConfig.class}">
                          ${priorityConfig.icon} ${project.priority.toUpperCase()}
                      </div>
                  </div>
                  <div class="project-status">
                      ${statusIcon} ${project.status} • Creado: ${Utils.formatDate(project.createdAt)}
                      ${project.updatedAt > project.createdAt ? `• Actualizado: ${Utils.formatDate(project.updatedAt)}` : ''}
                  </div>
                  <div class="progress-bar">
                      <div class="progress-fill" style="width: ${project.progress}%; background: ${priorityConfig.color}"></div>
                  </div>
                  <div class="project-progress-text">
                      ${project.progress}% completado
                  </div>
                  <div class="project-actions">
                      <button onclick="updateProgress(${project.id}, 10)" class="btn-small" title="Aumentar progreso">
                          <i class="fas fa-plus"></i> +10%
                      </button>
                      <button onclick="updateProgress(${project.id}, -10)" class="btn-small" title="Disminuir progreso">
                          <i class="fas fa-minus"></i> -10%
                      </button>
                      <button onclick="editProject(${project.id})" class="btn-small" title="Editar proyecto">
                          <i class="fas fa-edit"></i> Editar
                      </button>
                      <button onclick="deleteProject(${project.id})" class="btn-small btn-danger" title="Eliminar proyecto">
                          <i class="fas fa-trash"></i> Eliminar
                      </button>
                  </div>
              `;
              
              container.appendChild(projectElement);
          });
          
          // Actualizar estadísticas y gráfico
          ProjectManager.updateStats();
          ChartManager.update();
          
      } catch (error) {
          console.error('❌ Error renderizando proyectos:', error);
          NotificationSystem.error('Error al cargar proyectos');
      }
  },
  
  // Crear nuevo proyecto
  create: (projectData) => {
      try {
          const newProject = {
              id: Utils.generateId(),
              name: projectData.name.trim(),
              description: projectData.description.trim(),
              progress: 0,
              status: 'Planificación',
              priority: projectData.priority,
              createdAt: new Date(),
              updatedAt: new Date()
          };
          
          state.projects.unshift(newProject);
          ProjectManager.render();
          NotificationSystem.success(`¡Proyecto "${newProject.name}" creado exitosamente!`);
          
          console.log('✅ Proyecto creado:', newProject);
          
      } catch (error) {
          console.error('❌ Error creando proyecto:', error);
          NotificationSystem.error('Error al crear el proyecto');
      }
  },
  
  // Actualizar progreso
  updateProgress: (id, change) => {
      try {
          const project = state.projects.find(p => p.id == id);
          if (!project) {
              NotificationSystem.error('Proyecto no encontrado');
              return;
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
          
          ProjectManager.render();
          
          const changeText = change > 0 ? `+${change}%` : `${change}%`;
          NotificationSystem.success(`Progreso actualizado: ${oldProgress}% → ${project.progress}% (${changeText})`);
          
      } catch (error) {
          console.error('❌ Error actualizando progreso:', error);
          NotificationSystem.error('Error al actualizar progreso');
      }
  },
  
  // Eliminar proyecto
  delete: (id) => {
      try {
          const project = state.projects.find(p => p.id == id);
          if (!project) {
              NotificationSystem.error('Proyecto no encontrado');
              return;
          }
          
          if (confirm(`¿Estás seguro de eliminar el proyecto "${project.name}"?\n\nEsta acción no se puede deshacer.`)) {
              state.projects = state.projects.filter(p => p.id != id);
              ProjectManager.render();
              NotificationSystem.warning(`Proyecto "${project.name}" eliminado`);
              console.log('🗑️ Proyecto eliminado:', project.name);
          }
          
      } catch (error) {
          console.error('❌ Error eliminando proyecto:', error);
          NotificationSystem.error('Error al eliminar proyecto');
      }
  },
  
  // Editar proyecto (función placeholder)
  edit: (id) => {
      const project = state.projects.find(p => p.id == id);
      if (project) {
          NotificationSystem.info(`Función de edición para "${project.name}" en desarrollo`);
          // Aquí se implementaría un modal de edición
      }
  },
  
  // Actualizar estadísticas
  updateStats: () => {
      try {
          const totalElement = document.getElementById('total-projects');
          const completedElement = document.getElementById('completed-projects');
          const avgProgressElement = document.getElementById('avg-progress');
          
          const total = state.projects.length;
          const completed = state.projects.filter(p => p.status === 'Completado').length;
          const avgProgress = total > 0 ? 
              Math.round(state.projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;
          
          if (totalElement) totalElement.textContent = total;
          if (completedElement) completedElement.textContent = completed;
          if (avgProgressElement) avgProgressElement.textContent = `${avgProgress}%`;
          
      } catch (error) {
          console.error('❌ Error actualizando estadísticas:', error);
      }
  }
};

// ==================== SISTEMA DE GRÁFICOS ====================
const ChartManager = {
  create: () => {
      const ctx = document.getElementById('projectChart');
      if (!ctx) return;
      
      if (typeof Chart === 'undefined') {
          console.warn('⚠️ Chart.js no está disponible');
          ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Gráfico no disponible</p>';
          return;
      }
      
      try {
          if (state.chart) {
              state.chart.destroy();
          }
          
          const statusCounts = ChartManager.getStatusCounts();
          const labels = Object.keys(statusCounts);
          const data = Object.values(statusCounts);
          
          if (labels.length === 0) {
              ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay datos para mostrar</p>';
              return;
          }
          
          state.chart = new Chart(ctx.getContext('2d'), {
              type: 'doughnut',
              data: {
                  labels: labels,
                  datasets: [{
                      data: data,
                      backgroundColor: CONFIG.CHART_COLORS.slice(0, labels.length),
                      borderWidth: 3,
                      borderColor: '#fff',
                      hoverBorderWidth: 5,
                      hoverOffset: 10
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
                              usePointStyle: true,
                              font: {
                                  size: 12,
                                  family: 'Segoe UI'
                              }
                          }
                      },
                      tooltip: {
                          callbacks: {
                              label: function(context) {
                                  const label = context.label || '';
                                  const value = context.parsed;
                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = ((value / total) * 100).toFixed(1);
                                  return `${label}: ${value} proyectos (${percentage}%)`;
                              }
                          }
                      }
                  },
                  animation: {
                      animateRotate: true,
                      duration: CONFIG.ANIMATION_DURATION
                  }
              }
          });
          
          console.log('📊 Gráfico creado exitosamente');
          
      } catch (error) {
          console.error('❌ Error creando gráfico:', error);
          ctx.parentElement.innerHTML = '<p style="text-align: center; color: #f44336; padding: 40px;">Error al cargar gráfico</p>';
      }
  },
  
  getStatusCounts: () => {
      const counts = {};
      state.projects.forEach(project => {
          counts[project.status] = (counts[project.status] || 0) + 1;
      });
      return counts;
  },
  
  update: () => {
      if (state.chart) {
          try {
              const statusCounts = ChartManager.getStatusCounts();
              state.chart.data.labels = Object.keys(statusCounts);
              state.chart.data.datasets[0].data = Object.values(statusCounts);
              state.chart.update('active');
          } catch (error) {
              console.error('❌ Error actualizando gráfico:', error);
          }
      }
  }
};

// ==================== CALCULADORA DE PRODUCTIVIDAD ====================
const ProductivityCalculator = {
  calculate: () => {
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
                      <p>Ingresa las horas trabajadas para calcular tu productividad</p>
                  </div>
              `;
              return;
          }
          
          const tasksPerHour = tasks / hours;
          const productivity = Math.min(tasksPerHour * 2, 10); // Escala de 0-10
          const { message, color, icon } = ProductivityCalculator.getProductivityLevel(productivity);
          
          resultElement.innerHTML = `
              <div style="background: linear-gradient(135deg, ${color}15, ${color}05); border-radius: 10px; padding: 20px; text-align: center; border-left: 4px solid ${color};">
                  <div style="font-size: 2rem; margin-bottom: 10px;">${icon}</div>
                  <div style="color: ${color}; font-weight: bold; font-size: 1.1rem; margin-bottom: 8px;">
                      ${message}
                  </div>
                  <div style="color: #666; font-size: 0.9rem;">
                      <strong>Puntuación:</strong> ${productivity.toFixed(1)}/10<br>
                      <strong>Tareas por hora:</strong> ${tasksPerHour.toFixed(2)}<br>
                      <strong>Eficiencia:</strong> ${Utils.calculatePercentage(productivity, 10)}%
                  </div>
              </div>
          `;
          
          console.log(`📈 Productividad calculada: ${productivity.toFixed(1)}/10`);
          
      } catch (error) {
          console.error('❌ Error calculando productividad:', error);
          NotificationSystem.error('Error al calcular productividad');
      }
  },
  
  getProductivityLevel: (productivity) => {
      const { EXCELLENT, GOOD, AVERAGE } = CONFIG.PRODUCTIVITY_THRESHOLDS;
      
      if (productivity >= EXCELLENT) {
          return {
              message: '¡Excelente productividad!',
              color: '#4CAF50',
              icon: '🚀'
          };
      } else if (productivity >= GOOD) {
          return {
              message: 'Buen nivel de productividad',
              color: '#2196F3',
              icon: '👍'
          };
      } else if (productivity >= AVERAGE) {
          return {
              message: 'Productividad promedio',
              color: '#FF9800',
              icon: '⚡'
          };
      } else {
          return {
              message: '¡Puedes mejorar!',
              color: '#f44336',
              icon: '💪'
          };
      }
  }
};

// ==================== GESTIÓN DE FORMULARIOS ====================
const FormManager = {
  init: () => {
      const form = document.getElementById('project-form');
      if (!form) return;
      
      form.addEventListener('submit', FormManager.handleProjectSubmit);
      
      // Validación en tiempo real
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
          input.addEventListener('input', FormManager.validateField);
          input.addEventListener('blur', FormManager.validateField);
      });
      
      console.log('📝 Formularios inicializados');
  },
  
  handleProjectSubmit: (e) => {
      e.preventDefault();
      
      try {
          const formData = new FormData(e.target);
          const name = formData.get('project-name')?.trim();
          const description = formData.get('project-description')?.trim();
          const priority = formData.get('project-priority');
          
          // Validaciones
          if (!Utils.validateInput(name, 3, 100)) {
              NotificationSystem.error('El nombre debe tener entre 3 y 100 caracteres');
              return;
          }
          
          if (!Utils.validateInput(description, 10, 500)) {
              NotificationSystem.error('La descripción debe tener entre 10 y 500 caracteres');
              return;
          }
          
          if (!['alta', 'media', 'baja'].includes(priority)) {
              NotificationSystem.error('Prioridad inválida');
              return;
          }
          
          // Crear proyecto
          ProjectManager.create({ name, description, priority });
          
          // Limpiar formulario
          e.target.reset();
          FormManager.clearValidation(e.target);
          
      } catch (error) {
          console.error('❌ Error enviando formulario:', error);
          NotificationSystem.error('Error al crear proyecto');
      }
  },
  
  validateField: (e) => {
      const field = e.target;
      const value = field.value.trim();
      
      // Remover clases de validación anteriores
      field.classList.remove('valid', 'invalid');
      
      // Validar según el campo
      let isValid = true;
      let message = '';
      
      switch (field.name) {
          case 'project-name':
              isValid = Utils.validateInput(value, 3, 100);
              message = isValid ? '' : 'Entre 3 y 100 caracteres';
              break;
          case 'project-description':
              isValid = Utils.validateInput(value, 10, 500);
              message = isValid ? '' : 'Entre 10 y 500 caracteres';
              break;
      }
      
      // Aplicar estilos de validación
      if (value.length > 0) {
          field.classList.add(isValid ? 'valid' : 'invalid');
      }
      
      // Mostrar mensaje de error
      let errorElement = field.parentElement.querySelector('.error-message');
      if (message && !isValid) {
          if (!errorElement) {
              errorElement = document.createElement('div');
              errorElement.className = 'error-message';
              errorElement.style.cssText = 'color: #f44336; font-size: 0.8rem; margin-top: 5px;';
              field.parentElement.appendChild(errorElement);
          }
          errorElement.textContent = message;
      } else if (errorElement) {
          errorElement.remove();
      }
  },
  
  clearValidation: (form) => {
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(field => {
          field.classList.remove('valid', 'invalid');
          const errorElement = field.parentElement.querySelector('.error-message');
          if (errorElement) errorElement.remove();
      });
  }
};

// ==================== EFECTOS VISUALES ====================
const VisualEffects = {
  animateNumbers: () => {
      const numbers = document.querySelectorAll('.stat-number');
      numbers.forEach(number => {
          const finalValue = parseInt(number.textContent) || 0;
          if (finalValue === 0) return;
          
          let currentValue = 0;
          const increment = finalValue / 30;
          const timer = setInterval(() => {
              currentValue += increment;
              if (currentValue >= finalValue) {
                  number.textContent = finalValue;
                  clearInterval(timer);
              } else {
                  number.textContent = Math.floor(currentValue);
              }
          }, 50);
      });
  },
  
  addCustomStyles: () => {
      const style = document.createElement('style');
      style.textContent = `
          .form-group input.valid, .form-group textarea.valid {
              border-color: #4CAF50;
              box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
          }
          
          .form-group input.invalid, .form-group textarea.invalid {
              border-color: #f44336;
              box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
          }
          
          .loading {
              opacity: 0.6;
              pointer-events: none;
          }
      `;
      document.head.appendChild(style);
  }
};

// ==================== FUNCIONES GLOBALES ====================
function calculateProductivity() {
  ProductivityCalculator.calculate();
}

function updateProgress(id, change) {
  ProjectManager.updateProgress(id, change);
}

function deleteProject(id) {
  ProjectManager.delete(id);
}

function editProject(id) {
  ProjectManager.edit(id);
}

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================
const App = {
  init: () => {
      console.log('🚀 Iniciando Dashboard de Proyectos...');
      
      try {
          // Inicializar módulos
          VisualEffects.addCustomStyles();
          TimeManager.init();
          FormManager.init();
          
          // Renderizar contenido inicial
          ProjectManager.render();
          ChartManager.create();
          
          // Efectos con delay
          setTimeout(() => {
              VisualEffects.animateNumbers();
              NotificationSystem.success('¡Dashboard cargado correctamente!');
          }, CONFIG.ANIMATION_DURATION);
          
          console.log('✅ Dashboard inicializado exitosamente');
          
      } catch (error) {
          console.error('❌ Error inicializando aplicación:', error);
          NotificationSystem.error('Error al inicializar la aplicación');
      }
  },
  
  destroy: () => {
      TimeManager.destroy();
      if (state.chart) {
          state.chart.destroy();
      }
      console.log('🔄 Aplicación destruida');
  }
};

// ==================== EVENTOS GLOBALES ====================
document.addEventListener('DOMContentLoaded', App.init);

// Cleanup al cerrar la página
window.addEventListener('beforeunload', App.destroy);

// Manejo de errores globales
window.addEventListener('error', (e) => {
  console.error('❌ Error global:', e.error);
  NotificationSystem.error('Ha ocurrido un error inesperado');
});

// ==================== EXPORTACIÓN PARA DEBUGGING ====================
if (typeof window !== 'undefined') {
  window.DashboardDebug = {
      state,
      ProjectManager,
      ChartManager,
      NotificationSystem,
      Utils
  };
}
