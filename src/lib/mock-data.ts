import type { CurrencyInfo, EconomicEvent, Impact, MarketQuote, NewsArticle } from "./types";

function atTime(dayOffset: number, hourUTC: number, minuteUTC = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + dayOffset);
  d.setUTCHours(hourUTC, minuteUTC, 0, 0);
  return d.toISOString();
}

let eventSeq = 0;
function ev(
  dayOffset: number,
  hourUTC: number,
  minuteUTC: number,
  currency: string,
  impact: Impact,
  title: string,
  forecast: string | null,
  previous: string | null,
  description: string,
  extra?: Partial<EconomicEvent>
): EconomicEvent {
  const past = dayOffset < 0;
  eventSeq += 1;
  return {
    id: `evt-${eventSeq.toString().padStart(3, "0")}`,
    date: atTime(dayOffset, hourUTC, minuteUTC),
    currency,
    impact,
    title,
    actual: past && impact !== "holiday" ? previous : null,
    forecast,
    previous,
    description,
    source: extra?.source ?? "National Statistics Office",
    measures: extra?.measures ?? "Change in the reported indicator versus the previous period.",
    usualEffect:
      extra?.usualEffect ??
      "Actual greater than forecast is typically good for the currency.",
    frequency: extra?.frequency ?? "Monthly",
    ...extra,
  };
}

