import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

const name = 'CRF';
const path = 'es/index';
const globals = {
  'react-dom': 'ReactDOM',
  'react': 'React',
  'prop-types': 'PropTypes'
};
const external = Object.keys(globals);
const env = process.env.NODE_ENV;

export default [
  {
    input: 'src/index.js',
    output: {
      file: path + '.js',
      format: 'es',
    },
    external: external,
    plugins: [
      postcss({
        extensions: ['.css'],
      }),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: false
      }),
      resolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
    ]
  }
];