# Cogniform

Interactive editor for the cogniform writing system.

## Canonical working model

- 24 semantic primitives (semes).
- Four concentric rings, six semes per ring.
- Each seme occupies a ring/spoke intersection: R1a through R4f.
- A concept is formed by bonding one or more semes.
- Rings rotate independently and continuously.
- Same-ring neighboring positions connect circumferentially; aligned adjacent rings connect radially.
- Semantic bonds may route through multiple legal physical segments.
- Passing through an inactive seme does not activate or mark it; only explicitly active nodes contribute meaning.
- Structural operators handle QUERY, INDEX, ORDER polarity, and MEASURE without expanding the 24-seme inventory.
- Dynamic behavior is implemented in vanilla JavaScript.

## Current seme map

| Ring | a | b | c | d | e | f |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | NEGATION | WITH | QUALITY | CHANGE | EXIST | THING |
| R2 | IN | MANY | ORDER | TIME | DO | ONE |
| R3 | PLACE | SIZE | POWER | CAUSE | NECESSITY | POSSIBILITY |
| R4 | ALIVE | PERCEIVE | KNOW | SIGN | VALUE | WANT |

## Web interface

The repository root is a static web application intended for GitHub Pages deployment.

## Approved specification

See [SPEC.md](SPEC.md).

## Top-100 lexicon

The approved first 100 English frequency probes are stored in [data/top100-cogniforms-approved.json](data/top100-cogniforms-approved.json) and browsable at [lexicon/top100/](lexicon/top100/).