export const EVENTS: EconomicEvent[] = [
  // Yesterday
  ev(-1, 0, 30, "AUD", "medium", "Building Approvals m/m", "1.8%", "-2.4%",
    "Measures the change in the number of new building approvals issued. It is a leading indicator of future construction activity.",
    { source: "Australian Bureau of Statistics", frequency: "Monthly" }),
  ev(-1, 12, 30, "USD", "high", "Core PCE Price Index m/m", "0.3%", "0.2%",
    "The Federal Reserve's preferred inflation gauge. Measures the change in prices of goods and services purchased by consumers, excluding food and energy.",
    { source: "Bureau of Economic Analysis", usualEffect: "Actual greater than forecast is typically good for the USD, as it raises rate-hike expectations." }),
  ev(-1, 14, 0, "USD", "medium", "Pending Home Sales m/m", "0.6%", "-0.8%",
    "Change in the number of homes under contract to be sold but still awaiting the closing transaction.",
    { source: "National Association of Realtors" }),
  ev(-1, 14, 30, "USD", "low", "Crude Oil Inventories", "-1.2M", "0.9M",
    "Change in the number of barrels of crude oil held in inventory by commercial firms during the past week.",
    { source: "Energy Information Administration", frequency: "Weekly" }),
  ev(-1, 23, 50, "JPY", "medium", "Industrial Production m/m", "0.4%", "-1.1%",
    "Measures the change in the total inflation-adjusted value of output produced by manufacturers, mines, and utilities.",
    { source: "Ministry of Economy, Trade and Industry" }),
  // Today
  ev(0, 0, 30, "AUD", "high", "CPI q/q", "0.9%", "1.0%",
    "Measures the change in the price of goods and services purchased by consumers. Consumer prices account for a majority of overall inflation.",
    { source: "Australian Bureau of Statistics", frequency: "Quarterly" }),
  ev(0, 6, 0, "EUR", "medium", "German Import Prices m/m", "0.2%", "-0.1%",
    "Measures the change in the price of imported goods purchased domestically.",
    { source: "Destatis" }),
  ev(0, 9, 0, "EUR", "medium", "M3 Money Supply y/y", "2.1%", "2.0%",
    "Change in the total quantity of domestic currency in circulation and deposited in banks.",
    { source: "European Central Bank" }),
  ev(0, 12, 30, "USD", "high", "Advance GDP q/q", "2.4%", "2.8%",
    "Annualized change in the inflation-adjusted value of all goods and services produced by the economy. It is the broadest measure of economic activity.",
    { source: "Bureau of Economic Analysis", frequency: "Quarterly" }),
  ev(0, 12, 30, "USD", "medium", "Unemployment Claims", "219K", "224K",
    "Measures the number of individuals who filed for unemployment insurance for the first time during the past week.",
    { source: "Department of Labor", frequency: "Weekly" }),
  ev(0, 13, 45, "EUR", "high", "Main Refinancing Rate", "2.15%", "2.15%",
    "The interest rate on the main refinancing operations that provide the bulk of liquidity to the banking system.",
    { source: "European Central Bank", frequency: "8 times per year", usualEffect: "Actual greater than forecast is good for the EUR." }),
  ev(0, 14, 30, "EUR", "high", "ECB Press Conference", null, null,
    "The ECB President reads a prepared statement and answers press questions. Unscripted answers frequently create heavy market volatility.",
    { source: "European Central Bank", frequency: "8 times per year", measures: "Qualitative guidance on monetary policy and the economic outlook." }),
  ev(0, 18, 0, "USD", "low", "Natural Gas Storage", "52B", "48B",
    "Change in the number of cubic feet of natural gas held in underground storage during the past week.",
    { source: "Energy Information Administration", frequency: "Weekly" }),
  // Tomorrow
  ev(1, 0, 30, "JPY", "high", "Tokyo Core CPI y/y", "2.7%", "2.5%",
    "Leading indicator of national consumer inflation for Japan, released a month ahead of the national figure.",
    { source: "Statistics Bureau of Japan" }),
  ev(1, 1, 30, "CNY", "medium", "Manufacturing PMI", "50.1", "49.8",
    "Diffusion index based on surveyed purchasing managers in the manufacturing industry. Above 50.0 indicates expansion.",
    { source: "National Bureau of Statistics of China" }),
  ev(1, 7, 0, "GBP", "medium", "Nationwide HPI m/m", "0.3%", "0.5%",
    "Change in the average price of homes financed by Nationwide Building Society.",
    { source: "Nationwide Building Society" }),
  ev(1, 12, 30, "USD", "high", "Non-Farm Employment Change", "168K", "147K",
    "Change in the number of employed people during the previous month, excluding the farming industry. Job creation is the foremost indicator of consumer spending.",
    { source: "Bureau of Labor Statistics", usualEffect: "Actual greater than forecast is typically good for the USD." }),
  ev(1, 12, 30, "USD", "high", "Unemployment Rate", "4.2%", "4.2%",
    "Percentage of the total work force that is unemployed and actively seeking employment during the previous month.",
    { source: "Bureau of Labor Statistics" }),
  ev(1, 14, 0, "USD", "medium", "ISM Manufacturing PMI", "49.5", "49.0",
    "Diffusion index based on surveyed purchasing managers in the manufacturing industry.",
    { source: "Institute for Supply Management" }),
  // +2 days
  ev(2, 4, 30, "AUD", "high", "RBA Rate Statement", null, null,
    "The Reserve Bank of Australia's primary tool for communicating monetary policy. It contains the outcome of the rate decision and commentary on economic conditions.",
    { source: "Reserve Bank of Australia", frequency: "8 times per year" }),
  ev(2, 9, 0, "EUR", "medium", "Final Services PMI", "51.2", "51.0",
    "Diffusion index based on surveyed purchasing managers in the services industry.",
    { source: "S&P Global" }),
  ev(2, 12, 30, "CAD", "medium", "Trade Balance", "-0.7B", "-1.1B",
    "Difference in value between imported and exported goods during the reported month.",
    { source: "Statistics Canada" }),
  ev(2, 23, 50, "JPY", "low", "Household Spending y/y", "1.2%", "0.9%",
    "Change in the inflation-adjusted value of all expenditures by consumers.",
    { source: "Statistics Bureau of Japan" }),
  // +3 days
  ev(3, 11, 0, "GBP", "high", "BOE Official Bank Rate", "4.00%", "4.25%",
    "Interest rate at which the Bank of England lends to financial institutions overnight. Short-term interest rates are the paramount factor in currency valuation.",
    { source: "Bank of England", frequency: "8 times per year" }),
  ev(3, 11, 30, "GBP", "medium", "Monetary Policy Summary", null, null,
    "Released alongside the rate decision, it contains the vote split and the BOE's economic assessment.",
    { source: "Bank of England", frequency: "8 times per year" }),
  ev(3, 13, 15, "USD", "medium", "ADP Non-Farm Employment Change", "95K", "104K",
    "Estimated change in the number of employed people during the previous month, excluding farming and government.",
    { source: "Automatic Data Processing, Inc." }),
  ev(3, 0, 0, "NZD", "holiday", "Bank Holiday — Anniversary Day", null, null,
    "New Zealand banks are closed in observance of Anniversary Day. Expect lower liquidity in NZD pairs.",
    { source: "New Zealand Government", frequency: "Annual", impact: "holiday", actual: null }),
];

function ago(hours: number): string {
  return new Date(Date.now() - hours * 3600_000).toISOString();
}

