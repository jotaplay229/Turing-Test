import test from 'node:test';
import assert from 'node:assert/strict';
import { getSocialHref } from '../lib/social-links.js';
import { members } from '../lib/team-data.js';

test('respostas sem protocolo ou com apenas usuário viram perfis da rede correta', () => {
  assert.equal(
    getSocialHref('github', 'Kairo30ms'),
    'https://github.com/Kairo30ms',
  );
  assert.equal(
    getSocialHref('instagram', '@anaps_2'),
    'https://www.instagram.com/anaps_2/',
  );
  assert.equal(
    getSocialHref('linkedin', 'linkedin.com/in/kkaiohenrique'),
    'https://www.linkedin.com/in/kkaiohenrique/',
  );
});

test('parâmetros de compartilhamento e caminhos de repositório não atrapalham o perfil', () => {
  assert.equal(
    getSocialHref(
      'instagram',
      'https://www.instagram.com/Joatan_Henrique?stkn=exemplo',
    ),
    'https://www.instagram.com/Joatan_Henrique/',
  );
  assert.equal(
    getSocialHref(
      'github',
      'https://github.com/09-kaua-augusto-90/pweb_2025.2_kauaaugusto',
    ),
    'https://github.com/09-kaua-augusto-90',
  );
  assert.equal(
    getSocialHref(
      'linkedin',
      'https://www.linkedin.com/in/raissa-alcântara-a97605186?utm_source=share',
    ),
    'https://www.linkedin.com/in/raissa-alc%C3%A2ntara-a97605186/',
  );
});

test('respostas ausentes, páginas genéricas ou outra rede mantêm o aviso', () => {
  for (const value of [null, '', '.', 'Não tenho', 'Desativado no momento'])
    assert.equal(getSocialHref('github', value), null);
  assert.equal(
    getSocialHref(
      'github',
      'https://www.linkedin.com/home?originalSubdomain=br',
    ),
    null,
  );
  assert.equal(
    getSocialHref(
      'linkedin',
      'https://www.linkedin.com/home?originalSubdomain=br',
    ),
    null,
  );
  assert.equal(getSocialHref('instagram', 'https://example.com/perfil'), null);
});

test('perfis confirmados do cadastro geram 33 links válidos sem duplicar pessoas', () => {
  assert.equal(members.length, 17);
  assert.equal(new Set(members.map((member) => member.id)).size, 17);
  const links = members.flatMap((member) =>
    ['instagram', 'linkedin', 'github']
      .map((network) => getSocialHref(network, member[network]))
      .filter(Boolean),
  );
  assert.equal(links.length, 33);
  assert.equal(
    members.find((member) => member.id === 'joatan-matias').github,
    'https://github.com/jotaplay229',
  );
  assert.equal(
    members.find((member) => member.id === 'joao-silva').instagram,
    'https://www.instagram.com/petals_for__armor/',
  );
  assert.equal(
    members.find((member) => member.id === 'ana-souza').instagram,
    'https://www.instagram.com/anaps_2/',
  );
});
