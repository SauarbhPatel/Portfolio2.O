import * as THREE from 'three'

// Realistic app UIs painted onto the phone screens (decorative mock-ups, not real data).
// Canvas is laid out in a 1000 × 2146 coordinate space (≈ iPhone points × 2.56) and scaled for mobile.

export const SCREEN_W = 1000
export const SCREEN_H = 2146

const UI = '"Instrument Sans Variable", system-ui, sans-serif'
const DISPLAY = '"Bricolage Grotesque Variable", system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

function rr(c, x, y, w, h, r) {
  c.beginPath()
  c.roundRect(x, y, w, h, r)
}
function fillRR(c, x, y, w, h, r, fill) {
  rr(c, x, y, w, h, r)
  c.fillStyle = fill
  c.fill()
}
function txt(c, s, x, y, size, color, { weight = 500, font = UI, align = 'left', ls = 0 } = {}) {
  c.font = `${weight} ${size}px ${font}`
  c.fillStyle = color
  c.textAlign = align
  c.textBaseline = 'alphabetic'
  if ('letterSpacing' in c) c.letterSpacing = `${ls}px`
  c.fillText(s, x, y)
  if ('letterSpacing' in c) c.letterSpacing = '0px'
}
function circle(c, x, y, r, fill) {
  c.beginPath()
  c.arc(x, y, r, 0, Math.PI * 2)
  c.fillStyle = fill
  c.fill()
}
// smooth line through points (Catmull-Rom → Bézier)
function smooth(c, pts) {
  c.moveTo(pts[0][0], pts[0][1])
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    c.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
      p2[0],
      p2[1]
    )
  }
}

function statusBar(c, dark = true) {
  const col = dark ? '#F5F2EC' : '#111'
  txt(c, '9:41', 118, 104, 44, col, { weight: 600, align: 'center' })
  // dynamic island
  fillRR(c, 339, 30, 322, 96, 48, '#000')
  // signal
  for (let i = 0; i < 4; i++) fillRR(c, 742 + i * 17, 98 - (i + 1) * 9, 11, (i + 1) * 9, 3, col)
  // wifi
  c.strokeStyle = col
  c.lineWidth = 7
  c.lineCap = 'round'
  for (let i = 0; i < 3; i++) {
    c.beginPath()
    c.arc(835, 100, 10 + i * 13, Math.PI * 1.25, Math.PI * 1.75)
    c.stroke()
  }
  // battery
  c.lineWidth = 4
  c.globalAlpha = 0.45
  rr(c, 870, 72, 66, 32, 10)
  c.stroke()
  fillRR(c, 939, 81, 5, 14, 2, col)
  c.globalAlpha = 1
  fillRR(c, 875, 77, 46, 22, 6, col)
}
function homeBar(c, color = 'rgba(245,242,236,0.85)') {
  fillRR(c, 365, 2104, 270, 12, 6, color)
}
function bg(c, top, tint) {
  c.fillStyle = top
  c.fillRect(0, 0, SCREEN_W, SCREEN_H)
  const g = c.createRadialGradient(780, -100, 40, 780, -100, 1300)
  g.addColorStop(0, tint)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  c.fillStyle = g
  c.fillRect(0, 0, SCREEN_W, SCREEN_H)
}
function star(c, x, y, r, fill) {
  c.beginPath()
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 ? r * 0.45 : r
    c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad)
  }
  c.closePath()
  c.fillStyle = fill
  c.fill()
}

