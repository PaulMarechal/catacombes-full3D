const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;
import { defineConfig } from 'vite';
import path from 'path';
import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig({
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server: {
        host: true,
        open: !isCodeSandbox 
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true, 
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            plugins: [
                obfuscator({
                    compact: true,
                    controlFlowFlattening: true,
                    rotateStringArray: true,
                    stringArray: true,
                    stringArrayEncoding: ['rc4'],
                    stringArrayThreshold: 0.75,
                    deadCodeInjection: true,
                    selfDefending: true,
                    disableConsoleOutput: true
                })
            ]
        }
    }
});
