import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import compression from "vite-plugin-compression"

// https://vitejs.dev/config/
export default defineConfig({
  server: {},
  plugins: [
    react(),
    compression({
      ext: ".gz"
    })
  ],
  resolve: {
    alias: [
      // 配置 @ 指代 src
      {
        find: "@",
        replacement: resolve(__dirname, "./src")
      },
      {
        find: "@public",
        replacement: resolve(__dirname, "./src/assets")
      }
    ]
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
