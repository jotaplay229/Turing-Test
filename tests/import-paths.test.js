import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceFolders = ['app', 'backend', 'components', 'hooks', 'lib', 'tests'];
const imports = /(?:\bfrom\s+|\bimport\s*(?:\(\s*)?)(['"])([^'"\r\n]+)\1/g;

async function sourceFiles(folder) {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(filename)));
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(filename);
  }
  return files;
}

test('imports locais têm extensão e respeitam maiúsculas/minúsculas, como no Netlify', async () => {
  const files = (
    await Promise.all(
      sourceFolders.map((folder) => sourceFiles(path.join(root, folder))),
    )
  ).flat();
  let checked = 0;
  for (const filename of files) {
    const content = await readFile(filename, 'utf8');
    for (const [, , specifier] of content.matchAll(imports)) {
      assert.ok(
        !specifier.startsWith('@/'),
        `Use caminho relativo em ${filename}: ${specifier}`,
      );
      if (!specifier.startsWith('.')) continue;
      assert.ok(
        /\.(js|jsx|css|json)$/.test(specifier),
        `Extensão ausente em ${filename}: ${specifier}`,
      );
      const target = path.resolve(path.dirname(filename), specifier);
      const relative = path.relative(root, target);
      assert.ok(
        relative && !relative.startsWith('..') && !path.isAbsolute(relative),
      );
      let directory = root;
      for (const segment of relative.split(path.sep)) {
        const entries = await readdir(directory);
        assert.ok(
          entries.includes(segment),
          `Nome inexato ou arquivo ausente: ${relative}`,
        );
        directory = path.join(directory, segment);
      }
      checked++;
    }
  }
  assert.ok(
    checked > 50,
    'A verificação deve percorrer os módulos reais do site.',
  );
});