// ── 01 · Food ordering app ────────────────────────────────────────────────
function thali(c, cx, cy, r) {
  // plate
  const plate = c.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r)
  plate.addColorStop(0, '#f4efe7')
  plate.addColorStop(1, '#bdb4a6')
  circle(c, cx, cy, r, plate)
  circle(c, cx, cy, r * 0.88, '#e9e2d6')
  const bowls = [
    [-0.42, -0.36, 0.27, ['#f2a03d', '#b85a12']], // dal
    [0.05, -0.5, 0.25, ['#7cbf5a', '#2f6b25']], // sabzi
    [0.48, -0.2, 0.24, ['#f6e2a8', '#d9b45d']], // kheer
    [-0.5, 0.25, 0.22, ['#e2583a', '#8f2412']], // curry
  ]
  bowls.forEach(([dx, dy, br, [a, b]]) => {
    const x = cx + dx * r
    const y = cy + dy * r
    circle(c, x, y + 6, br * r * 1.02, 'rgba(0,0,0,0.18)')
    circle(c, x, y, br * r, '#cfc6b8')
    const g = c.createRadialGradient(x - br * r * 0.3, y - br * r * 0.3, 2, x, y, br * r * 0.85)
    g.addColorStop(0, a)
    g.addColorStop(1, b)
    circle(c, x, y, br * r * 0.85, g)
  })
  // rice mound
  const rice = c.createRadialGradient(cx + r * 0.08, cy + r * 0.25, 4, cx + r * 0.12, cy + r * 0.3, r * 0.3)
  rice.addColorStop(0, '#ffffff')
  rice.addColorStop(1, '#e3ddd0')
  circle(c, cx + r * 0.12, cy + r * 0.3, r * 0.3, rice)
  // rotis
  for (let i = 0; i < 2; i++) {
    const g = c.createRadialGradient(cx + r * 0.52, cy + r * 0.38 + i * 18, 4, cx + r * 0.52, cy + r * 0.38 + i * 18, r * 0.24)
    g.addColorStop(0, '#e9c58c')
    g.addColorStop(1, '#b7843f')
    circle(c, cx + r * 0.52 - i * 14, cy + r * 0.38 + i * 18, r * 0.24, g)
  }
}

