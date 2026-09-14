import { getStore } from '@netlify/blobs';
import { handleApplication } from '../handler.js';
/** Credenciais do Blobs são fornecidas pelo Netlify, apenas no servidor. */
export default async function candidaturas(request, context) {
  return handleApplication(request, async (record) => {
    const storeName =
      context.deploy.context === 'production'
        ? 'turing-candidaturas'
        : 'turing-candidaturas-testes';
    const store = getStore(storeName);
    await store.setJSON(
      `${record.createdAt.slice(0, 10)}/${record.id}`,
      record,
    );
  });
}
export const config = {
  path: '/api/candidaturas',
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
