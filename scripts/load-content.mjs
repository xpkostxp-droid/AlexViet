import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Load the site's TypeScript data with its real imports, not text/regex parsing.
// Only local content modules are allowed; no browser globals are needed.
export function loadContent(root) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: filename,
      transformers: { before: [context => node => {
        const visit = child => {
          if (ts.isPropertyAccessExpression(child) && child.name.text === 'BASE_URL'
            && ts.isPropertyAccessExpression(child.expression) && child.expression.name.text === 'env'
            && ts.isMetaProperty(child.expression.expression)) {
            return context.factory.createStringLiteral('./');
          }
          return ts.visitEachChild(child, visit, context);
        };
        return ts.visitNode(node, visit);
      }] },
    });
    const localRequire = (specifier) => {
      if (!specifier.startsWith('.')) throw new Error(`Non-local content import: ${specifier}`);
      const resolved = path.resolve(path.dirname(filename), `${specifier}.ts`);
      if (!resolved.startsWith(path.join(root, 'src', 'content') + path.sep)) {
        throw new Error(`Import outside content directory: ${specifier}`);
      }
      return load(resolved);
    };
    const run = vm.runInThisContext(`(function(exports, require, module) {\n${outputText}\n})`, { filename });
    run(module.exports, localRequire, module);
    return module.exports;
  }
  return {
    ...load(path.join(root, 'src/content/lessons.ts')),
    ...load(path.join(root, 'src/content/cards.ts')),
    dialogueSets: [{ lessonId: 'lesson-9', source: 'src/content/games/dialogues.ts',
      heading: 'Диалоги · Урок 9', sentences: load(path.join(root, 'src/content/games/dialogues.ts')).dialogueSentences }],
  };
}
