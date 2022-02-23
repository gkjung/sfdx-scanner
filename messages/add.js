module.exports = {
	"commandDescription": `add custom rules to the scanner's registry`,
	"commandDescriptionLong": `Add custom rules to Sfdx Scanner's registry to run them along with built-in rules.
	Rules should have been compiled and tested separately.
	Please refer to our Custom Rules help page for more information:
	<link to Custom Rules Help Page>`,
	"flags": {
		"languageDescription": "language against which the custom rules will evaluate",
		"languageDescriptionLong": "Language against which the custom rules will evaluate.",
		"pathDescription": "one or more paths to custom rule definitions",
		"pathDescriptionLong": `One or more paths to custom rule definitions. Specify multiple values with a comma-separated list.`
	},
	"validations": {
		"languageCannotBeEmpty": "Language cannot be empty",
    "pathCannotBeEmpty": "Path cannot be empty"
	},
	"errors": {
		"invalidFilePath": "Failed to find any file or directory with path: %s",
		"readCustomRulePathFileFailed": "Failed to read custom rule path file: %s",
		"writeCustomRulePathFileFailed": "Failed to write to custom rule path file: %s"
	},
	"examples": `PMD: XPath-based rules may be added as standalone XMLs. Java-based rules must be contained in JARs. Adhere
to PMD conventions, including defining rules in XMLs contained in a /category directory.
Refer to PMD's documentation for more information on writing rules: https://pmd.github.io/latest/pmd_userdocs_extending_writing_pmd_rules.html

	You may specify one or more files directly.
		E.g., $ sfdx scanner:rule:add --language apex --path "/Users/me/rules/Jar1.jar,/Users/me/rules/category/apex/MyRules.xml"
			Successfully added rules for apex.
			2 path(s) added:
			/Users/me/rules/Jar1.jar,/Users/me/rules/category/apex/MyRules.xml

	You may also specify a directory containing one or more JARs/XMLs, all of which will be added.
		E.g., $ sfdx scanner:rule:add --language apex --path "/Users/me/rules"
			Successfully added rules for apex.
			2 path(s) added:
			/Users/me/rules/SomeJar.jar,/Users/me/rules/AnotherJar.jar,/Users/me/rules/category/apex/MyRules.xml
	`
};
