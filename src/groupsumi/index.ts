import { fetchHtml } from '../lib/http.js';
import { extractJsonLd, findProductOffer } from '../lib/jsonld.js';

export async function scanGroupSumi(timeoutMs = 20000) {
  const res = await fetchHtml(
    'https://groupsumi.fr/chauffage/climatiseur-mobile/climatiseur-et-deshumidificateur-portable-4-en-1-midea-portasplit-3-5-kw-13907811',
    timeoutMs
  );

  if (res.blocked) {
    return { source: 'groupsumi', offers: [], ok: false, note: 'bloqué' };
  }

  const offer = findProductOffer(extractJsonLd(res.html));
  const inStock = offer?.status === 'in_stock' || offer?.status === 'limited';
  const price = offer?.price ?? null;

  const offers = inStock
    ? [
        {
          source: 'groupsumi',
          key: 'groupsumi:offer',
          label: `GroupSumi — ${price ? `${price}€` : 'prix inconnu'}`,
          url: 'https://groupsumi.fr/chauffage/climatiseur-mobile/climatiseur-et-deshumidificateur-portable-4-en-1-midea-portasplit-3-5-kw-13907811',
          price,
          risky: true,
        },
      ]
    : [];

  return { source: 'groupsumi', offers, ok: true };
}
