# A Matchup is an unordered champion pair in a Lane, with at least one Focus Champion

A Matchup is {champion A, champion B} in one Lane, stored once and shown from the perspective of whichever Focus Champion the user navigated from. At least one side must be a Focus Champion of that Lane. Every Insight is tagged with the side it is about (A, B or both). We rejected a directional "Focus vs Opponent" Matchup because two Focus Champions can meet (Akali vs Zed), and a directional model would split that knowledge into two pages that drift apart.
