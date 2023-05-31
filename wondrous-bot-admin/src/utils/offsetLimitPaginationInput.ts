const offsetLimitPaginationInput = (existing, incoming, { args }) => {
  const merged = existing ? existing.slice(0) : [];
  if (incoming) {
    if (args) {
      // Assume an offset of 0 if args.offset omitted.
      const { offset = 0 } = args.input;
      for (let i = 0; i < incoming.length; ++i) {
        merged[offset + i] = incoming[i];
      }
    } else {
      // It's unusual (probably a mistake) for a paginated field not
      // to receive any arguments, so you might prefer to throw an
      // exception here, instead of recovering by appending incoming
      // onto the existing array.
      merged.push.apply(merged, incoming);
    }
  }
  return merged;
};

export default offsetLimitPaginationInput;
