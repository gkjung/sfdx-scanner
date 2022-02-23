import {SfdxCommand} from '@salesforce/command';
import {CategoryFilter, LanguageFilter, RuleFilter, RulesetFilter, RulenameFilter, EngineFilter} from './RuleFilter';
import {uxEvents, EVENTS} from './ScannerEvents';

export abstract class ScannerCommand extends SfdxCommand {

	protected buildRuleFilters(): RuleFilter[] {
		const filters: RuleFilter[] = [];
		// Create a filter for any provided categories.
		if (this.flags.category && this.flags.category.length) {
			filters.push(new CategoryFilter(this.flags.category));
		}

		// Create a filter for any provided rulesets.
		if (this.flags.ruleset && this.flags.ruleset.length) {
			filters.push(new RulesetFilter(this.flags.ruleset));
		}

		// Create a filter for any provided languages.
		if (this.flags.language && this.flags.language.length) {
			filters.push(new LanguageFilter(this.flags.language));
		}

		// Create a filter for provided rule names.
		// NOTE: Only a single rule name can be provided. It will be treated as a singleton list.
		if (this.flags.rulename) {
			filters.push(new RulenameFilter([this.flags.rulename]));
		}

		// Create a filter for any provided engines.
		if (this.flags.engine && this.flags.engine.length) {
			filters.push(new EngineFilter(this.flags.engine));
		}

		return filters;
	}

	protected displayInfo(msg: string, verboseOnly: boolean): void {
		if (!verboseOnly || this.flags.verbose) {
			this.ux.log(msg);
		}
	}

	protected displayWarning(msg: string, verboseOnly: boolean): void {
		if (!verboseOnly || this.flags.verbose) {
			this.ux.warn(msg);
		}
	}

	protected displayError(msg: string): void {
		this.ux.error(msg);
	}

	protected async init(): Promise<void> {
		await super.init();
		this.buildEventListeners();
	}

	protected buildEventListeners(): void {
		uxEvents.on(EVENTS.INFO_ALWAYS, msg => this.displayInfo(msg, false));
		uxEvents.on(EVENTS.INFO_VERBOSE, msg => this.displayInfo(msg, true));
		uxEvents.on(EVENTS.WARNING_ALWAYS, msg => this.displayWarning(msg, false));
		uxEvents.on(EVENTS.WARNING_VERBOSE, msg => this.displayWarning(msg, true));
		uxEvents.on(EVENTS.ERROR_ALWAYS, msg => this.displayError(msg));
		uxEvents.on(EVENTS.ERROR_VERBOSE, msg => this.displayError(msg));
	}
}
