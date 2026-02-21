import { defineConfig } from 'vite';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  
  // Plugins
  plugins: [
    // Legacy browser support with polyfills
    legacy({
      targets: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 Edge versions',
        '> 0.5%',
        'not dead'
      ],
      modernPolyfills: true,
      renderLegacyChunks: true,
      // Polyfills to include for legacy browsers
      polyfills: [
        'es.promise',
        'es.array.iterator',
        'es.object.assign',
        'es.array.from',
        'es.array.find',
        'es.array.find-index',
        'es.array.includes',
        'es.string.includes',
        'es.string.starts-with',
        'es.string.ends-with'
      ]
    }),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files larger than 10kb
      deleteOriginFile: false
    }),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    })
  ],
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    
    // JavaScript minification with terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false // Remove comments
      }
    },
    
    // CSS minification
    cssMinify: true,
    
    // Code splitting configuration
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Manual chunk splitting for vendor bundles
        manualChunks(id) {
          // Firebase vendor bundle
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // Other node_modules go to vendor bundle
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    
    // Enable tree-shaking
    treeshake: true
  },
  
  server: {
    port: 3000,
    open: true
  },
  
  // Enable compression
  preview: {
    port: 4173,
    // Compression will be handled by hosting provider (Firebase Hosting)
    // but we can enable it for local preview
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js'
  }
});
