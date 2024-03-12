export const shortenContent = (content: string) => {
  if (content.length > 250) {
    return `${content.slice(0, 250)}...`;
  }
  return content;
};

export const createBrNewLine = (content: string) => {
    // eslint-disable-next-line react/jsx-key
    return content ? content.split("\n").map((text, i) => i ? [<br />, text] : text) : ''
}