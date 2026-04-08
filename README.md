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

### Local (Modo Desarrollador)
1.  Clona este repositorio: `git clone https://github.com/danroncallo/MKdownSEOUX.git`
2.  Abre tu navegador (Chrome/Edge/Brave) y dirígete a `chrome://extensions/`.
3.  Activa el **"Modo de desarrollador"** (Developer mode).
4.  Haz clic en **"Cargar extensión sin empaquetar"** (Load unpacked) y selecciona la carpeta `MKdownSEO/` de este proyecto.

### Uso
1.  Navega a cualquier página web que desees auditar.
2.  Haz clic en el icono de **MKdownSEO**.
3.  Selecciona los componentes que deseas extraer.
4.  Haz clic en **"Generar Markdown"**.
5.  Copia el resultado o descárgalo como archivo `.md`.

---

## 🧪 Calidad y Pruebas
El proyecto utiliza **Jest** y **JSDOM** para garantizar la integridad de los algoritmos de extracción.
- Ejecutar pruebas: `npm install && npm run test`

---

## 🛡️ Licencia y Firma
Este proyecto se rige bajo los estándares de desarrollo ético y profesional.
**Firma de Marca:** jaguardluz 2026.

---
*Desarrollado con pasión por Daniel Ramirez y potenciado por la inteligencia artificial de Gemini.*