function foodApp(c, accent) {
  bg(c, '#0d0c0b', 'rgba(255,90,31,0.22)')
  statusBar(c)
  txt(c, 'Good afternoon, Aarav', 64, 236, 38, 'rgba(245,242,236,0.6)')
  txt(c, 'What’s for lunch?', 60, 326, 80, '#F5F2EC', { weight: 800, font: DISPLAY, ls: -2 })
  // avatar
  const av = c.createLinearGradient(850, 190, 940, 280)
  av.addColorStop(0, '#ffb27a')
  av.addColorStop(1, accent)
  circle(c, 892, 250, 46, av)
  txt(c, 'A', 892, 266, 44, '#1a0d06', { weight: 700, align: 'center' })
  // search
  fillRR(c, 60, 380, 880, 118, 59, '#1b1916')
  c.strokeStyle = 'rgba(245,242,236,0.5)'
  c.lineWidth = 6
  c.beginPath()
  c.arc(132, 434, 20, 0, Math.PI * 2)
  c.stroke()
  c.beginPath()
  c.moveTo(147, 450)
  c.lineTo(164, 467)
  c.stroke()
  txt(c, 'Search home kitchens', 190, 452, 38, 'rgba(245,242,236,0.45)')
  // chips
  const chips = [['Lunch', true], ['Dinner'], ['Subscription']]
  let x = 60
  chips.forEach(([t, on]) => {
    c.font = `600 36px ${UI}`
    const w = c.measureText(t).width + 76
    fillRR(c, x, 540, w, 92, 46, on ? accent : '#1b1916')
    txt(c, t, x + w / 2, 598, 36, on ? '#140803' : 'rgba(245,242,236,0.8)', { weight: 600, align: 'center' })
    x += w + 18
  })
  // featured card
  fillRR(c, 60, 672, 880, 760, 56, '#171513')
  c.save()
  rr(c, 60, 672, 880, 470, [56, 56, 0, 0])
  c.clip()
  const hero = c.createRadialGradient(500, 900, 40, 500, 900, 560)
  hero.addColorStop(0, '#5a2a12')
  hero.addColorStop(1, '#1d0f08')
  c.fillStyle = hero
  c.fillRect(60, 672, 880, 470)
  // soft light
  const l = c.createRadialGradient(330, 700, 10, 330, 700, 420)
  l.addColorStop(0, 'rgba(255,190,120,0.35)')
  l.addColorStop(1, 'rgba(255,190,120,0)')
  c.fillStyle = l
  c.fillRect(60, 672, 880, 470)
  c.shadowColor = 'rgba(0,0,0,0.55)'
  c.shadowBlur = 50
  c.shadowOffsetY = 24
  thali(c, 500, 912, 200)
  c.restore()
  fillRR(c, 96, 708, 210, 66, 33, 'rgba(13,12,11,0.75)')
  txt(c, 'Bestseller', 201, 752, 30, '#ffb27a', { weight: 600, align: 'center' })
  circle(c, 868, 742, 40, 'rgba(13,12,11,0.75)')
  // heart
  c.fillStyle = accent
  c.beginPath()
  c.moveTo(868, 762)
  c.bezierCurveTo(840, 742, 846, 718, 862, 722)
  c.bezierCurveTo(866, 723, 868, 728, 868, 730)
  c.bezierCurveTo(868, 728, 870, 723, 874, 722)
  c.bezierCurveTo(890, 718, 896, 742, 868, 762)
  c.fill()
  txt(c, 'Home-style Veg Thali', 100, 1222, 52, '#F5F2EC', { weight: 700, font: DISPLAY, ls: -1 })
  txt(c, 'Sharma’s Kitchen · 2.1 km', 100, 1278, 34, 'rgba(245,242,236,0.55)')
  star(c, 116, 1360, 20, '#FFC046')
  txt(c, '4.8  ·  25 min', 148, 1373, 34, 'rgba(245,242,236,0.8)', { weight: 500 })
  txt(c, '₹149', 900, 1376, 60, accent, { weight: 800, font: DISPLAY, align: 'right' })
  // list rows
  const rows = [
    ['Dal Makhani Combo', 'Daily · Subscription', '₹129', ['#f2a03d', '#b85a12']],
    ['Paneer Lunch Box', 'Gupta Rasoi · 1.4 km', '₹159', ['#f6d58a', '#c98a2e']],
  ]
  rows.forEach(([t, s, p, [a, b]], i) => {
    const y = 1470 + i * 228
    fillRR(c, 60, y, 880, 206, 44, '#171513')
    const g = c.createRadialGradient(150, y + 90, 6, 166, y + 103, 66)
    g.addColorStop(0, a)
    g.addColorStop(1, b)
    circle(c, 166, y + 103, 70, '#2a2420')
    circle(c, 166, y + 103, 56, g)
    txt(c, t, 266, y + 92, 40, '#F5F2EC', { weight: 600 })
    txt(c, s, 266, y + 144, 32, 'rgba(245,242,236,0.5)')
    txt(c, p, 800, y + 120, 40, '#F5F2EC', { weight: 700, align: 'right' })
    circle(c, 872, y + 103, 38, accent)
    fillRR(c, 856, y + 100, 32, 7, 3, '#140803')
    fillRR(c, 868, y + 88, 7, 32, 3, '#140803')
  })
  // tab bar
  fillRR(c, 0, 1950, 1000, 196, 0, 'rgba(20,18,16,0.96)')
  c.fillStyle = 'rgba(245,242,236,0.08)'
  c.fillRect(0, 1950, 1000, 2)
  const tabs = ['Home', 'Search', 'Orders', 'Profile']
  tabs.forEach((t, i) => {
    const cx = 125 + i * 250
    const on = i === 0
    const col = on ? accent : 'rgba(245,242,236,0.45)'
    fillRR(c, cx - 26, 1990, 52, 46, 14, on ? accent : 'rgba(245,242,236,0.18)')
    txt(c, t, cx, 2080, 28, col, { weight: 600, align: 'center' })
  })
  homeBar(c)
}

