# portfolio

Personal portfolio site for [Penn Cameron Porterfield](https://github.com/melonmelonz).

Live at **[penn.goolz.org](https://penn.goolz.org)** — resume at [penn.goolz.org/cv](https://penn.goolz.org/cv).

## Stack

Static site — vanilla HTML/CSS/JS, no build step. Hosted on Cloudflare Pages
(project `penn-portfolio`).

## Deploy

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`).

Manual:

```sh
npx wrangler pages deploy . --project-name=penn-portfolio
```
