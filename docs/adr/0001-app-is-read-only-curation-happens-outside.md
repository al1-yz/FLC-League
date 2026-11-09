# Collecting external content happens outside the app; the app edits only the user's own data

The app does not collect or write external content: coaching Insights are collected on demand by Claude (from approved Sources) or entered outside the app, and statistics come from a separate collector run on demand. Inside the app, the user may edit **only their own data**: Verdicts, Me notes, approving or rejecting Unreviewed Insights, and flagging Conflicts. We chose this because the budget is $0 (an in-app LLM or scheduler costs money or infrastructure), updates are only needed when the user asks, and rating matchups after every game must be quick. Everything runs locally.

## Status
accepted (amended 2026-11-04: originally fully read-only; in-app editing of the user's own data added in D6.1)
