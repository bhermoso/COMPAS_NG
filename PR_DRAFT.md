# PR draft: feat(h06): LocalHealthPlanCompiler + persist PLS

Summary:
- Adds LocalHealthPlanCompiler implementing H-06 and gates G-PLS-1..G-PLS-7.
- Persists compiled PLS in `workspace.compiledPlans`.
- Adds manifest warnings and improved gate reporting.
- Includes tests and updates runtime to attempt compilation when PSL is approved.

How to test locally:

1. Start dev server: `npm run dev`
2. Run tests: `npm test`
3. Run full build: `npm run build`

Suggested reviewers: @team-health @maintainers
