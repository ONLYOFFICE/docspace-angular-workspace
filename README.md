# ONLYOFFICE DocSpace Angular Workspace

This repository is the Angular CLI workspace that hosts the source code of
[`@onlyoffice/docspace-angular`](https://www.npmjs.com/package/@onlyoffice/docspace-angular) —
an Angular component that integrates [ONLYOFFICE DocSpace](https://github.com/ONLYOFFICE/DocSpace)
into Angular applications.

**Please note**: To work with the component, you need to have ONLYOFFICE DocSpace. If you are new to
DocSpace, [create an account](https://www.onlyoffice.com/docspace-registration.aspx).

## Repository structure

```
.
├── projects/
│   └── onlyoffice/
│       └── docspace-angular/   # the @onlyoffice/docspace-angular library
│           ├── src/            # component sources
│           ├── README.md       # installation guide, usage examples and API reference
│           └── CHANGELOG.md    # version history
├── stories/                    # Storybook stories, a dev harness against a real portal
├── .storybook/                 # Storybook configuration
├── eslint.config.js            # ESLint flat config, covers the library, stories and Storybook
├── angular.json                # Angular CLI workspace configuration
└── package.json                # workspace dependencies and scripts
```

The workspace holds exactly one project, so the Angular CLI resolves it automatically — passing the
full scoped name (`ng build @onlyoffice/docspace-angular`) also works.

For installation instructions, usage examples, and the full API reference, see the
[library README](projects/onlyoffice/docspace-angular/README.md).

## Development

### Prerequisites

- [Node.js (and npm)](https://nodejs.org/en), the version in [`.nvmrc`](.nvmrc)

### Clone the project from the GitHub repository:
```
git clone https://github.com/ONLYOFFICE/docspace-angular-workspace
```

### Install the project dependencies:
```
npm install
```

### Build the library:
```
npm run build
```
The build output is placed in `dist/onlyoffice/docspace-angular`.

### Lint the sources:
```
npm run lint
```

### Test the component:
```
npm test
```
That is Karma's interactive watch mode with a real Chrome. For a one-shot run (CI, agents):
```
npm run test:ci
```

### Create the package:
```
cd dist/onlyoffice/docspace-angular
npm pack
```

## Storybook

The stories open a real DocSpace, so they need a portal to point at. Copy *.env.example* to *.env*
and fill it in:
```
STORYBOOK_DOCSPACE_URL=https://example-onlyoffice.com
STORYBOOK_DOCSPACE_FILE_ID=100000
```
Only the *STORYBOOK_*-prefixed variables reach the browser. *STORYBOOK_DOCSPACE_FILE_ID* is the file
the *Editor* story opens, it can be any file id from the portal above.

### Start Storybook:
```
npm run storybook
```
### Build Storybook:
```
npm run build-storybook
```

Both Storybook targets in `angular.json` set `browserTarget` to the library's own `build` target.
That looks odd for an ng-packagr target and it is: `@storybook/angular` refuses to start unless the
option is set at all, and this workspace has no application to point it at. Nothing is read from it —
the `tsConfig` next to it is what Storybook actually compiles against — but dropping it brings back
`SB_FRAMEWORK_ANGULAR_0001`.

## Release process

One library major per Angular major, each on its own long-lived branch: `master` carries the oldest
line still maintained, and every newer Angular major gets a `feature/angular-v-<n>` branch that the
older line is merged forward into. The pairing is the compatibility table in the
[library README](projects/onlyoffice/docspace-angular/README.md#versions) — this branch is the
Angular 22 line and publishes v3.x, while `feature/angular-v-21` carries v2.x and `master` stays on
Angular 20 with v1.x.

Both [`create-tag.yml`](.github/workflows/create-tag.yml) and
[`release.yml`](.github/workflows/release.yml) read the first version heading out of
`projects/onlyoffice/docspace-angular/CHANGELOG.md` to tag and publish a release, and `release.yml`
takes the top changelog section as the GitHub release notes. Pushing to `master` auto-tags a release,
and the tag push in turn triggers the npm publish — so bump the changelog and the library
`package.json` version together with any release-worthy change.

## Feedback and support

In case you have any issues, questions, or suggestions for the ONLYOFFICE DocSpace Angular component,
please refer to the [Issues](https://github.com/ONLYOFFICE/docspace-angular-workspace/issues) section.

Official project website: [www.onlyoffice.com](https://www.onlyoffice.com/).

Support forum: [forum.onlyoffice.com](https://forum.onlyoffice.com/).

## License

The source code is licensed under the [Apache-2.0](LICENSE) license.
