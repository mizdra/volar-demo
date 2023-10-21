import { Language, VirtualFile, FileKind, FileCapabilities, FileRangeCapabilities } from '@volar/language-core';
import * as html from 'vscode-html-languageservice';
import type * as ts from 'typescript/lib/tsserverlibrary';

export const language: Language<Html1File> = {
	createVirtualFile(fileName, snapshot) {
		if (fileName.endsWith('.html1')) {
			return new Html1File(fileName, snapshot);
		}
	},
	updateVirtualFile(html1File, snapshot) {
		html1File.update(snapshot);
	},
};

const htmlLs = html.getLanguageService();

/** `.html1` という拡張子のファイルをモデリングしたもの。 */
export class Html1File implements VirtualFile {
	kind = FileKind.TextFile;
	capabilities = FileCapabilities.full;
	codegenStacks = [];

	fileName!: string;
	mappings!: VirtualFile['mappings'];
	embeddedFiles!: VirtualFile['embeddedFiles'];
	htmlDocument!: html.HTMLDocument;

	constructor(
		public sourceFileName: string,
		public snapshot: ts.IScriptSnapshot,
	) {
		this.onSnapshotUpdated();
	}

	public update(newSnapshot: ts.IScriptSnapshot) {
		this.snapshot = newSnapshot;
		this.onSnapshotUpdated();
	}

	/** ファイルが更新されたときに呼ばれるメソッド */
	onSnapshotUpdated() {
		// ファイル全体を `.html` ファイルとして扱うよう指示
		this.fileName = this.sourceFileName + '.html'; // `example.html1` なら `example.html1.html`
		this.mappings = [{
			sourceRange: [0, this.snapshot.getLength()],
			generatedRange: [0, this.snapshot.getLength()],
			data: FileRangeCapabilities.full,
		}];
		// 以下はおまじない
		const document = html.TextDocument.create(this.fileName, 'html', 0, this.snapshot.getText(0, this.snapshot.getLength()));
		this.htmlDocument = htmlLs.parseHTMLDocument(document);

		// ファイルを解析して、style タグを見つけたら、その中身を `.css` ファイルとして扱うよう指示
		this.embeddedFiles = [];
		this.htmlDocument.roots.forEach(root => {
			if (root.tag === 'style' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
				const styleText = this.snapshot.getText(root.startTagEnd, root.endTagStart);
				this.embeddedFiles.push({
					fileName: this.fileName + `.css`, // `example.html1` なら `example.html1.css`
					kind: FileKind.TextFile,
					snapshot: {
						getText: (start, end) => styleText.substring(start, end),
						getLength: () => styleText.length,
						getChangeRange: () => undefined,
					},
					mappings: [{
						sourceRange: [root.startTagEnd, root.endTagStart],
						generatedRange: [0, styleText.length],
						data: FileRangeCapabilities.full,
					}],
					codegenStacks: [],
					capabilities: FileCapabilities.full,
					embeddedFiles: [],
				});
			}
		});
	}
}
