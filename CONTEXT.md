# LoLMechs

A personal study tool for League of Legends lane matchups. It explains what happens in a matchup, why, and how to respond, combining statistics with credited coaching knowledge.

## Language

### Champions & classification

**Focus Champion**:
A champion the user plays and studies matchups for (initially Akali, Zed, Orianna in Mid; Kai'Sa, Ezreal, Yunara in Bot).
_Avoid_: main, my champion

**Opponent**:
The other champion in a Matchup, seen from a Focus Champion's perspective. In Bot, whoever plays the Bot position, whatever their Archetype.
_Avoid_: enemy, counter

**Archetype**:
A community-defined playstyle grouping of champions (e.g. Control Mage, Battlemage, Assassin, Artillery Mage). Not Riot's official class system.
_Avoid_: class, subclass, role

**Primary Archetype**:
The single Archetype a champion is counted under for computed Archetype Matchup figures. A champion may also have one **Secondary Archetype**, which is descriptive only.

**Lane**:
The map position a Matchup is played in. Only Mid and Bot exist in this context; Bot means the two Bot-position players, ignoring supports.
_Avoid_: role, position

### Matchups

**Matchup**:
Two different champions facing each other in one Lane, at least one of them a Focus Champion. Shown from the perspective of the Focus Champion being viewed.
_Avoid_: counter, pairing

**Section**:
One of the fixed slots of the Matchup template (e.g. Trading patterns & stance, Wave management & lane priority); some exist only in one Lane.
_Avoid_: tab, chapter

**Archetype Matchup**:
One Archetype against another Archetype in a Lane, used to guide picks against a type of champion.
_Avoid_: class matchup

### Learning

**General Concept**:
A League of Legends fundamental that applies regardless of champions (e.g. wave management, lane priority, roaming, map pressure, objectives). Matchup sections apply General Concepts to a specific Matchup.
_Avoid_: topic, lesson, mechanic

### Knowledge

**Source**:
The origin of a piece of information (Riot, an analytics site, a coach, a guide, or the user themself as **Me**), always credited where its information appears.
_Avoid_: reference, provider

**Insight**:
A single credited claim about a Matchup, Archetype Matchup, champion or General Concept, paraphrased from one Source. Valid for one Patch, except General Concept Insights, which are patch-independent.
_Avoid_: tip, note, fact

**Unreviewed**:
The state of an Insight that Claude collected and the user has not yet approved. Unreviewed Insights are shown, but marked.

**Verdict**:
The user's own judgement of a Matchup: difficulty (1–5), confidence, notes, and the Patch it was made on.
_Avoid_: rating, score

**Me Note**:
Free text written by the user (Source: Me) attached to a Matchup Section or a General Concept.
_Avoid_: comment, annotation

**Third-party Reference**:
A statistic hand-recorded from a third-party Source (e.g. a LoLalytics win rate) with its sample size, rank filter, Patch and date; never combined with our own statistics.
_Avoid_: external stat, scraped data

**Conflict**:
Two Insights on the same topic whose claims contradict each other. Both are kept and shown; neither wins.
_Avoid_: disagreement, error

**Content Repository**:
The private store of all knowledge and the user's own data, kept apart from the app's public code.
_Avoid_: database, vault

**Catalog**:
The local copy of Riot's static game data (champions, items, runes, Patches) the app reads.
_Avoid_: static data, dictionary

**Patch**:
A League of Legends game version (e.g. 16.22). Champion and Matchup information is only valid for the Patch it was captured on.
_Avoid_: version, season
