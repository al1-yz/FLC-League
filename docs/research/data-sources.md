# Data Sources Feasibility — LoLMechs

Status: research only (no code). All sources accessed **2026-11-04** unless noted.
Scope: local-only, personal-use, never-published, $0 app for mid / ADC matchup learning
(initial: Akali, Zed, Orianna vs ~5 mid opponents each).

**Labels**
- **CONFIRMED** = read on the primary page cited (accessed 2026-11-04).
- **UNVERIFIED** = page unreachable, not stated anywhere I found, or my inference/estimate.

> Not legal advice. ToS/copyright notes below separate *what a page says* (CONFIRMED) from
> *general principles* (UNVERIFIED/HYPOTHESIS). For anything that matters, read the ToS yourself.

---

## 1. Riot Games official (Developer Portal, API Terms, Data Dragon)

### 1.1 API key types — CONFIRMED (https://developer.riotgames.com/docs/portal)

| Key | Who gets it | Rate limit (per region) | Expiry | Approval |
|---|---|---|---|---|
| Development | Auto-generated on first Developer Portal login | 20 req / 1 s **and** 100 req / 2 min | "deactivate every 24 hours" — must be reset manually | None |
| Personal | Register a product, choose "personal project" | 20 req / 1 s **and** 100 req / 2 min ("by design very limited") | Not stated on the page (UNVERIFIED; often reported as non-expiring) | Product registration + "detailed description"; "registered without the verification process, but won't be approved for rate limit increases" |
| Production | Register a product for public use | 500 req / 10 s and 30,000 req / 10 min (expandable) | n/a | Needs working prototype/site, verification, review |

