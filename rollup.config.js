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
  plugins: [ nodeResolve(), typescript(), terser(), filesize() ]
};
