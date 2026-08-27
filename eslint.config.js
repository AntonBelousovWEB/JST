import antfu from '@antfu/eslint-config'

export default antfu(
	{
		react: true,
		typescript: {
			tsconfigPath: 'tsconfig.json',
			overridesTypeAware: {
				'ts/no-misused-promises': ['error', {
					checksVoidReturn: { attributes: false },
				}],
				'ts/promise-function-async': 'off',
				'ts/strict-boolean-expressions': 'off',
			},
		},
		lessOpinionated: true,
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
		},
		formatters: {
			html: true,
			css: true,
		},
		ignores: ['.react-router/**', 'build/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
		rules: {
			'no-console': ['error', { allow: ['log', 'error'] }],
		},
	},
	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
	},
	{
		files: ['src/shared/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': ['error', {
				patterns: [{
					group: ['@/{app,pages,widgets,features,entities}/**'],
					message: 'shared cannot depend on higher application layers',
				}],
			}],
		},
	},
	{
		files: ['src/entities/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': ['error', {
				patterns: [{
					group: ['@/{app,pages,widgets,features}/**'],
					message: 'entities can only depend on entities and shared',
				}],
			}],
		},
	},
	{
		files: ['src/features/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': ['error', {
				patterns: [{
					group: ['@/{app,pages,widgets}/**'],
					message: 'features cannot depend on composition layers',
				}],
			}],
		},
	},
	{
		files: ['src/widgets/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': ['error', {
				patterns: [{
					group: ['@/{app,pages}/**'],
					message: 'widgets cannot depend on app or pages',
				}],
			}],
		},
	},
)
