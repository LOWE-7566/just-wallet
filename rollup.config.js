// rollup.config.js
const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const uglify = require('rollup-plugin-uglify-es');
const {dts} = require("rollup-plugin-dts");

module.exports = [
  {
    input: './index.ts', // Adjust the input file as needed
    output: {
      file: 'lib/bundle.cjs',
      format: 'cjs',
      sourcemap: true, // Enable source maps
    },
    plugins: [
      typescript(), // Use @rollup/plugin-typescript
      resolve({ preferBuiltins: false}),
      uglify(),
      commonjs()
    ],
  },
  {
    input: './index.ts', // Same input file for ESM
    output: {
      file: 'lib/bundle.mjs',
      format: 'esm',
      sourcemap: true, // Enable source maps
    },
    plugins: [
      typescript(), // Use @rollup/plugin-typescript
      resolve({preferBuiltins: false}),
      uglify(),
      commonjs()
    ],
  },

  
    {
    input: "./typings/index.d.ts",
    output: { file: "lib/types.d.ts", format: "esm", sourcemap: true },
      plugins: [
      
        typescript(), // Use @rollup/plugin-typescript
        dts(),
      resolve({preferBuiltins: false}),
      uglify(),
      commonjs()
      ],
  },
];
