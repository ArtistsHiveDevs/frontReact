export function GMapsSvgMaker(icon: any, data?: any) {
  const path = icon[4] as string;
  const iconAnchor = [icon[0] / 2 || 0, icon[1] || 20];
  const customColor = data?.color || "#8a5433";
  const customOpacity = data?.opacity || 1;
  const customRotation = data?.rotation || 0;
  const customScale = data?.scale || 0.06;

  return {
    path,
    fillColor: customColor,
    fillOpacity: customOpacity,
    strokeWeight: 1,
    rotation: customRotation,
    scale: customScale,
    iconAnchor,
  };
}
