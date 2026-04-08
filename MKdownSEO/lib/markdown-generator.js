/**
 * MKdownSEO - Markdown Generator (jaguardluz 2026)
 * 
 * Modular class for converting extracted web data into a 
 * professional SEO audit report in Markdown format.
 */

class MarkdownGenerator {
  constructor(turndownService) {
    this.turndown = turndownService;
  }

  /**
   * Generates a complete Markdown report from extracted data.
   * @param {Object} data - The data object from the content script.
   * @param {string} url - The URL of the analyzed page.
   * @returns {string} - The final Markdown report.
   */
  generate(data, url) {
    let md = `# 🚀 Reporte Estratégico MKdownSEO (Audit Pro)\n`;
    md += `> **URL:** ${url}\n`;
    md += `> **Idioma (HTML):** ${data.metadata?.lang || 'N/A'}\n`;
    md += `> **Fecha de Análisis:** ${new Date().toLocaleString()}\n\n`;

    // 1. Meta Data Audit Section
    if (data.metadata) {
      md += this.generateMetadataSection(data.metadata);
    }

    // 2. Tech Stack Section
    if (data.tech) {
      md += this.generateTechSection(data.tech);
    }

    // 3. Heading Hierarchy Section
    if (data.headings && data.headings.length > 0) {
      md += `## 🏗️ Jerarquía de Encabezados (H1-H6)\n`;
      data.headings.forEach(h => {
        const level = parseInt(h.level);
        const indent = '  '.repeat(Math.max(0, level - 1));
        const hashes = '#'.repeat(Math.min(level, 6));
        md += `${indent}${hashes} H${level}: ${h.text}\n`;
      });
      md += `\n`;
    }

    // 3b. Page Header Section
    if (data.sections.header) {
        md += `## 🔝 Encabezado de Página (HEADER)\n`;
        md += `--- \n\n${data.sections.header}\n\n---\n\n`;
    }

    // 4. Navigation Map Section
    if (data.sections.nav && data.sections.nav.links && data.sections.nav.links.length > 0) {
      md += `## 🗺️ Mapa de Navegación (NAV)\n`;
      md += `| Texto de Enlace | URL Completa (Raw) |\n`;
      md += `| :--- | :--- |\n`;
      data.sections.nav.links.slice(0, 50).forEach(l => {
          md += `| ${l.text} | ${l.url} |\n`;
      });
      md += `\n`;
    }

    // 5. Body Variants Section
    if (data.sections.body) {
      md += `## 📝 Contenido Semántico con Etiquetas (BODY)\n`;
      md += `--- \n\n`;
      let bodyContent = data.sections.body;
      if (bodyContent.includes('[ARCHITECTURAL PARENT:')) {
        bodyContent = bodyContent.replace(/\[ARCHITECTURAL PARENT: (.*?)\]/, '### [SECTION: $1]');
      }
      md += `${bodyContent}\n\n---\n\n`;
    }

    if (data.sections.bodyMarkdown) {
        md += `## 📝 Contenido en Markdown Limpio (BODY)\n`;
        md += `--- \n\n${this.turndown.turndown(data.sections.bodyMarkdown)}\n\n---\n\n`;
    }

    if (data.sections.bodyText) {
        md += `## 📝 Contenido en Texto Plano (BODY)\n`;
        md += `--- \n\n${data.sections.bodyText}\n\n---\n\n`;
    }

    if (data.sections.bodyCleanHTML) {
        md += `## 🌐 Estructura HTML Limpia (BODY)\n`;
        md += `--- \n\n\`\`\`html\n${data.sections.bodyCleanHTML}\n\`\`\`\n\n---\n\n`;
    }

    // 5b. Body Links Catalog Section
    if (data.sections.bodyLinks && data.sections.bodyLinks.length > 0) {
      md += this.generateBodyLinksSection(data.sections.bodyLinks);
    }

    // 6. Footer Section
    if (data.sections.footer && data.sections.footer.links && data.sections.footer.links.length > 0) {
      md += `## 📜 Footer y Enlaces Raw\n`;
      md += `| Texto | URL |\n`;
      md += `| :--- | :--- |\n`;
      data.sections.footer.links.forEach(l => {
          md += `| ${l.text} | ${l.url} |\n`;
      });
      md += `\n`;
    }

    // 7. Structured Data Section
    if (data.schema && data.schema.length > 0) {
      md += `## 📊 Datos Estructurados (Schema.org)\n`;
      md += `\`\`\`json\n${JSON.stringify(data.schema, null, 2)}\n\`\`\`\n\n`;
    }

    md += `\n---\n*Generado con MKdownSEO por jaguardluz - 2026*`;
    return md;
  }

  generateBodyLinksSection(links) {
    let md = `## 🔗 Catálogo de Enlaces del Body (SEO Internal/External)\n`;
    md += `| Texto de Anclaje | URL Completa (Raw) |\n`;
    md += `| :--- | :--- |\n`;
    links.forEach(l => {
      md += `| ${l.text} | ${l.url} |\n`;
    });
    md += `\n`;
    return md;
  }

  generateMetadataSection(meta) {
    let md = `## 📋 Auditoría de Meta Data\n`;
    md += `| Campo | Valor | Elemento |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Title** | ${meta.title || 'N/A'} | \`<title>\` |\n`;
    md += `| **Description** | ${meta.description || 'N/A'} | \`meta:desc\` |\n`;
    md += `| **Robots** | ${meta.robots || 'N/A'} | \`meta:robots\` |\n`;
    md += `| **Canonical** | ${meta.canonical || 'N/A'} | \`link:canonical\` |\n`;
    if (meta.ogTitle) md += `| **OG:Title** | ${meta.ogTitle} | \`og:title\` |\n`;
    if (meta.twitterCard) md += `| **Twitter:Card** | ${meta.twitterCard} | \`twitter:card\` |\n`;
    md += `\n`;
    return md;
  }

  generateTechSection(tech) {
    let hasTech = false;
    let techMd = `## 🛠️ Stack Tecnológico\n`;
    const categories = {
        CMS: 'Sistemas de Gestión (CMS)',
        Ecommerce: 'Plataformas E-commerce',
        Frameworks: 'Frameworks y CSS',
        Analytics: 'Analítica y UX',
        Tools: 'Gestión de Etiquetas y Herramientas'
    };
    for (const [key, label] of Object.entries(categories)) {
        if (tech[key] && tech[key].length > 0) {
            hasTech = true;
            techMd += `### ${label}\n`;
            tech[key].forEach(t => techMd += `- ${t}\n`);
            techMd += `\n`;
        }
    }
    return hasTech ? techMd : '';
  }
}

// Export for global use in popup
window.MarkdownGenerator = MarkdownGenerator;
