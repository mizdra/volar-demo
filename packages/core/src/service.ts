import { Diagnostic, Service } from "@volar/language-service";
import { Html1File } from "./language";

export function createHtml1Service(): Service {
  return (context) => ({
    provideDiagnostics(document) {
      const [file] = context!.documents.getVirtualFileByUri(document.uri);
      if (!(file instanceof Html1File)) return;

      const styleNodes = file.htmlDocument.roots.filter(root => root.tag === 'style');
      if (styleNodes.length <= 1) return;

      const errors: Diagnostic[] = [];
      for (let i = 1; i < styleNodes.length; i++) {
        errors.push({
          severity: 2,
          range: {
            start: file.document.positionAt(styleNodes[i].start),
            end: file.document.positionAt(styleNodes[i].end),
          },
          source: 'html1',
          message: 'Only one style tag is allowed.',
        });
      }
      return errors;
    },
  })
}