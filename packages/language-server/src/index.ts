import { createConnection, startLanguageServer, LanguageServerPlugin } from '@volar/language-server/node';

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	// html1 拡張子に関する情報を登録
	extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
	resolveConfig(config) {
		// ここに Volar.js の設定を書く

		// ...

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
