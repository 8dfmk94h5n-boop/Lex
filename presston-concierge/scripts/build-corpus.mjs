// Genera worker/src/corpus.generated.js a partir de corpus/*.md.
// Cada sección "### Título" es un fragmento buscable. Archivos *-en.md → EN, el resto → ES.
// Uso: node scripts/build-corpus.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const corpusDir = join(root, 'corpus');
const outFile = join(root, 'worker', 'src', 'corpus.generated.js');

const chunks = [];
for (const file of readdirSync(corpusDir).filter((f) => f.endsWith('.md')).sort()) {
  const lang = file.endsWith('-en.md') ? 'EN' : 'ES';
  const source = file.replace(/\.md$/, '');
  const md = readFileSync(join(corpusDir, file), 'utf8');
  for (const section of md.split(/^### /m).slice(1)) {
    const [heading, ...body] = section.split('\n');
    const title = heading
      .replace(/✅.*$/u, '') // anotaciones de aprobación
      .replace(/^\d+\.\s*/, '')
      .trim();
    const text = body.join('\n').replace(/\*\*/g, '').trim();
    if (!text) continue;
    chunks.push({ id: `${source}#${chunks.length}`, lang, source, title, text });
  }
}

const out =
  '// GENERADO por scripts/build-corpus.mjs — no editar a mano. Fuente: corpus/*.md\n' +
  `export const CORPUS = ${JSON.stringify(chunks, null, 2)};\n`;
writeFileSync(outFile, out);
console.log(`corpus: ${chunks.length} fragmentos → ${outFile}`);