let newsSeq = 0;
function article(
  hoursAgo: number,
  title: string,
  summary: string,
  source: string,
  category: NewsArticle["category"],
  readMinutes: number,
  body: string[]
): NewsArticle {
  newsSeq += 1;
  return {
    id: `news-${newsSeq.toString().padStart(3, "0")}`,
    title,
    summary,
    body,
    source,
    category,
    publishedAt: ago(hoursAgo),
    readMinutes,
  };
}

export const NEWS: NewsArticle[] = [
  article(1, "Dollar steady ahead of advance GDP print as traders brace for ECB",
    "The US dollar held near weekly highs in early trading as markets positioned for a double dose of event risk: US advance GDP and the European Central Bank's rate decision.",
    "Reuters", "Breaking", 3, [
      "The US dollar index hovered near its weekly highs on Thursday as traders refrained from large directional bets ahead of two closely watched releases: the first estimate of US second-quarter GDP and the European Central Bank's policy decision.",
      "Futures markets price the ECB as overwhelmingly likely to hold rates steady, putting the focus squarely on President Lagarde's press conference for clues about the autumn path.",
      "\"It is a classic wait-and-see session,\" said one strategist at a European bank. \"The GDP number sets the tone for the dollar, but the ECB presser is where the volatility will come from.\"",
      "EUR/USD traded in a narrow band through the Asian session, while Treasury yields edged lower.",
    ]),
  article(3, "Euro slips as soft money supply data clouds ECB outlook",
    "The euro edged lower after eurozone M3 money supply growth came in broadly in line with expectations but lending to households continued to cool.",
    "Bloomberg", "Central Banks", 4, [
      "The euro softened against the dollar and the pound after the latest eurozone monetary aggregates pointed to continued weakness in credit creation across the bloc.",
      "M3 money supply grew 2.0% year-on-year, close to the 2.1% consensus, but the details showed lending to households decelerating for a third consecutive month.",
      "Economists said the figures are unlikely to change the ECB's near-term stance but strengthen the case for a cut later in the year if activity data disappoints.",
    ]),
  article(5, "Yen rallies as Tokyo inflation beats, stoking BOJ hike bets",
    "The yen strengthened across the board after Tokyo core CPI rose more than expected, reviving speculation that the Bank of Japan could tighten policy again this year.",
    "Nikkei", "Breaking", 3, [
      "Tokyo's core consumer price index rose 2.7% from a year earlier, above the 2.5% median forecast, keeping pressure on the Bank of Japan to continue normalizing policy.",
      "USD/JPY fell sharply on the release as short-term rates markets moved to price a higher probability of a hike at the next meeting.",
      "Analysts cautioned that one strong regional print does not make a trend, but acknowledged the direction of travel is becoming harder for the BOJ to ignore.",
    ]),
  article(8, "Oil steadies after inventory draw, traders eye demand signals from China",
    "Crude prices were little changed after a larger-than-expected draw in US crude inventories offset lingering concerns about Chinese demand.",
    "Reuters", "Analysis", 4, [
      "US crude inventories fell more than expected last week, according to government data, lending support to prices that have been range-bound for most of the month.",
      "Attention now turns to China's manufacturing PMI, due Friday, for fresh signals on demand from the world's largest crude importer.",
      "\"The market is caught between a tightening physical balance and macro headwinds,\" one analyst said. \"Until one of those breaks, expect chop.\"",
    ]),
  article(12, "Cable consolidates ahead of Bank of England as markets price a cut",
    "Sterling traded sideways with rates markets nearly fully pricing a 25bp cut from the Bank of England at next week's meeting.",
    "Financial Times", "Central Banks", 5, [
      "The pound was little changed against both the dollar and the euro as investors awaited the Bank of England's policy announcement, with a quarter-point cut nearly fully priced.",
      "The key uncertainty is the vote split and whether the MPC signals a faster easing cadence into year-end.",
      "A hawkish surprise — a hold, or a cut framed as cautious — could see sterling pop, strategists said, while a dovish cut leaves it vulnerable to a slide toward recent lows.",
    ]),
  article(16, "Gold holds near record highs as real yields drift lower",
    "Gold prices consolidated near all-time highs, supported by easing real yields and persistent central-bank buying.",
    "Bloomberg", "Analysis", 3, [
      "Bullion steadied after touching fresh records earlier in the week, with traders citing declining real yields and steady official-sector demand as the twin pillars of the rally.",
      "Analysts at several banks have raised their year-end targets, though some warn positioning is now stretched.",
    ]),
  article(20, "Aussie in focus as quarterly CPI looms over RBA decision",
    "The Australian dollar faces a pivotal week with quarterly inflation data landing just before the Reserve Bank's rate decision.",
    "Reuters", "Analysis", 4, [
      "AUD/USD firmed modestly as traders positioned for Australia's quarterly CPI, the key domestic input into the RBA's policy calculus.",
      "A trimmed-mean print at or below the RBA's forecast would likely seal a cut; a hot number could force the bank to push back against easing expectations.",
    ]),
  article(26, "Technical outlook: EUR/USD coils inside a tightening range",
    "A look at the key levels traders are watching as EUR/USD volatility compresses ahead of major event risk.",
    "FXStreet", "Technical", 6, [
      "EUR/USD has spent two weeks in an increasingly narrow range, with implied volatility sinking ahead of the ECB and US data deluge.",
      "Technicians point to a well-defined support shelf below spot and a descending trendline capping rallies; a break of either on a closing basis should invite follow-through.",
      "Options markets are pricing a breakout-sized move for the week, suggesting complacency is low despite the quiet tape.",
    ]),
  article(30, "Understanding central bank divergence and what it means for FX",
    "Interest rate differentials are the engine of currency trends. Here is how to read the divergence trade in the current cycle.",
    "Forex News Desk", "Education", 7, [
      "Currency valuation is, at its core, a relative game: what matters is not where a central bank sets rates, but where it sets them relative to everyone else — and where markets expect that gap to go.",
      "In the current cycle, the Federal Reserve, ECB, BOE, and BOJ are moving at different speeds and, in Japan's case, in a different direction entirely.",
      "That divergence creates persistent, tradable trends in pairs like USD/JPY and EUR/GBP, but it also means positioning can unwind violently when expectations shift.",
    ]),
  article(36, "Swiss franc strengthens as safe-haven demand ticks up",
    "The franc outperformed its G10 peers as modest risk aversion returned to equity markets.",
    "Reuters", "Breaking", 2, [
      "The Swiss franc gained against the euro and the dollar as a soft session in global equities revived demand for traditional havens.",
      "The SNB is widely seen as comfortable with gradual franc strength given subdued domestic inflation.",
    ]),
  article(48, "Five things to watch in this week's non-farm payrolls report",
    "From wage growth to participation, here is a checklist for reading the most important US data release of the month.",
    "Forex News Desk", "Education", 5, [
      "Friday's employment report arrives at a delicate moment for the Fed, with inflation progress intact but the labor market showing early signs of cooling.",
      "Beyond the headline, traders will focus on average hourly earnings, the participation rate, revisions to prior months, and the household survey.",
      "History suggests the dollar's reaction function is asymmetric: a big miss moves markets more than a big beat when easing is already priced.",
    ]),
  article(55, "Canadian dollar lags as trade deficit widens",
    "The loonie underperformed after Canada posted a wider-than-expected merchandise trade deficit.",
    "Bloomberg", "Analysis", 3, [
      "USD/CAD pushed higher after data showed Canada's trade balance deteriorated more than economists forecast, with exports slipping and imports rising.",
      "The Bank of Canada has signaled comfort with current policy settings, leaving the currency sensitive to external drivers like oil and the US outlook.",
    ]),
];

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function spark(base: number, seed: number): number[] {
  const rand = seeded(seed);
  const pts: number[] = [];
  let v = base;
  for (let i = 0; i < 24; i++) {
    v += (rand() - 0.5) * base * 0.004;
    pts.push(Number(v.toFixed(5)));
  }
  return pts;
}

