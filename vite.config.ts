import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const isStaticBuild = process.env.STATIC_BUILD === 'true'

function inlineStaticAssets(): Plugin {
  return {
    name: 'inline-static-assets',
    apply: 'build',
    closeBundle() {
      if (!isStaticBuild) return
      const outDir = path.resolve(process.cwd(), 'static')
      const htmlPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(htmlPath)) return

      let html = fs.readFileSync(htmlPath, 'utf-8')

      const deletedFiles: string[] = []

      html = html.replace(
        /<link\s+rel="stylesheet"\s+[^>]*?href="([^"]+)"[^>]*>/g,
        (match, href) => {
          const cleanHref = (href as string).trim()
          const filePath = path.join(outDir, cleanHref.replace(/^\.\//, ''))
          if (fs.existsSync(filePath)) {
            const css = fs.readFileSync(filePath, 'utf-8')
            deletedFiles.push(filePath)
            return `<style>${css}</style>`
          }
          return match
        }
      )

      html = html.replace(
        /<script\s+type="module"[^>]*?src="([^"]+)"[^>]*><\/script>/g,
        (match, src) => {
          const cleanSrc = (src as string).trim()
          const filePath = path.join(outDir, cleanSrc.replace(/^\.\//, ''))
          if (fs.existsSync(filePath)) {
            const js = fs.readFileSync(filePath, 'utf-8')
            deletedFiles.push(filePath)
            return `<script type="module">${js}</script>`
          }
          return match
        }
      )

      fs.writeFileSync(htmlPath, html, 'utf-8')

      deletedFiles.forEach((f) => {
        try { fs.unlinkSync(f) } catch {}
      })

      try {
        const assetsDir = path.join(outDir, 'assets')
        const remaining = fs.readdirSync(assetsDir)
        if (remaining.length === 0) {
          fs.rmSync(assetsDir, { recursive: true, force: true })
        }
      } catch {}
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: isStaticBuild ? './' : '/nh-ai-platform/',
  build: {
    outDir: isStaticBuild ? 'static' : 'dist',
  },
  define: {
    'import.meta.env.VITE_STATIC_BUILD': JSON.stringify(isStaticBuild ? 'true' : 'false'),
  },
  plugins: [react(), tailwindcss(), inlineStaticAssets()],
})
