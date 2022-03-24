import {flags, SfdxCommand} from '@salesforce/command';
import {Messages, SfdxError} from '@salesforce/core';
import {AnyJson} from '@salesforce/ts-types';
import {Controller} from '../../../Controller';
import {stringArrayTypeGuard} from '../../../lib/util/Utils';
import path = require('path');
import untildify = require('untildify');


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('@salesforce/sfdx-scanner', 'add');


export default class Add extends SfdxCommand {

	public static description = messages.getMessage('commandDescription');
	public static longDescription = messages.getMessage('commandDescriptionLong');

	public static examples = [
		messages.getMessage('examples')
	];

	protected static flagsConfig = {
		language: flags.string({
			char: 'l',
			description: messages.getMessage('flags.languageDescription'),
			longDescription: messages.getMessage('flags.languageDescriptionLong'),
			required: true
		}),
		path: flags.array({
			char: 'p',
			description: messages.getMessage('flags.pathDescription'),
			longDescription: messages.getMessage('flags.pathDescriptionLong'),
			required: true
		})
	};

	public async run(): Promise<AnyJson> {
		this.validateFlags();

		// We know that the `language` flag is going to be a string, even if the linter isn't smart enough to realize it.
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const language: string = this.flags.language;
		const paths = this.resolvePaths();

		this.logger.trace(`Language: ${language}`);
		this.logger.trace(`Rule path: ${JSON.stringify(paths)}`);

		// Add to Custom Classpath registry
		const manager = await Controller.createRulePathManager();
		const classpathEntries = await manager.addPathsForLanguage(language, paths);
		this.ux.log(`Successfully added rules for ${language}.`);
		this.ux.log(`${classpathEntries.length} Path(s) added: ${JSON.stringify(classpathEntries)}`);
		return {success: true, language, path: classpathEntries};
	}

	private validateFlags(): void {
		if (typeof this.flags.language === 'string' && this.flags.language.length === 0) {
			throw SfdxError.create('@salesforce/sfdx-scanner', 'add', 'validations.languageCannotBeEmpty', []);
		}
		// --path '' results in different values depending on the OS. On Windows it is [], on *nix it is [""]
		if (this.flags.path && stringArrayTypeGuard(this.flags.path) && (!this.flags.path.length || this.flags.path.includes(''))) {
			throw SfdxError.create('@salesforce/sfdx-scanner', 'add', 'validations.pathCannotBeEmpty', []);
		}
	}

	private resolvePaths(): string[] {
		// path.resolve() turns relative paths into absolute paths. It accepts multiple strings, but this is a trap because
		// they'll be concatenated together. So we use .map() to call it on each path separately.
		// This typeguard is technically unnecessary, but it quiets TSLint and it's ultimately harmless.
		if (!stringArrayTypeGuard(this.flags.path)) {
			throw SfdxError.create('@salesforce/sfdx-scanner', 'add', 'errors.wronglyTypedPaths', []);
		}
		return this.flags.path.map(p => path.resolve(untildify(p)));
	}
}
