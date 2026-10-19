# Cogniform resolution proposal v1

**Status: PREVIEW ONLY — not canonical.**  
**Scope:** resolve every issue surfaced by `analysis/top100-cogniforms.md` without expanding the 24-seme inventory just to imitate English grammar.

## Design decision

The 100-word pass exposed two different kinds of problems that should not be solved the same way:

1. **semantic problems** — what the concept actually means;
2. **orthographic / discourse problems** — how a writer asks for a missing value, refers to a participant, shows direction, records an exact measure, or physically routes a bond.

The proposal therefore keeps the **24 semes as the semantic inventory** and adds a small **structural layer** that does not count as semes.

This avoids turning English pronoun classes, tense particles, calendar units, and question words into fake universal primitives.

---

## 1. Separate the semantic graph from the physical route

### Current failure

A semantic pair such as:

- WITH—PLACE
- DO—SIGN
- MANY—ALIVE
- KNOW—EXIST

can be perfectly sensible while being impossible to draw as a single direct bond under the present coordinates.

The current analysis therefore has **27 layout-blocked entries**.

### Proposed rule: routed bond

A semantic bond may be drawn as one or more **legal adjacent physical segments**.

- A physical segment still cannot be diagonal.
- A radial segment still cannot skip a ring.
- Ring/spoke geometry remains hard.
- The **semantic endpoints** are the semes that participate in the concept.
- Intermediate seme positions can be used as **transit points** without activating their meanings.
- **An inactive seme remains visually inactive even when a bond passes through its position.** The bond line simply continues through it.
- A seme participates in the concept only when its node is explicitly marked active.
- Direct adjacency remains preferred because it is shorter and visually cheaper.

This preserves the original geometry while removing accidental semantic impossibility.

### Example

Semantic bond:

`WITH—PLACE`

At the present neutral layout it can be routed physically as:

`R1b WITH — R1a — R2a — R3a PLACE`

Only **R1b WITH** and **R3a PLACE** are marked active. R1a and R2a remain visually ordinary/inactive even though the line passes through their positions; NEGATION and IN therefore do not enter the concept.

### Notation split

Semantic notation records meaning:

`R1b—R3a`

Optional route notation can record the particular drawing:

`R1b→R1a→R2a→R3a  (active: R1b, R3a)`

Meaning is therefore stable even if a different ring rotation produces a different legal route.

### Result

**27/27 current layout blocks become representable without changing any seme meaning.**

---

## 2. Add a QUERY operator, not an interrogative seme

### Problem

WHAT, WHO, WHICH, WHEN, and WHERE forced awkward constructions involving NEGATION + KNOW + SIGN because the inventory has no “question” primitive.

That is a category error: “unknown/requested value” is a property of an utterance, not necessarily a concept.

### Proposed mark

A hollow query halo attached to a seme or subgraph:

`?`

Examples:

- WHAT → `?THING`
- WHO → `?ALIVE` (or a later conventional PERSON compound)
- WHERE → `?PLACE`
- WHEN → `?TIME`
- WHICH → query the ONE selected from a contextually established set

The queried seme still means exactly what it means normally. The mark says **this value is being requested**.

### Result

All five high-frequency interrogative gaps are removed without adding a 25th seme.

---

## 3. Add an INDEX operator for discourse reference

### Problem

The English list repeatedly demanded:

- speaker
- addressee
- previously established referent
- proximal / distal deixis
- possessive pronoun role
- first/second/third person distinctions

These are heavily grammaticalized in English, but they are not good candidates for universal semantic primitives.

### Proposed mark

An **index pin** attaches a concept to discourse context.

Proposed preview states:

- `@O` — discourse origin: speaker / author / current viewpoint
- `@A` — addressee / addressed participant
- `@R` — already established referent
- optional **near / far** state relative to the selected anchor

These are structural references, not semes.

Examples:

- YOU → `ALIVE@A`
- ME → `ONE—ALIVE@O`
- WE → `MANY—ALIVE@O` with inclusive origin reference
- THEY → `MANY@R`
- IT → `THING@R`
- THIS → `THING@O:near`
- THAT → `THING@O:far`
- THERE → `PLACE@O:far`

Possessive forms use WITH plus an indexed participant rather than new possessive primitives.

### Gender

HE / SHE and HIM / HER **do not need separate core cognitoforms**. They map to the same referential concept unless biological sex is actually relevant to the intended meaning.

That is intentional normalization, not information loss forced by English grammar.

### Result

The pronoun/deixis cluster stops pressuring the seme inventory.

---

## 4. Give ORDER an orientation state

ORDER is already defined as:

> directed relative position or arrangement along an understood dimension.

The 100-word pass showed that the missing piece is not another seme; it is **polarity along that dimension**.

### Proposed mark

ORDER may carry an orientation state:

- `ORDER+`
- `ORDER−`

