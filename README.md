# 🚀 MKdownSEO (Audit Pro v1.1.0)

**MKdownSEO** es una extensión de navegador de alto rendimiento diseñada para consultores SEO, analistas de UX y desarrolladores que necesitan transformar la complejidad de una página web en reportes estratégicos estructurados en Markdown.

Desarrollado bajo el estándar de excelencia **jaguardluz 2026**, esta herramienta permite realizar auditorías profundas, extrayendo metadatos dinámicos, firmas tecnológicas, jerarquías semánticas y catálogos de enlazado contextual, incluso en aplicaciones modernas que utilizan **Shadow DOM**.

---

## 👨‍💻 Créditos y Colaboración

*   **Creador:** Daniel Ramirez
*   **Asistencia de IA:** Desarrollado y optimizado en colaboración con el modelo de lenguaje **Gemini** (Google AI).
*   **Orquestación:** Implementado mediante la herramienta **Gemini CLI**, siguiendo flujos de trabajo de ingeniería avanzada y protocolos de diseño automatizado.

---

## ✨ Características Principales

### 🔍 Extracción Profunda y Resiliente

- **Shadow DOM Traversal:** Algoritmo recursivo capaz de penetrar en Shadow Roots abiertos para capturar contenido oculto a los selectores estándar.
- **Auditoría de Meta Data:** Captura en tiempo real de Títulos, Descripciones, Canonical, Robots, Open Graph y Twitter Cards.
- **Schema.org Detection:** Extracción segura y parseo de bloques `application/ld+json` para validación de datos estructurados.

### 🛠️ Inteligencia de Negocio

- **Tech Stack Profiler:** Identificación automática de CMS (WordPress, Webflow), Ecommerce (Shopify, Magento), Frameworks (React, Next.js) y herramientas de analítica.
- **Body Links Catalog:** Generación automática de una tabla catálogo con todos los enlaces contextuales del cuerpo de la página, discriminando inteligentemente el ruido del header y footer.

### 📝 Salida de Alta Calidad

- **Markdown Estratégico:** Reportes listos para ser consumidos por modelos de lenguaje (LLMs) o para ser incluidos en documentación técnica de auditoría.
- **Variantes de Contenido:** Soporte para contenido semántico, Markdown puro, texto plano y estructura HTML limpia.

---

## 📂 Estructura del Proyecto

```text
MKdownSEO/
├── algoritmos/          # Documentación técnica de la lógica core (Pseudocódigos y Diagramas)
├── MKdownSEO/           # Código fuente de la extensión (Manifest V3)
│   ├── lib/             # Librerías de transformación (Turndown, Generator)
│   ├── popup/           # Interfaz de usuario
│   ├── scripts/         # Content Scripts y Service Workers
│   └── tests/           # Suite de pruebas con Jest
├── GEMINI.md            # Instrucciones de contexto para agentes de IA
└── package.json         # Configuración de entorno y dependencias de test
```

---

## 🚀 Instalación y Uso

### 1. Preparación del Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/danroncallo/MKdownSEOUX.git
    ```
2.  **Entrar al directorio:**
    ```bash
    cd MKdownSEOUX
    ```

### 2. Instalación en el Navegador (Chrome, Brave, Edge)

Para usar la extensión mientras está en desarrollo, debes cargarla como una "Extensión sin empaquetar":

1.  **Abrir el gestor de extensiones:** 
    - En **Chrome**: Escribe `chrome://extensions/` en la barra de direcciones.
    - En **Brave**: Escribe `brave://extensions/`.
    - En **Edge**: Escribe `edge://extensions/`.
2.  **Activar el "Modo de desarrollador":** Localiza el interruptor en la esquina superior derecha y asegúrate de que esté encendido.
3.  **Cargar la extensión:** 
    - Haz clic en el botón **"Cargar extensión sin empaquetar"** (Load unpacked).
    - En la ventana emergente, navega hasta la carpeta del proyecto y selecciona **específicamente la carpeta llamada `MKdownSEO/`** (la que contiene el archivo `manifest.json`).
4.  **Verificación:** Deberías ver el icono de **MKdownSEO** aparecer en tu lista de extensiones.

### 3. Guía de Uso Rápido

Una vez instalada, sigue estos pasos para realizar tu primera auditoría:

1.  **Fijar la extensión (Opcional):** Haz clic en el icono del rompecabezas (Extensiones) en tu navegador y "fija" (pin) a MKdownSEO para tener acceso rápido.
2.  **Navegar:** Ve al sitio web que deseas analizar.
3.  **Configurar:** Haz clic en el icono de la extensión para abrir el popup.
4.  **Seleccionar:** Marca los componentes que necesites (ej. *Meta Data*, *Headings*, o el nuevo *Enlaces del Body*).
5.  **Extraer:** Pulsa el botón **"Generar Markdown"**.
6.  **Acción Final:** 
    - Usa **"Copiar Texto"** para pegarlo directamente en ChatGPT, Claude o tu herramienta de documentación.
    - Usa **"Descargar .md"** para guardar el reporte técnico en tu equipo.

---

## 🧪 Calidad y Pruebas

El proyecto utiliza **Jest** y **JSDOM** para garantizar la integridad de los algoritmos de extracción.

- Ejecutar pruebas: `npm install && npm run test`

---

## 🛡️ Licencia y Firma
Este proyecto se distribuye bajo la **Licencia MIT**. Esto garantiza que el software es de código abierto y permite su uso, modificación y distribución gratuita, siempre que se mantenga el aviso de copyright y la autorización de la licencia original. 

Para más detalles, consulta el archivo [LICENSE](./LICENSE) en la raíz de este repositorio.

**Firma de Marca:** jaguardluz 2026.

---
*Desarrollado con pasión por Daniel Ramirez y potenciado por la inteligencia artificial de Gemini.*
