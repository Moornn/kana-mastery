// Interface pour expliquer à TypeScript la structure Cloudflare
interface PagesContext {
  request: Request;
  env: {
    KANA_KV: any; 
  };
}

export async function onRequest(context: PagesContext) {
  const { request, env } = context;
  
  // La magie Zero Trust : Cloudflare nous donne l'email vérifié !
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Non autorisé par Zero Trust' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // RÉCUPÉRATION DES DONNÉES (GET)
  if (request.method === 'GET') {
    const data = await env.KANA_KV.get(email);
    return new Response(data || JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // SAUVEGARDE DES DONNÉES (POST)
  if (request.method === 'POST') {
    const body = await request.text();
    // On enregistre les données dans le KV avec l'email comme clé unique
    await env.KANA_KV.put(email, body);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Méthode non supportée', { status: 405 });
}