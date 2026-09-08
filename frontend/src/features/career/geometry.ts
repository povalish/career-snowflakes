export function polarPoint(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: 300 + radius * Math.cos(radians), y: 300 + radius * Math.sin(radians) };
}

export function sectorPath(innerRadius: number, outerRadius: number, start: number, end: number) {
  const outerStart = polarPoint(outerRadius, start);
  const outerEnd = polarPoint(outerRadius, end);
  const innerStart = polarPoint(innerRadius, start);
  const innerEnd = polarPoint(innerRadius, end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
}
