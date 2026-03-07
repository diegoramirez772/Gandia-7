/**
 * generate-structure.js
 * Ejecuta desde la raíz de tu proyecto: node generate-structure.js
 * Genera: project-structure.md
 */

const fs   = require('fs')
const path = require('path')

const IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
  '.turbo', '.cache', 'out', '.expo', 'android', 'ios',
])

const EXT_ICONS = {
  '.tsx': '⚛️ ', '.ts': '🔷', '.jsx': '⚛️ ', '.js': '🟨',
  '.css': '🎨', '.scss': '🎨', '.json': '📋', '.md': '📝',
  '.env': '🔐', '.svg': '🖼️ ', '.png': '🖼️ ', '.jpg': '🖼️ ',
}

function getIcon(file) {
  const ext = path.extname(file)
  return EXT_ICONS[ext] || '📄'
}

function walk(dir, prefix = '', lines = [], depth = 0) {
  if (depth > 6) return lines

  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return lines
  }

  // Carpetas primero, luego archivos
  const sorted = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
    return a.name.localeCompare(b.name)
  })

  sorted.forEach((entry, i) => {
    if (IGNORE.has(entry.name) || entry.name.startsWith('.')) return

    const isLast      = i === sorted.length - 1
    const connector   = isLast ? '└── ' : '├── '
    const newPrefix   = prefix + (isLast ? '    ' : '│   ')

    if (entry.isDirectory()) {
      lines.push(`${prefix}${connector}📁 **${entry.name}/**`)
      walk(path.join(dir, entry.name), newPrefix, lines, depth + 1)
    } else {
      const icon = getIcon(entry.name)
      const size = getSize(path.join(dir, entry.name))
      lines.push(`${prefix}${connector}${icon} ${entry.name} ${size}`)
    }
  })

  return lines
}

function getSize(filePath) {
  try {
    const bytes = fs.statSync(filePath).size
    if (bytes < 1024)       return `_(${bytes}B)_`
    if (bytes < 1024 * 100) return `_(${(bytes/1024).toFixed(1)}KB)_`
    return `_(**${(bytes/1024).toFixed(0)}KB**)_`
  } catch {
    return ''
  }
}

function countFiles(dir, counts = { files: 0, components: 0, pages: 0 }) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return counts }

  for (const e of entries) {
    if (IGNORE.has(e.name) || e.name.startsWith('.')) continue
    if (e.isDirectory()) {
      countFiles(path.join(dir, e.name), counts)
    } else {
      counts.files++
      const ext = path.extname(e.name)
      if (['.tsx', '.jsx'].includes(ext)) {
        if (e.name.toLowerCase().includes('page') || dir.toLowerCase().includes('pages')) counts.pages++
        else counts.components++
      }
    }
  }
  return counts
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

const root    = process.cwd()
const pkg     = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const counts  = countFiles(root)
const lines   = walk(root)
const now     = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })

const doc = `# 📁 Estructura del Proyecto — ${pkg.name || 'Proyecto'}

> Generado: ${now}
> Versión: \`${pkg.version || '—'}\` · Framework: \`${
  pkg.dependencies?.next ? 'Next.js' :
  pkg.dependencies?.['react-scripts'] ? 'CRA' :
  pkg.devDependencies?.vite || pkg.dependencies?.vite ? 'Vite + React' :
  'React'
}\`

## 📊 Resumen

| Métrica | Valor |
|---|---|
| Total archivos | ${counts.files} |
| Componentes (.tsx/.jsx) | ${counts.components} |
| Páginas | ${counts.pages} |
| Dependencias | ${Object.keys(pkg.dependencies || {}).length} |
| Dev dependencies | ${Object.keys(pkg.devDependencies || {}).length} |

## 🔑 Dependencias principales

${Object.keys(pkg.dependencies || {}).map(d => `- \`${d}\` ${pkg.dependencies[d]}`).join('\n')}

## 🛠️ Scripts disponibles

${Object.entries(pkg.scripts || {}).map(([k, v]) => `- \`npm run ${k}\` → \`${v}\``).join('\n')}

## 🗂️ Árbol de archivos

\`\`\`
${pkg.name || path.basename(root)}/
${lines.join('\n')}
\`\`\`

---
_Generado por generate-structure.js_
`

const outPath = path.join(root, 'project-structure.md')
fs.writeFileSync(outPath, doc, 'utf8')
console.log(`\n✅  Estructura generada en: project-structure.md`)
console.log(`📦  ${counts.files} archivos · ${counts.components} componentes · ${counts.pages} páginas\n`)