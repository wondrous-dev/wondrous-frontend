const opositeSide = {
  top: "bottom",
  bottom: "top",
  right: "left",
  left: "right",
};

export function doArrow(
  position,
  verticalAlign,
  horizontalAlign,
  color = "white",
  overridenPosition = null,
  spaceFromSide = 20
) {
  const positionConfig = overridenPosition || position;

  if ((!position || position === "custom") && !overridenPosition) {
    return {};
  }

  const width = 16;
  const height = 12;
  const isVertical = positionConfig === "top" || positionConfig === "bottom";

  const obj = {
    [`--rtp-arrow-${isVertical ? opositeSide[horizontalAlign] : verticalAlign}`]: height + spaceFromSide + "px",
    [`--rtp-arrow-${opositeSide[positionConfig]}`]: -height + 2 + "px",
    [`--rtp-arrow-border-${isVertical ? "left" : "top"}`]: `${width / 2}px solid transparent`,
    [`--rtp-arrow-border-${isVertical ? "right" : "bottom"}`]: `${width / 2}px solid transparent`,
    [`--rtp-arrow-border-${positionConfig}`]: `${height}px solid ${color}`,
  };
  return obj;
}
