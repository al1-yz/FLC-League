# 09: Review workflow

**What to build:** Insights collected by Claude show an Unreviewed badge until approved. A review page lists all Unreviewed Insights (subject, Section, Source, Patch). The user approves (badge removed everywhere), rejects (that single entry is deleted from its collected file along with any Conflict containing it; the rest of the file is preserved), or flags two Insights as a Conflict (refused with an explanation unless they share subject and Section). Approvals and user-flagged Conflicts live in the user's own data. The app offers no way to edit external Insight text. Spec: US5, FR-024, FR-025, FR-027, FR-035, I13, I17.

**Blocked by:** #03, #04

**Status:** ready-for-agent

- [ ] Unreviewed badge derived from collector and approvals; persists correctly after restart
- [ ] Approve removes the badge everywhere
- [ ] Reject deletes only that entry and its Conflicts; other entries and formatting in the file are preserved
- [ ] Flagging across different subject or Section is refused with a reason
- [ ] No operation exists to edit external Insight text
