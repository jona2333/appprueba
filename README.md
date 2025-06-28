# 🚀 Dashboard de Gestión de Proyectos y Equipo

Un dashboard profesional y moderno para la gestión integral de proyectos y equipos de trabajo, desarrollado con tecnologías web fundamentales (HTML5, CSS3, JavaScript ES6+).

![Dashboard Preview](https://img.shields.io/badge/Status-Activo-brightgreen) ![Version](https://img.shields.io/badge/Version-2.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Funcionalidades](#-funcionalidades)
- [API y Módulos](#-api-y-módulos)
- [Personalización](#-personalización)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 🎯 **Gestión Completa de Proyectos**
- ✅ Crear, editar, actualizar y eliminar proyectos
- 📊 Seguimiento de progreso en tiempo real
- 🏷️ Sistema de prioridades (Alta, Media, Baja)
- 📈 Estados automáticos basados en progreso

### 👥 **Sistema de Gestión de Equipo** *(NUEVO)*
- 👤 CRUD completo de miembros del equipo
- 🔍 Búsqueda y filtros avanzados (rol, departamento, estado)
- 📧 Gestión de información de contacto y habilidades
- 🎯 Asignación bidireccional de miembros a proyectos
- 📊 Estados de miembros (Activo, Inactivo, En vacaciones)
- 🏢 Organización por departamentos y roles

### 📊 **Visualización de Datos Avanzada**
- 🥧 Gráficos interactivos con Chart.js
- 📈 Estadísticas en tiempo real de proyectos y equipo
- 🎨 Barras de progreso animadas
- 📱 Diseño responsive y adaptativo
- 📋 Dashboard de asignaciones proyecto-miembro
- 🏆 Sistema de puntuación de productividad

### 🛠️ **Herramientas Integradas**
- ⏰ Reloj en tiempo real
- 📊 Calculadora de productividad mejorada
- 🔔 Sistema de notificaciones toast
- 💾 Persistencia automática de datos
- 📤 Exportación/importación de datos

### 🎨 **Experiencia de Usuario**
- ✨ Efectos glassmorphism modernos
- 🎭 Animaciones suaves y naturales
- 📱 Completamente responsive
- ♿ Accesibilidad web integrada
- 🚀 Navegación por secciones (Proyectos, Equipo, Asignaciones)

## 🌐 Demo

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/dashboard-proyectos.git

# Navega al directorio
cd dashboard-proyectos

# Abre index.html en tu navegador favorito
open index.html
```

**🔗 [Ver Demo en Vivo](https://tu-usuario.github.io/dashboard-proyectos)**

## 🚀 Instalación

### Requisitos Previos
- Navegador web moderno (Chrome 80+, Firefox 75+, Safari 13+)
- Conexión a internet (para CDN de librerías externas)

### Instalación Rápida

1. **Descarga los archivos:**
   ```bash
   git clone https://github.com/tu-usuario/dashboard-proyectos.git
   cd dashboard-proyectos
   ```

2. **Estructura de archivos:**
   ```
   dashboard-proyectos/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── README.md
   ```

3. **Ejecutar:**
   - Abre `index.html` en tu navegador
   - ¡Listo! El dashboard está funcionando

### Instalación para Desarrollo

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/dashboard-proyectos.git

# Navega al directorio
cd dashboard-proyectos

# Opcional: Usar un servidor local
python -m http.server 8000
# o
npx serve .
```

## 📖 Uso

### Gestión de Proyectos

#### ➕ **Crear Nuevo Proyecto**
1. Completa el formulario "Crear Nuevo Proyecto"
2. Ingresa nombre (3-100 caracteres)
3. Añade descripción detallada (10-500 caracteres)
4. Selecciona prioridad (Alta/Media/Baja)
5. Haz clic en "Crear Proyecto"

#### 📊 **Actualizar Progreso**
```javascript
// Los proyectos se actualizan automáticamente:
// 0-19%: Planificación
// 20-79%: En desarrollo
// 80-99%: Testing
// 100%: Completado
```

#### 🗑️ **Eliminar Proyecto**
- Haz clic en el botón "Eliminar" del proyecto
- Confirma la acción en el diálogo

### Calculadora de Productividad

1. Ingresa horas trabajadas en el día
2. Añade número de tareas completadas
3. Haz clic en "Calcular Productividad"
4. Obtén tu puntuación y recomendaciones

### Interpretación de Estadísticas

- **Proyectos Totales**: Total de proyectos creados
- **Miembros del Equipo**: Total de miembros registrados  
- **Puntuación de Productividad**: Métrica calculada basada en progreso, miembros activos y distribución de carga
- **Tasa de Finalización**: Promedio de progreso de todos los proyectos

## 👥 Gestión de Miembros del Equipo

### ➕ **Agregar Nuevo Miembro**

1. Haz clic en **"Miembros de Equipo"** en el header o navega a la sección "Equipo"
2. Pulsa **"Agregar Miembro"**
3. Completa el formulario:
   - **Información básica**: Nombre, email, teléfono
   - **Rol profesional**: Developer, Designer, Manager, Analyst, Tester
   - **Departamento**: IT, Marketing, Sales, HR, Finance
   - **Estado**: Activo, Inactivo, En vacaciones
   - **Habilidades**: Lista separada por comas
   - **Ubicación**: Ciudad, país
4. Haz clic en **"Agregar Miembro"**

### ✏️ **Editar Miembro Existente**

1. Localiza el miembro en la vista de equipo
2. Haz clic en el icono **✏️ Editar**
3. Modifica los campos necesarios
4. Confirma con **"Actualizar Miembro"**

### 🗑️ **Eliminar Miembro**

1. Localiza el miembro en la lista
2. Haz clic en el icono **🗑️ Eliminar**
3. Confirma la acción (se removerá de todos los proyectos)

### 🔍 **Búsqueda y Filtros**

- **Búsqueda en tiempo real**: Busca por nombre, email o habilidades
- **Filtro por rol**: Filtra por Developer, Designer, Manager, etc.
- **Filtro por departamento**: Filtra por IT, Marketing, Sales, etc.
- **Estado**: Visualiza el estado actual (activo, inactivo, vacaciones)

### 🎯 **Asignación a Proyectos**

#### Desde la Vista de Equipo:
1. Haz clic en **🎯 Ver proyectos** del miembro
2. Visualiza proyectos actuales asignados

#### Desde la Vista de Asignaciones:
1. Navega a la sección **"Asignaciones"**
2. Selecciona un proyecto
3. Haz clic en **"Asignar Miembro"**
4. Selecciona el miembro disponible
5. Confirma la asignación

#### Remover Asignaciones:
1. En la vista de asignaciones
2. Haz clic en **❌** junto al miembro asignado
3. Confirma la remoción

### 📊 **Visualización de Datos del Equipo**

#### Estadísticas Rápidas:
- **Desarrolladores**: Cantidad de developers
- **Diseñadores**: Cantidad de designers  
- **Managers**: Cantidad de managers
- **Departamentos**: Número de departamentos únicos

#### Gráficos Interactivos:
- **Distribución por Roles**: Gráfico de dona mostrando proporción de roles
- **Distribución por Departamentos**: Gráfico de barras por departamento

### 💡 **Consejos de Uso**

- **Emails únicos**: Cada miembro debe tener un email único
- **Habilidades detalladas**: Agregar habilidades específicas facilita la búsqueda
- **Estados actualizados**: Mantener estados actualizados para métricas precisas
- **Asignaciones balanceadas**: Distribuir proyectos equitativamente entre miembros

## 📁 Estructura del Proyecto

```
dashboard-proyectos/
│
├── 📄 dashboard.html           # Estructura HTML principal del dashboard
├── 🎨 styles.css               # Estilos y diseño visual completo
├── ⚡ script.js                # Lógica de aplicación con todos los módulos
├── 📖 README.md                # Documentación completa
└── 🧪 test.html                # Página de pruebas (opcional)
```

### Arquitectura del Código JavaScript

```javascript
// Configuración Global
CONFIG = {
  NOTIFICATION_DURATION: 4000,
  ANIMATION_DURATION: 600,
  CHART_COLORS: [...],
  PRODUCTIVITY_THRESHOLDS: {...}
}

// Módulos Principales
├── Utils                      # Utilidades generales
├── NotificationSystem         # Sistema de notificaciones
├── TimeManager               # Gestión de tiempo
├── ProjectManager            # CRUD de proyectos
├── TeamMemberManager         # CRUD de miembros del equipo
├── AssignmentManager         # Gestión de asignaciones
├── GlobalStatsManager        # Estadísticas globales
├── ChartManager              # Gráficos y visualización
├── ProductivityCalculator    # Cálculos de productividad
├── FormManager               # Validación de formularios
└── VisualEffects            # Animaciones y efectos
```

## 🛠️ Tecnologías

### Frontend Core
- **HTML5**: Estructura semántica moderna
- **CSS3**: Flexbox, Grid, Animaciones, Variables CSS
- **JavaScript ES6+**: Módulos, Arrow Functions, Destructuring

### Librerías Externas
- **[Chart.js 4.4.0](https://www.chartjs.org/)**: Gráficos interactivos
- **[Font Awesome 6.5.1](https://fontawesome.com/)**: Iconografía profesional

### Características Técnicas
- **Responsive Design**: Mobile-first approach
- **Glassmorphism**: Efectos visuales modernos
- **Progressive Enhancement**: Funciona sin JavaScript
- **Accessibility**: ARIA labels y navegación por teclado

## 🔧 Funcionalidades

### Core Features

| Funcionalidad | Descripción | Estado |
|---------------|-------------|---------|
| 📝 CRUD Proyectos | Crear, leer, actualizar, eliminar | ✅ Completo |
| 👥 CRUD Miembros | Gestión completa de equipo | ✅ Completo |
| 🔍 Búsqueda/Filtros | Búsqueda en tiempo real y filtros avanzados | ✅ Completo |
| 🎯 Asignaciones | Sistema bidireccional proyecto-miembro | ✅ Completo |
| 📊 Gráficos | Visualización con Chart.js | ✅ Completo |
| 📈 Estadísticas | Métricas en tiempo real | ✅ Completo |
| 🔔 Notificaciones | Sistema toast no intrusivo | ✅ Completo |
| ⏰ Reloj | Tiempo actual actualizado | ✅ Completo |
| 📊 Productividad | Calculadora con métricas mejoradas | ✅ Completo |
| 📱 Responsive | Adaptable a todos los dispositivos | ✅ Completo |
| ♿ Accesibilidad | WCAG 2.1 AA compliance | ✅ Completo |
| 💾 Persistencia | Almacenamiento automático LocalStorage | ✅ Completo |

### Funcionalidades Avanzadas

#### 🎨 **Sistema de Temas**
```css
/* Modo oscuro automático */
@media (prefers-color-scheme: dark) {
  /* Estilos para tema oscuro */
}
```

#### 🔄 **Persistencia de Datos**
```javascript
// Preparado para integración con:
// - LocalStorage
// - IndexedDB
// - APIs REST
// - Firebase
```

#### 📊 **Analytics Integrado**
```javascript
// Sistema de métricas interno
window.DashboardDebug = {
  state, ProjectManager, ChartManager, 
  NotificationSystem, Utils
};
```

## 🎛️ API y Módulos

### ProjectManager API

```javascript
// Crear proyecto
ProjectManager.create({
  name: "Mi Proyecto",
  description: "Descripción detallada",
  priority: "alta"
});

// Actualizar progreso
ProjectManager.updateProgress(projectId, +10);

// Eliminar proyecto
ProjectManager.delete(projectId);

// Renderizar vista
ProjectManager.render();
```

### TeamMemberManager API

```javascript
// Crear miembro del equipo
TeamMemberManager.create({
  name: "Ana García",
  email: "ana@empresa.com",
  role: "Developer",
  department: "IT",
  status: "active",
  skills: "JavaScript, React, Node.js",
  location: "Ciudad de México"
});

// Actualizar miembro
TeamMemberManager.update(memberId, {
  name: "Ana García López",
  status: "vacation"
});

// Eliminar miembro
TeamMemberManager.delete(memberId);

// Asignar a proyecto
TeamMemberManager.assignToProject(memberId, projectId);

// Remover de proyecto
TeamMemberManager.removeFromProject(memberId, projectId);

// Renderizar vista
TeamMemberManager.render();

// Actualizar estadísticas
TeamMemberManager.updateStats();
```

### AssignmentManager API

```javascript
// Renderizar asignaciones
AssignmentManager.render();

// Asignar miembro a proyecto
AssignmentManager.assignMemberToProject(memberId, projectId);

// Remover asignación
AssignmentManager.removeMemberFromProject(memberId, projectId);
```

### GlobalStatsManager API

```javascript
// Actualizar estadísticas globales
GlobalStatsManager.updateStats();

// Calcular puntuación de productividad
GlobalStatsManager.calculateProductivityScore();
```

### NotificationSystem API

```javascript
// Tipos de notificación
NotificationSystem.success("¡Proyecto creado!");
NotificationSystem.error("Error al guardar");
NotificationSystem.warning("Advertencia importante");
NotificationSystem.info("Información adicional");
```

### Utils API

```javascript
// Utilidades disponibles
Utils.generateId()                    // ID único
Utils.formatDate(new Date())          // Fecha formateada
Utils.validateInput(value, min, max)  // Validación
Utils.debounce(func, delay)          // Optimización
Utils.sanitizeHTML(string)           // Seguridad
```

## 🎨 Personalización

### Colores y Temas

```css
/* Variables CSS personalizables */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #4CAF50;
  --error-color: #f44336;
  --warning-color: #ff9800;
}
```

### Configuración JavaScript

```javascript
// Personalizar configuración
const CONFIG = {
  NOTIFICATION_DURATION: 5000,        // Duración notificaciones
  ANIMATION_DURATION: 800,            // Velocidad animaciones
  CHART_COLORS: ['#custom1', '#custom2'], // Colores gráficos
  PRODUCTIVITY_THRESHOLDS: {          // Umbrales productividad
    EXCELLENT: 10,
    GOOD: 7,
    AVERAGE: 5
  }
};
```

### Añadir Nuevos Módulos

```javascript
// Plantilla para nuevo módulo
const NuevoModulo = {
  init: () => {
    console.log('🚀 Nuevo módulo inicializado');
  },
  
  metodoPublico: () => {
    // Tu lógica aquí
  }
};

// Integrar en App.init()
App.init = () => {
  // ... código existente
  NuevoModulo.init();
};
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Sigue estos pasos:

### 1. Fork del Proyecto
```bash
git clone https://github.com/tu-usuario/dashboard-proyectos.git
cd dashboard-proyectos
```

### 2. Crear Rama de Feature
```bash
git checkout -b feature/nueva-funcionalidad
```

### 3. Realizar Cambios
- Sigue las convenciones de código existentes
- Añade comentarios descriptivos
- Mantén la estructura modular

### 4. Testing
```bash
# Verifica que todo funcione correctamente
# Prueba en diferentes navegadores
# Valida responsive design
```

### 5. Commit y Push
```bash
git add .
git commit -m "✨ Añadir nueva funcionalidad increíble"
git push origin feature/nueva-funcionalidad
```

### 6. Pull Request
- Describe los cambios realizados
- Incluye capturas de pantalla si aplica
- Menciona issues relacionados

### Guías de Contribución

#### 📝 **Convenciones de Código**
- **JavaScript**: camelCase para variables y funciones
- **CSS**: kebab-case para clases
- **HTML**: Semántico y accesible
- **Comentarios**: Descriptivos y útiles

#### 🎯 **Áreas de Mejora**
- [ ] Integración con APIs externas
- [ ] Modo offline con Service Workers
- [ ] Exportación de datos (PDF, Excel)
- [ ] Sistema de usuarios y autenticación
- [ ] Notificaciones push
- [ ] Drag & drop para proyectos
- [ ] Temas personalizables
- [ ] Integración con calendarios

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

```
MIT License

Copyright (c) 2024 Tu Nombre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

## 🙏 Agradecimientos

- **Chart.js Team**: Por la excelente librería de gráficos
- **Font Awesome**: Por los iconos profesionales
- **Comunidad Open Source**: Por la inspiración y recursos
- **MDN Web Docs**: Por la documentación excepcional



<div align="center">

**⭐ Si este proyecto te resulta útil, ¡considera darle una estrella! ⭐**

[⬆ Volver al inicio](#-dashboard-de-gestión-de-proyectos)

</div>