function quote(
  symbol: string,
  name: string,
  price: number,
  changePct: number,
  decimals: number,
  seed: number
): MarketQuote {
  const change = price * (changePct / 100);
  const spread = price * 0.0002;
  return {
    symbol,
    name,
    bid: Number(price.toFixed(decimals)),
    ask: Number((price + spread).toFixed(decimals)),
    change: Number(change.toFixed(decimals)),
    changePct,
    dayHigh: Number((price * 1.004).toFixed(decimals)),
    dayLow: Number((price * 0.996).toFixed(decimals)),
    decimals,
    sparkline: spark(price, seed),
  };
}

export const QUOTES: MarketQuote[] = [
  quote("EUR/USD", "Euro / US Dollar", 1.0842, 0.12, 4, 11),
  quote("GBP/USD", "British Pound / US Dollar", 1.2951, -0.08, 4, 12),
  quote("USD/JPY", "US Dollar / Japanese Yen", 149.62, -0.34, 2, 13),
  quote("USD/CHF", "US Dollar / Swiss Franc", 0.8798, 0.05, 4, 14),
  quote("AUD/USD", "Australian Dollar / US Dollar", 0.6591, 0.21, 4, 15),
  quote("USD/CAD", "US Dollar / Canadian Dollar", 1.3647, 0.09, 4, 16),
  quote("NZD/USD", "New Zealand Dollar / US Dollar", 0.6023, -0.15, 4, 17),
  quote("EUR/GBP", "Euro / British Pound", 0.8372, 0.19, 4, 18),
  quote("EUR/JPY", "Euro / Japanese Yen", 162.21, -0.22, 2, 19),
  quote("GBP/JPY", "British Pound / Japanese Yen", 193.74, -0.41, 2, 20),
  quote("EUR/CHF", "Euro / Swiss Franc", 0.9539, 0.17, 4, 21),
  quote("AUD/JPY", "Australian Dollar / Japanese Yen", 98.61, -0.12, 2, 22),
  quote("XAU/USD", "Gold / US Dollar", 2412.4, 0.46, 1, 23),
  quote("XAG/USD", "Silver / US Dollar", 28.14, 0.62, 2, 24),
  quote("WTI", "Crude Oil WTI", 78.42, -0.85, 2, 25),
  quote("US500", "S&P 500 Index", 5486.2, 0.31, 1, 26),
  quote("US30", "Dow Jones Industrial Average", 40291.0, 0.18, 0, 27),
  quote("NAS100", "Nasdaq 100 Index", 19312.5, 0.54, 1, 28),
  quote("BTC/USD", "Bitcoin / US Dollar", 67420.0, 1.24, 0, 29),
  quote("DXY", "US Dollar Index", 104.12, -0.06, 2, 30),
];

