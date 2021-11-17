// Shorten string without words getting separated
function shortenString(text, max = 300) {
  return text && text.length > max
    ? text.slice(0, max).split(" ").slice(0, -1).join(" ") + "..."
    : text;
}

export default shortenString;
