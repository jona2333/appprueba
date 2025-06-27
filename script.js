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
          assignedMembers: [1, 2], // IDs de miembros asignados
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
          assignedMembers: [3, 4],
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
          assignedMembers: [1, 3],
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
          assignedMembers: [2],
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date()
      }
  ],
  teamMembers: [
      {
          id: 1,
          name: "Ana García",
          email: "ana.garcia@empresa.com",
          role: "Developer",
          department: "IT",
          phone: "+52 555 1234567",
          status: "active",
          skills: ["JavaScript", "React", "Node.js", "MongoDB"],
          projects: [1, 3], // IDs de proyectos asignados
          location: "Ciudad de México, México",
          avatar: "AG",
          joinDate: new Date('2024-01-10'),
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date()
      },
      {
          id: 2,
          name: "Carlos López",
          email: "carlos.lopez@empresa.com",
          role: "Designer",
          department: "IT",
          phone: "+52 555 2345678",
          status: "active",
          skills: ["Figma", "Adobe XD", "Illustrator", "UI/UX"],
          projects: [1, 4],
          location: "Guadalajara, México",
          avatar: "CL",
          joinDate: new Date('2024-01-20'),
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date()
      },
      {
          id: 3,
          name: "María Rodríguez",
          email: "maria.rodriguez@empresa.com",
          role: "Manager",
          department: "Marketing",
          phone: "+52 555 3456789",
          status: "active",
          skills: ["Project Management", "Scrum", "Leadership"],
          projects: [2, 3],
          location: "Monterrey, México",
          avatar: "MR",
          joinDate: new Date('2024-02-01'),
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date()
      },
      {
          id: 4,
          name: "Juan Pérez",
          email: "juan.perez@empresa.com",
          role: "Developer",
          department: "IT",
          phone: "+52 555 4567890",
          status: "vacation",
          skills: ["Python", "Django", "PostgreSQL", "Docker"],
          projects: [2],
          location: "Puebla, México",
          avatar: "JP",
          joinDate: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
      }
  ],
  chart: null,
  rolesChart: null,
  departmentsChart: null,
  nextMemberId: 5,
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
          const completionRateElement = document.getElementById('completion-rate');
          
          const total = state.projects.length;
          const avgProgress = total > 0 ? 
              Math.round(state.projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;
          
          if (totalElement) totalElement.textContent = total;
          if (completionRateElement) completionRateElement.textContent = `${avgProgress}%`;
          
          // Actualizar estadísticas globales
          GlobalStatsManager.updateStats();
          
      } catch (error) {
          console.error('❌ Error actualizando estadísticas:', error);
      }
  }
};