export const CURRENCIES: CurrencyInfo[] = [
  {
    code: "USD",
    name: "US Dollar",
    nation: "United States",
    centralBank: "Federal Reserve",
    interestRate: "4.25% – 4.50%",
    nickname: "Greenback",
    description:
      "The US dollar is the world's primary reserve currency and the most traded currency on the planet, involved in the vast majority of all FX transactions. Its value is driven by Federal Reserve policy, US economic data, and global risk sentiment.",
  },
  {
    code: "EUR",
    name: "Euro",
    nation: "Eurozone",
    centralBank: "European Central Bank",
    interestRate: "2.15%",
    nickname: "Fiber",
    description:
      "The euro is the shared currency of the eurozone and the second most traded currency in the world. EUR/USD is the most liquid currency pair globally. Watch ECB policy decisions, German data, and eurozone inflation prints.",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    nation: "Japan",
    centralBank: "Bank of Japan",
    interestRate: "0.50%",
    nickname: "Yen",
    description:
      "The yen is a traditional safe-haven currency that tends to strengthen during risk-off episodes. Decades of ultra-loose Bank of Japan policy made it the funding currency of choice for carry trades, though normalization is underway.",
  },
  {
    code: "GBP",
    name: "British Pound",
    nation: "United Kingdom",
    centralBank: "Bank of England",
    interestRate: "4.25%",
    nickname: "Cable",
    description:
      "The pound is one of the oldest currencies still in use and among the most traded. GBP pairs are known for their volatility. Key drivers include Bank of England policy, UK inflation, and domestic political developments.",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    nation: "Australia",
    centralBank: "Reserve Bank of Australia",
    interestRate: "3.60%",
    nickname: "Aussie",
    description:
      "The Australian dollar is a commodity-linked currency highly sensitive to Chinese demand, iron ore prices, and global risk appetite. It is a favorite proxy for Asia-Pacific growth sentiment.",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    nation: "Canada",
    centralBank: "Bank of Canada",
    interestRate: "2.75%",
    nickname: "Loonie",
    description:
      "The Canadian dollar is closely correlated with crude oil prices given Canada's status as a major energy exporter. Bank of Canada policy and US economic spillovers are the other key drivers.",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    nation: "Switzerland",
    centralBank: "Swiss National Bank",
    interestRate: "0.00%",
    nickname: "Swissy",
    description:
      "The Swiss franc is the premier safe-haven currency, backed by Switzerland's political neutrality, strong institutions, and current account surplus. The SNB has historically intervened to limit excessive appreciation.",
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
    nation: "New Zealand",
    centralBank: "Reserve Bank of New Zealand",
    interestRate: "3.25%",
    nickname: "Kiwi",
    description:
      "The New Zealand dollar is influenced by dairy prices, RBNZ policy, and broader risk sentiment. It often trades as a higher-beta sibling of the Australian dollar.",
  },
];
