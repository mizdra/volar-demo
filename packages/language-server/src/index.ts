import { language, Html1File } from './language';
import createHtmlService from 'volar-service-html';
import createCssService from 'volar-service-css';
import { createConnection, startLanguageServer, LanguageServerPlugin, Service, ServiceContext, CompletionItem, CompletionItemKind } from '@volar/language-server/node';

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
		config.services.html1 ??= (serviceContext: ServiceContext | undefined): ReturnType<Service> => {
			return {
				provideCompletionItems: (document, _position, context, cancel) => {
					if (serviceContext === undefined) return;
					const virtualFile = serviceContext.documents.getSourceByUri(document.uri)?.root;
					if (!(virtualFile instanceof Html1File)) return;

					const result: CompletionItem[] = [];
					for (const token of virtualFile.cssTokens) {
						result.push({
							label: token.name.slice(1), // Convert `.foo` to `foo`
							kind: CompletionItemKind.Variable,
							data: {
								languageId: document.languageId,
								uri: document.uri,
								position: token.location,
								context,
								cancel,
							},
						});
					}
					return {
						isIncomplete: false,
						items: result,
					};
				},
			};
		};

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
