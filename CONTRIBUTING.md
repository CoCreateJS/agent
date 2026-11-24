# Contributing to CoCreate Agent

Changes should follow the agent configuration, authorization, and execution
contracts documented in the [README](./README.md).

Use conventional commit messages so semantic-release can generate release notes
and publish package updates:

| Commit | Release |
| --- | --- |
| `fix: ...` | Patch |
| `feat: ...` | Minor |
| `perf: ...` | Patch |
| `feat!: ...` or a `BREAKING CHANGE:` footer | Major |

Run `npm test` before submitting changes. Pull requests should describe the
behavior changed and any authorization or protocol implications.
