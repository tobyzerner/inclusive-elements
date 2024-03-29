import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: 'inclusive-elements',
        },
        rollupOptions: {
            external: [
                '@floating-ui/dom',
                'focus-trap',
                'hello-goodbye',
                'tabbable',
            ],
            output: {
                preserveModules: true,
            },
        },
    },
});
