# 💒 Boda Dani & Ana - Versión React

Esta es la versión React de la página web de boda de Dani y Ana, duplicada desde la versión HTML original.

## ✨ Características

- **🔐 Sistema de Login**: Autenticación con usuarios predefinidos
- **⏰ Countdown en Tiempo Real**: Cuenta atrás hasta la fecha de la boda (8 de Agosto 2026)
- **🖼️ Fondo Rotativo**: Imágenes que cambian automáticamente cada 8 segundos
- **📱 Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **🎨 Diseño Moderno**: Glassmorphism, animaciones suaves y efectos visuales
- **🧭 Navegación Intuitiva**: Menú hamburguesa móvil y navegación desktop
- **📋 Formulario RSVP**: Confirmación de asistencia interactiva
- **🖼️ Galería de Fotos**: Visor de imágenes con modal
- **📞 Página de Contacto**: Información de contacto y FAQs

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. **Navegar a la carpeta del proyecto React:**
```bash
cd "c:\Users\DanielGarcíaCarabelo\Downloads\pag web boda 2.0\html\webreact"
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm start
```

4. **Abrir el navegador:**
La aplicación se abrirá automáticamente en `http://localhost:3000`

### Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Crea la versión de producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de Create React App

## 🔑 Credenciales de Acceso

Utiliza cualquiera de estas credenciales para acceder:

| Usuario | Contraseña |
|---------|------------|
| `invitadoespecial` | `bodaana&dani` |
| `familia` | `noscasamos` |
| `amigos` | `fiesta2025` |
| `admin` | `admin_2026` |
| `dani` | `ana123` |
| `ana` | `dani123` |

## 📁 Estructura del Proyecto

```
webreact/
├── public/
│   ├── index.html           # HTML principal
│   ├── manifest.json        # Manifiesto PWA
│   └── images/             # Imágenes copiadas de la web original
├── src/
│   ├── components/         # Componentes React
│   │   ├── Login.js        # Componente de login
│   │   ├── MainLayout.js   # Layout principal con navegación
│   │   ├── HomeComponent.js # Página de inicio con countdown
│   │   ├── Story.js        # Historia de la pareja
│   │   ├── EventDetails.js # Detalles del evento
│   │   ├── Gallery.js      # Galería de fotos
│   │   ├── RSVP.js         # Formulario de confirmación
│   │   ├── Contact.js      # Página de contacto
│   │   └── *.css          # Estilos de cada componente
│   ├── data/
│   │   └── users.json      # Base de datos de usuarios
│   ├── styles/
│   │   ├── index.css       # Estilos globales
│   │   └── App.css         # Estilos específicos de la app
│   ├── App.js              # Componente principal
│   └── index.js            # Punto de entrada
├── package.json            # Dependencias y scripts
└── README.md              # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca principal de UI
- **React Router DOM** - Navegación entre páginas
- **CSS3** - Estilos con variables CSS y flexbox/grid
- **Font Awesome** - Iconos
- **Google Fonts** - Tipografías (Playfair Display, Montserrat, Great Vibes)

## 🔧 Características Técnicas

### Autenticación
- Sistema de login con localStorage
- Usuarios predefinidos en JSON
- Protección de rutas privadas
- Logout funcional

### UI/UX
- **Animaciones CSS**: Fade-in, slide-in, hover effects
- **Glassmorphism**: Efectos de vidrio en login y elementos
- **Responsive Design**: Mobile-first approach
- **Loading States**: Spinners y estados de carga
- **Confetti Effect**: Animación de celebración en login exitoso

### Funcionalidades
- **Countdown Timer**: Actualización en tiempo real hasta la fecha de boda
- **Image Carousel**: Fondo que rota entre 5 imágenes automáticamente
- **Form Handling**: Manejo de formularios con validación
- **Modal Gallery**: Visor de imágenes con overlay
- **Smooth Scrolling**: Navegación suave entre secciones

## 📱 Responsive Design

- **Desktop**: Navegación horizontal, layout de 2-3 columnas
- **Tablet**: Adaptación de grid, menú hamburguesa opcional
- **Mobile**: Menú hamburguesa, layout de 1 columna, botones táctiles

## 🎯 Páginas Incluidas

1. **🏠 Inicio**: Countdown, imagen rotativa, información rápida
2. **💕 Nuestra Historia**: Timeline con hitos importantes
3. **📅 Detalles del Evento**: Programa, lugar, dress code
4. **🖼️ Galería**: Fotos de la pareja con modal viewer
5. **💌 Confirmar Asistencia**: Formulario RSVP completo
6. **📞 Contacto**: Información de contacto y FAQs

## 🔄 Diferencias con la Versión Original

### ✅ Mantenido
- Todos los estilos y colores originales
- Sistema de login idéntico
- Countdown funcional
- Fondo rotativo
- Responsive design

### 🆕 Mejorado
- **Navegación moderna** con React Router
- **Estado de aplicación** gestionado con hooks
- **Componentes reutilizables** y modulares
- **Mejor performance** con Virtual DOM
- **Hot reload** para desarrollo rápido

## 🚀 Despliegue

Para crear una versión de producción:

```bash
npm run build
```

Esto generará una carpeta `build/` con los archivos optimizados para producción.

## 🤝 Comparación con Versión Original

| Característica | HTML Original | React Version |
|----------------|---------------|---------------|
| Login | ✅ Funcional | ✅ Mejorado |
| Countdown | ✅ JavaScript vanilla | ✅ React hooks |
| Navegación | ✅ SPA básico | ✅ React Router |
| Responsive | ✅ CSS puro | ✅ CSS + React |
| Performance | ⚠️ Carga completa | ✅ Lazy loading |
| Mantenimiento | ⚠️ Monolítico | ✅ Modular |
| Escalabilidad | ⚠️ Limitada | ✅ Excelente |

## 📝 Próximas Mejoras

- [ ] PWA completa con service worker
- [ ] Backend real para RSVP
- [ ] Base de datos para usuarios
- [ ] Envío de emails automático
- [ ] Integración con redes sociales
- [ ] Tests unitarios
- [ ] Optimización de imágenes
- [ ] Modo offline

## 💝 Créditos

Desarrollado con 💕 para la boda de Dani y Ana - 29 de Agosto, 2026

---

*¡Esperamos que disfrutes de esta nueva versión React de nuestra página de boda!* 🎉
