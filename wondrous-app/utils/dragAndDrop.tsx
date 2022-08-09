const SCROLL_OFFSET = 50;

// Taken from https://codesandbox.io/s/react-dnd-example-12-forked-241x9?file=/src/Card.jsx:1067-1119 and https://github.com/react-dnd/react-dnd/issues/553
function scrollDown() {
  const nextScrollTop = document.documentElement.scrollTop + SCROLL_OFFSET;
  window.scrollTo(0, nextScrollTop);
}

function scrollUp() {
  const nextScrollTop = document.documentElement.scrollTop - SCROLL_OFFSET;
  if (nextScrollTop >= 0) {
    window.scrollTo(0, nextScrollTop);
  }
}

export default class SmoothScrollPlugin {
  data = {
    isDragging: false,
    lastMouseClientY: undefined,
  };

  constructor() {
    this.addEventListeners();
  }

  onDragStart = () => {
    this.data = {
      isDragging: true,
      lastMouseClientY: undefined,
    };
    this.smoothscroll();
  };

  onDragEnd = () => {
    this.data = {
      isDragging: false,
      lastMouseClientY: undefined,
    };
  };

  addEventListeners = () => {
    if (typeof window !== 'undefined') {
      window?.addEventListener('dragover', (e) => {
        this.data.lastMouseClientY = e.clientY;
      });
    }
  };

  smoothscroll = () => {
    const { isDragging, lastMouseClientY } = this.data;
    if (isDragging) {
      if (lastMouseClientY !== undefined) {
        if (lastMouseClientY > window.innerHeight - 50) {
          scrollDown();
        } else if (lastMouseClientY < 50) {
          scrollUp();
        }
      }
      if (typeof window !== 'undefined') {
        window?.requestAnimationFrame(this.smoothscroll);
      }
    }
  };
}
