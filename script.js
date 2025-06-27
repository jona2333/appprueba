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
  AUTO_SAVE_DELAY: 1000,
  STORAGE_KEYS: {
      PROJECTS: 'dashboard_projects_v2',
      MEMBERS: 'dashboard_members_v1'
  }
};

// ==================== ESTADO GLOBAL ====================
let state = {
  projects: [],
  members: [],
  charts: {
      projects: null,
      departments: null,
      roles: null
  },
  timers: {
      clock: null,
      autoSave: null
  },
  nextProjectId: 1,
  nextMemberId: 1
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
  
  // Validar email
  validateEmail: (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
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
  },

  // Generar iniciales
  generateInitials: (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  // Calcular antigüedad en meses
  calculateTenure: (joinDate) => {
      const now = new Date();
      const join = new Date(joinDate);
      const diffTime = Math.abs(now - join);
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      return diffMonths;
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

// ==================== SISTEMA DE ALMACENAMIENTO ====================
const StorageManager = {
  save: () => {
      try {
          const projectsData = {
              projects: state.projects,
              nextId: state.nextProjectId,
              lastSaved: new Date().toISOString()
          };
          
          const membersData = {
              members: state.members,
              nextId: state.nextMemberId,
              lastSaved: new Date().toISOString()
          };
          
          localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projectsData));
          localStorage.setItem(CONFIG.STORAGE_KEYS.MEMBERS, JSON.stringify(membersData));
          
          console.log('✅ Datos guardados correctamente');
          return true;
      } catch (error) {
          console.error('❌ Error guardando:', error);
          NotificationSystem.error('Error al guardar datos');
          return false;
      }
  },

  load: () => {
      try {
          // Cargar proyectos
          const savedProjects = localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS);
          if (savedProjects) {
              const projectsData = JSON.parse(savedProjects);
              state.projects = projectsData.projects || [];
              state.nextProjectId = projectsData.nextId || 1;
              
              // Convertir fechas
              state.projects.forEach(project => {
                  if (project.createdAt) project.createdAt = new Date(project.createdAt);
                  if (project.updatedAt) project.updatedAt = new Date(project.updatedAt);
              });
          } else {
              StorageManager.loadDefaultProjects();
          }

          // Cargar miembros
          const savedMembers = localStorage.getItem(CONFIG.STORAGE_KEYS.MEMBERS);
          if (savedMembers) {
              const membersData = JSON.parse(savedMembers);
              state.members = membersData.members || [];
              state.nextMemberId = membersData.nextId || 1;
              
              // Convertir fechas
              state.members.forEach(member => {
                  if (member.joinDate) member.joinDate = new Date(member.joinDate);
                  if (member.createdAt) member.createdAt = new Date(member.createdAt);
                  if (member.updatedAt) member.updatedAt = new Date(member.updatedAt);
              });
          } else {
              StorageManager.loadDefaultMembers();
          }

          console.log(`📂 Cargados ${state.projects.length} proyectos y ${state.members.length} miembros`);
          
      } catch (error) {
          console.error('❌ Error cargando datos:', error);
          NotificationSystem.error('Error al cargar datos guardados');
          StorageManager.loadDefaultData();
      }
  },

  loadDefaultProjects: () => {
      state.projects = [
          {
              id: 1,
              name: "Sistema de Inventario Avanzado", 
              progress: 75, 
              status: "En desarrollo", 
              priority: "alta",
              description: "Sistema completo para gestión de inventarios con reportes en tiempo real",
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date(),
              assignedMembers: [1, 2]
          },
          {
              id: 2,
              name: "App Móvil E-commerce", 
              progress: 45, 
              status: "Diseño", 
              priority: "media",
              description: "Aplicación móvil para tienda en línea con carrito de compras",
              createdAt: new Date('2024-02-01'),
              updatedAt: new Date(),
              assignedMembers: [3, 4]
          },
          {
              id: 3,
              name: "Dashboard de Analytics", 
              progress: 90, 
              status: "Testing", 
              priority: "alta",
              description: "Panel de control con métricas y análisis de datos empresariales",
              createdAt: new Date('2024-01-20'),
              updatedAt: new Date(),
              assignedMembers: [1, 5]
          }
      ];
      state.nextProjectId = 4;
  },

  loadDefaultMembers: () => {
      state.members = [
          {
              id: 1,
              name: "Ana García",
              email: "ana.garcia@empresa.com",
              role: "Developer",
              department: "IT",
              phone: "+52 555 123 4567",
              location: "Ciudad de México, MX",
              status: "active",
              skills: ["JavaScript", "React", "Node.js", "PostgreSQL"],
              projects: [1, 3],
              salary: 75000,
              joinDate: new Date('2023-06-15'),
              createdAt: new Date('2023-06-15'),
              updatedAt: new Date()
          },
          {
              id: 2,
              name: "Carlos Mendoza",
              email: "carlos.mendoza@empresa.com",
              role: "Designer",
              department: "IT",
              phone: "+52 555 234 5678",
              location: "Guadalajara, MX",
              status: "active",
              skills: ["Figma", "Adobe XD", "Photoshop", "UI/UX"],
              projects: [1],
              salary: 65000,
              joinDate: new Date('2023-08-01'),
              createdAt: new Date('2023-08-01'),
              updatedAt: new Date()
          },
          {
              id: 3,
              name: "María Rodríguez",
              email: "maria.rodriguez@empresa.com",
              role: "Manager",
              department: "IT",
              phone: "+52 555 345 6789",
              location: "Monterrey, MX",
              status: "active",
              skills: ["Project Management", "Scrum", "Leadership", "Planning"],
              projects: [2],
              salary: 95000,
              joinDate: new Date('2022-03-10'),
              createdAt: new Date('2022-03-10'),
              updatedAt: new Date()
          },
          {
              id: 4,
              name: "Luis Torres",
              email: "luis.torres@empresa.com",
              role: "QA",
              department: "IT",
              phone: "+52 555 456 7890",
              location: "Ciudad de México, MX",
              status: "vacation",
              skills: ["Testing", "Selenium", "Jest", "Quality Assurance"],
              projects: [2],
              salary: 55000,
              joinDate: new Date('2023-11-20'),
              createdAt: new Date('2023-11-20'),
              updatedAt: new Date()
          },
          {
              id: 5,
              name: "Elena Vargas",
              email: "elena.vargas@empresa.com",
              role: "Analyst",
              department: "Marketing",
              phone: "+52 555 567 8901",
              location: "Puebla, MX",
              status: "active",
              skills: ["Data Analysis", "SQL", "Python", "Tableau"],
              projects: [3],
              salary: 60000,
              joinDate: new Date('2023-09-05'),
              createdAt: new Date('2023-09-05'),
              updatedAt: new Date()
          }
      ];
      state.nextMemberId = 6;
  }
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
              
              // Obtener miembros asignados
              const assignedMembers = project.assignedMembers ? 
                  state.members.filter(m => project.assignedMembers.includes(m.id)) : [];
              
              const membersHtml = assignedMembers.length > 0 ? `
                  <div class="project-members">
                      <span class="members-label">👥 Equipo:</span>
                      ${assignedMembers.map(member => `
                          <span class="member-badge" title="${member.name} (${member.role})">
                              ${Utils.generateInitials(member.name)}
                          </span>
                      `).join('')}
                  </div>
              ` : '';
              
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
                  ${membersHtml}
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
                      <button onclick="assignMembersToProject(${project.id})" class="btn-small" title="Asignar miembros" style="background: #2196F3;">
                          <i class="fas fa-users"></i> Equipo
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
          ChartManager.updateProjectChart();
          
      } catch (error) {
          console.error('❌ Error renderizando proyectos:', error);
          NotificationSystem.error('Error al cargar proyectos');
      }
  },
  
  // Crear nuevo proyecto
  create: (projectData) => {
      try {
          const newProject = {
              id: state.nextProjectId++,
              name: projectData.name.trim(),
              description: projectData.description.trim(),
              progress: 0,
              status: 'Planificación',
              priority: projectData.priority,
              createdAt: new Date(),
              updatedAt: new Date(),
              assignedMembers: []
          };
          
          state.projects.unshift(newProject);
          ProjectManager.render();
          StorageManager.save();
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
          StorageManager.save();
          
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
              
              // Remover proyecto de miembros asignados
              state.members.forEach(member => {
                  if (member.projects && member.projects.includes(id)) {
                      member.projects = member.projects.filter(pid => pid !== id);
                  }
              });
              
              ProjectManager.render();
              StorageManager.save();
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
          
          // Actualizar estadísticas de miembros
          TeamManager.updateStats();
          
      } catch (error) {
          console.error('❌ Error actualizando estadísticas:', error);
      }
  }
};

