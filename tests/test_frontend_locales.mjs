import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(
  "custom_components/lafaer/frontend/ha-lafaer-panel.js",
  "utf8",
);

for (const expected of ["en", "zh-Hans", "zh-Hant"]) {
  assert.match(source, new RegExp(`(?:^|[\\s,])(?:"${expected}"|${expected}):`));
}

const dictionarySource = source.slice(0, source.indexOf("const esc"));
for (const key of [
  "requiredFields",
  "confirmName",
  "distance",
  "powerSource",
  "serialNumber",
  "radarFirmware",
  "adoptedDevices",
  "discoveredDevices",
  "available",
  "offline",
  "lastSeen",
  "takeoverConnecting",
  "takeoverFailed",
  "takeoverSucceeded",
  "unknownError",
]) {
  assert.equal(
    dictionarySource.match(new RegExp(`\\b${key}:`, "g"))?.length,
    3,
    `${key} must exist in all three locales`,
  );
}

assert.match(source, /return "en";/);
assert.match(source, /document\.visibilityState|document\.hidden/);
assert.match(source, /lafaer\/session\/heartbeat/);
assert.match(source, /_sessionGeneration/);
assert.match(source, /await unsubscribe\(\)/);
assert.match(source, /set_settings/);
assert.match(source, /prompt\(/);
assert.match(source, /step:this\._selected\.model==="LWR01"\?1\.4:\.75/);
assert.match(source, /if \(!customElements\.get\("ha-lafaer-panel"\)\)/);
assert.match(source, /s\.distance_cm/);
assert.match(source, /s\.work_mode/);
assert.doesNotMatch(source, /type:"lafaer\/device\/adopt",\.\.\.device/);
assert.match(source, /device_id:device\.device_id\.trim\(\)/);
assert.match(source, /this\._initialScanStarted=true;await this\._scan\(\)/);
assert.match(source, /this\._devices\.length\?this\._devices\.map/);
assert.match(source, /unmanaged\.length\?unmanaged\.map/);
assert.match(source, /this\._adoptionStates\.set\(key,\{status:"working"/);
assert.match(source, /<ha-circular-progress active size="small">/);
assert.match(source, /this\._adoptionStates\.set\(key,\{status:"error"/);

class FakeHTMLElement {
  set innerHTML(value) {
    this._innerHTML = value;
    this._buttons = [...value.matchAll(/data-i="(\d+)"/g)].map((match) => ({
      dataset: { i: match[1] },
      onclick: null,
    }));
  }

  get innerHTML() {
    return this._innerHTML;
  }

  querySelectorAll(selector) {
    return selector === "button" ? this._buttons : [];
  }

  dispatchEvent() {}
}

const registry = new Map();
const context = {
  HTMLElement: FakeHTMLElement,
  CustomEvent: class {},
  customElements: {
    define: (name, constructor) => registry.set(name, constructor),
    get: (name) => registry.get(name),
  },
};
vm.runInNewContext(source, context);

const RangeEditor = registry.get("lafaer-range-editor");
const rangeEditor = new RangeEditor();
rangeEditor.config = {
  values: [0, 1],
  visibleCount: 2,
  step: 1.4,
  disabledValue: 0,
  enabledValue: 1,
};
assert.match(rangeEditor.innerHTML, /0-1\.4m/);
rangeEditor.querySelectorAll("button")[0].onclick();
assert.deepEqual([...rangeEditor.value], [1, 1]);
assert.match(rangeEditor.innerHTML, /range-segment enabled/);

console.log("frontend locale and lifecycle checks passed");
