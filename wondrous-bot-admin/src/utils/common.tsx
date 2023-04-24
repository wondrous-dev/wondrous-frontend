export function shallowEqual(objA, objB) {
  if (!objA || !objB) {
    return objA === objB;
  }

  return !Object.keys({ ...objA, ...objB }).some(
    (key) => objA[key] !== objB[key]
  );
}
