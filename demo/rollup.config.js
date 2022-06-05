import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: __dirname + '/demo.ts',
    output: {
        file: __dirname + '/demo.js',
    },
    plugins: [
        nodeResolve({
            exportConditions: ['production'],
        }),
        typescript(),
        terser(),
    ],
};