// ── 02 · API monitor ──────────────────────────────────────────────────────
function apiApp(c, accent) {
  bg(c, '#0b0c0f', 'rgba(157,184,255,0.2)')
  statusBar(c)
  txt(c, 'API Monitor', 60, 300, 82, '#F2F4F8', { weight: 800, font: DISPLAY, ls: -2 })
  fillRR(c, 60, 336, 220, 66, 33, 'rgba(61,214,140,0.14)')
  circle(c, 98, 369, 10, '#3DD68C')
  txt(c, 'Healthy', 182, 381, 32, '#3DD68C', { weight: 600, align: 'center' })
  txt(c, 'production · last 15 min', 304, 381, 32, 'rgba(242,244,248,0.5)')
  const kpi = [
    ['Requests', '1.2k', '/min'],
    ['p95', '42', 'ms'],
    ['Errors', '0.02', '%'],
  ]
  kpi.forEach(([k, v, u], i) => {
    const x = 60 + i * 300
    fillRR(c, x, 450, 280, 220, 40, '#14161b')
    txt(c, k, x + 34, 520, 32, 'rgba(242,244,248,0.55)')
    txt(c, v, x + 34, 618, 70, '#F2F4F8', { weight: 700, font: DISPLAY })
    c.font = `700 70px ${DISPLAY}`
    const w = c.measureText(v).width
    txt(c, u, x + 40 + w, 618, 32, 'rgba(242,244,248,0.5)')
  })
  // chart
  fillRR(c, 60, 710, 880, 560, 48, '#14161b')
  txt(c, 'Latency', 104, 790, 36, '#F2F4F8', { weight: 600 })
  txt(c, 'ms · p95', 896, 790, 30, 'rgba(242,244,248,0.45)', { align: 'right' })
  c.strokeStyle = 'rgba(242,244,248,0.07)'
  c.lineWidth = 2
  for (let i = 0; i < 4; i++) {
    c.beginPath()
    c.moveTo(104, 880 + i * 100)
    c.lineTo(896, 880 + i * 100)
    c.stroke()
  }
  const data = [62, 55, 58, 49, 52, 44, 47, 40, 46, 39, 43, 38, 41, 36]
  const pts = data.map((d, i) => [104 + (i * 792) / (data.length - 1), 1200 - (d - 30) * 9])
  const fill = c.createLinearGradient(0, 880, 0, 1200)
  fill.addColorStop(0, 'rgba(157,184,255,0.45)')
  fill.addColorStop(1, 'rgba(157,184,255,0)')
  c.beginPath()
  smooth(c, pts)
  c.lineTo(896, 1200)
  c.lineTo(104, 1200)
  c.closePath()
  c.fillStyle = fill
  c.fill()
  c.beginPath()
  smooth(c, pts)
  c.strokeStyle = accent
  c.lineWidth = 8
  c.shadowColor = accent
  c.shadowBlur = 24
  c.stroke()
  c.shadowBlur = 0
  const lp = pts[pts.length - 1]
  circle(c, lp[0], lp[1], 22, 'rgba(157,184,255,0.25)')
  circle(c, lp[0], lp[1], 11, '#fff')
  // log
  txt(c, 'Recent requests', 60, 1360, 38, '#F2F4F8', { weight: 600 })
  const logs = [
    ['GET', '/api/orders', 200, 38, '#3DD68C'],
    ['POST', '/api/auth/otp', 201, 64, '#9DB8FF'],
    ['GET', '/api/menu?day=mon', 200, 22, '#3DD68C'],
    ['PUT', '/api/users/42', 200, 51, '#FFC046'],
    ['GET', '/api/kitchens', 200, 29, '#3DD68C'],
  ]
  logs.forEach(([m, p, s, ms, col], i) => {
    const y = 1400 + i * 128
    fillRR(c, 60, y, 880, 110, 30, '#14161b')
    fillRR(c, 90, y + 30, 112, 50, 14, col + '26')
    txt(c, m, 146, y + 66, 26, col, { weight: 600, font: MONO, align: 'center' })
    txt(c, p, 228, y + 68, 30, '#E6E9EF', { font: MONO })
    txt(c, String(s), 790, y + 68, 30, '#3DD68C', { font: MONO, align: 'right' })
    txt(c, `${ms}ms`, 906, y + 68, 30, 'rgba(242,244,248,0.45)', { font: MONO, align: 'right' })
  })
  homeBar(c)
}

