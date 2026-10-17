export function measureSpeechViewport(width, height, requestedDensity = 1) {
  const viewWidth = Number.isFinite(width) && width > 0 ? width : 1000;
  const viewHeight = Number.isFinite(height) && height > 0 ? height : 680;
  const desiredDensity = Number.isFinite(requestedDensity)
    ? Math.max(1, Math.min(2, requestedDensity))
    : 1;
  const density = Math.min(desiredDensity, 2600 / viewWidth, 1800 / viewHeight);
  return {
    width: viewWidth,
    height: viewHeight,
    scaleX: viewWidth / 1000,
    scaleY: viewHeight / 680,
    density,
    pixelWidth: Math.max(1, Math.round(viewWidth * density)),
    pixelHeight: Math.max(1, Math.round(viewHeight * density)),
  };
}

export function placeSpeechBox(x, y, width, height, viewport) {
  return {
    x: Math.max(8, Math.min(viewport.width - width - 8, x - width / 2)),
    y: Math.max(8, Math.min(viewport.height - height - 14, y - height - 35)),
  };
}