The connected seme supplies the dimension.

Examples:

- TO / toward → `ORDER+—PLACE`
- FROM / away → `ORDER−—PLACE`
- AFTER → `ORDER+—TIME`
- BEFORE → `ORDER−—TIME`
- MORE → `ORDER+—SIZE`
- LESS → `ORDER−—SIZE`

UP / DOWN use the same mechanism when a vertical spatial axis is established by context.

GO / COME can share the same motion core:

`CHANGE—ORDER—PLACE`

and differ by orientation relative to the active index anchor rather than by separate primitives.

WILL / past-oriented modal constructions can similarly combine TIME, POSSIBILITY, and ORDER polarity without requiring “future” and “past” semes.

### Result

The source/goal, earlier/later, higher/lower, and viewpoint-direction gaps become one general mechanism.

---

## 5. Add a MEASURE payload for exact quantities

### Problem

DAY and YEAR both reduce naturally toward TIME + magnitude, but the 24 semes should not contain arbitrary calendar units.

### Proposed mark

SIZE and TIME can carry a **numeric measure payload**:

`#(...)`

The payload is orthographic quantitative data, not a seme.

Examples in preview notation:

- DAY → `TIME #(duration)`
- YEAR → `TIME #(larger duration / cycle)`

The exact numeral and unit encoding can be designed separately; the important architectural decision is that **measured quantity is not a new semantic primitive for every unit**.

The same mechanism later supports distance, count, degree, duration, and other scalar values.

### Result

DAY/YEAR and similar conventional-unit collisions gain a native place in the notation without expanding the ontology.

---

## 6. Split polysemy instead of forcing one English word into one cognitoform

The corpus item RIGHT combines several different meanings.

It should not have one cognitoform.

Examples:

- right = TRUE → `KNOW—EXIST`
- right = ACCEPTABLE / GOOD → `VALUE`
- right = spatial direction → an oriented PLACE / ORDER construction

The English spelling is a dictionary lookup issue, not an ontology issue.

The same policy applies whenever later corpus work encounters genuine polysemy.

---

## 7. English words are test probes, not vocabulary slots

Several “conventional” flags disappear once we stop requiring one unique cognitoform for every English token.

Examples:

- OF / WITH / HAVE / AND / ALSO may share or overlap around WITH.
- THINK and KNOW may share a non-factive cognition core when context does not require a distinction.
- GO and COME can share a motion event and differ by viewpoint anchoring.
- GIVE and TAKE can share a transfer event and differ by indexed viewpoint.
- HE and SHE can share a referential animate form.
- THE may become a reference operation rather than a standalone lexical cognitoform.

Many-to-one mappings are therefore acceptable and often desirable.

---

## 8. Keep the current 24 coordinates during this proposal

This proposal **does not remap the semes yet**.

Reason:

- the current coordinate assignment is not fully canonical;
- the 100-word sample is strongly biased toward English grammar;
- routed bonds remove the hard geometric failures immediately;
- changing addresses now would invalidate existing notation for relatively little gain.

After this structural layer is tested against a much larger and more varied concept corpus, we can optimize seme placement for **average route length** while retaining the rule that more broadly applicable semes belong more centrally.

That turns layout optimization into an efficiency problem instead of an ontology problem.

---

## Resolution of the markdown issue classes

| Issue class | Before | Proposed resolution |
|---|---:|---|
| Layout-blocked entries | 27 | Routed bonds make all 27 physically representable |
| Interrogative inventory gaps | 5 major cases | QUERY operator |
| Speaker/addressee/anaphora/deixis gaps | recurring | INDEX operator |
| Source/goal and ordered polarity gaps | recurring | ORDER+/ORDER− |
| Exact unit collisions | DAY/YEAR and future cases | MEASURE payload |
| English gender/person grammar | recurring | normalize unless semantically required |
| Genuine polysemy | RIGHT in this sample | split by sense |
| Conventional many-to-one mappings | 25 flags | explicitly allowed |

## Corpus-level result

Under this proposal:

- **0 concepts are semantically rejected because of ring placement.**
- **No new semes are required by the top-100 test.**
- All previously identified gaps have either:
  - a structural notation mechanism,
  - a deliberate many-to-one normalization rule, or
  - a polysemy split.
- The 24 semes remain the only atomic semantic building blocks.

---

## Proposed visual conventions in the preview

These are deliberately provisional:

- **filled node** — active seme
- **solid bond** — semantic bond / physical route
- **query halo** — requested/unknown value
- **index pin** — discourse anchor
- **arrow / +− badge on ORDER** — orientation along a dimension
- **measure badge** — quantitative payload

**Transit rule refinement:** a bond passing through an inactive seme does not mark or activate that seme. Node activation alone determines semantic participation.

Nothing in this proposal becomes canonical until explicitly approved.
