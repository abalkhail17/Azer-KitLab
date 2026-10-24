# KitLab V1 – V108 UNDER TESTING – based on V106 approved baseline – Netlify TEST PACKAGE

This is a Netlify Functions deployment package, NOT the offline demo HTML. It uses the V108 editor based on approved V106 and login art, but strips client-side password checks. Website login is checked by Netlify Functions and the editor is fetched only after login.

## How to deploy (important)
1. Create a PRIVATE GitHub repository, upload the CONTENTS of this folder (netlify.toml at the repository root, along with site/ and netlify/). Avoid dragging the ZIP onto Netlify's manual deploy page: it cannot build Netlify Functions from that upload.
2. On Netlify: Add new project -> Import from Git -> your private GitHub repo. The checked-in `netlify.toml` sets publish to `site` and functions to `netlify/functions`.
3. Site configuration -> Environment variables -> add:
   - `KIT_USERNAME` = your preferred primary username (for example `abalkhail17@gmail.com`)
   - `KIT_PASSWORD` = primary password (enter it on Netlify; not in the repository)
   - `KIT_SESSION_SECRET` = a RANDOM 32+ character string; preferably 64+ (generate securely)
   - optional `KIT_USERNAME_ALIAS` = alternate name for the primary account (e.g. `abalkhail17`)
   - optional `KIT_TEST_USERNAME` and `KIT_TEST_PASSWORD` = separate temporary demo account; disable/remove after testing (avoid `123`/`123` on a public site)
4. Trigger Deploy site after saving variables. Use the deployed website link, not a local HTML preview, to test server login.

## Checks
- Public login HTML contains no real password values or editor artwork source.
- Editor is transmitted in protected chunks only after server login (30+ requests); this may take time on a cold deploy.
- Stateless cookie auth: max 20 minutes. Client additionally logs out after 15 min idle, on hiding page, and on leaving site.
- Light-only login, monochrome controls, original logo assets, editor layout, and panel-rendering path derive from approved V106.

## Important security limitations
This is a TEST deployment, not a security audit. Shared-password auth has no built-in rate limiting, per-user revocation, or true server-side idle expiry (client-only for idle). Netlify functions must work with this package's overall bundle size. Check live deployment Function logs and editor load. Use strong passwords and Netlify access controls for external visitors. Do NOT publish offline local demo HTML as a public site.

V109: Layout-only. Original Azer Studio logo far left, KitLab right near theme switch; matching arrangement on login. No changes to login credentials, Netlify auth, controls, or garment rendering.
