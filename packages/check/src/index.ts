
import { language } from '@html1/language-server/out/language';
import { createHtml1Service } from '@html1/language-server/out/service';

import createHtmlService from 'volar-service-html';
import createCssService from 'volar-service-css';
import * as kit from '@volar/kit';
import * as path from 'path';

const fileName = path.resolve(process.cwd(), process.argv[2]);

const project = kit.createInferredProject(process.cwd(), () => [fileName]);
const config: kit.Config = {
	languages: {
		html1: language,
	},
	services: {
		html: createHtmlService(),
		css: createCssService(),
		html1: createHtml1Service(),
	},
};
const linter = kit.createLinter(config, project.languageHost);
reportErrors(linter, fileName);

async function reportErrors(linter: ReturnType<typeof kit.createLinter>, fileName: string) {
	const diagnostics = await linter.check(fileName);
	linter.logErrors(fileName, diagnostics);
}
