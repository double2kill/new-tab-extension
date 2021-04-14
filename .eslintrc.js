module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'plugin:vue/vue3-recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'keyword-spacing': ['error', { 'before': true }],
    'space-before-function-paren': ['error', 'always'],
    'no-multi-spaces': 'error',
    'space-before-blocks': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'func-call-spacing': ['error', 'never'],
    'no-trailing-spaces': 'error',
  }
}
