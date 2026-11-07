const svgNamespace = 'http://www.w3.org/2000/svg';

const stroke = (d, color, width = 2, opacity = 1) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
const shape = (d, color, opacity = 1) =>
  `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
const dot = (x, y, radius, color, opacity = 1) =>
  `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${opacity}"/>`;
const pixel = (x, y, width, height, color) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}"/>`;

// The order matches the nine style thumbnails.
const motifs = [
  {
    rim: '#D3D9D4', secondary: '#18252C',
    art: stroke('M2 13C10 2 22 18 33 8Q38 4 46 7', '#E7EDE9', 4, .89)
      + stroke('M3 14C12 4 22 18 33 9Q39 4 45 8', '#18252C', 2.4)
      + stroke('M8 18Q20 10 29 16', '#AAB7B7', 1, .9)
      + dot(4, 7, 1.7, '#CDD8D7', .8) + dot(34, 18, 2.2, '#17272F', .88)
      + dot(42, 19, 1.1, '#DDE7E7', .92),
  },
  {
    rim: '#F9AACC', secondary: '#FFF3F9',
    art: stroke('M3 17Q19 4 40 9', '#F7BCD6', 1.5, .9)
      + shape('M12 16Q9 7 18 5Q24 12 12 16', '#F68EB6')
      + shape('M27 20Q22 13 33 11Q39 18 27 20', '#FFC5DC')
      + shape('M41 1L43 8L48 10L43 12L41 19L39 12L34 10L39 8Z', '#FFF6F4'),
  },
  {
    rim: '#FFE5A3', secondary: '#FF9B8B',
    art: shape('M18 2Q20 2 23 9Q30 9 30 12Q29 14 24 17Q25 24 22 23L16 19Q10 22 9 19L10 14Q4 10 8 9L14 8Z', '#FFE5A3')
      + dot(35, 15, 5.1, '#FF9B8B') + dot(43, 5, 2.8, '#FFF0C7') + dot(4, 20, 2.3, '#FA7A9B'),
  },
  {
    rim: '#FFAF9E', secondary: '#AFC1FC',
    art: stroke('M1 17L11 7L20 12L26 4L46 9', '#E7E9F0', 1.7)
      + shape('M12 8L20 12L25 5L27 11L20 17L12 14Z', '#FF8C85', .95)
      + shape('M26 4L39 7L46 9L38 16L27 11Z', '#8FA9FF', .95) + dot(39, 20, 2.3, '#FBCC8B'),
  },
  {
    rim: '#EBECE8', secondary: '#B6B6AE',
    art: stroke('M2 13L13 9L24 11L38 7L46 8', '#F2F2EB', 1.6)
      + stroke('M4 16L14 12L25 14L39 10L46 11', '#A8ADAD', 1.1, .95)
      + stroke('M7 9L11 16M15 7L20 17M24 8L29 17M31 6L36 14', '#D1D3CB', 1.4, .95),
  },
  {
    rim: '#FBE05E', secondary: '#55DEF0', radius: 4,
    art: pixel(2, 13, 8, 7, '#2DA6C8') + pixel(10, 9, 8, 7, '#6DE1E7')
      + pixel(18, 5, 8, 7, '#FBE05E') + pixel(26, 5, 8, 7, '#FF9F4F')
      + pixel(34, 10, 8, 7, '#FBE05E') + pixel(42, 15, 5, 5, '#8BEFEE')
      + pixel(26, 18, 4, 4, '#FF9F4F'),
  },
  {
    rim: '#F0BE67', secondary: '#E68A41',
    art: shape('M2 11Q7 3 14 7L23 6L19 15L10 18L3 17Z', '#C47731')
      + shape('M8 9L16 5L24 6L33 3L31 11L24 15L11 14Z', '#F7C676')
      + shape('M18 14L25 11L40 10L45 6L42 17L31 19L17 20Z', '#E39A48')
      + stroke('M11 9L24 7L30 6M25 15L38 13', '#FCE9B4', 1.3, .93),
  },
  {
    rim: '#5EE3FF', secondary: '#FFAA55', radius: 4,
    art: stroke('M1 17H9L15 9H28L34 3H46', '#61E3FF', 2.4)
      + stroke('M10 22H21L26 16H36L42 10H47', '#FF9F4D', 1.8)
      + pixel(12, 7, 4, 4, '#A5F5FF') + pixel(32, 1, 4, 4, '#C8FAFF')
      + pixel(39, 8, 4, 4, '#FFC98B'),
  },
  {
    rim: '#F5ACCC', secondary: '#DBB6FC',
    art: shape('M2 14Q0 6 12 6Q18 1 24 7Q32 6 36 10Q48 11 44 18Q36 23 27 19Q17 24 10 19Q2 21 2 14Z', '#F897BE', .5)
      + shape('M6 14Q6 8 18 10Q25 6 35 13Q43 13 40 17Q30 22 23 16Q12 19 6 14Z', '#D9AAFB', .6)
      + dot(11, 9, 2, '#FFF1EF', .72) + dot(40, 5, 2.6, '#EDC6FB', .47),
  },
];

const edges = [
  { name: 'top', x: 32, y: 9, angle: 0 },
  { name: 'right', x: 111, y: 33, angle: 90 },
  { name: 'bottom', x: 88, y: 111, angle: 180 },
  { name: 'left', x: 9, y: 87, angle: 270 },
];

export function createEffect(index) {
  const motif = motifs[index];
  if (!motif) throw new RangeError('Expected a style index from 0 through 8');

  const effect = document.createElementNS(svgNamespace, 'svg');
  effect.setAttribute('class', 'style-effect');
  effect.setAttribute('viewBox', '0 0 120 120');
  effect.setAttribute('aria-hidden', 'true');
  effect.setAttribute('focusable', 'false');

  const radius = motif.radius ?? 22;
  const trails = edges.map(({ name, x, y, angle }) => `
    <g class="style-effect__trail style-effect__trail--${name}">
      <g transform="translate(${x} ${y}) rotate(${angle}) scale(.63) translate(-24 -12)">${motif.art}</g>
    </g>`).join('');

  effect.innerHTML = `
    <g class="style-effect__rim" fill="none">
      <rect x="7" y="7" width="106" height="106" rx="${radius}" stroke="${motif.rim}" stroke-width="1.5" opacity=".74"/>
      <rect x="9.5" y="9.5" width="101" height="101" rx="${radius}" stroke="${motif.secondary}" stroke-width="1.2" opacity=".77"/>
    </g>
    ${trails}`;

  return effect;
}