// ==================== GESTIÓN DE ESTADÍSTICAS GLOBALES ====================
const GlobalStatsManager = {
  updateStats: () => {
      try {
          // Estadísticas de proyectos
          const totalProjectsEl = document.getElementById('total-projects');
          const completionRateEl = document.getElementById('completion-rate');
          
          const totalProjects = state.projects.length;
          const avgProgress = totalProjects > 0 ? 
              Math.round(state.projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0;
          
          if (totalProjectsEl) totalProjectsEl.textContent = totalProjects;
          if (completionRateEl) completionRateEl.textContent = `${avgProgress}%`;
          
          // Estadísticas de miembros del equipo
          const totalMembersEl = document.getElementById('total-members');
          if (totalMembersEl) totalMembersEl.textContent = state.teamMembers.length;
          
          // Calcular puntuación de productividad
          GlobalStatsManager.calculateProductivityScore();
          
      } catch (error) {
          console.error('❌ Error actualizando estadísticas globales:', error);
      }
  },

  calculateProductivityScore: () => {
      try {
          const productivityScoreEl = document.getElementById('productivity-score');
          if (!productivityScoreEl) return;

          let score = 0;
          
          if (state.projects.length > 0 && state.teamMembers.length > 0) {
              // Factor 1: Progreso promedio de proyectos (0-40 puntos)
              const avgProgress = state.projects.reduce((sum, p) => sum + p.progress, 0) / state.projects.length;
              score += (avgProgress / 100) * 40;
              
              // Factor 2: Proporción de miembros activos (0-30 puntos)
              const activeMembers = state.teamMembers.filter(m => m.status === 'active').length;
              const activeMemberRatio = activeMembers / state.teamMembers.length;
              score += activeMemberRatio * 30;
              
              // Factor 3: Distribución de proyectos por miembro (0-30 puntos)
              const projectsPerMember = state.projects.length / state.teamMembers.length;
              const optimalRatio = projectsPerMember <= 2 ? 1 : (projectsPerMember <= 4 ? 0.8 : 0.5);
              score += optimalRatio * 30;
          }
          
          productivityScoreEl.textContent = Math.round(score);
          
      } catch (error) {
          console.error('❌ Error calculando puntuación de productividad:', error);
      }
  }
};

// ==================== SISTEMA DE GRÁFICOS ====================
const ChartManager = {
  create: () => {
      const ctx = document.getElementById('projects-chart');
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
      // Configurar formulario de proyectos
      const projectForm = document.getElementById('project-form');
      if (projectForm) {
          projectForm.addEventListener('submit', FormManager.handleProjectSubmit);
          
          const inputs = projectForm.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
              input.addEventListener('input', FormManager.validateField);
              input.addEventListener('blur', FormManager.validateField);
          });
      }

      // Configurar formulario de miembros del equipo
      const teamMemberForm = document.getElementById('team-member-form');
      if (teamMemberForm) {
          teamMemberForm.addEventListener('submit', FormManager.handleTeamMemberSubmit);
          
          const inputs = teamMemberForm.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
              input.addEventListener('input', FormManager.validateMemberField);
              input.addEventListener('blur', FormManager.validateMemberField);
          });
      }

      // Configurar búsqueda de equipo
      const teamSearch = document.getElementById('team-search');
      if (teamSearch) {
          teamSearch.addEventListener('input', (e) => {
              TeamMemberManager.search(e.target.value);
          });
      }

      // Configurar filtros de equipo
      const roleFilter = document.getElementById('team-filter-role');
      const departmentFilter = document.getElementById('team-filter-department');
      
      if (roleFilter) {
          roleFilter.addEventListener('change', () => TeamMemberManager.render());
      }
      
      if (departmentFilter) {
          departmentFilter.addEventListener('change', () => TeamMemberManager.render());
      }
      
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
          hideProjectForm();
          
      } catch (error) {
          console.error('❌ Error enviando formulario:', error);
          NotificationSystem.error('Error al crear proyecto');
      }
  },

  // Manejar envío de formulario de miembros del equipo
  handleTeamMemberSubmit: (e) => {
      e.preventDefault();
      
      try {
          const formData = new FormData(e.target);
          const memberData = {
              id: formData.get('id'),
              name: formData.get('name')?.trim(),
              email: formData.get('email')?.trim(),
              role: formData.get('role'),
              department: formData.get('department'),
              phone: formData.get('phone')?.trim(),
              status: formData.get('status'),
              skills: formData.get('skills')?.trim(),
              location: formData.get('location')?.trim()
          };
          
          // Validaciones
          if (!Utils.validateInput(memberData.name, 2, 100)) {
              NotificationSystem.error('El nombre debe tener entre 2 y 100 caracteres');
              return;
          }
          
          if (!memberData.email || !FormManager.validateEmail(memberData.email)) {
              NotificationSystem.error('Email inválido');
              return;
          }
          
          if (!memberData.role) {
              NotificationSystem.error('Debe seleccionar un rol');
              return;
          }
          
          if (!memberData.department) {
              NotificationSystem.error('Debe seleccionar un departamento');
              return;
          }

          // Verificar email único (excluyendo el miembro actual en edición)
          const existingMember = state.teamMembers.find(m => 
              m.email.toLowerCase() === memberData.email.toLowerCase() && 
              m.id !== parseInt(memberData.id)
          );
          
          if (existingMember) {
              NotificationSystem.error('Ya existe un miembro con este email');
              return;
          }
          
          // Crear o actualizar miembro
          let success = false;
          if (memberData.id && currentEditingMember) {
              success = TeamMemberManager.update(currentEditingMember.id, memberData);
          } else {
              success = TeamMemberManager.create(memberData);
          }
          
          if (success) {
              closeTeamMemberModal();
          }
          
      } catch (error) {
          console.error('❌ Error en formulario de miembro:', error);
          NotificationSystem.error('Error al procesar formulario');
      }
  },

  // Validar email
  validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
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

  // Validar campos de miembros del equipo
  validateMemberField: (e) => {
      const field = e.target;
      const value = field.value.trim();
      
      field.classList.remove('valid', 'invalid');
      
      let isValid = true;
      let message = '';
      
      switch (field.name) {
          case 'name':
              isValid = Utils.validateInput(value, 2, 100);
              message = isValid ? '' : 'Entre 2 y 100 caracteres';
              break;
          case 'email':
              isValid = value.length === 0 || FormManager.validateEmail(value);
              message = isValid ? '' : 'Email inválido';
              break;
          case 'phone':
              isValid = value.length === 0 || value.length >= 10;
              message = isValid ? '' : 'Mínimo 10 caracteres';
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

// ==================== GESTIÓN DE MIEMBROS DEL EQUIPO ====================
const TeamMemberManager = {
  // Obtener configuración por rol
  getRoleConfig: (role) => {
      const configs = {
          'Developer': { icon: '👨‍💻', color: '#4CAF50', class: 'role-developer' },
          'Designer': { icon: '🎨', color: '#FF9800', class: 'role-designer' },
          'Manager': { icon: '👔', color: '#2196F3', class: 'role-manager' },
          'Analyst': { icon: '📊', color: '#9C27B0', class: 'role-analyst' },
          'Tester': { icon: '🧪', color: '#607D8B', class: 'role-tester' }
      };
      return configs[role] || { icon: '👤', color: '#666', class: 'role-default' };
  },

  // Obtener configuración por departamento
  getDepartmentConfig: (department) => {
      const configs = {
          'IT': { icon: '💻', color: '#4CAF50' },
          'Marketing': { icon: '📈', color: '#FF9800' },
          'Sales': { icon: '💼', color: '#2196F3' },
          'HR': { icon: '👥', color: '#9C27B0' },
          'Finance': { icon: '💰', color: '#607D8B' }
      };
      return configs[department] || { icon: '🏢', color: '#666' };
  },

  // Renderizar lista de miembros
  render: () => {
      try {
          const container = document.getElementById('team-members-container');
          if (!container) return;

          const searchTerm = document.getElementById('team-search')?.value.toLowerCase() || '';
          const roleFilter = document.getElementById('team-filter-role')?.value || '';
          const departmentFilter = document.getElementById('team-filter-department')?.value || '';

          // Filtrar miembros
          let filteredMembers = state.teamMembers.filter(member => {
              const matchesSearch = member.name.toLowerCase().includes(searchTerm) ||
                                  member.email.toLowerCase().includes(searchTerm) ||
                                  member.skills.some(skill => skill.toLowerCase().includes(searchTerm));
              const matchesRole = !roleFilter || member.role === roleFilter;
              const matchesDepartment = !departmentFilter || member.department === departmentFilter;
              
              return matchesSearch && matchesRole && matchesDepartment;
          });

          if (filteredMembers.length === 0) {
              container.innerHTML = `
                  <div style="text-align: center; padding: 40px; color: #666;">
                      <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                      <p>No se encontraron miembros del equipo</p>
                  </div>
              `;
              return;
          }

          // Renderizar miembros
          container.innerHTML = filteredMembers.map(member => {
              const roleConfig = TeamMemberManager.getRoleConfig(member.role);
              const departmentConfig = TeamMemberManager.getDepartmentConfig(member.department);
              const statusIcons = { 'active': '✅', 'inactive': '❌', 'vacation': '🌴' };
              const statusColors = { 'active': '#4CAF50', 'inactive': '#f44336', 'vacation': '#FF9800' };

              return `
                  <div class="team-member-card" data-member-id="${member.id}">
                      <div class="member-avatar">
                          ${member.avatar || member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div class="member-info">
                          <div class="member-header">
                              <h3 class="member-name">${Utils.sanitizeHTML(member.name)}</h3>
                              <div class="member-status" style="color: ${statusColors[member.status]}">
                                  ${statusIcons[member.status]} ${member.status}
                              </div>
                          </div>
                          <div class="member-details">
                              <div class="member-role" style="color: ${roleConfig.color}">
                                  ${roleConfig.icon} ${member.role}
                              </div>
                              <div class="member-department" style="color: ${departmentConfig.color}">
                                  ${departmentConfig.icon} ${member.department}
                              </div>
                              <div class="member-contact">
                                  <i class="fas fa-envelope"></i> ${member.email}
                                  ${member.phone ? `<br><i class="fas fa-phone"></i> ${member.phone}` : ''}
                              </div>
                              ${member.location ? `<div class="member-location"><i class="fas fa-map-marker-alt"></i> ${member.location}</div>` : ''}
                          </div>
                          <div class="member-skills">
                              ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                          </div>
                          <div class="member-projects">
                              <strong>Proyectos:</strong> ${member.projects.length} asignados
                          </div>
                      </div>
                      <div class="member-actions">
                          <button onclick="TeamMemberManager.edit(${member.id})" class="btn-small btn-primary" title="Editar miembro">
                              <i class="fas fa-edit"></i>
                          </button>
                          <button onclick="TeamMemberManager.delete(${member.id})" class="btn-small btn-danger" title="Eliminar miembro">
                              <i class="fas fa-trash"></i>
                          </button>
                          <button onclick="TeamMemberManager.viewProjects(${member.id})" class="btn-small btn-info" title="Ver proyectos">
                              <i class="fas fa-tasks"></i>
                          </button>
                      </div>
                  </div>
              `;
          }).join('');

          // Actualizar estadísticas del equipo
          TeamMemberManager.updateStats();

      } catch (error) {
          console.error('❌ Error renderizando miembros del equipo:', error);
          NotificationSystem.error('Error al cargar miembros del equipo');
      }
  },

  // Crear nuevo miembro
  create: (memberData) => {
      try {
          const newMember = {
              id: state.nextMemberId++,
              name: memberData.name.trim(),
              email: memberData.email.trim(),
              role: memberData.role,
              department: memberData.department,
              phone: memberData.phone ? memberData.phone.trim() : '',
              status: memberData.status,
              skills: memberData.skills ? memberData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
              projects: [], // Se asignarán proyectos por separado
              location: memberData.location ? memberData.location.trim() : '',
              avatar: memberData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
              joinDate: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
          };

          state.teamMembers.unshift(newMember);
          TeamMemberManager.render();
          TeamMemberManager.updateGlobalStats();
          NotificationSystem.success(`¡Miembro "${newMember.name}" agregado exitosamente!`);
          
          // Auto-guardar
          Utils.debounce(() => {
              localStorage.setItem('dashboard_team_members', JSON.stringify(state.teamMembers));
          }, CONFIG.AUTO_SAVE_DELAY)();

          return newMember;

      } catch (error) {
          console.error('❌ Error creando miembro:', error);
          NotificationSystem.error('Error al crear miembro del equipo');
          return null;
      }
  },

  // Actualizar miembro existente
  update: (id, memberData) => {
      try {
          const memberIndex = state.teamMembers.findIndex(m => m.id === id);
          if (memberIndex === -1) {
              NotificationSystem.error('Miembro no encontrado');
              return false;
          }

          const member = state.teamMembers[memberIndex];
          
          // Actualizar datos
          member.name = memberData.name.trim();
          member.email = memberData.email.trim();
          member.role = memberData.role;
          member.department = memberData.department;
          member.phone = memberData.phone ? memberData.phone.trim() : '';
          member.status = memberData.status;
          member.skills = memberData.skills ? memberData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
          member.location = memberData.location ? memberData.location.trim() : '';
          member.avatar = memberData.name.split(' ').map(n => n[0]).join('').toUpperCase();
          member.updatedAt = new Date();

          TeamMemberManager.render();
          TeamMemberManager.updateGlobalStats();
          NotificationSystem.success(`¡Miembro "${member.name}" actualizado exitosamente!`);

          // Auto-guardar
          Utils.debounce(() => {
              localStorage.setItem('dashboard_team_members', JSON.stringify(state.teamMembers));
          }, CONFIG.AUTO_SAVE_DELAY)();

          return true;

      } catch (error) {
          console.error('❌ Error actualizando miembro:', error);
          NotificationSystem.error('Error al actualizar miembro del equipo');
          return false;
      }
  },

  // Eliminar miembro
  delete: (id) => {
      try {
          const member = state.teamMembers.find(m => m.id === id);
          if (!member) {
              NotificationSystem.error('Miembro no encontrado');
              return false;
          }

          if (confirm(`¿Eliminar a "${member.name}" del equipo?\n\nEsta acción no se puede deshacer y se removerá de todos los proyectos asignados.`)) {
              // Remover miembro de proyectos
              state.projects.forEach(project => {
                  if (project.assignedMembers && project.assignedMembers.includes(id)) {
                      project.assignedMembers = project.assignedMembers.filter(memberId => memberId !== id);
                  }
              });

              // Eliminar miembro
              state.teamMembers = state.teamMembers.filter(m => m.id !== id);
              
              TeamMemberManager.render();
              TeamMemberManager.updateGlobalStats();
              ProjectManager.render(); // Actualizar proyectos también
              NotificationSystem.warning(`"${member.name}" eliminado del equipo`);

              // Auto-guardar
              Utils.debounce(() => {
                  localStorage.setItem('dashboard_team_members', JSON.stringify(state.teamMembers));
                  localStorage.setItem('dashboard_projects', JSON.stringify(state.projects));
              }, CONFIG.AUTO_SAVE_DELAY)();

              return true;
          }
          return false;

      } catch (error) {
          console.error('❌ Error eliminando miembro:', error);
          NotificationSystem.error('Error al eliminar miembro del equipo');
          return false;
      }
  },

  // Editar miembro (mostrar formulario)
  edit: (id) => {
      const member = state.teamMembers.find(m => m.id === id);
      if (member) {
          showTeamMemberForm(member);
      } else {
          NotificationSystem.error('Miembro no encontrado');
      }
  },

  // Ver proyectos de un miembro
  viewProjects: (id) => {
      const member = state.teamMembers.find(m => m.id === id);
      if (!member) {
          NotificationSystem.error('Miembro no encontrado');
          return;
      }

      const memberProjects = state.projects.filter(project => 
          project.assignedMembers && project.assignedMembers.includes(id)
      );

      if (memberProjects.length === 0) {
          NotificationSystem.info(`${member.name} no tiene proyectos asignados`);
          return;
      }

      const projectsList = memberProjects.map(p => `• ${p.name} (${p.progress}%)`).join('\n');
      alert(`Proyectos de ${member.name}:\n\n${projectsList}`);
  },

  // Actualizar estadísticas del equipo
  updateStats: () => {
      try {
          // Contadores por rol
          const roleCounts = {};
          const departmentCounts = {};

          state.teamMembers.forEach(member => {
              roleCounts[member.role] = (roleCounts[member.role] || 0) + 1;
              departmentCounts[member.department] = (departmentCounts[member.department] || 0) + 1;
          });

          // Actualizar elementos de estadísticas
          const developersCount = document.getElementById('developers-count');
          const designersCount = document.getElementById('designers-count');
          const managersCount = document.getElementById('managers-count');
          const departmentsCountEl = document.getElementById('departments-count');

          if (developersCount) developersCount.textContent = roleCounts['Developer'] || 0;
          if (designersCount) designersCount.textContent = roleCounts['Designer'] || 0;
          if (managersCount) managersCount.textContent = roleCounts['Manager'] || 0;
          if (departmentsCountEl) departmentsCountEl.textContent = Object.keys(departmentCounts).length;

          // Actualizar gráficos
          TeamMemberManager.updateCharts();

      } catch (error) {
          console.error('❌ Error actualizando estadísticas del equipo:', error);
      }
  },

  // Actualizar estadísticas globales
  updateGlobalStats: () => {
      try {
          const totalMembersEl = document.getElementById('total-members');
          if (totalMembersEl) {
              totalMembersEl.textContent = state.teamMembers.length;
          }
      } catch (error) {
          console.error('❌ Error actualizando estadísticas globales:', error);
      }
  },

  // Actualizar gráficos del equipo
  updateCharts: () => {
      TeamMemberManager.createRolesChart();
      TeamMemberManager.createDepartmentsChart();
  },

  // Crear gráfico de roles
  createRolesChart: () => {
      try {
          const ctx = document.getElementById('roles-chart');
          if (!ctx) return;

          // Destruir gráfico anterior si existe
          if (state.rolesChart) {
              state.rolesChart.destroy();
          }

          // Contar roles
          const roleCounts = {};
          state.teamMembers.forEach(member => {
              roleCounts[member.role] = (roleCounts[member.role] || 0) + 1;
          });

          const labels = Object.keys(roleCounts);
          const data = Object.values(roleCounts);

          if (labels.length === 0) {
              ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay datos para mostrar</p>';
              return;
          }

          state.rolesChart = new Chart(ctx.getContext('2d'), {
              type: 'doughnut',
              data: {
                  labels: labels,
                  datasets: [{
                      data: data,
                      backgroundColor: CONFIG.CHART_COLORS,
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
          console.error('❌ Error creando gráfico de roles:', error);
      }
  },

  // Crear gráfico de departamentos
  createDepartmentsChart: () => {
      try {
          const ctx = document.getElementById('departments-chart');
          if (!ctx) return;

          // Destruir gráfico anterior si existe
          if (state.departmentsChart) {
              state.departmentsChart.destroy();
          }

          // Contar departamentos
          const departmentCounts = {};
          state.teamMembers.forEach(member => {
              departmentCounts[member.department] = (departmentCounts[member.department] || 0) + 1;
          });

          const labels = Object.keys(departmentCounts);
          const data = Object.values(departmentCounts);

          if (labels.length === 0) {
              ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay datos para mostrar</p>';
              return;
          }

          state.departmentsChart = new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                  labels: labels,
                  datasets: [{
                      label: 'Miembros por Departamento',
                      data: data,
                      backgroundColor: CONFIG.CHART_COLORS,
                      borderWidth: 1
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      y: {
                          beginAtZero: true,
                          ticks: {
                              stepSize: 1
                          }
                      }
                  },
                  plugins: {
                      legend: {
                          display: false
                      }
                  }
              }
          });

      } catch (error) {
          console.error('❌ Error creando gráfico de departamentos:', error);
      }
  },

  // Buscar miembros
  search: Utils.debounce((searchTerm) => {
      TeamMemberManager.render();
  }, 300),

  // Asignar miembro a proyecto
  assignToProject: (memberId, projectId) => {
      try {
          const member = state.teamMembers.find(m => m.id === memberId);
          const project = state.projects.find(p => p.id === projectId);

          if (!member || !project) {
              NotificationSystem.error('Miembro o proyecto no encontrado');
              return false;
          }

          // Verificar si ya está asignado
          if (member.projects.includes(projectId)) {
              NotificationSystem.warning(`${member.name} ya está asignado a ${project.name}`);
              return false;
          }

          // Asignar en ambas direcciones
          member.projects.push(projectId);
          if (!project.assignedMembers) {
              project.assignedMembers = [];
          }
          project.assignedMembers.push(memberId);

          NotificationSystem.success(`${member.name} asignado a ${project.name}`);
          return true;

      } catch (error) {
          console.error('❌ Error asignando miembro a proyecto:', error);
          NotificationSystem.error('Error al asignar miembro a proyecto');
          return false;
      }
  },

  // Remover miembro de proyecto
  removeFromProject: (memberId, projectId) => {
      try {
          const member = state.teamMembers.find(m => m.id === memberId);
          const project = state.projects.find(p => p.id === projectId);

          if (!member || !project) {
              NotificationSystem.error('Miembro o proyecto no encontrado');
              return false;
          }

          // Remover en ambas direcciones
          member.projects = member.projects.filter(id => id !== projectId);
          if (project.assignedMembers) {
              project.assignedMembers = project.assignedMembers.filter(id => id !== memberId);
          }

          NotificationSystem.success(`${member.name} removido de ${project.name}`);
          return true;

      } catch (error) {
          console.error('❌ Error removiendo miembro de proyecto:', error);
          NotificationSystem.error('Error al remover miembro de proyecto');
          return false;
      }
  }
};

// ==================== GESTIÓN DE ASIGNACIONES ====================
const AssignmentManager = {
  render: () => {
      try {
          const container = document.getElementById('assignments-container');
          if (!container) return;

          container.innerHTML = `
              <div class="assignments-grid">
                  ${state.projects.map(project => {
                      const assignedMembers = state.teamMembers.filter(member => 
                          project.assignedMembers && project.assignedMembers.includes(member.id)
                      );

                      return `
                          <div class="assignment-card">
                              <div class="assignment-header">
                                  <h3>${Utils.sanitizeHTML(project.name)}</h3>
                                  <div class="project-progress-mini">${project.progress}%</div>
                              </div>
                              <div class="assigned-members">
                                  <h4>Miembros Asignados (${assignedMembers.length})</h4>
                                  <div class="members-list">
                                      ${assignedMembers.map(member => {
                                          const roleConfig = TeamMemberManager.getRoleConfig(member.role);
                                          return `
                                              <div class="assigned-member">
                                                  <div class="member-avatar-small">${member.avatar}</div>
                                                  <div class="member-info-small">
                                                      <div class="member-name">${member.name}</div>
                                                      <div class="member-role" style="color: ${roleConfig.color}">
                                                          ${roleConfig.icon} ${member.role}
                                                      </div>
                                                  </div>
                                                  <button onclick="AssignmentManager.removeMemberFromProject(${member.id}, ${project.id})" 
                                                          class="btn-small btn-danger" title="Remover del proyecto">
                                                      <i class="fas fa-times"></i>
                                                  </button>
                                              </div>
                                          `;
                                      }).join('')}
                                      ${assignedMembers.length === 0 ? '<p class="no-members">No hay miembros asignados</p>' : ''}
                                  </div>
                              </div>
                              <div class="assignment-actions">
                                  <button onclick="AssignmentManager.showAssignMemberModal(${project.id})" 
                                          class="btn btn-primary">
                                      <i class="fas fa-user-plus"></i>
                                      Asignar Miembro
                                  </button>
                              </div>
                          </div>
                      `;
                  }).join('')}
              </div>
          `;

      } catch (error) {
          console.error('❌ Error renderizando asignaciones:', error);
          NotificationSystem.error('Error al cargar asignaciones');
      }
  },

  showAssignMemberModal: (projectId) => {
      const project = state.projects.find(p => p.id === projectId);
      if (!project) return;

      const availableMembers = state.teamMembers.filter(member => 
          !project.assignedMembers || !project.assignedMembers.includes(member.id)
      );

      if (availableMembers.length === 0) {
          NotificationSystem.warning('No hay miembros disponibles para asignar');
          return;
      }

      const membersList = availableMembers.map(member => {
          const roleConfig = TeamMemberManager.getRoleConfig(member.role);
          return `
              <div class="selectable-member" onclick="AssignmentManager.assignMemberToProject(${member.id}, ${projectId})">
                  <div class="member-avatar-small">${member.avatar}</div>
                  <div class="member-info-small">
                      <div class="member-name">${member.name}</div>
                      <div class="member-role" style="color: ${roleConfig.color}">
                          ${roleConfig.icon} ${member.role}
                      </div>
                  </div>
              </div>
          `;
      }).join('');

      // Mostrar modal simple
      if (confirm(`Seleccionar miembro para asignar a "${project.name}"?\n\nMiembros disponibles: ${availableMembers.length}`)) {
          // Por simplicidad, asignar el primer miembro disponible
          // En una implementación más completa, se podría mostrar un modal personalizado
          const selectedMember = availableMembers[0];
          AssignmentManager.assignMemberToProject(selectedMember.id, projectId);
      }
  },

  assignMemberToProject: (memberId, projectId) => {
      if (TeamMemberManager.assignToProject(memberId, projectId)) {
          AssignmentManager.render();
          TeamMemberManager.render();
          ProjectManager.render();
      }
  },

  removeMemberFromProject: (memberId, projectId) => {
      if (TeamMemberManager.removeFromProject(memberId, projectId)) {
          AssignmentManager.render();
          TeamMemberManager.render();
          ProjectManager.render();
      }
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
      console.log('🚀 Iniciando Dashboard de Proyectos y Equipo...');
      
      try {
          // Cargar datos guardados
          App.loadData();
          
          // Inicializar módulos
          VisualEffects.addCustomStyles();
          TimeManager.init();
          FormManager.init();
          
          // Renderizar contenido inicial
          ProjectManager.render();
          TeamMemberManager.render();
          TeamMemberManager.updateGlobalStats();
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

  // Cargar datos del localStorage
  loadData: () => {
      try {
          // Cargar proyectos
          const savedProjects = localStorage.getItem('dashboard_projects');
          if (savedProjects) {
              const projects = JSON.parse(savedProjects);
              state.projects = projects.map(project => ({
                  ...project,
                  createdAt: new Date(project.createdAt),
                  updatedAt: new Date(project.updatedAt)
              }));
          }

          // Cargar miembros del equipo
          const savedMembers = localStorage.getItem('dashboard_team_members');
          if (savedMembers) {
              const members = JSON.parse(savedMembers);
              state.teamMembers = members.map(member => ({
                  ...member,
                  joinDate: new Date(member.joinDate),
                  createdAt: new Date(member.createdAt),
                  updatedAt: new Date(member.updatedAt)
              }));
              
              // Actualizar nextMemberId
              if (state.teamMembers.length > 0) {
                  state.nextMemberId = Math.max(...state.teamMembers.map(m => m.id)) + 1;
              }
          }

          console.log(`📂 Cargados ${state.projects.length} proyectos y ${state.teamMembers.length} miembros del equipo`);

      } catch (error) {
          console.error('❌ Error cargando datos:', error);
          NotificationSystem.error('Error al cargar datos guardados');
      }
  },

  // Guardar datos en localStorage
  saveData: () => {
      try {
          localStorage.setItem('dashboard_projects', JSON.stringify(state.projects));
          localStorage.setItem('dashboard_team_members', JSON.stringify(state.teamMembers));
          console.log('✅ Datos guardados correctamente');
      } catch (error) {
          console.error('❌ Error guardando datos:', error);
          NotificationSystem.error('Error al guardar datos');
      }
  },
  
  destroy: () => {
      // Guardar datos antes de destruir
      App.saveData();
      
      TimeManager.destroy();
      if (state.chart) {
          state.chart.destroy();
      }
      if (state.rolesChart) {
          state.rolesChart.destroy();
      }
      if (state.departmentsChart) {
          state.departmentsChart.destroy();
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