// ==================== GESTIÓN DE MIEMBROS DEL EQUIPO ====================
const TeamManager = {
  // Renderizar lista de miembros
  render: () => {
      const container = document.getElementById('members-list');
      if (!container) return;
      
      try {
          const filteredMembers = TeamManager.getFilteredMembers();
          
          if (filteredMembers.length === 0) {
              container.innerHTML = `
                  <div class="text-center" style="padding: 40px; color: #666;">
                      <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                      <p>No se encontraron miembros con los filtros aplicados.</p>
                  </div>
              `;
              return;
          }
          
          container.innerHTML = filteredMembers.map(member => {
              const statusConfig = TeamManager.getStatusConfig(member.status);
              const initials = Utils.generateInitials(member.name);
              const tenure = Utils.calculateTenure(member.joinDate);
              let skillsText = 'Sin habilidades definidas';
              if (member.skills && member.skills.length > 0) {
                  skillsText = member.skills.slice(0, 3).join(', ');
                  if (member.skills.length > 3) {
                      skillsText += '...';
                  }
              }
              
              // Obtener proyectos asignados
              const assignedProjects = member.projects ? 
                  state.projects.filter(p => member.projects.includes(p.id)) : [];
              
              return `
                  <div class="member-card fade-in-up">
                      <div class="member-header">
                          <div class="member-avatar">
                              ${initials}
                          </div>
                          <div class="member-info">
                              <h3 class="member-name">${Utils.sanitizeHTML(member.name)}</h3>
                              <p class="member-role">${member.role} • ${member.department}</p>
                              <div class="member-status ${statusConfig.class}">
                                  ${statusConfig.icon} ${statusConfig.label}
                              </div>
                          </div>
                          <div class="member-actions">
                              <button onclick="editMember(${member.id})" class="btn-icon" title="Editar">
                                  <i class="fas fa-edit"></i>
                              </button>
                              <button onclick="deleteMember(${member.id})" class="btn-icon btn-danger" title="Eliminar">
                                  <i class="fas fa-trash"></i>
                              </button>
                          </div>
                      </div>
                      <div class="member-details">
                          <div class="member-detail-item">
                              <i class="fas fa-envelope"></i>
                              <span>${member.email}</span>
                          </div>
                          ${member.phone ? `
                              <div class="member-detail-item">
                                  <i class="fas fa-phone"></i>
                                  <span>${member.phone}</span>
                              </div>
                          ` : ''}
                          ${member.location ? `
                              <div class="member-detail-item">
                                  <i class="fas fa-map-marker-alt"></i>
                                  <span>${member.location}</span>
                              </div>
                          ` : ''}
                          <div class="member-detail-item">
                              <i class="fas fa-calendar"></i>
                              <span>Ingresó hace ${tenure} meses</span>
                          </div>
                      </div>
                      <div class="member-skills">
                          <strong>Habilidades:</strong> ${skillsText}
                      </div>
                      ${assignedProjects.length > 0 ? `
                          <div class="member-projects">
                              <strong>Proyectos:</strong>
                              ${assignedProjects.map(project => `
                                  <span class="project-badge">${project.name}</span>
                              `).join('')}
                          </div>
                      ` : ''}
                  </div>
              `;
          }).join('');
          
      } catch (error) {
          console.error('❌ Error renderizando miembros:', error);
          NotificationSystem.error('Error al cargar miembros del equipo');
      }
  },

  // Obtener configuración de estado
  getStatusConfig: (status) => {
      const configs = {
          'active': { class: 'status-active', icon: '🟢', label: 'Activo' },
          'inactive': { class: 'status-inactive', icon: '🔴', label: 'Inactivo' },
          'vacation': { class: 'status-vacation', icon: '🟡', label: 'En Vacaciones' }
      };
      return configs[status] || configs['active'];
  },

  // Obtener miembros filtrados
  getFilteredMembers: () => {
      const searchTerm = (document.getElementById('member-search')?.value || '').toLowerCase();
      const departmentFilter = document.getElementById('department-filter')?.value || '';
      const roleFilter = document.getElementById('role-filter')?.value || '';
      const statusFilter = document.getElementById('status-filter')?.value || '';
      
      return state.members.filter(member => {
          const matchesSearch = !searchTerm || 
              member.name.toLowerCase().includes(searchTerm) ||
              member.email.toLowerCase().includes(searchTerm) ||
              member.role.toLowerCase().includes(searchTerm);
          
          const matchesDepartment = !departmentFilter || member.department === departmentFilter;
          const matchesRole = !roleFilter || member.role === roleFilter;
          const matchesStatus = !statusFilter || member.status === statusFilter;
          
          return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
      });
  },

  // Crear nuevo miembro
  create: (memberData) => {
      try {
          // Validaciones
          if (!Utils.validateInput(memberData.name, 2, 100)) {
              NotificationSystem.error('El nombre debe tener entre 2 y 100 caracteres');
              return false;
          }
          
          if (!Utils.validateEmail(memberData.email)) {
              NotificationSystem.error('Email inválido');
              return false;
          }
          
          // Verificar email único
          if (state.members.some(m => m.email === memberData.email)) {
              NotificationSystem.error('Ya existe un miembro con este email');
              return false;
          }
          
          const newMember = {
              id: state.nextMemberId++,
              name: memberData.name.trim(),
              email: memberData.email.trim().toLowerCase(),
              role: memberData.role,
              department: memberData.department,
              phone: memberData.phone?.trim() || '',
              location: memberData.location?.trim() || '',
              status: memberData.status || 'active',
              skills: memberData.skills ? 
                  memberData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
              projects: [],
              salary: memberData.salary ? parseFloat(memberData.salary) : null,
              joinDate: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
          };
          
          state.members.push(newMember);
          TeamManager.render();
          TeamManager.updateStats();
          StorageManager.save();
          NotificationSystem.success(`¡Miembro "${newMember.name}" agregado exitosamente!`);
          
          console.log('✅ Miembro creado:', newMember);
          return true;
          
      } catch (error) {
          console.error('❌ Error creando miembro:', error);
          NotificationSystem.error('Error al crear miembro');
          return false;
      }
  },

  // Actualizar miembro
  update: (id, memberData) => {
      try {
          const member = state.members.find(m => m.id == id);
          if (!member) {
              NotificationSystem.error('Miembro no encontrado');
              return false;
          }
          
          // Validaciones
          if (!Utils.validateInput(memberData.name, 2, 100)) {
              NotificationSystem.error('El nombre debe tener entre 2 y 100 caracteres');
              return false;
          }
          
          if (!Utils.validateEmail(memberData.email)) {
              NotificationSystem.error('Email inválido');
              return false;
          }
          
          // Verificar email único (excluyendo el miembro actual)
          if (state.members.some(m => m.id !== id && m.email === memberData.email)) {
              NotificationSystem.error('Ya existe otro miembro con este email');
              return false;
          }
          
          // Actualizar datos
          member.name = memberData.name.trim();
          member.email = memberData.email.trim().toLowerCase();
          member.role = memberData.role;
          member.department = memberData.department;
          member.phone = memberData.phone?.trim() || '';
          member.location = memberData.location?.trim() || '';
          member.status = memberData.status;
          member.skills = memberData.skills ? 
              memberData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
          member.salary = memberData.salary ? parseFloat(memberData.salary) : null;
          member.updatedAt = new Date();
          
          TeamManager.render();
          TeamManager.updateStats();
          StorageManager.save();
          NotificationSystem.success(`¡Miembro "${member.name}" actualizado exitosamente!`);
          
          console.log('✅ Miembro actualizado:', member);
          return true;
          
      } catch (error) {
          console.error('❌ Error actualizando miembro:', error);
          NotificationSystem.error('Error al actualizar miembro');
          return false;
      }
  },

  // Eliminar miembro
  delete: (id) => {
      try {
          const member = state.members.find(m => m.id == id);
          if (!member) {
              NotificationSystem.error('Miembro no encontrado');
              return;
          }
          
          if (confirm(`¿Estás seguro de eliminar a "${member.name}"?\n\nEsta acción no se puede deshacer.`)) {
              // Remover de proyectos asignados
              state.projects.forEach(project => {
                  if (project.assignedMembers && project.assignedMembers.includes(id)) {
                      project.assignedMembers = project.assignedMembers.filter(mid => mid !== id);
                  }
              });
              
              // Eliminar miembro
              state.members = state.members.filter(m => m.id !== id);
              
              TeamManager.render();
              TeamManager.updateStats();
              ProjectManager.render(); // Actualizar vista de proyectos
              StorageManager.save();
              NotificationSystem.warning(`Miembro "${member.name}" eliminado`);
              console.log('🗑️ Miembro eliminado:', member.name);
          }
          
      } catch (error) {
          console.error('❌ Error eliminando miembro:', error);
          NotificationSystem.error('Error al eliminar miembro');
      }
  },

  // Actualizar estadísticas
  updateStats: () => {
      try {
          // Estadísticas principales
         const totalMembers = state.members.length;
        const activeMembers = state.members.filter(m => m.status === 'active').length;
        const departments = [...new Set(state.members.map(m => m.department))].filter(d => d);
          
             // Actualizar elementos principales
        const totalMembersElement = document.getElementById('total-members');
        const activeMembersElement = document.getElementById('active-members');
        const totalDepartmentsElement = document.getElementById('total-departments');
        
        if (totalMembersElement) totalMembersElement.textContent = totalMembers;
        if (activeMembersElement) activeMembersElement.textContent = activeMembers;
        if (totalDepartmentsElement) totalDepartmentsElement.textContent = departments.length;
        
             // Estadísticas del modal con animación
        const modalTotalElement = document.getElementById('modal-total-members');
        const modalActiveElement = document.getElementById('modal-active-members');
        const modalDepartmentsElement = document.getElementById('modal-total-departments');
        const modalTenureElement = document.getElementById('modal-avg-tenure');
        
        // Animar números
        if (modalTotalElement) {
            TeamManager.animateNumber(modalTotalElement, totalMembers);
        }
        if (modalActiveElement) {
            TeamManager.animateNumber(modalActiveElement, activeMembers);
        }
        if (modalDepartmentsElement) {
            TeamManager.animateNumber(modalDepartmentsElement, departments.length);
        }
         // Calcular antigüedad promedio
        if (modalTenureElement && totalMembers > 0) {
            const avgTenure = Math.round(
                state.members.reduce((sum, m) => sum + Utils.calculateTenure(m.joinDate), 0) / totalMembers
            );
            TeamManager.animateNumber(modalTenureElement, avgTenure);
        } else if (modalTenureElement) {
            modalTenureElement.textContent = '0';
        }
        
        // Actualizar gráficos de miembros
        ChartManager.updateMemberCharts();
        
    } catch (error) {
        console.error('❌ Error actualizando estadísticas de miembros:', error);
    }
},
// Agregar función para animar números
animateNumber: (element, finalValue) => {
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const increment = (finalValue - startValue) / 20;
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if ((increment > 0 && currentValue >= finalValue) || 
            (increment < 0 && currentValue <= finalValue)) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(currentValue);
        }
    }, 50);
}
};