Other CONFIRMED points from the same page:
- Personal-key acceptable uses listed verbatim include "personal projects to gather your own stats", "personal research", "projects meant for personal usage and not production". Public consumption (incl. open alpha/beta) with a personal key is forbidden.
- Three layers of limits: application (per key, per region), method (per endpoint, per region), service (shared by all apps). A 429 must be honored using the `Retry-After` header; violators "may have their access disabled".
- Product review favours tools that "help players get better at our games"; "What we don't want to see are products that solve our games or make everything too simple."
- FAQ (https://developer.riotgames.com/docs/faqs): applications "typically reviewed weekly … sometimes … up to three weeks"; one product per key; no multiple applications to bypass rate limits.

### 1.2 Policies — CONFIRMED (https://developer.riotgames.com/policies/general, "LAST UPDATED: MAY 29, 2025")

- **Boilerplate required**, posted "in a location that is readily visible to players":
  `[Your product] isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.`
- "All products must be registered in, and audited by Riot Games through the Developer Portal"; new features must be audited too.
- "Products should use supported services from Riot Games for data ingestion" (i.e. the official API, not scraping).
- Use Data Dragon / Press Kit for assets.
- Game integrity: no MMR/ELO calculators; no de-anonymizing players; "should not remove game decisions, but may highlight decisions that are important".
- No crypto/blockchain, no betting.
- Developer safety: don't commit/ship the API key; use HTTPS.

LoL game policy — CONFIRMED (https://developer.riotgames.com/docs/lol#game-policy):
- Approved personal-key examples: "Personal sites", "School projects", "Creating a proof of concept for a Production Key request".
- Approved production examples include "Aggregate player stats (no specific players)" and "Training tools that allow players to view their own match histories and aggregate stats".
- Unapproved: "Products cannot display win rates for Augments or Arena Mode items"; no "game-session-specific information that would be previously unknown to the player"; "Apps that dictate player decisions".
- **Implication (UNVERIFIED inference):** Summoner's Rift aggregate win rates, matchup win rates, gold/CS diffs are within approved use cases. There is **no** prohibition on showing SR win rates. Keep the app educational ("highlight decisions"), not live in-game advice.

### 1.3 API Terms — CONFIRMED (https://developer.riotgames.com/terms, "LAST UPDATED: DECEMBER 9, 2013")

- License is "limited, non-exclusive … revocable" to use the API "for the purpose of displaying such Game Information to end users".
- Prohibited: using the API "to collect any additional information about the Game or Game users that is not provided Game Information or permitted by the Riot Games API"; distributing/sublicensing API access; sharing your key.
- **Storage:** the Terms do **not** set a cache/retention duration (none found on Terms or Policies pages). But: "Upon termination … delete all of the Game Information in Your possession."
- **GDPR:** Riot forwards end-user deletion requests "to all active developers by sharing a list of identifiers (e.g. accountId)". → If you persist PUUIDs you are expected to process these. (Design hint, UNVERIFIED: store PUUIDs only transiently for dedup, persist only aggregates + match IDs.)
- Charging for access needs Riot's prior written approval (irrelevant at $0).

### 1.4 Legal Jibber Jabber (fan content) — CONFIRMED (https://www.riotgames.com/en/legal)
- Supports "free fan projects for the benefit of the community"; suggested notice:
  `[The title of your Project] was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.`
- Prohibits using Riot IP "in games and apps" unless licensed or via a valid API key complying with API Terms.
- Relevance: covers using champion icons/splashes in a free, unpublished personal tool. Add both notices to the app footer; costs nothing.

### 1.5 Endpoints a matchup pipeline needs — CONFIRMED via `https://developer.riotgames.com/api-details/<api>` (JSON behind https://developer.riotgames.com/apis)

| Step | Endpoint | Host | Notes (CONFIRMED) |
|---|---|---|---|
| Seed players by rank | `GET /lol/league-exp/v4/entries/{queue}/{tier}/{division}?page=` | platform (e.g. `br1`, `na1`, `euw1`, `kr`) | Tiers IRON…CHALLENGER, divisions I–IV, `page` starts at 1. `LeagueEntryDTO` includes `puuid`, tier, rank, LP, wins, losses |
| (alt) Apex tiers | `/lol/league/v4/{challenger,grandmaster,master}leagues/by-queue/{queue}` and `/lol/league/v4/entries/{queue}/{tier}/{division}` | platform | |
| Match IDs | `GET /lol/match/v5/matches/by-puuid/{puuid}/ids` | regional (`americas`/`europe`/`asia`/`sea`) | Params: `startTime`/`endTime` (epoch s), `queue` (420 = Ranked Solo, see queues.json), `type=ranked`, `start`, `count` default 20, max 100. **No champion filter.** |
| Match | `GET /lol/match/v5/matches/{matchId}` | regional | `gameVersion` ("first two parts … determine the patch"), `gameDuration`, per participant `championName`, `teamPosition`/`individualPosition`, `win`, gold/CS/damage, `challenges` (e.g. `laneMinionsFirst10Minutes`, `earlyLaningPhaseGoldExpAdvantage`, `goldPerMinute`) |
| Timeline | `GET /lol/match/v5/matches/{matchId}/timeline` | regional | `frameInterval`, frames → `participantFrames` with `totalGold`, `xp`, `minionsKilled`, `jungleMinionsKilled`, `level`, `position`; plus events. Needed for exact gold/CS/XP diff @10/@15 |
| Riot ID → PUUID (only for your own account) | `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` | regional | |

Regional routing (CONFIRMED, match-v5 page): AMERICAS = NA, BR, LAN, LAS; EUROPE = EUNE, EUW, ME1, TR, RU; ASIA = KR, JP; SEA = OCE, SG2, TW2, VN2.

Pipeline shape: `league-exp entries (tier/div) → puuids → matchlist ids (queue=420, startTime=patch start) → dedupe → match → (timeline) → filter teamPosition MIDDLE/BOTTOM + champion pair → aggregate by patch (gameVersion major.minor) and tier`.
UNVERIFIED caveats: the match does not carry the rank of each player; tier comes from the seed entry (approximation — lobbies are mixed). Exact timeline frame interval value (commonly 60 000 ms) not stated on the page.

### 1.6 Throughput estimate for personal/dev key (UNVERIFIED — arithmetic from CONFIRMED limits)

- Binding limit: 100 req / 120 s ≈ **0.83 req/s ≈ 3,000 req/h ≈ 72,000 req/day per routing value**.
- Platform host (league-exp) and regional host (match-v5) are different routing values → probably separate buckets ("enforced per region"); treat as HYPOTHESIS.
- Cost per match: 1 (match) + 1 (timeline) = 2 req; matchlist ≈ 1 req per seeded player (≤100 IDs each; heavy overlap within an elo).

| Mode | Matches/hour | Matches/day (24 h continuous) |
|---|---|---|
| match + timeline, one regional cluster | ~1,300–1,450 | ~30,000–34,000 |
| match only (use `challenges` fields, skip timeline) | ~2,600–2,900 | ~60,000–68,000 |
| 4 regional clusters in parallel (if buckets independent) | ×4 | ×4 |

Dev key must be manually regenerated every 24 h → fine for on-demand runs; a personal key avoids that.

**Matchup sample reality check (CONFIRMED data point, UNVERIFIED extrapolation):** LoLalytics shows Akali vs Zed (mid), Emerald+, patch 16.22 = **136 games** (49.26% WR) — and LoLalytics claims to analyse *every* ranked game (https://lolalytics.com/lol/akali/vs/zed/build/). A sampled personal pipeline will see far fewer per patch. Mitigations: target the candidate champions (seed from high-elo players who play them, whose matchlists are dense in those champions), pool 2–3 patches, widen to Emerald+/Diamond+ across several regions, and show confidence intervals / sample counts on every stat.

### 1.7 Data Dragon — CONFIRMED (https://developer.riotgames.com/docs/lol)
- Static data + assets (champions, items, runes, summoner spells, icons, splash/loading art); per-patch tarball `https://ddragon.leagueoflegends.com/cdn/dragontail-<ver>.tgz`.
- Versions: `https://ddragon.leagueoflegends.com/api/versions.json` (live check: latest `16.22.1`); region version: `https://ddragon.leagueoflegends.com/realms/na.json`.
- "Updating Data Dragon after each League of Legends patch is a manual process, so it is not always updated immediately"; "always use the most recent Data Dragon version for a given patch".
- "All of which can be used by third-party developers"; policies name Data Dragon as the asset source.
- Champion `tags` (fetched live from `…/cdn/16.22.1/data/en_US/champion.json`): Orianna `["Mage","Support"]`, Akali `["Assassin"]`, Zed `["Assassin"]`.

### 1.8 Community Dragon — CONFIRMED (https://www.communitydragon.org/documentation)
- Community project (not Riot), "open-source organization which provides tools for scraping data from riot's content delivery network"; RAW service = data extracted from game client + LCU (live and PBE); CDN service "will be deprecated in the future".
- Self-described: "functions within a gray area, this project has been acknowledged by Riot through the Riot Developer Portal. The usage of CommunityDragon does not pose a risk to your API key."
- No license / rate-limit terms found (UNVERIFIED). `raw.communitydragon.org/robots.txt` returns 404.
- Use: richer ability data (exact spell values/ratios) than Data Dragon, if needed. Unofficial — schema can change without notice.

---

## 2. LoLalytics (lolalytics.com)

| Item | Finding |
|---|---|
| Data | CONFIRMED (matchup page above): matchup WR, games, delta vs average opponent, "normalised" delta, rank filter (default Emerald+), patch (16.22), builds/runes/skill order with WR, objectives, damage/gold/CS, "Win Rate vs Game Length" chart (present in page payload). Gold/CS diff **@15** for the matchup: not found in the page (UNVERIFIED). |
| API | No documented public API found (CONFIRMED absence on site footer: only `/info/privacy`; `/info/terms`, `/terms/`, `/tos/`, `/about/` all 404). Any JSON the frontend uses is undocumented/unofficial — not investigated. |
| Automated access | robots.txt (https://lolalytics.com/robots.txt) CONFIRMED: `User-agent: *` / `Content-Signal: search=yes,ai-train=no,use=reference` / `Allow: /`; header says "As a condition of accessing this website, you agree to abide by the following content signals" and reserves rights under EU Directive 2019/790 Art. 4. Many AI crawlers fully disallowed. No ToS page found → no explicit scraping clause (UNVERIFIED either way). |
| Freshness | Shows current patch 16.22 on 2026-11-04 (CONFIRMED). Update cadence not stated (UNVERIFIED). |
| Reliability | Large samples, claims full coverage of ranked games at selected tier; methodology of "normalised" WR not documented on page (UNVERIFIED). |
| Store/display locally | No license granted. Lowest-risk: **manual** lookup and hand-noting numbers with source+date. Bulk scraping into your DB: not prohibited by a found ToS, but no permission either (UNVERIFIED risk). Privacy page carries the Riot boilerplate. |

## 3. DPM.lol

| Item | Finding |
|---|---|
| Data | CONFIRMED (https://dpm.lol/, https://dpm.lol/tierlist, https://dpm.lol/matchups): tier list & builds "Emerald+ 16.22", leaderboards, player profiles, esports/pro, "Data Studio", **matchup videos** ("Get a video for every League Matchups … over 50K Matches"), Premium desktop app (draft assistant, overlay). Footer: "Some content is provided courtesy of Leaguepedia and Liquipedia, under a CC-BY-SA 3.0 license." |
| API | None public found. robots.txt references internal `/v1/players/...` paths (unofficial). |
| Automated access | **Prohibited.** ToS (https://dpm.lol/tos, "Last Updated: 28/04/2025"), *Limitations*: "Automated queries, including scraping and crawling, are strictly prohibited unless express written permission is granted by DPMLOL owner." Premium users also agree "not to … develop tools aimed at retrieving DPMLOL data without authorization." robots.txt disallows `/*/champions/versus`, `/*/champions/synergy`, `/v1/players/*/champions/versus-by-lane` for all bots. Governing law: France. Note: dpm.lol returns HTTP 403 to non-browser clients (curl/WebFetch); ToS read via a browser. |
| Freshness | Current patch 16.22 shown (CONFIRMED). |
| Store/display locally | Manual viewing only. Matchup **videos** are a useful *qualitative* source (watch, take own notes). |

## 4. Gol.gg (Games of Legends — pro play)

| Item | Finding |
|---|---|
| Data | CONFIRMED (https://gol.gg/champion/list/season-S16/split-ALL/tournament-ALL/): pro champion stats per season/split/tournament with Picks, Bans, Wins, Winrate, **CSD@15, GD@15, XPD@15**; tournaments, teams, players, game pages, tools (ban stats, picks & bans by patch/week). Patreon tiers include "Betting" and "Analyst" (synergy, game search engine) (https://gol.gg/premium/esports/). |
| API | None found (no API/download links in site nav/footer). |
| Automated access | robots.txt (https://gol.gg/robots.txt) CONFIRMED: `User-agent: *` disallows `/adm_lms/ /meta/ /week/ /raw/ /game/ajax.score.php /league-admin/ /user/ /summoner/ /ranking/`; several bots fully blocked. Only a "Private Policy" page exists (https://gol.gg/policy/private-policy/); it mentions "Terms of Use" but none is linked (UNVERIFIED whether one exists). |
| Freshness | Current through Worlds 2026 (CONFIRMED in tournament list). |
| Reliability | Pro games only → small samples, coordinated play, different meta. Good for *how pros play the matchup*, weak for solo-queue win rates. |
| Store/display locally | No license stated. Manual reference with attribution. Footer has Riot boilerplate. |

## 5. Alternatives

| Source | API / dump | Automated access terms | Notes |
|---|---|---|---|
| **U.GG** | No public API found (UNVERIFIED) | robots.txt CONFIRMED: `User-agent: *` `Content-Signal: search=yes,ai-train=no,use=reference`, then `Disallow: /*?*` (query URLs). ToS (https://u.gg/terms-of-service) **could not be read**: Cloudflare bot-verification page; I did not bypass it (UNVERIFIED). | Manual only. |
| **OP.GG** | **Official MCP server** (CONFIRMED, https://github.com/opgginc/opgg-mcp, MIT license for the code, last push 2026-10-29): endpoint `https://mcp-api.op.gg/mcp`, tools incl. `lol_get_champion_analysis` (win/pick/ban, counters), `lol_get_lane_matchup_guide`, `lol_list_lane_meta_champions`. Terms for *data* use via MCP not stated in README (UNVERIFIED). | ToS (https://op.gg/lol/policies/agreement) CONFIRMED: license "for your personal, non-commercial use"; prohibited "scraping or data mining while using the Sites or Services" and "use automated scripts to collect information". robots.txt: `User-Agent: *` `Allow: /`. | MCP = the only *sanctioned* programmatic third-party stats feed found. Useful as an LLM-assisted cross-check, not as a bulk source. |
| **Mobalytics** | None public found | ToS (https://mobalytics.gg/terms/, "Last Updated: July 23, 2026") CONFIRMED: may not "access or search the Services … or download Content … through the use of any engine, software, tool, agent … (including spiders, robots, crawlers, data mining tools or the like)" other than browsers/search agents. | Manual only. |
| **Leaguepedia** (lol.fandom.com) | **Yes — MediaWiki API + Cargo (SQL-like)** CONFIRMED (https://lol.fandom.com/wiki/Help:Leaguepedia_API): endpoint `https://lol.fandom.com/api.php`; tables e.g. ScoreboardGames/ScoreboardPlayers, picks & bans; 500 rows/query (5,000 admin); "made available as a courtesy … without guarantee of stability or accuracy"; logged-out Cargo queries "practically impossible" due to Fandom rate limits → use a bot password (you create it yourself). | robots.txt CONFIRMED: `User-agent: *` `Allow: /api.php?action=`. License CONFIRMED (page footer): "Content is available under CC BY-SA 3.0 unless otherwise noted" (https://www.fandom.com/licensing). | Pro play only (results, scoreboards, picks/bans, rosters). CC BY-SA: attribution + share-alike if you redistribute; personal local storage is fine. |
| **Oracle's Elixir** | **Yes — CSV match-data downloads** via Google Drive CONFIRMED (https://oracleselixir.com/tools/downloads): LCS, LEC, LCK, LPL, PCS, CBLOL, more; "provided free of charge … intended for use by analysts, commentators, and fans"; "updated ONCE PER DAY". | No formal license; page states "Game statistics are the property of Riot Games, and any usage of such data must follow Riot Games' terms and policies"; includes Leaguepedia content under CC-BY-SA 3.0. robots.txt: `Allow: /` with `ai-train=no`. | Best pro dataset: per-player per-game rows incl. early-game diffs (column set per Definitions page — not verified). Download manually ≤1×/day. |

---

## 6. Qualitative coaching sources (YouTube, Mobafire, coach sites, Reddit)

CONFIRMED (platform terms):
- YouTube Terms (https://www.youtube.com/static?template=terms): may not "access, reproduce, download … any part of the Service or any Content" except as authorized, nor "access the Service using any automated means (such as robots, botnets or scrapers)" except search engines/with permission. → Don't download videos or bulk-scrape transcripts; watch and write your own notes.
- Reddit User Agreement (https://www.redditinc.com/policies/user-agreement): "scraping the Services without Reddit's prior written consent is prohibited".
- Mobafire: robots.txt (https://www.mobafire.com/robots.txt) disallows `/ajax/`, `/json/`, tools paths for `*`; ToS page returned 403 (UNVERIFIED).

General copyright principles (UNVERIFIED as applied to you — not legal advice):
- Ideas, methods and facts are not protected; expression is. US 17 U.S.C. §102(b) CONFIRMED (https://www.copyright.gov/title17/92chap1.html): no protection for "any idea, procedure, process, system, method of operation, concept, principle, or discovery". "Zed spikes at 6; respect W-E all-in" is an idea → your own paraphrase is fine.
- Verbatim copies (full transcripts, guide text, screenshots) are reproductions; private, non-commercial, attributed, small excerpts are the lowest-risk end (fair use factors in US §107; most countries have a narrower private-copy exception — e.g. Brazil's Lei 9.610/98 art. 46 allows copying of small excerpts for the copier's private use, UNVERIFIED: planalto.gov.br unreachable).
- EU has a separate *database right* for substantial extraction from databases (relevant to bulk-copying stats sites like DPM, French) (UNVERIFIED applicability).
- Recommended practice: store **paraphrased notes in your own words** + `source_url`, `creator`, `video timestamp`, `patch`, `date_noted`; keep any verbatim quote short (a sentence). Never redistribute.

---

## 7. Community class taxonomy ("Control Mage")

- CONFIRMED (https://wiki.leagueoflegends.com/en-us/Champion_classes): the wiki uses Riot's class system — Controller (Enchanter, Catcher), Fighter (Juggernaut, Diver), Mage (**Burst, Battlemage, Artillery**), Marksman, Slayer (**Assassin, Skirmisher**), Tank, Specialist — and since Jan 2021 also shows the legacy client classes. Zed and Akali are listed as Assassin examples.
- Champion pages CONFIRMED: **Orianna** — Class: Burst; Legacy: Mage, Support. **Akali** — Assassin; Legacy: Assassin. **Zed** — Assassin; Legacy: Assassin.
- "Control mage" is **not** a class on the wiki: a full-text wiki search for "control mage" returned only 3 champion *development* pages (Vex, Taliyah, Zyra) (CONFIRMED via wiki API search). It is widely used informally by guide sites (web search hits on Orianna guides, e.g. Mobafire, dodge.gg, metabot.gg) → a community *descriptor*, not a standard taxonomy.
- Recommendation: model `riot_subclass` (from wiki) and a free-form `archetype_tags` (e.g. "control mage", "lane bully") field, with source per tag.

---

## (a) Summary comparison

| Source | Data relevant to LoLMechs | Official API | Automated access allowed? | Freshness | Store locally (personal) |
|---|---|---|---|---|---|
| Riot API (match-v5, league-exp-v4) | Raw ranked matches → every stat you want (WR, by duration, by patch/rank, gold/CS/XP @15) | Yes | **Yes**, within key limits + policies | Live | Yes; delete on termination; honor GDPR deletion lists |
| Data Dragon | Champions/items/runes/icons, patch versions | Yes (static CDN) | Yes | Per patch, manual (may lag) | Yes |
| Community Dragon | Detailed client data | Unofficial | Not addressed; "acknowledged by Riot" | Per patch + PBE | Yes (no license stated) |
| LoLalytics | Matchup WR, games, WR vs game length, builds | No | Not prohibited by any found ToS; robots `Allow: /` with content-signals | Current patch | Manual notes only (no license) |
| DPM.lol | Tier list, pro/high-elo matchup videos | No | **No** (ToS) | Current patch | Manual only |
| Gol.gg | Pro champion GD/CSD/XPD@15 | No | Partially restricted by robots; no ToS found | Current | Manual reference |
| U.GG | Builds, matchups | No | ToS unread (bot wall) | — | Manual |
| OP.GG | Champion analysis, counters, lane matchup guide | **MCP server** (official) | Website: **No** (ToS); MCP: sanctioned endpoint, data terms unstated | Current | Cross-check only |
| Mobalytics | Guides, stats | No | **No** (ToS) | — | Manual |
| Leaguepedia | Pro scoreboards, picks/bans | Yes (MediaWiki/Cargo) | Yes via api.php | Near-live | Yes, CC BY-SA 3.0 |
| Oracle's Elixir | Pro per-game CSV | Download | Yes (manual download, ≤1/day) | Daily | Yes, subject to Riot terms |
| YouTube / Reddit / guides | Coaching knowledge | — | **No** scraping/downloading | — | Own paraphrased notes + attribution |

## (b) Recommended acquisition strategy

**Primary — own pipeline on the Riot API (quantitative):**
1. Start with the auto-issued **development key** to prototype (no approval). Then **register a personal product** in the Developer Portal for a personal key (no daily reset; acceptable uses explicitly include personal research). Key lives in a local `.env`, never committed.
2. Pipeline: league-exp-v4 (Emerald I → Master+, 1–3 platforms, e.g. BR1/NA1/EUW1/KR) → PUUIDs → match-v5 ids (`queue=420`, `startTime`=patch start) → dedupe → match → timeline only for matches containing a target matchup (MIDDLE: Akali/Zed/Orianna vs opponents; BOTTOM later). This "filter before timeline" step roughly halves cost.
3. Seed preferentially from players whose recent games contain the target champions to raise matchup hit-rate.
4. Throttle client-side under 20/s and 100/2 min per routing value, obey `Retry-After`. Expect ~1.3–2.9k matches/hour per regional cluster (estimate).
5. Aggregate per `patch × tier bracket × lane × champion pair`; show sample size + confidence interval; pool patches when n is small. Persist aggregates and match IDs; avoid long-term PUUID storage.
6. Static data + images from **Data Dragon** (version from versions.json/realms); Community Dragon only if you need spell-level detail.
7. Add Riot's boilerplate + Legal Jibber Jabber notice to the app footer.

**Fallback 1 — manual reference + sanctioned feeds:**
- Manually look up LoLalytics/U.GG for sanity checks and early-patch numbers; record `value, sample size, rank, patch, source URL, date` by hand.
- OP.GG MCP (official) for LLM-assisted cross-checks of WR/counters.

**Fallback 2 — pro play context:** Oracle's Elixir CSV (daily, manual download) and/or Leaguepedia Cargo API for pro GD/CSD@15 and picks; gol.gg for manual browsing.

**Qualitative:** watch creators (YouTube, DPM matchup videos, coach sites), write your own structured notes (power spikes, trading pattern, wave plan, win condition) with creator + URL + timestamp + patch. No downloading, no transcript scraping, no bulk copying of guide text.

**Avoid:** scraping DPM.lol, OP.GG website, Mobalytics, YouTube, Reddit (all prohibited in ToS read); bypassing bot walls.

## (c) Open questions / risks for you to decide

1. **Key type:** stay on the dev key (24 h manual reset) or register a personal product (review can take 1–3 weeks)? Recommended: register now, prototype on dev key meanwhile.
2. **Sample size vs. patch freshness:** even full-coverage LoLalytics has ~136 Akali-vs-Zed Emerald+ games on 16.22. Accept pooling patches / wider ranks, or show "insufficient data"?
3. **Rank attribution:** match data has no per-player rank; accept "seed tier" as proxy, or spend extra league-v4 `entries/by-puuid` calls per opponent (≈10× cost)?
4. **Regions:** which platforms (BR1 only? add KR/EUW for volume)? More regions = more data, but meta differs.
5. **Timeline cost:** need exact @15 diffs (timeline, 2× cost), or are `challenges` fields (`earlyLaningPhaseGoldExpAdvantage`, `laneMinionsFirst10Minutes`) enough for some stats?
6. **PUUID retention / GDPR:** keep only aggregates + match IDs (simplest), or keep PUUIDs and handle Riot's deletion lists?
7. **Third-party numbers:** is hand-copying LoLalytics values into your notes acceptable to you given no ToS was found (robots `Allow: /`, content-signals header)? Do you want U.GG's ToS checked manually in your browser (bot wall blocked me)?
8. **Policy drift:** Riot policies say developers "must remain up to date"; API Terms dated 2013, Policies dated 2025-05-29. Re-check before each major build phase.
9. **Unofficial deps:** Community Dragon and Leaguepedia Cargo can change schema without notice; OP.GG MCP data-use terms unstated.
