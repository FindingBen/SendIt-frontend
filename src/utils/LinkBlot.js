// LinkBlot.js
import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class LinkBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("href", value);
    node.setAttribute("target", "_blank");
    node.innerText = "Link";
    return node;
  }

  static value(node) {
    return node.getAttribute("href");
  }
}

LinkBlot.blotName = "link";
LinkBlot.tagName = "a";
LinkBlot.className = "ql-link";

Quill.register(LinkBlot);

export default LinkBlot;