// ==================== SISTEMA DE GRÁFICOS ====================
const ChartManager = {
  updateProjectChart: () => {
      const ctx = document.getElementById('projectChart');
      if (!ctx) return;
      
      if (typeof Chart === 'undefined') {
          console.warn('⚠️ Chart.js no está disponible');
          ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Gráfico no disponible</p>';
          return;
      }
      
      try {
          if (state.charts.projects) {
              state.charts.projects.destroy();
          }
          
          const statusCounts = ChartManager.getProjectStatusCounts();
          const labels = Object.keys(statusCounts);
          const data = Object.values(statusCounts);
          
          if (labels.length === 0) {
              ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay datos para mostrar</p>';
              return;
          }
          
          state.charts.projects = new Chart(ctx.getContext('2d'), {
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
          
          console.log('📊 Gráfico de proyectos actualizado');
          
      } catch (error) {
          console.error('❌ Error actualizando gráfico de proyectos:', error);
          ctx.parentElement.innerHTML = '<p style="text-align: center; color: #f44336; padding: 40px;">Error al cargar gráfico</p>';
      }
  },

  updateMemberCharts: () => {
      ChartManager.updateDepartmentChart();
      ChartManager.updateRoleChart();
  },

  updateDepartmentChart: () => {
      const ctx = document.getElementById('departmentChart');
      if (!ctx || typeof Chart === 'undefined') return;
      
      try {
          if (state.charts.departments) {
              state.charts.departments.destroy();
          }
          
          const departmentCounts = ChartManager.getDepartmentCounts();
          const labels = Object.keys(departmentCounts);
          const data = Object.values(departmentCounts);
          
          if (labels.length === 0) {
              ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay datos</p>';
              return;
          }
          
          state.charts.departments = new Chart(ctx.getContext('2d'), {
              type: 'pie',
              data: {
                  labels: labels,
                  datasets: [{
                      data: data,
                      backgroundColor: CONFIG.CHART_COLORS.slice(0, labels.length),
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
                              padding: 15,
                              usePointStyle: true,
                              font: { size: 11 }
                          }
                      }
                  }
              }
          });
          
      } catch (error) {
          console.error('❌ Error actualizando gráfico de departamentos:', error);
      }
  },

  updateRoleChart: () => {
      const ctx = document.getElementById('roleChart');
      if (!ctx || typeof Chart === 'undefined') return;
      
      try {
          if (state.charts.roles) {
              state.charts.roles.destroy();
          }
          
          const roleCounts = ChartManager.getRoleCounts();
          const labels = Object.keys(roleCounts);
          const data = Object.values(roleCounts);
          
          if (labels.length === 0) {
              ctx.parentElement.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay datos</p>';
              return;
          }
          
          state.charts.roles = new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                  labels: labels,
                  datasets: [{
                      label: 'Miembros',
                      data: data,
                      backgroundColor: CONFIG.CHART_COLORS[1],
                      borderColor: CONFIG.CHART_COLORS[1],
                      borderWidth: 1
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: { display: false }
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          ticks: { stepSize: 1 }
                      }
                  }
              }
          });
          
      } catch (error) {
          console.error('❌ Error actualizando gráfico de roles:', error);
      }
  },

  getProjectStatusCounts: () => {
      const counts = {};
      state.projects.forEach(project => {
          counts[project.status] = (counts[project.status] || 0) + 1;
      });
      return counts;
  },

  getDepartmentCounts: () => {
      const counts = {};
      state.members.forEach(member => {
          counts[member.department] = (counts[member.department] || 0) + 1;
      });
      return counts;
  },

  getRoleCounts: () => {
      const counts = {};
      state.members.forEach(member => {
          counts[member.role] = (counts[member.role] || 0) + 1;
      });
      return counts;
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

// ==================== GESTIÓN DE MODALES ====================
const ModalManager = {
  openTeamModal: () => {
      const modal = document.getElementById('team-modal');
      if (modal) {
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
          
          // Actualizar contenido
          TeamManager.render();
          TeamManager.updateStats();
          
          // Mostrar primera pestaña
          ModalManager.switchTab('members');
      }
  },

  closeTeamModal: () => {
      const modal = document.getElementById('team-modal');
      if (modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
          
          // Limpiar formulario
          ModalManager.resetMemberForm();
      }
  },

  switchTab: (tabName) => {
      // Ocultar todas las pestañas
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach(tab => tab.classList.remove('active'));
      
      // Mostrar pestaña seleccionada
      const activeTab = document.getElementById(`${tabName}-tab`);
      if (activeTab) {
          activeTab.classList.add('active');
      }
      
      // Actualizar botones de pestañas
      const tabButtons = document.querySelectorAll('.tab-button');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      const activeButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
      if (activeButton) {
          activeButton.classList.add('active');
      }
      
      // Acciones específicas por pestaña
      if (tabName === 'stats') {
          setTimeout(() => {
              ChartManager.updateMemberCharts();
          }, 100);
      }
  },

  resetMemberForm: () => {
      const form = document.getElementById('member-form');
      if (form) {
          form.reset();
          document.getElementById('member-id').value = '';
          document.getElementById('save-button-text').textContent = 'Guardar Miembro';
          
          // Limpiar validaciones
          const fields = form.querySelectorAll('input, textarea, select');
          fields.forEach(field => {
              field.classList.remove('valid', 'invalid');
              const errorElement = field.parentElement.querySelector('.error-message');
              if (errorElement) errorElement.remove();
          });
      }
  }
};

// ==================== GESTIÓN DE FORMULARIOS ====================
const FormManager = {
  init: () => {
      // Formulario de proyectos
      const projectForm = document.getElementById('project-form');
      if (projectForm) {
          projectForm.addEventListener('submit', FormManager.handleProjectSubmit);
      }
      
      // Formulario de miembros
      const memberForm = document.getElementById('member-form');
      if (memberForm) {
          memberForm.addEventListener('submit', FormManager.handleMemberSubmit);
      }
      
      // Validación en tiempo real
      const inputs = document.querySelectorAll('input, textarea, select');
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
          console.error('❌ Error enviando formulario de proyecto:', error);
          NotificationSystem.error('Error al crear proyecto');
      }
  },

  handleMemberSubmit: (e) => {
      e.preventDefault();
      
      try {
          const formData = new FormData(e.target);
          const memberId = document.getElementById('member-id').value;
          
          const memberData = {
              name: formData.get('name')?.trim(),
              email: formData.get('email')?.trim(),
              role: formData.get('role'),
              department: formData.get('department'),
              phone: formData.get('phone')?.trim(),
              location: formData.get('location')?.trim(),
              status: formData.get('status'),
              salary: formData.get('salary'),
              skills: formData.get('skills')?.trim()
          };
          
          let success = false;
          if (memberId) {
              // Actualizar miembro existente
              success = TeamManager.update(parseInt(memberId), memberData);
          } else {
              // Crear nuevo miembro
              success = TeamManager.create(memberData);
          }
          
          if (success) {
              // Limpiar formulario y cambiar a pestaña de miembros
              ModalManager.resetMemberForm();
              ModalManager.switchTab('members');
          }
          
      } catch (error) {
          console.error('❌ Error enviando formulario de miembro:', error);
          NotificationSystem.error('Error al procesar miembro');
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
          case 'name':
              isValid = Utils.validateInput(value, 2, 100);
              message = isValid ? '' : 'Entre 2 y 100 caracteres';
              break;
          case 'project-description':
              isValid = Utils.validateInput(value, 10, 500);
              message = isValid ? '' : 'Entre 10 y 500 caracteres';
              break;
          case 'email':
              isValid = !value || Utils.validateEmail(value);
              message = isValid ? '' : 'Email inválido';
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

// ==================== FUNCIONES AUXILIARES ====================
const FilterManager = {
  filterMembers: Utils.debounce(() => {
      TeamManager.render();
  }, 300)
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

function openTeamModal() {
  ModalManager.openTeamModal();
}

function closeTeamModal() {
  ModalManager.closeTeamModal();
}

function switchTab(tabName) {
  ModalManager.switchTab(tabName);
}

function resetMemberForm() {
  ModalManager.resetMemberForm();
}

function filterMembers() {
  FilterManager.filterMembers();
}

function editMember(id) {
  const member = state.members.find(m => m.id == id);
  if (!member) {
      NotificationSystem.error('Miembro no encontrado');
      return;
  }
  
  // Llenar formulario con datos del miembro
  document.getElementById('member-id').value = member.id;
  document.getElementById('member-name').value = member.name;
  document.getElementById('member-email').value = member.email;
  document.getElementById('member-role').value = member.role;
  document.getElementById('member-department').value = member.department;
  document.getElementById('member-phone').value = member.phone || '';
  document.getElementById('member-location').value = member.location || '';
  document.getElementById('member-status').value = member.status;
  document.getElementById('member-salary').value = member.salary || '';
  document.getElementById('member-skills').value = member.skills ? member.skills.join(', ') : '';
  
  // Cambiar texto del botón
  document.getElementById('save-button-text').textContent = 'Actualizar Miembro';
  
  // Cambiar a pestaña de edición
  ModalManager.switchTab('add-member');
}

function deleteMember(id) {
  TeamManager.delete(id);
}

function assignMembersToProject(projectId) {
  const project = state.projects.find(p => p.id == projectId);
  if (!project) {
      NotificationSystem.error('Proyecto no encontrado');
      return;
  }
  
  // Crear lista de miembros disponibles
  const availableMembers = state.members.filter(m => m.status === 'active');
  
  if (availableMembers.length === 0) {
      NotificationSystem.warning('No hay miembros activos disponibles');
      return;
  }
  
  // Crear checkboxes para selección
  // (Eliminado: variable memberOptions no utilizada)
  
  // Construir la lista de miembros como string separado
  const memberListString = availableMembers.map(function(m, i) {
      return (i + 1) + '. ' + m.name + ' (' + m.role + ')';
  }).join('\n');
  
  // Mostrar modal simple con prompt
  const selectedIds = prompt(
      'Selecciona miembros para "' + project.name + '":\n\n' +
      memberListString +
      '\n\nIngresa los números separados por comas (ej: 1,3,5):'
  );
  
  if (selectedIds !== null) {
      try {
          const indices = selectedIds.split(',').map(s => parseInt(s.trim()) - 1).filter(i => !isNaN(i) && i >= 0 && i < availableMembers.length);
          const newAssignedMembers = indices.map(i => availableMembers[i].id);
          
          // Actualizar proyecto
          project.assignedMembers = newAssignedMembers;
          project.updatedAt = new Date();
          
          // Actualizar miembros
          state.members.forEach(member => {
              if (!member.projects) member.projects = [];
              
              if (newAssignedMembers.includes(member.id)) {
                  // Agregar proyecto si no está
                  if (!member.projects.includes(projectId)) {
                      member.projects.push(projectId);
                  }
              } else {
                  // Remover proyecto si estaba
                  member.projects = member.projects.filter(pid => pid !== projectId);
              }
          });
          
          ProjectManager.render();
          StorageManager.save();
          
          const assignedNames = newAssignedMembers.map(id => 
              state.members.find(m => m.id === id)?.name
          ).filter(Boolean);
          
          if (assignedNames.length > 0) {
              NotificationSystem.success(`Miembros asignados: ${assignedNames.join(', ')}`);
          } else {
              NotificationSystem.info('Se removieron todos los miembros del proyecto');
          }
          
      } catch (error) {
          console.error('❌ Error al procesar la selección:', error);
          NotificationSystem.error('Error al procesar la selección');
      }
  }
}

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================
const App = {
  init: () => {
      console.log('🚀 Iniciando Dashboard de Proyectos con Gestión de Equipo...');
      
      try {
          // Cargar datos guardados
          StorageManager.load();
          
          // Inicializar módulos
          TimeManager.init();
          FormManager.init();
          
          // Renderizar contenido inicial
          ProjectManager.render();
          ChartManager.updateProjectChart();
          
          // Configurar eventos del modal
          App.setupModalEvents();
          
          // Efectos con delay
          setTimeout(() => {
              NotificationSystem.success('¡Dashboard cargado correctamente!');
          }, CONFIG.ANIMATION_DURATION);
          
          console.log('✅ Dashboard inicializado exitosamente');
          
      } catch (error) {
          console.error('❌ Error inicializando aplicación:', error);
          NotificationSystem.error('Error al inicializar la aplicación');
      }
  },
  
  setupModalEvents: () => {
      // Cerrar modal al hacer clic fuera
      const modal = document.getElementById('team-modal');
      if (modal) {
          modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                  closeTeamModal();
              }
          });
      }
      
      // Cerrar modal con tecla Escape
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              closeTeamModal();
          }
      });
  },
  
  destroy: () => {
      TimeManager.destroy();
      
      // Destruir gráficos
      Object.values(state.charts).forEach(chart => {
          if (chart) chart.destroy();
      });
      
      // Guardar datos antes de cerrar
      StorageManager.save();
      
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
      TeamManager,
      ChartManager,
      NotificationSystem,
      Utils,
      StorageManager
  };
}

console.log('📝 Sistema de Gestión de Equipo cargado - Dashboard listo para inicializar');
