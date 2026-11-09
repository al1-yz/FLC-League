# 05: Live reload on content changes

**What to build:** When any file in the Content Repository changes while the app is open, the app reloads and re-validates content and the open page updates automatically, without losing anything the user is typing. Spec: FR-026c.

**Blocked by:** #01

**Status:** ready-for-agent

- [ ] Editing a content file shows the change on the open page within 2 seconds without manual reload
- [ ] Text typed in an open form survives the refresh
- [ ] New invalid entries appear in the validation report after reload
- [ ] End-to-end test "live reload" passes
