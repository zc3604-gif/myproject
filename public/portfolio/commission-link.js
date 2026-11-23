// Commission module link (front page): double-click the "commission"
// custom module to open commission.html, the way the built-in modules
// open their works pages on double-click.
//
// This runs after main.js (module scripts execute in document order),
// so the front-page nodes already exist by the time it runs. It uses a
// capture-phase listener on #viewport: capture runs before main.js's
// own dblclick handler on the node (which would open the rename
// prompt), so stopPropagation() keeps the rename prompt from appearing
// for this module only. Other custom modules are untouched and still
// rename on double-click. Clicking still selects the module, as usual.
const COMMISSION_PAGE = "./commission.html";

function findCommissionNode() {
  for (const node of document.querySelectorAll("#world .node")) {
    const kind = node.querySelector(".kind");
    if (kind && kind.textContent.trim().toLowerCase() === "commission") return node;
  }
  return null;
}

const node = findCommissionNode();
if (node) {
  node.classList.add("link");
  node.title = "Open commission";
  const viewport = document.querySelector("#viewport");
  (viewport || document).addEventListener(
    "dblclick",
    (event) => {
      if (!node.contains(event.target)) return;
      if (event.target.closest("[contenteditable], .upload, .media, input, .remove-custom")) return;
      event.stopPropagation();
      event.preventDefault();
      window.location.href = COMMISSION_PAGE;
    },
    true,
  );
}
