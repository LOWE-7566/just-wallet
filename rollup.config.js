// rollup.config.js
const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const uglify = require('rollup-plugin-uglify-es');

module.exports = [
  {
    input: './index.ts', // Adjust the input file as needed
    output: {
      file: 'lib/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true, // Enable source maps
    },
    plugins: [
      typescript(), // Use @rollup/plugin-typescript
      resolve({ preferBuiltins: false}),
      commonjs(),
      uglify()
    ],
  },
  {
    input: './index.ts', // Same input file for ESM
    output: {
      file: 'lib/bundle.esm.js',
      format: 'esm',
      sourcemap: true, // Enable source maps
    },
    plugins: [
      typescript(), // Use @rollup/plugin-typescript
      resolve({preferBuiltins: false}),
      commonjs(),
      uglify()
    ],
  },
];
