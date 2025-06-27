<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Proyectos</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>
                <i class="fas fa-chart-line"></i>
                Dashboard de Proyectos
            </h1>
            <div class="header-time">
                <i class="fas fa-clock"></i>
                <span id="current-time">--:--:--</span>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-number" id="total-projects">0</div>
                <div class="stat-label">Total Proyectos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-number" id="completed-projects">0</div>
                <div class="stat-label">Completados</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-number" id="avg-progress">0%</div>
                <div class="stat-label">Progreso Promedio</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-number" id="total-members">0</div>
                <div class="stat-label">Miembros del Equipo</div>
            </div>
        </div>

        <!-- Contenido Principal -->
        <div class="main-content">
            <div class="chart-section">
                <h2 class="section-title">
                    <i class="fas fa-chart-pie"></i>
                    Estado de Proyectos
                </h2>
                <div style="height: 300px; position: relative;">
                    <canvas id="projectChart"></canvas>
                </div>
            </div>
            
            <div class="project-list">
                <h2 class="section-title">
                    <i class="fas fa-tasks"></i>
                    Proyectos Recientes
                </h2>
                <div id="projects-container">
                    <!-- Los proyectos se generarán dinámicamente -->
                </div>
            </div>
        </div>

        <!-- Paneles de Acción -->
        <div class="actions-section">
            <!-- Panel de Nuevo Proyecto -->
            <div class="action-panel">
                <h2 class="section-title">
                    <i class="fas fa-plus-circle"></i>
                    Nuevo Proyecto
                </h2>
                <form id="project-form">
                    <div class="form-group">
                        <label for="project-name">Nombre del Proyecto</label>
                        <input type="text" id="project-name" name="project-name" required 
                               placeholder="Ej: Sistema de Inventario" maxlength="100">
                    </div>
                    <div class="form-group">
                        <label for="project-description">Descripción</label>
                        <textarea id="project-description" name="project-description" required 
                                  placeholder="Describe el proyecto en detalle..." maxlength="500"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="project-priority">Prioridad</label>
                        <select id="project-priority" name="project-priority" required>
                            <option value="baja">🟢 Baja</option>
                            <option value="media" selected>🟡 Media</option>
                            <option value="alta">🔴 Alta</option>
                        </select>
                    </div>
                    <button type="submit" class="btn">
                        <i class="fas fa-save"></i>
                        Crear Proyecto
                    </button>
                </form>
            </div>

            <!-- Panel de Miembros del Equipo -->
            <div class="action-panel">
                <h2 class="section-title">
                    <i class="fas fa-users"></i>
                    Miembros del Equipo
                </h2>
                <button onclick="openTeamModal()" class="btn">
                    <i class="fas fa-user-plus"></i>
                    Gestionar Equipo
                </button>
                <div class="team-stats">
                    <div class="team-stat-item">
                        <span class="team-stat-number" id="active-members">0</span>
                        <span class="team-stat-label">Activos</span>
                    </div>
                    <div class="team-stat-item">
                        <span class="team-stat-number" id="total-departments">0</span>
                        <span class="team-stat-label">Departamentos</span>
                    </div>
                </div>
            </div>

            <!-- Panel de Productividad -->
            <div class="action-panel">
                <h2 class="section-title">
                    <i class="fas fa-chart-bar"></i>
                    Calculadora de Productividad
                </h2>
                <div class="form-group">
                    <label for="hours-worked">Horas Trabajadas</label>
                    <input type="number" id="hours-worked" min="0" max="24" step="0.5" 
                           placeholder="8" onchange="calculateProductivity()">
                </div>
                <div class="form-group">
                    <label for="tasks-completed">Tareas Completadas</label>
                    <input type="number" id="tasks-completed" min="0" max="100" 
                           placeholder="5" onchange="calculateProductivity()">
                </div>
                <div id="productivity-result">
                    <div style="color: #666; text-align: center; padding: 20px;">
                        <i class="fas fa-calculator" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <p>Ingresa los datos para calcular tu productividad</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Gestión de Equipo -->
    <div id="team-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-users"></i> Gestión de Miembros del Equipo</h2>
                <button class="close" type="button" onclick="closeTeamModal()" aria-label="Cerrar">&times;</button>
            </div>
            
            <div class="modal-body">
                <!-- Pestañas -->
                <div class="tabs">
                    <button class="tab-button active" onclick="switchTab('members')">
                        <i class="fas fa-list"></i> Miembros
                    </button>
                    <button class="tab-button" onclick="switchTab('add-member')">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                    <button class="tab-button" onclick="switchTab('stats')">
                        <i class="fas fa-chart-bar"></i> Estadísticas
                    </button>
                </div>

                <!-- Contenido de Pestañas -->
                <!-- Tab: Lista de Miembros -->
                <div id="members-tab" class="tab-content active">
                    <div class="search-filter-section">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="member-search" placeholder="Buscar miembros..." 
                                   onkeyup="filterMembers()">
                        </div>
                        <div class="filter-controls">
                            <select id="department-filter" onchange="filterMembers()">
                                <option value="">Todos los departamentos</option>
                                <option value="IT">IT</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Ventas</option>
                                <option value="HR">Recursos Humanos</option>
                                <option value="Finance">Finanzas</option>
                            </select>
                            <select id="role-filter" onchange="filterMembers()">
                                <option value="">Todos los roles</option>
                                <option value="Developer">Desarrollador</option>
                                <option value="Designer">Diseñador</option>
                                <option value="Manager">Gerente</option>
                                <option value="Analyst">Analista</option>
                                <option value="QA">QA</option>
                            </select>
                            <select id="status-filter" onchange="filterMembers()">
                                <option value="">Todos los estados</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="vacation">En Vacaciones</option>
                            </select>
                        </div>
                    </div>
                    <div id="members-list">
                        <!-- Los miembros se generarán dinámicamente -->
                    </div>
                </div>

                <!-- Tab: Agregar Miembro -->
                <div id="add-member-tab" class="tab-content">
                    <form id="member-form">
                        <input type="hidden" id="member-id">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="member-name">Nombre Completo *</label>
                                <input type="text" id="member-name" name="name" required 
                                       placeholder="Juan Pérez" maxlength="100">
                            </div>
                            <div class="form-group">
                                <label for="member-email">Email *</label>
                                <input type="email" id="member-email" name="email" required 
                                       placeholder="juan@empresa.com">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="member-role">Rol *</label>
                                <select id="member-role" name="role" required>
                                    <option value="">Seleccionar rol</option>
                                    <option value="Developer">Desarrollador</option>
                                    <option value="Designer">Diseñador</option>
                                    <option value="Manager">Gerente</option>
                                    <option value="Analyst">Analista</option>
                                    <option value="QA">QA</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="member-department">Departamento *</label>
                                <select id="member-department" name="department" required>
                                    <option value="">Seleccionar departamento</option>
                                    <option value="IT">IT</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Ventas</option>
                                    <option value="HR">Recursos Humanos</option>
                                    <option value="Finance">Finanzas</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="member-phone">Teléfono</label>
                                <input type="tel" id="member-phone" name="phone" 
                                       placeholder="+52 555 123 4567">
                            </div>
                            <div class="form-group">
                                <label for="member-location">Ubicación</label>
                                <input type="text" id="member-location" name="location" 
                                       placeholder="Ciudad de México, MX">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="member-status">Estado</label>
                                <select id="member-status" name="status">
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                    <option value="vacation">En Vacaciones</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="member-salary">Salario (Opcional)</label>
                                <input type="number" id="member-salary" name="salary" min="0" 
                                       placeholder="50000">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="member-skills">Habilidades (separadas por comas)</label>
                            <textarea id="member-skills" name="skills" 
                                      placeholder="JavaScript, React, Node.js, SQL"></textarea>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="btn">
                                <i class="fas fa-save"></i>
                                <span id="save-button-text">Guardar Miembro</span>
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="resetMemberForm()">
                                <i class="fas fa-times"></i>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>

