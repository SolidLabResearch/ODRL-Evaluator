# Releasing a new version

This is only relevant if you are a developer with push access responsible for doing a new release.

Steps to follow:
- Verify that the `RELEASE_NOTES.md` are correct.
- Create release notes and tags: `npx commit-and-tag-version -r major/minor/patch`
  - Updates the package.json, and generates the new entries in CHANGELOG.md. Commits with chore(release): Release version vx.y.z of the npm package
  - Optionally run `npx commit-and-tag-version -r major/minor/patch --dry-run` to preview the commands that will be run and the changes to CHANGELOG.md.
- Do a GitHub release
- npm release: `npm run release`
- potentially upgrade dependent repositories
  - ODRL Test Suite at https://github.com/SolidLabResearch/ODRL-Test-Suite
  - FORCE demo at https://github.com/woutslabbinck/ODRL-Evaluator-Demo
  - User-Access Server at https://github.com/SolidLabResearch/user-managed-access