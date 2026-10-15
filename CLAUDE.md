# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Angular CLI workspace (Angular 20, Node version in `.nvmrc`) hosting a single library project,
`@onlyoffice/docspace-angular` (`projects/onlyoffice/docspace-angular`) — a `<docspace>` component
that embeds ONLYOFFICE Apps (formerly DocSpace) via `@onlyoffice/docspace-sdk-js`. There is no
application project; Storybook (`stories/`) is the only dev harness. User-facing docs and the API
reference live in the library's own `README.md`.

## Commands

```
npm run build            # ng-packagr build → dist/onlyoffice/docspace-angular
npm run lint             # ESLint flat config over library, stories and .storybook
npm run test:ci          # one-shot Karma run in ChromeHeadlessCI (use this, not `npm test`, which watches)
npm run storybook        # dev server on :6006, needs .env (see below)
npm run build-storybook  # → storybook-static
```

Run a single spec/test: there is only one spec file; focus a test with `fit`/`fdescribe` and run
`npm run test:ci`, or pass `--include=<path-to-spec>` (`npx ng test --watch=false --browsers=ChromeHeadlessCI --include=projects/onlyoffice/docspace-angular/src/lib/components/docspace.component.spec.ts`).

CI (`.github/workflows/ci.yml`) runs lint, `test:ci`, build + entry-point check + `npm pack`, and
`build-storybook` as separate jobs.

## Architecture

- `DocSpaceComponent` (`src/lib/components/docspace.component.ts`) — standalone, OnPush, signal
  `input.required<TFrameConfig>()` named `config` and `output` `setDocspaceInstance`. It renders a
  wrapper div sized from `config.width/height` with an inner div whose id is `config.frameId`, then
  in `ngAfterViewInit` (browser platform only — SSR-safe) calls the SDK, which looks the mount
  element up by id. The config is read **once**; later input changes are intentionally ignored
  (re-init would destroy the frame) — consumers use the emitted instance's `setConfig`.
  `ngOnDestroy` calls `destroyFrame()`. The `line-height: 0` on the wrapper is deliberate (prevents
  iframe baseline overflow/scrollbar).
- `DocSpaceSdk` (`src/lib/services/docspace-sdk.service.ts`) — root-provided injectable seam around
  `new SDK().initFrame(config)`. Exists so tests (and apps) can swap the SDK; a fresh SDK object per
  call so frames share nothing. Specs mock it with `jasmine.createSpyObj` and use
  `provideZonelessChangeDetection()`.
- SDK types are imported from deep paths: `@onlyoffice/docspace-sdk-js/dist/types/{instance,types}`.
- Public surface is `src/public-api.ts`. `@onlyoffice/docspace-sdk-js` is a **peer** dependency
  (`>=2.0.0`) of the library and a devDependency of the workspace.

## Gotchas

- Root `tsconfig.json` maps `@onlyoffice/docspace-angular` to `dist/` (last build), but
  `.storybook/tsconfig.json` remaps it to `src/public-api.ts`, so stories pick up edits without a rebuild.
- Storybook targets in `angular.json` set `browserTarget` to the library `build` target. It's unused
  but required — removing it brings back `SB_FRAMEWORK_ANGULAR_0001`. Zoneless mode is on
  (`experimentalZoneless`).
- Storybook needs a real ONLYOFFICE Apps instance: copy `.env.example` to `.env` and set
  `STORYBOOK_DOCSPACE_URL` and `STORYBOOK_DOCSPACE_FILE_ID` (only `STORYBOOK_`-prefixed vars reach
  the browser; read in `stories/env.ts`).
- The selector is bare `docspace` (part of the public API); the angular-eslint selector-prefix rules
  are disabled on purpose. Lint enforces single quotes (template literals allowed) and semicolons;
  Prettier: `printWidth: 100`, `singleQuote: true`.
- `test:ci` uses the `ChromeHeadlessCI` launcher from the library's `karma.conf.js` (`--no-sandbox`):
  Gitea Actions runs jobs as root in a container, where Chrome aborts on the SUID sandbox helper.
- Source files carry the Ascensio System SIA Apache-2.0 license header — keep it on new files.

## Branches per Angular version

Each Angular major lives on its own branch, and the library major tracks it:

| Branch                | Angular | Library version |
|-----------------------|---------|-----------------|
| `develop`             | 20      | 1.x             |
| `feature/angular-v21` | 21      | 2.x             |
| `feature/angular-v22` | 22      | 3.x             |

Changes flow forward by merge: `develop` → `feature/angular-v21` → `feature/angular-v22`. Each
upgrade branch carries only the Angular bump, the regenerated lockfile, and the new CHANGELOG
section/`package.json` version on top. Make shared fixes on the oldest branch that needs them and
merge forward rather than cherry-picking. Expect conflicts in `package-lock.json`, CHANGELOG and the
version fields. `release.yml` publishes a version whose major is below the latest on npm under the
`backport` dist-tag, so releasing from an older-Angular branch doesn't move `latest`.

## Release

Pushing to `master` auto-tags `v<version>` from the first version heading in
`projects/onlyoffice/docspace-angular/CHANGELOG.md`; the tag triggers npm publish and a GitHub
release whose notes are the top changelog section. Bump the CHANGELOG and the library
`package.json` version together for any release-worthy change. Commits follow Conventional Commits.