// ── 03 · Live delivery tracking ───────────────────────────────────────────
function trackApp(c, accent) {
  c.fillStyle = '#101311'
  c.fillRect(0, 0, SCREEN_W, SCREEN_H)
  // map: blocks + streets
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  c.fillStyle = '#151a16'
  for (let i = 0; i < 26; i++) fillRR(c, rnd() * 1000 - 60, rnd() * 1400 - 40, 120 + rnd() * 200, 90 + rnd() * 160, 18, i % 7 === 0 ? '#16241a' : '#161b17')
  c.strokeStyle = '#232a24'
  c.lineCap = 'round'
  ;[
    [[-20, 300], [1020, 420]],
    [[-20, 760], [1020, 660]],
    [[-20, 1120], [1020, 1180]],
    [[260, -20], [180, 1400]],
    [[640, -20], [720, 1400]],
  ].forEach(([a, b]) => {
    c.lineWidth = 34
    c.beginPath()
    c.moveTo(...a)
    c.lineTo(...b)
    c.stroke()
  })
  c.strokeStyle = '#1c221d'
  c.lineWidth = 14
  for (let i = 0; i < 9; i++) {
    c.beginPath()
    c.moveTo(rnd() * 1000, -20)
    c.lineTo(rnd() * 1000, 1400)
    c.stroke()
  }
  // river
  c.strokeStyle = '#13212b'
  c.lineWidth = 60
  c.beginPath()
  c.moveTo(-40, 980)
  c.bezierCurveTo(300, 900, 500, 1200, 1040, 1020)
  c.stroke()
  // route
  const route = [
    [190, 420],
    [240, 560],
    [420, 610],
    [560, 700],
    [690, 690],
    [760, 860],
    [800, 1010],
  ]
  c.lineJoin = 'round'
  c.strokeStyle = 'rgba(216,242,107,0.25)'
  c.lineWidth = 34
  c.beginPath()
  smooth(c, route)
  c.stroke()
  c.strokeStyle = accent
  c.lineWidth = 14
  c.shadowColor = accent
  c.shadowBlur = 30
  c.beginPath()
  smooth(c, route)
  c.stroke()
  c.shadowBlur = 0
  // kitchen pin
  fillRR(c, 150, 380, 80, 80, 22, '#F5F2EC')
  fillRR(c, 172, 402, 36, 36, 8, '#101311')
  // destination pin
  circle(c, 800, 1010, 46, 'rgba(255,90,31,0.25)')
  circle(c, 800, 1010, 26, '#FF5A1F')
  circle(c, 800, 1010, 10, '#fff')
  // rider with pulse
  ;[110, 80, 54].forEach((r, i) => circle(c, 560, 700, r, `rgba(216,242,107,${0.08 + i * 0.07})`))
  circle(c, 560, 700, 36, accent)
  c.fillStyle = '#101311'
  c.beginPath()
  c.moveTo(580, 700)
  c.lineTo(548, 684)
  c.lineTo(556, 700)
  c.lineTo(548, 716)
  c.closePath()
  c.fill()
  // top fade + status
  const tf = c.createLinearGradient(0, 0, 0, 320)
  tf.addColorStop(0, 'rgba(16,19,17,0.95)')
  tf.addColorStop(1, 'rgba(16,19,17,0)')
  c.fillStyle = tf
  c.fillRect(0, 0, 1000, 320)
  statusBar(c)
  circle(c, 116, 236, 50, 'rgba(20,24,21,0.9)')
  c.strokeStyle = '#F5F2EC'
  c.lineWidth = 7
  c.beginPath()
  c.moveTo(126, 214)
  c.lineTo(104, 236)
  c.lineTo(126, 258)
  c.stroke()
  fillRR(c, 600, 196, 340, 80, 40, 'rgba(20,24,21,0.9)')
  circle(c, 646, 236, 12, accent)
  txt(c, 'Live tracking', 790, 249, 32, '#F5F2EC', { weight: 600, align: 'center' })
  // bottom sheet
  c.shadowColor = 'rgba(0,0,0,0.6)'
  c.shadowBlur = 60
  fillRR(c, 0, 1230, 1000, 960, [64, 64, 0, 0], '#151614')
  c.shadowBlur = 0
  fillRR(c, 440, 1258, 120, 12, 6, 'rgba(245,242,236,0.25)')
  txt(c, 'Arriving in', 70, 1366, 36, 'rgba(245,242,236,0.55)')
  txt(c, '5 min', 66, 1488, 120, '#F5F2EC', { weight: 800, font: DISPLAY, ls: -4 })
  fillRR(c, 700, 1400, 236, 74, 37, 'rgba(216,242,107,0.14)')
  txt(c, 'ETA 1:42', 818, 1449, 32, accent, { weight: 600, align: 'center' })
  // steps
  const steps = ['Picked up', 'On the way', 'Delivered']
  fillRR(c, 110, 1561, 780, 8, 4, 'rgba(245,242,236,0.12)')
  fillRR(c, 110, 1561, 390, 8, 4, accent)
  steps.forEach((s, i) => {
    const x = 110 + i * 390
    circle(c, x, 1565, i < 2 ? 22 : 18, i < 2 ? accent : '#2a2b28')
    if (i === 1) circle(c, x, 1565, 36, 'rgba(216,242,107,0.2)')
    txt(c, s, x, 1636, 30, i < 2 ? '#F5F2EC' : 'rgba(245,242,236,0.45)', { weight: 600, align: i === 0 ? 'left' : i === 2 ? 'right' : 'center' })
  })
  // rider row
  fillRR(c, 60, 1700, 880, 196, 44, '#1d1e1b')
  const g = c.createLinearGradient(100, 1740, 210, 1850)
  g.addColorStop(0, '#d8f26b')
  g.addColorStop(1, '#5fa84a')
  circle(c, 160, 1798, 58, g)
  txt(c, 'RK', 160, 1814, 40, '#101311', { weight: 700, align: 'center' })
  txt(c, 'Rahul K.', 250, 1784, 42, '#F5F2EC', { weight: 600 })
  star(c, 266, 1834, 15, '#FFC046')
  txt(c, '4.9 · Delivery partner', 292, 1846, 30, 'rgba(245,242,236,0.5)')
  circle(c, 772, 1798, 52, '#2a2b28')
  circle(c, 880, 1798, 52, accent)
  // chat + phone glyphs
  fillRR(c, 750, 1780, 46, 34, 12, 'rgba(245,242,236,0.85)')
  c.strokeStyle = '#101311'
  c.lineWidth = 8
  c.beginPath()
  c.arc(880, 1798, 18, Math.PI * 0.6, Math.PI * 1.9)
  c.stroke()
  // message
  fillRR(c, 60, 1928, 640, 110, [44, 44, 44, 10], '#24261f')
  txt(c, 'On my way — 2 mins!', 100, 1997, 36, '#F5F2EC', { weight: 500 })
  homeBar(c)
}

