# PodMotion Website

This repository contains the source for [podmotion.io](https://podmotion.io) — the marketing and documentation site for **PodMotion**, live workload migration for Kubernetes. PodMotion moves running Pods between nodes and clusters with a verified zero-sequence-delta guarantee, bringing vMotion-class operational continuity to cloud-native infrastructure. The site is a statically exported Next.js application served from GitHub Pages.

## Live Site

https://podmotion.io

## Stack

- Next.js 16 (`output: 'export'`, static HTML)
- React 19
- Tailwind CSS 4
- Framer Motion

## Local Development

The build pipeline runs on a native Linux filesystem. Use WSL (Ubuntu) — do not run `npm` against the NTFS mount, which cannot store the Linux symlinks Next.js depends on.

```bash
# from a WSL Ubuntu shell
cd website
npm install
./preview.sh        # builds and serves the static export locally
```

`preview.sh` produces the production static export and serves `out/` so you preview exactly what ships to GitHub Pages. For an iterative dev server, `npm run dev` is available, but always validate against `preview.sh` before opening a PR.

## Contributing Content

1. Fork this repository.
2. Branch from `main`.
3. Make your edits. All files use **LF line endings** (enforced by `.gitattributes`) — do not introduce CRLF.
4. Run `./preview.sh` and confirm the static export builds clean with no warnings.
5. Open a pull request against `main`. CI builds every PR; merges to `main` deploy automatically.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the static export and publishes `out/` to the `gh-pages` branch via [`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages). The `CNAME` is pinned to `podmotion.io`.

## Related

- Core project: the main [PodMotion repository](https://github.com/podmotion/podmotion)

## License

Apache License 2.0. See [LICENSE](./LICENSE).