<!-- Tab: Estadísticas -->
<div id="stats-tab" class="tab-content">
    <div class="stats-grid-modal">
        <div class="stat-card-modal">
            <div class="stat-icon">👥</div>
            <div class="stat-number" id="modal-total-members">0</div>
            <div class="stat-label">Total Miembros</div>
        </div>
        <div class="stat-card-modal">
            <div class="stat-icon">🏢</div>
            <div class="stat-number" id="modal-total-departments">0</div>
            <div class="stat-label">Departamentos</div>
        </div>
        <div class="stat-card-modal">
            <div class="stat-icon">✅</div>
            <div class="stat-number" id="modal-active-members">0</div>
            <div class="stat-label">Miembros Activos</div>
        </div>
        <div class="stat-card-modal">
            <div class="stat-icon">📅</div>
            <div class="stat-number" id="modal-avg-tenure">0</div>
            <div class="stat-label">Meses Promedio</div>
        </div>
    </div>
    <div class="charts-section">
        <div class="chart-container">
            <h3>📊 Distribución por Departamento</h3>
            <canvas id="departmentChart"></canvas>
        </div>
        <div class="chart-container">
            <h3>👤 Distribución por Rol</h3>
            <canvas id="roleChart"></canvas>
        </div>
    </div>
</div>
    <!-- Notificación -->
    <div id="notification" class="notification"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script.js"></script>
</body>
</html>
