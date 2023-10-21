import { language } from './language';
import createHtmlService from 'volar-service-html';
import createCssService from 'volar-service-css';
import { createConnection, startLanguageServer, LanguageServerPlugin } from '@volar/language-server/node';

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
	resolveConfig(config) {

		// `.html1` のパーサーのようなものを登録
		config.languages ??= {};
		config.languages.html1 ??= language;

		// `.html1` の中で使われる言語のサービス (言語機能を提供する君) を登録
		config.services ??= {};
		config.services.html ??= createHtmlService();
		config.services.css ??= createCssService();
		config.services.html1 ??= (_serviceContext) => ({
			// 以下を実装すれば、コード補完をカスタマイズできる
			// provideCompletionItems: (uri, position, context) => {
			//   // ...
			// },
		});

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
