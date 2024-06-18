# Arquitectura del proyecto

<table border>
<tr>
<td>
Para favorecer el desarrollo, mantenimiento y escalabilidad del proyecto, esta aplicación emplea una arquitectura modular y está diseñada para funcionar tanto en un entorno de navegador como en una versión de escritorio utilizando Electron.
</td>
</tr>
</table>

## Estructura de directorios

A continuación se describen algunos aspectos clave de esta arquitectura como la estructura del proyecto y qué significa cáda directorio enfocándonos únicamente en el primer y segundo nivel de jerarquía:

```bash
.
├── 📂 browser/             # Código fuente para la app en el navegador (Cartilla y juegos)
│   ├── 📁 fonts/           # Fuentes tipográficas para la aplicación
│   ├── 📁 images/          # Imágenes de la aplicación
│   ├── 📁 lib/             # Configuraciones y archivos necesarios de bibliotectas
│   ├── 📁 scripts/         # Lógica en JavaScript para la interación
│   ├── 🖼️ favicon.ico      # Icono de la aplicación
│   └── 📕 index.html       # Página HTML principal para la interfaz del navegador
│
├── 📂 desktop/             # Código fuente para la ventana de escritorio (Panel administrativo)
│   ├── 📁 scripts/         # Lógica en JavaScript para la interación
│   ├── 📁 styles/          # Estilos CSS para la aplicación de escritorio
│   └── 📕 index.html       # Página HTML principal para la versión de escritorio
│
├── 📂 doc/                 # Documentación del proyecto
│   ├── 📁 assets/          # Archivos necesarios como imágenes, documentos, videos, etc.
│   ├── 📖 about.md         # Información detallada acerca del proyecto
│   └── 📖 architecture.md  # Información sobre la arquitectura del software
│
├── 📂 node_modules/        # Módulos y paquetes instalados por npm
│
├── 📂 src/                 # Código fuente de la lógica del servidor
│   ├── 📁 controllers/     # Controladores para el proceso de datos
│   ├── 📁 models/          # Modelos para la base de datos
│   ├── 📁 routes/          # Rutas para dirigir los procesos
│   ├── 📁 lib/             # Configuraciones y archivos necesarios de bibliotectas
│   ├── 📁 utils/           # Utilidades y archivos JavaScript esenciales
│   ├── 📜 app.js           # Archivo principal de la aplicación
│   ├── 📜 constants.js     # Constantes globales para la aplicación
│   └── 📜 server.js        # Configuración del servidor Node.js
│
├── ⚙️ .gitignore           # Archivo para ignorar ciertos archivos en Git
├── ⚙️ electron-builder.yml # Configuración para empaquetar con Electron
├── 📄 LICENSE              # Licencia de la aplicación (MIT)
├── 📜 main.js              # Punto de entrada principal de la aplicación
├── ⚙️ nodemon.json         # Configuración para nodemon (para desarrolladores)
├── 📄 package-lock.json    # Archivo de bloqueo de dependencias
├── ⚙️ package.json         # Configuración del proyecto y dependencias
└── 📖 README.md            # Documentación principal del proyecto
```

Esta estructura modular garantiza que cada directorio y archivo tenga una función específica dentro del proyecto.

## Detalles adicionales

- **Uso de ESModules:**
  Este proyecto está configurado para aprovechar [ESModules](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules), permitiendo así utilizar las características modernas de JavaScript para organizar y modularizar el código de manera eficiente.

- **Enfoques de programación en el entorno del navegador:**

  - **Programación funcional:** Utilizada como el patrón de diseño principal para la lógica e interacción en todos los entornos (navegador, escritorio y servidor).
  
  - **Programación orientada a objetos:** Implementada específicamente para juegos en HTML Canvas dentro del entorno del navegador.

  - **Programación oriendata a eventos:** Empleada para funcionalidades de Socket.IO, como conexiones, desconexiones, envío y recepción de mensajes en tiempo real. Además, gestiona los eventos de los botones de acción en la ventana de escritorio.
