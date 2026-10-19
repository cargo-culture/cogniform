# Cogniform specification — approved working rules

Approved: 2026-10-19

## Semantic inventory

The language uses exactly 24 atomic semantic primitives (semes). Concepts are connected structures of one or more semes.

The semes are:

THING, ONE, CHANGE, WITH, QUALITY, NEGATION, MANY, IN, DO, TIME, POSSIBILITY, NECESSITY, PLACE, SIZE, CAUSE, POWER, VALUE, ALIVE, KNOW, WANT, SIGN, PERCEIVE, EXIST, ORDER.

## Geometry

- Four concentric rings (R1–R4), six seme positions per ring (a–f).
- Rings rotate continuously and independently.
- Circumferential physical segments join neighboring positions on the same ring.
- Radial physical segments join aligned positions on adjacent rings.
- No physical diagonal segments.
- No physical radial skipping of intervening rings.

## Routed semantic bonds

Semantic connection and physical routing are distinct.

A semantic bond may be drawn through any legal sequence of lattice segments. If the line passes through an inactive seme position, that seme remains visually unmarked and contributes no meaning.

Only explicitly active seme nodes participate semantically.

Direct routes are preferred when available because they are shorter, but route length does not change the semantic bond.

## Structural operators

Structural operators are not semes.

### QUERY

Marks a semantic slot as requested or unknown.

Examples:
- WHAT → ?THING
- WHO → ?ALIVE
- WHERE → ?PLACE
- WHEN → ?TIME

### INDEX

Anchors a concept to discourse context.

Working states:
- @O — discourse origin / speaker / viewpoint
- @A — addressee
- @R — established referent
- near / far may modify the anchor

### ORDER polarity

ORDER may carry + or − orientation along an understood dimension.

Examples:
- TO → ORDER+—PLACE
- FROM → ORDER−—PLACE
- AFTER → ORDER+—TIME
- MORE → ORDER+—SIZE

### MEASURE

TIME or SIZE may carry an exact quantitative payload without adding new semes.

Examples:
- DAY → TIME #(24 h)
- YEAR → TIME #(1 year)

## Lexical policy

English words are test probes, not canonical vocabulary slots.

- Different English words may map to the same cognitoform.
- English grammatical distinctions do not require new semes unless they encode a semantic distinction the system needs.
- Polysemous English words split into separate cognitoforms by sense.
- Gender, case, person, deixis, and viewpoint are represented structurally when relevant rather than as English-specific semantic primitives.

## Current coordinates

| Ring | a | b | c | d | e | f |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | NEGATION | WITH | QUALITY | CHANGE | EXIST | THING |
| R2 | IN | MANY | ORDER | TIME | DO | ONE |
| R3 | PLACE | SIZE | POWER | CAUSE | NECESSITY | POSSIBILITY |
| R4 | ALIVE | PERCEIVE | KNOW | SIGN | VALUE | WANT |

The coordinate assignment remains a working layout rather than an immutable part of the ontology.
