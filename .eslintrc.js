module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  globals: {
    __static: true
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-async-promise-executor': 0,
    // "no-new": 0,
    // "no-trailing-spaces": 0,
    // "comma-dangle": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
