Build a Wikipedia attention tracker in this React + TypeScript app, using
the installed `@han-sen/tally-ui` component library for the UI. Don't add
other UI libraries.

Use the Wikimedia APIs (no API key needed):

- Pageviews: https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/
- Article search: https://www.mediawiki.org/wiki/API:Opensearch

Cover September 1–30, 2026 for English Wikipedia, counting views by people
(not bots).

The app should let someone:

1. Find any article by typing part of its title, with suggestions appearing
   as they type.
2. Compare up to three articles: daily views across September on one view,
   with each article clearly told apart.
3. See each selected article's total September views, how that changed from
   August, and its busiest day.
4. See the ten most-viewed articles on September 30, ranked with their view
   counts. Leave out pages that aren't articles, like the Main Page and
   special pages.
5. Remove an article from the comparison.

Handle the states a real user will hit: data still loading, an article with
no views in the range, and a request that fails. It should work with the
keyboard and a screen reader.

When you're done, the app should type-check and build with no errors.
