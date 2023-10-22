import { language, createHtml1Service } from '@html1/core';
import createHtmlService from 'volar-service-html';
import createCssService from 'volar-service-css';
import { createConnection, startLanguageServer, LanguageServerPlugin } from '@volar/language-server/node';

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
	resolveConfig(config) {
		// 1. Language オブジェクトを登録。
		// `.html1` の中身をパースして、どのような言語がどこに組み込まれているかを
		// Volar.js に伝える役割を担っている。
		config.languages ??= {};
		config.languages.html1 ??= language;

		// 2. `.html1` に組み込まれている言語のための Service を登録。
		// Service とはエディタからのリクエストを受け取って、言語機能を提供するもののこと。
		config.services ??= {};
		config.services.html ??= createHtmlService();
		config.services.css ??= createCssService();
		config.services.html1 ??= createHtml1Service();

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
