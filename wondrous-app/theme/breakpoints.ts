// large - any browser width above 1024px
// middle - on tablet or computer when the browser width is less than 1024 (range 768-1024px)
// mobile - but any size below 768 - width just screeches in the single column all the way down 768px to mobile (414px)
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    large: 1024,
    middle: 768,
    mobile: 414,
  },
};

export default breakpoints;
