/**
 * Smoke test for the Beginner Drills catalog (no browser required).
 * Run: node tests/drill-smoke.mjs
 *
 * Loads js/drills.js in a minimal mock environment and checks:
 * - 5 chapters × 20 drills = 100
 * - every drill has setup + test functions
 * - setup() returns a model with nodes
 * - representative outcome tests behave as expected
 */

import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadScript(rel, sandbox) {
  const code = fs.readFileSync(path.join(root, rel), "utf8");
  vm.runInNewContext(code, sandbox, { filename: rel });
}

const state = {
  model: { nodes: [], meta: {}, applicability: {} },
  selectedId: null,
  rootSelected: false,
  lastLearningAction: null,
  drillEvidence: {},
  drillBaseline: null,
  drillProgress: {},
  drillChapterIndex: 0,
  drillIndex: 0,
  tagMode: "partial",
  leftMode: "document",
  contextRulesOn: true,
  undoStack: [],
  redoStack: [],
};

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  state,
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
  },
  localStorage: {
    _d: {},
    getItem(k) { return this._d[k] ?? null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; },
  },
  uid: () => "n" + Math.random().toString(36).slice(2, 9),
  $: () => null,
  $$: () => [],
  // stubs used if applyDrillSetup is exercised later
  renderAuthor() {},
  renderTree() {},
  syncControlsFromModel() {},
  renderReferences() {},
  renderBrexPanel() {},
  renderElementCoach() {},
  refreshInsertOptions() {},
  updateContext() {},
  syncSourcePassive() {},
  renderPreview() {},
  selectElement() {},
  revealSelectedInEditor() {},
  updateUndoRedoButtons() {},
  closeQuickTags() {},
  closeInsertMarkupPopup() {},
  currentTagMode() { return state.tagMode; },
  flattenText(nodes) {
    return (nodes || []).map(n => (n.text || "") + flattenChild(n)).join(" ");
    function flattenChild(n) {
      return (n.children || []).map(c => (c.text || "") + flattenChild(c)).join(" ");
    }
  },
  currentComments() { return state.model.comments || []; },
};

loadScript("js/drills.js", sandbox);

const { drillChapters, makeDrill, getNodesByType, getNodeByType } = sandbox;
let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("ok:", msg);
  }
}

assert(Array.isArray(drillChapters), "drillChapters is an array");
assert(drillChapters.length === 5, `expected 5 chapters, got ${drillChapters.length}`);

let total = 0;
for (const ch of drillChapters) {
  assert(ch.drills?.length === 20, `${ch.id} has 20 drills (got ${ch.drills?.length})`);
  total += ch.drills?.length || 0;
  for (let i = 0; i < (ch.drills || []).length; i++) {
    const d = ch.drills[i];
    assert(typeof d.setup === "function", `${ch.id}#${i} has setup()`);
    assert(typeof d.test === "function", `${ch.id}#${i} has test()`);
    assert(typeof d.prompt === "string" && d.prompt.length > 0, `${ch.id}#${i} has prompt`);
    try {
      const model = d.setup();
      assert(model && Array.isArray(model.nodes), `${ch.id}#${i} setup returns nodes`);
    } catch (e) {
      assert(false, `${ch.id}#${i} setup threw: ${e.message}`);
    }
  }
}
assert(total === 100, `total drills = 100 (got ${total})`);

// Representative outcome checks
const insertSpec = ["insert", "inside", "cmd", "step", "Insert cmd INSIDE the selected step."];
const insertDrill = makeDrill(insertSpec);
const insertModel = insertDrill.setup();
state.model = { nodes: insertModel.nodes, meta: {}, applicability: {} };
state.drillBaseline = insertModel.trainingBaseline;
state.lastLearningAction = null;
assert(insertDrill.test() === false, "insert test fails before insertion");
// simulate growth
const step = getNodeByType("step");
if (step) {
  step.children = step.children || [];
  step.children.push({ id: "x", type: "cmd", text: "New" });
}
assert(insertDrill.test() === true, "insert test passes after structural growth");

const undoSpec = ["undo", null, "Undo the accidental note."];
const undoDrill = makeDrill(undoSpec);
const undoModel = undoDrill.setup();
state.model = { nodes: undoModel.nodes, meta: {}, applicability: {} };
state.drillEvidence = {};
state.lastLearningAction = null;
assert(getNodesByType("note").length === 1, "undo setup includes a note");
assert(undoDrill.test() === false, "undo test fails before undo");
state.model.nodes = state.model.nodes.filter(n => n.type !== "note");
state.drillEvidence.undoUsed = true;
assert(undoDrill.test() === true, "undo test passes when note gone + evidence");

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("\nAll drill smoke checks passed.");
