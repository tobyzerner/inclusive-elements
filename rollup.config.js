import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';

export default {
    input: 'src/index.ts',
    output: {
        file: pkg.main,
    },
    external: ['@floating-ui/dom', 'focus-trap', 'hello-goodbye', 'tabbable'],
    plugins: [
        nodeResolve({
            exportConditions: ['production'],
        }),
        typescript(),
        terser(),
        filesize(),
    ],
};
