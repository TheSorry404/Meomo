// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
	rules: {
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-this-alias": "off",

		// vue
		"vue/multi-word-component-names": "off",
		"vue/valid-define-props": "off",
		"vue/no-v-model-argument": "off",
		"prefer-rest-params": "off",
		// prettier
		"prettier/prettier": "error",
		"@typescript-eslint/ban-types": [
			"error",
			{
				// 关闭空类型检查 {}
				extendDefaults: true,
				types: {
					"{}": false,
					Function: false,
				},
			},
		],
  },

});
