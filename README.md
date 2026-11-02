# Bask demo

An interactive Bask sun care concept with product animations, campaign directions, and a design reference library, protected by an encrypted password gate on GitHub Pages.

- Website: https://qtyree1328.github.io/bask-demo/
- Repository: https://github.com/qtyree1328/bask-demo

## Setup

Use Node.js 22 or later, then install the tooling:

```sh
git clone https://github.com/qtyree1328/bask-demo.git
cd bask-demo
npm ci
npm run decrypt
```

Enter the site password when prompted. Decryption restores `site/index.html`, the editable page, from the encrypted `docs/index.html`.

## Edit and publish

1. Replace or edit `site/index.html` with the eventual website HTML.
2. Run `npm run encrypt` and enter the site password. For automation, provide it through the `STATICRYPT_PASSWORD` environment variable.
3. Run `npm run preview` and open http://localhost:4173 to check the password gate and page.
4. Commit the updated encrypted file and push to `main`:

```sh
git add docs/index.html
git commit -m "Update demo website"
git push origin main
```

The GitHub Actions workflow publishes `docs/` to GitHub Pages automatically. Check the repository's **Actions** tab for deployment status. No password secret is needed on GitHub because encryption happens locally before committing.

## Password and content protection

This repository is public. `site/` is ignored by Git so the editable plaintext HTML stays on your computer; only the encrypted page is committed. Never force-add plaintext content or put the password in repository files, workflow files, or commit messages.

StatiCrypt encrypts the HTML and decrypts it in the visitor's browser. This is a static demo password gate, not server authentication: anyone can download the encrypted page and attempt to guess its password offline.

Only content inside the encrypted HTML is protected. Keep the page self-contained: inline CSS and JavaScript, and embed images as data URLs in `site/index.html`. The publishing check rejects extra files in `docs/`. Externally hosted assets and external API responses remain accessible independently of the password gate. Use relative URLs for any public links so they work under `/bask-demo/`.

To change the password, encrypt the page again with the new password and publish the result. Previously downloaded encrypted copies remain decryptable with their original password.
