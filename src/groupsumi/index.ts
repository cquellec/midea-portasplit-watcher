import { fetchHtml } from '../lib/http.js';
import { extractJsonLd, findProductOffer } from '../lib/jsonld.js';

export async function checkGroupSumi(timeoutMs = 20000) {
  const res = await fetchHtml(
    'https://groupsumi.fr/chauffage/climatisation/climatiseur-mobile/climatiseur-et-deshumidificateur-portable-4-en-1-midea-portasplit-3-5-kw-13907811',
    timeoutMs
  );

  if (res.blocked) {
    return { inStock: false, price: null, maintenance: true };
  }

  const offer = findProductOffer(extractJsonLd(res.html));

  return {
    inStock: offer?.status === 'in_stock' || offer?.status === 'limited',
    price: offer?.price ?? null,
    maintenance: false,
  };
}
