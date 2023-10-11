import * as marked from "marked";

interface State {
  cssModuleNames?: Record<string, string>;
  inQuote?: boolean;
  inEmphasis?: boolean;
  escapeHTML?: boolean;
  inline?: boolean;
  discordCallback?: DiscordCallback;
}

marked.setOptions({
  breaks: true,
});

interface DiscordCallback {
  user?: (node: any) => string;
  channel?: (node: any) => string;
  role?: (node: any) => string;
  everyone?: () => string;
  here?: () => string;
}

function htmlTag(
  tagName: string,
  content: string,
  attributes?: Record<string, string>,
  isClosed: boolean | State = true,
  state: State = {}
): string {
  if (typeof isClosed === "object") {
    state = isClosed;
    isClosed = true;
  }

  if (!attributes) attributes = {};

  if (attributes.class && state.cssModuleNames)
    attributes.class = attributes.class
      .split(" ")
      .map((cl) => state.cssModuleNames![cl] || cl)
      .join(" ");

  let attributeString = "";
  for (let attr in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, attr) && attributes[attr])
      attributeString += ` ${attr}="${attributes[attr]}"`; // Adjust sanitization if necessary
  }

  let unclosedTag = `<${tagName}${attributeString}>`;

  if (isClosed) return unclosedTag + content + `</${tagName}>`;
  return unclosedTag;
}

const renderer = new marked.Renderer();

// Override methods on the renderer as needed
// For example, to custom render links:
renderer.link = (href, title, text) => {
  // Custom rendering logic for links
  return `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
};

// Add more overridden methods as necessary to handle different elements in the markdown

marked.use({
  gfm: true,
  breaks: true,
});

export function toHTML(
  source: string,
  options?: {
    isTitle?: boolean;
    cssModuleNames?: Record<string, string>;
    discordCallback?: Partial<DiscordCallback>;
  }
): string {
  options = Object.assign(
    {
      isTitle: false,
      discordCallback: {},
    },
    options || {}
  );

  const state: State = {
    inline: true,
    inQuote: false,
    inEmphasis: false,
    escapeHTML: true,
    cssModuleNames: options.cssModuleNames || null,
    discordCallback: Object.assign({}, options.discordCallback),
  };
  let markdownString = source.replace(/\n(?=\n)/g, "\n<br>");

  const html = marked.parse(`${markdownString}`, {
    breaks: true,
  });
  return html;
  // You should not need to replace \n manually if the breaks option is set to true
  // return marked.parse(source, { renderer, breaks: true }); // Ensure renderer is properly configured
}
