import { defineConfig } from 'vite-plus';

export default defineConfig({
    lint: {
        ignorePatterns: ['dist/**'],
        options: { typeAware: true, typeCheck: true },
    },
    fmt: {
        singleQuote: true,
        ignorePatterns: ['CHANGELOG.md'],
    },
    test: {
        environment: 'jsdom',
        restoreMocks: true,
    },
    pack: {
        platform: 'browser',
        deps: {
            alwaysBundle: ['tabbable', 'transition-kit'],
            onlyBundle: false,
        },
    },
});
