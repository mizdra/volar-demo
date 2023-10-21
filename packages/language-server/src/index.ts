import { language } from './language';
import createHtmlService from 'volar-service-html';
import createCssService from 'volar-service-css';
import { createConnection, startLanguageServer, LanguageServerPlugin } from '@volar/language-server/node';

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
	resolveConfig(config) {

		// languages
		config.languages ??= {};
		config.languages.html1 ??= language;

		// services
		config.services ??= {};
		config.services.html ??= createHtmlService();
		config.services.css ??= createCssService();
		config.services.html1 ??= (_serviceContext) => ({});

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
