import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

export default [{
  input: './Wallet.ts',
  output: {
    file:'./dist/bundle.js',
    format: 'cjs',
    name: 'main'
  },
  plugins: [typescript(), babel({babelHelpers : 'bundled'})]
},
{
  input: './Wallet.ts',
  output: {
    file:'./es6/bundle.js',
    format: 'es',
    name: 'main'
  },
  plugins: [typescript(), babel({babelHelpers : 'bundled'})]
}];
