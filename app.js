(() => {
  'use strict';

  const svg = document.getElementById('cogniformSvg');
  const backgroundLayer = document.getElementById('backgroundLayer');
  const radialBondLayer = document.getElementById('radialBondLayer');
  const ringLayer = document.getElementById('ringLayer');
  const statusEl = document.getElementById('status');
  const angleReadout = document.getElementById('angleReadout');
  const emptyState = document.getElementById('emptyState');
  const bondTableWrap = document.getElementById('bondTableWrap');
  const bondRows = document.getElementById('bondRows');
  const resetBtn = document.getElementById('resetBtn');

  const NS = 'http://www.w3.org/2000/svg';
  const CX = 380;
  const CY = 380;
  const RADII = [104, 184, 264, 344];
  const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];
  const ALIGN_TOLERANCE_DEG = 3.5;
  const TAP_DISTANCE_PX = 8;

  const SEMES = [
    ['NEGATION', 'WITH', 'QUALITY', 'CHANGE', 'EXIST', 'THING'],
    ['IN', 'MANY', 'ORDER', 'TIME', 'DO', 'ONE'],
    ['PLACE', 'SIZE', 'POWER', 'CAUSE', 'NECESSITY', 'POSSIBILITY'],
    ['ALIVE', 'PERCEIVE', 'KNOW', 'SIGN', 'VALUE', 'WANT']
  ];

  const state = {
    rotation: [0, 0, 0, 0],
    bonds: new Set(),
    drag: null
  };

  const ringUi = [];
  const radialUi = [];

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }
    return el;
  }

  function normalizeDegrees(value) {
    const result = value % 360;
    return result < 0 ? result + 360 : result;
  }

  function signedAngleDelta(a, b) {
    let delta = a - b;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
  }

  function circularDifference(a, b) {
    return Math.abs(signedAngleDelta(a, b));
  }

  function point(radius, angleDeg) {
    const angle = angleDeg * Math.PI / 180;
    return {
      x: CX + radius * Math.cos(angle),
      y: CY + radius * Math.sin(angle)
    };
  }

  function nodeId(ringIndex, semeIndex) {
    return `${ringIndex}:${semeIndex}`;
  }

  function parseNodeId(id) {
    const [ring, index] = id.split(':').map(Number);
    return { ring, index };
  }

  function addressFor(ringIndex, semeIndex) {
    return `R${ringIndex + 1}${LETTERS[semeIndex]}`;
  }

  function addressFromId(id) {
    const { ring, index } = parseNodeId(id);
    return addressFor(ring, index);
  }

  function semeNameFromId(id) {
    const { ring, index } = parseNodeId(id);
    return SEMES[ring][index];
  }

  function bondKey(a, b) {
    return [a, b].sort().join('|');
  }

  function splitBondKey(key) {
    return key.split('|');
  }

  function nodeAngle(ringIndex, semeIndex) {
    return normalizeDegrees(-90 + semeIndex * 60 + state.rotation[ringIndex]);
  }

  function nodePoint(ringIndex, semeIndex) {
    return point(RADII[ringIndex], nodeAngle(ringIndex, semeIndex));
  }

  function pointerAngle(event) {
    const rect = svg.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 760;
    const y = (event.clientY - rect.top) / rect.height * 760;
    return Math.atan2(y - CY, x - CX) * 180 / Math.PI;
  }

  function circumferentialPath(ringIndex, semeIndex) {
    const a = nodePoint(ringIndex, semeIndex);
    const b = nodePoint(ringIndex, (semeIndex + 1) % 6);
    const radius = RADII[ringIndex];
    return `M ${a.x} ${a.y} A ${radius} ${radius} 0 0 1 ${b.x} ${b.y}`;
  }

  function circumferentialMidpoint(ringIndex, semeIndex) {
    return point(
      RADII[ringIndex],
      -90 + (semeIndex + 0.5) * 60 + state.rotation[ringIndex]
    );
  }

  function radialAlignmentDifference(aId, bId) {
    const a = parseNodeId(aId);
    const b = parseNodeId(bId);
    if (Math.abs(a.ring - b.ring) !== 1) return Infinity;
    return circularDifference(
      nodeAngle(a.ring, a.index),
      nodeAngle(b.ring, b.index)
    );
  }

  function areRadiallyAligned(aId, bId) {
    return radialAlignmentDifference(aId, bId) <= ALIGN_TOLERANCE_DEG;
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function drawBackground() {
    backgroundLayer.replaceChildren();

    for (let i = 0; i < 6; i += 1) {
      const p = point(RADII[3] + 18, -90 + i * 60);
      backgroundLayer.appendChild(svgEl('line', {
        x1: CX,
        y1: CY,
        x2: p.x,
        y2: p.y,
        class: 'reference-spoke'
      }));
    }

    for (const radius of RADII) {
      backgroundLayer.appendChild(svgEl('circle', {
        cx: CX,
        cy: CY,
        r: radius,
        class: 'ring-track'
      }));
    }

    backgroundLayer.appendChild(svgEl('circle', {
      cx: CX,
      cy: CY,
      r: 4,
      class: 'center-dot'
    }));
  }

  function makeSemeLabel(group, ringIndex, semeIndex) {
    const name = SEMES[ringIndex][semeIndex];

    const address = svgEl('text', {
      x: 0,
      y: -7,
      class: 'seme-address'
    });
    address.textContent = addressFor(ringIndex, semeIndex);

    const label = svgEl('text', {
      x: 0,
      y: 8,
      class: 'seme-label'
    });

    if (name.length <= 9) {
      label.textContent = name;
    } else {
      const cut = Math.ceil(name.length / 2);
      const first = svgEl('tspan', { x: 0, dy: -4 });
      const second = svgEl('tspan', { x: 0, dy: 13 });
      first.textContent = name.slice(0, cut);
      second.textContent = name.slice(cut);
      label.append(first, second);
    }

    group.append(address, label);
  }

  function buildRingUi() {
    ringLayer.replaceChildren();
    ringUi.length = 0;

    for (let ring = 0; ring < 4; ring += 1) {
      const ui = {
        dragHit: null,
        nodes: [],
        arcBonds: [],
        orientationDot: null
      };

      const dragHit = svgEl('circle', {
        cx: CX,
        cy: CY,
        r: RADII[ring],
        class: 'ring-drag-hit',
        'aria-label': `Rotate ring ${ring + 1}`
      });

      dragHit.addEventListener('pointerdown', event => {
        beginRingDrag(ring, event);
      });

      ringLayer.appendChild(dragHit);
      ui.dragHit = dragHit;

      for (let index = 0; index < 6; index += 1) {
        const aId = nodeId(ring, index);
        const bId = nodeId(ring, (index + 1) % 6);

        const visible = svgEl('path', { class: 'bond-guide' });
        const hit = svgEl('path', {
          class: 'bond-hit',
          role: 'button',
          tabindex: '0',
          'aria-label': `Toggle bond ${addressFromId(aId)} to ${addressFromId(bId)}`
        });
        const handle = svgEl('circle', {
          r: 7,
          class: 'bond-handle'
        });

        hit.addEventListener('pointerdown', event => {
          beginRingDrag(
            ring,
            event,
            { aId, bId, type: 'circumferential' }
          );
        });

        hit.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleBond(aId, bId);
          }
        });

        ringLayer.append(visible, hit, handle);
        ui.arcBonds.push({ aId, bId, visible, hit, handle });
      }

      for (let index = 0; index < 6; index += 1) {
        const id = nodeId(ring, index);
        const group = svgEl('g', {
          class: 'seme-group',
          role: 'button',
          tabindex: '0',
          'aria-label': `${addressFor(ring, index)} ${SEMES[ring][index]}`
        });

        group.appendChild(svgEl('circle', {
          cx: 0,
          cy: 0,
          r: 27,
          class: 'seme-node'
        }));

        makeSemeLabel(group, ring, index);

        group.addEventListener('pointerdown', event => {
          beginRingDrag(ring, event, null, id);
        });

        group.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setStatus(`${addressFor(ring, index)} — ${SEMES[ring][index]}`);
          }
        });

        ringLayer.appendChild(group);
        ui.nodes.push(group);
      }

      const orientationDot = svgEl('circle', {
        r: 7,
        class: 'orientation-dot'
      });
      ringLayer.appendChild(orientationDot);
      ui.orientationDot = orientationDot;

      ringUi.push(ui);
    }
  }

  function buildRadialUi() {
    radialBondLayer.replaceChildren();
    radialUi.length = 0;

    for (let pair = 0; pair < 3; pair += 1) {
      for (let slot = 0; slot < 6; slot += 1) {
        const visible = svgEl('line', { class: 'bond-guide' });
        const hit = svgEl('line', {
          class: 'bond-hit',
          role: 'button',
          tabindex: '0'
        });
        const handle = svgEl('circle', {
          r: 7,
          class: 'bond-handle'
        });

        const item = {
          pair,
          slot,
          aId: null,
          bId: null,
          visible,
          hit,
          handle,
          tapStart: null
        };

        hit.addEventListener('pointerdown', event => {
          if (event.button !== undefined && event.button !== 0) return;
          if (!item.aId || !item.bId) return;
          event.preventDefault();
          item.tapStart = {
            x: event.clientX,
            y: event.clientY,
            pointerId: event.pointerId
          };
          try { hit.setPointerCapture(event.pointerId); } catch (_) {}
        });

        hit.addEventListener('pointerup', event => {
          if (!item.tapStart || item.tapStart.pointerId !== event.pointerId) return;
          const distance = Math.hypot(
            event.clientX - item.tapStart.x,
            event.clientY - item.tapStart.y
          );
          item.tapStart = null;
          if (distance <= TAP_DISTANCE_PX && item.aId && item.bId) {
            toggleBond(item.aId, item.bId);
          }
        });

        hit.addEventListener('pointercancel', () => {
          item.tapStart = null;
        });

        hit.addEventListener('keydown', event => {
          if ((event.key === 'Enter' || event.key === ' ') && item.aId && item.bId) {
            event.preventDefault();
            toggleBond(item.aId, item.bId);
          }
        });

        radialBondLayer.append(visible, hit, handle);
        radialUi.push(item);
      }
    }
  }

  function beginRingDrag(ringIndex, event, tapBond = null, tapSeme = null) {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();

    state.drag = {
      ringIndex,
      pointerId: event.pointerId,
      lastAngle: pointerAngle(event),
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      tapBond,
      tapSeme
    };

    ringUi[ringIndex].dragHit.classList.add('dragging');

    try { svg.setPointerCapture(event.pointerId); } catch (_) {}
  }

  function onPointerMove(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;

    event.preventDefault();

    const now = pointerAngle(event);
    const delta = signedAngleDelta(now, drag.lastAngle);
    drag.lastAngle = now;

    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > TAP_DISTANCE_PX) {
      drag.moved = true;
    }

    state.rotation[drag.ringIndex] = normalizeDegrees(
      state.rotation[drag.ringIndex] + delta
    );

    removeBrokenRadialBonds();
    renderGeometry();

    setStatus(`R${drag.ringIndex + 1}: ${state.rotation[drag.ringIndex].toFixed(1)}°`);
  }

  function onPointerUp(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;

    const wasTap = !drag.moved;

    ringUi[drag.ringIndex].dragHit.classList.remove('dragging');
    state.drag = null;

    try { svg.releasePointerCapture(event.pointerId); } catch (_) {}

    if (wasTap && drag.tapBond) {
      toggleBond(drag.tapBond.aId, drag.tapBond.bId);
    } else if (wasTap && drag.tapSeme) {
      setStatus(`${addressFromId(drag.tapSeme)} — ${semeNameFromId(drag.tapSeme)}`);
    } else {
      setStatus(
        `R${drag.ringIndex + 1} rotated to ${state.rotation[drag.ringIndex].toFixed(1)}°.`
      );
    }

    renderGeometry();
    renderBondTable();
  }

  function onPointerCancel(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;

    ringUi[drag.ringIndex].dragHit.classList.remove('dragging');
    state.drag = null;

    renderGeometry();
    setStatus('Rotation cancelled.');
  }

  function updateRingGeometry(ringIndex) {
    const ui = ringUi[ringIndex];

    ui.nodes.forEach((node, index) => {
      const p = nodePoint(ringIndex, index);
      node.setAttribute('transform', `translate(${p.x} ${p.y})`);
    });

    ui.arcBonds.forEach((bond, index) => {
      const path = circumferentialPath(ringIndex, index);
      const mid = circumferentialMidpoint(ringIndex, index);
      const active = state.bonds.has(bondKey(bond.aId, bond.bId));

      bond.visible.setAttribute('d', path);
      bond.hit.setAttribute('d', path);
      bond.visible.setAttribute('class', active ? 'bond-active' : 'bond-guide');
      bond.hit.setAttribute('aria-pressed', String(active));

      bond.handle.setAttribute('cx', mid.x);
      bond.handle.setAttribute('cy', mid.y);
      bond.handle.setAttribute('class', active ? 'bond-handle active' : 'bond-handle');
    });

    const orientationPoint = point(
      RADII[ringIndex] - 34,
      -90 + state.rotation[ringIndex]
    );

    ui.orientationDot.setAttribute('cx', orientationPoint.x);
    ui.orientationDot.setAttribute('cy', orientationPoint.y);
  }

  function updateRadialGeometry() {
    let uiIndex = 0;

    for (let innerRing = 0; innerRing < 3; innerRing += 1) {
      for (let innerIndex = 0; innerIndex < 6; innerIndex += 1) {
        const item = radialUi[uiIndex++];
        let bestOuterIndex = -1;
        let bestDifference = Infinity;

        for (let outerIndex = 0; outerIndex < 6; outerIndex += 1) {
          const difference = circularDifference(
            nodeAngle(innerRing, innerIndex),
            nodeAngle(innerRing + 1, outerIndex)
          );

          if (difference < bestDifference) {
            bestDifference = difference;
            bestOuterIndex = outerIndex;
          }
        }

        if (bestDifference <= ALIGN_TOLERANCE_DEG) {
          const aId = nodeId(innerRing, innerIndex);
          const bId = nodeId(innerRing + 1, bestOuterIndex);
          const a = nodePoint(innerRing, innerIndex);
          const b = nodePoint(innerRing + 1, bestOuterIndex);
          const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
          const active = state.bonds.has(bondKey(aId, bId));

          item.aId = aId;
          item.bId = bId;

          for (const line of [item.visible, item.hit]) {
            line.setAttribute('x1', a.x);
            line.setAttribute('y1', a.y);
            line.setAttribute('x2', b.x);
            line.setAttribute('y2', b.y);
            line.hidden = false;
          }

          item.visible.setAttribute('class', active ? 'bond-active' : 'bond-guide');
          item.hit.setAttribute('aria-pressed', String(active));
          item.hit.setAttribute(
            'aria-label',
            `Toggle radial bond ${addressFromId(aId)} to ${addressFromId(bId)}`
          );

          item.handle.setAttribute('cx', mid.x);
          item.handle.setAttribute('cy', mid.y);
          item.handle.setAttribute('class', active ? 'bond-handle active' : 'bond-handle');
          item.handle.hidden = false;
        } else {
          item.aId = null;
          item.bId = null;
          item.visible.hidden = true;
          item.hit.hidden = true;
          item.handle.hidden = true;
        }
      }
    }
  }

  function removeBrokenRadialBonds() {
    for (const key of [...state.bonds]) {
      const [aId, bId] = splitBondKey(key);
      const a = parseNodeId(aId);
      const b = parseNodeId(bId);
      if (a.ring !== b.ring && !areRadiallyAligned(aId, bId)) {
        state.bonds.delete(key);
      }
    }
  }

  function toggleBond(aId, bId) {
    const key = bondKey(aId, bId);
    const adding = !state.bonds.has(key);

    if (adding) state.bonds.add(key);
    else state.bonds.delete(key);

    setStatus(
      `${adding ? 'Added' : 'Removed'} ${addressFromId(aId)}—${addressFromId(bId)}: ` +
      `${semeNameFromId(aId)}—${semeNameFromId(bId)}.`
    );

    renderGeometry();
    renderBondTable();
  }

  function renderAngles() {
    angleReadout.replaceChildren();

    state.rotation.forEach((angle, index) => {
      const row = document.createElement('div');
      row.className = 'angle-row';

      const label = document.createElement('span');
      label.textContent = `R${index + 1}`;

      const value = document.createElement('strong');
      value.textContent = `${angle.toFixed(1)}°`;

      row.append(label, value);
      angleReadout.appendChild(row);
    });
  }

  function renderBondTable() {
    const bonds = [...state.bonds].sort();
    bondRows.replaceChildren();

    if (bonds.length === 0) {
      emptyState.hidden = false;
      bondTableWrap.hidden = true;
      return;
    }

    emptyState.hidden = true;
    bondTableWrap.hidden = false;

    for (const key of bonds) {
      const [aId, bId] = splitBondKey(key);
      const a = parseNodeId(aId);
      const b = parseNodeId(bId);
      const type = a.ring === b.ring ? 'Circumferential' : 'Radial';

      const row = document.createElement('tr');
      const notationCell = document.createElement('td');
      const semeCell = document.createElement('td');
      const typeCell = document.createElement('td');

      const code = document.createElement('code');
      code.textContent = `${addressFromId(aId)}—${addressFromId(bId)}`;

      notationCell.appendChild(code);
      semeCell.textContent = `${semeNameFromId(aId)} — ${semeNameFromId(bId)}`;
      typeCell.textContent = type;

      row.append(notationCell, semeCell, typeCell);
      bondRows.appendChild(row);
    }
  }

  function renderGeometry() {
    for (let ring = 0; ring < 4; ring += 1) {
      updateRingGeometry(ring);
    }
    updateRadialGeometry();
    renderAngles();
  }

  function resetAll() {
    state.rotation = [0, 0, 0, 0];
    state.bonds.clear();
    state.drag = null;

    for (const ui of ringUi) {
      ui.dragHit.classList.remove('dragging');
    }

    setStatus('Reset to neutral orientation.');
    renderGeometry();
    renderBondTable();
  }

  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerCancel);
  resetBtn.addEventListener('click', resetAll);

  drawBackground();
  buildRadialUi();
  buildRingUi();
  renderGeometry();
  renderBondTable();
})();
