# FinancesPME.fr — média financier pour dirigeants de PME

Site statique HTML/CSS/JS conçu pour un déploiement Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Feagleout%2Ffinancespme-media&project-name=financespme-media&repository-name=financespme-media)

## Structure
- Homepage éditoriale
- Rubriques : Actualités, Banques, Financement, Trésorerie, PME, Stratégie
- Guides et articles
- Lexique
- Calculateurs BFR / DSCR / mensualité
- Consulting
- À propos, rédaction, experts, méthodologie, politique éditoriale
- Contact, newsletter, pages légales
- SEO : metadata, canonical, Schema.org, sitemap.xml, robots.txt
- GEO : llms.txt, réponses directes, définitions et structure sémantique

## Qualité technique
- URLs propres et trailing slash cohérent
- Métadonnées SEO uniques
- H1 unique sur chaque page
- Canonicals
- Open Graph / Twitter cards
- Schema.org
- Maillage interne
- Sitemap XML, robots.txt et flux RSS
- Responsive mobile
- En-têtes de sécurité Vercel

## Formulaires et newsletter
Les formulaires utilisent maintenant des fonctions serverless Vercel et l’API Resend.

Variables d’environnement à renseigner dans Vercel :
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` — adresse qui reçoit les demandes
- `CONTACT_FROM_EMAIL` — expéditeur vérifié dans Resend
- `RESEND_AUDIENCE_ID` — audience utilisée pour Le Brief FinancesPME

Les formulaires incluent validation côté serveur, champ anti-bot honeypot, messages de statut et consentement explicite pour la newsletter.

## À finaliser avant mise en production
1. Informations légales définitives de l’entité éditrice.
2. Renseigner les variables d’environnement Resend ci-dessus.
3. Analytics et CMP uniquement si des traceurs non essentiels sont ajoutés.
4. Vérification Google Search Console / Bing Webmaster Tools.
5. Publication régulière de contenus datés, vérifiés et sourcés.
6. Brancher le domaine `financespme.fr` au projet Vercel.

## Déploiement
Le site est prêt à être servi comme projet statique Vercel. Aucun build n’est nécessaire.

Repository : https://github.com/eagleout/financespme-media