// ── 04 · Web dashboard ────────────────────────────────────────────────────
function dashApp(c) {
  const ember = '#FF5A1F'
  bg(c, '#0e0d0c', 'rgba(255,140,80,0.16)')
  statusBar(c)
  txt(c, 'Overview', 60, 300, 82, '#F5F2EC', { weight: 800, font: DISPLAY, ls: -2 })
  fillRR(c, 680, 236, 260, 80, 40, '#1b1916')
  txt(c, '30 days  ▾', 810, 288, 32, 'rgba(245,242,236,0.8)', { weight: 600, align: 'center' })
  // main chart card
  fillRR(c, 60, 360, 880, 640, 48, '#171513')
  txt(c, 'Active users', 104, 440, 34, 'rgba(245,242,236,0.55)')
  txt(c, '8,420', 100, 548, 104, '#F5F2EC', { weight: 800, font: DISPLAY, ls: -3 })
  fillRR(c, 420, 482, 170, 62, 31, 'rgba(61,214,140,0.14)')
  txt(c, '▲ 12.4%', 505, 524, 30, '#3DD68C', { weight: 600, align: 'center' })
  const data = [30, 38, 34, 46, 42, 55, 51, 63, 58, 70, 66, 82]
  const pts = data.map((d, i) => [104 + (i * 792) / (data.length - 1), 940 - d * 3.6])
  const fill = c.createLinearGradient(0, 600, 0, 940)
  fill.addColorStop(0, 'rgba(255,90,31,0.5)')
  fill.addColorStop(1, 'rgba(255,90,31,0)')
  c.beginPath()
  smooth(c, pts)
  c.lineTo(896, 940)
  c.lineTo(104, 940)
  c.closePath()
  c.fillStyle = fill
  c.fill()
  c.beginPath()
  smooth(c, pts)
  c.strokeStyle = ember
  c.lineWidth = 8
  c.shadowColor = ember
  c.shadowBlur = 24
  c.stroke()
  c.shadowBlur = 0
  // tooltip on last point
  const lp = pts[pts.length - 1]
  c.setLineDash([8, 10])
  c.strokeStyle = 'rgba(245,242,236,0.25)'
  c.lineWidth = 3
  c.beginPath()
  c.moveTo(lp[0], lp[1])
  c.lineTo(lp[0], 940)
  c.stroke()
  c.setLineDash([])
  circle(c, lp[0], lp[1], 14, '#fff')
  // tiles
  const tiles = [
    ['Uploads', '1,284', 'bars'],
    ['Storage', '72%', 'ring'],
    ['Uptime', '99.98%', 'dots'],
    ['Avg. load', '1.2s', 'line'],
  ]
  tiles.forEach(([k, v, kind], i) => {
    const x = 60 + (i % 2) * 450
    const y = 1040 + Math.floor(i / 2) * 330
    fillRR(c, x, y, 430, 310, 44, '#171513')
    txt(c, k, x + 40, y + 76, 32, 'rgba(245,242,236,0.55)')
    txt(c, v, x + 36, y + 170, 70, '#F5F2EC', { weight: 700, font: DISPLAY, ls: -2 })
    if (kind === 'bars') [40, 64, 52, 80, 70, 96].forEach((h, j) => fillRR(c, x + 40 + j * 58, y + 270 - h * 0.7, 36, h * 0.7, 8, j === 5 ? ember : 'rgba(245,242,236,0.22)'))
    if (kind === 'ring') {
      c.lineWidth = 18
      c.strokeStyle = 'rgba(245,242,236,0.1)'
      c.beginPath()
      c.arc(x + 340, y + 150, 56, 0, Math.PI * 2)
      c.stroke()
      c.strokeStyle = ember
      c.lineCap = 'round'
      c.beginPath()
      c.arc(x + 340, y + 150, 56, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.72)
      c.stroke()
    }
    if (kind === 'dots') for (let j = 0; j < 18; j++) fillRR(c, x + 40 + j * 20, y + 230, 12, 40, 4, j === 11 ? '#FFC046' : '#3DD68C')
    if (kind === 'line') {
      c.beginPath()
      smooth(c, [0, 1, 2, 3, 4, 5].map((j) => [x + 40 + j * 70, y + 250 - [10, 30, 18, 40, 26, 34][j]]))
      c.strokeStyle = '#9DB8FF'
      c.lineWidth = 6
      c.stroke()
    }
  })
  // deploys
  txt(c, 'Recent deploys', 60, 1770, 38, '#F5F2EC', { weight: 600 })
  ;[
    ['v2.4.1 · main', '2m ago'],
    ['v2.4.0 · main', '1h ago'],
  ].forEach(([t, s], i) => {
    const y = 1806 + i * 132
    fillRR(c, 60, y, 880, 114, 32, '#171513')
    circle(c, 120, y + 57, 26, 'rgba(61,214,140,0.18)')
    c.strokeStyle = '#3DD68C'
    c.lineWidth = 6
    c.beginPath()
    c.moveTo(108, y + 58)
    c.lineTo(117, y + 67)
    c.lineTo(134, y + 48)
    c.stroke()
    txt(c, t, 170, y + 70, 34, '#F5F2EC', { font: MONO })
    txt(c, s, 900, y + 70, 30, 'rgba(245,242,236,0.45)', { align: 'right' })
  })
  homeBar(c)
}

const PAINTERS = { mobile: foodApp, backend: apiApp, realtime: trackApp, web: dashApp }

export function drawScreen(svc, scale = 1) {
  const cv = document.createElement('canvas')
  cv.width = Math.round(SCREEN_W * scale)
  cv.height = Math.round(SCREEN_H * scale)
  const c = cv.getContext('2d')
  c.scale(scale, scale)
  ;(PAINTERS[svc.id] || foodApp)(c, svc.color)
  // subtle screen vignette for depth
  const v = c.createRadialGradient(500, 1073, 600, 500, 1073, 1300)
  v.addColorStop(0, 'rgba(0,0,0,0)')
  v.addColorStop(1, 'rgba(0,0,0,0.18)')
  c.fillStyle = v
  c.fillRect(0, 0, SCREEN_W, SCREEN_H)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  return tex
}
