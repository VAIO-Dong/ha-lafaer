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
  "moreActions",
  "deviceStatus",
  "modeSensing",
  "currentEnergy",
  "thresholdValue",
  "connectingDevice",
  "connectionFailed",
  "connectionFailedHint",
  "retry",
  "radarConfiguration",
  "energyAdvanced",
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
assert.match(source, /save_mode_sensing/);
assert.match(source, /save_advanced/);
assert.doesNotMatch(source, /\b(?:prompt|confirm)\(/);
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
assert.match(source, /id="menu-manual"/);
assert.match(source, /id="menu-debug"/);
assert.match(source, /id="detail-more"/);
assert.match(source, /const DETAIL_STYLES/);
assert.match(source, /if\(this\._snapshot\?\.connected!==true\)return this\._renderConnection\(\)/);
assert.match(source, /<details id="energy-advanced"/);
assert.match(source, /this\._setEnergyPolling\(e\.target\.open\)/);
assert.match(source, /mode!==1.*pir_sensitivity/);
assert.match(source, /mode!==0.*radar_sensitivity/);
assert.match(source, /<output>\$\{energy\[i\]\?\?0\}<\/output>/);
assert.match(source, /energyLabel:this\.t\.currentEnergy/);
assert.doesNotMatch(source, /hiddenPause/);
assert.doesNotMatch(source, /id="save-(?:settings|ranges|detection|keep)"/);

class FakeHTMLElement {
  attachShadow() {
    this.shadowRoot = {
      activeElement: null,
      innerHTML: "",
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    return this.shadowRoot;
  }

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

const Panel = registry.get("ha-lafaer-panel");
const panel = new Panel();
panel._hass = { language: "en" };
panel._selected = { device_id: "test", model: "LWR02", name: "Test sensor" };
panel._snapshot = {
  connected: true,
  status: { occupied: false, work_mode: 2 },
  config: {},
  radar_status: { ranges: Array(15).fill(0) },
  detection_thresholds: { custom: Array(15).fill(100) },
  keep_thresholds: { custom: Array(15).fill(80) },
};

panel._workModeDraft = 0;
let modeView = panel._renderModeSensing();
assert.match(modeView, /id="pir-sensitivity"/);
assert.doesNotMatch(modeView, /id="radar-sensitivity"/);

panel._workModeDraft = 1;
modeView = panel._renderModeSensing();
assert.doesNotMatch(modeView, /id="pir-sensitivity"/);
assert.match(modeView, /id="radar-sensitivity"/);
assert.match(modeView, /<details id="energy-advanced" class="energy-advanced" >/);

panel._workModeDraft = 2;
modeView = panel._renderModeSensing();
assert.match(modeView, /id="pir-sensitivity"/);
assert.match(modeView, /id="radar-sensitivity"/);

const overview = panel
  ._renderDetail()
  .match(/<section class="detail-section overview">.*?<\/section>/s)[0];
assert.doesNotMatch(overview, /Detection mode|PIR status|Radar status/);

panel._snapshot = null;
assert.match(panel._renderDetail(), /Connecting to device/);

// Background status renders must not replace a dialog while the user is typing.
let acceptClick, cancelClick, closed;
const field = {dataset:{field:"name"},value:"wrong",reportValidity(){}};
const alert = {};
const dialog = {
  set innerHTML(value) {this.markup=value;},
  addEventListener(name, callback) { if(name === "closed") closed = callback; },
  querySelector(selector) {
    if(selector === "[data-accept]") return {set onclick(callback){acceptClick=callback;}};
    if(selector === "[data-cancel]") return {set onclick(callback){cancelClick=callback;}};
    return alert;
  },
  querySelectorAll() {return [field];},
  remove() {},
};
context.document = {createElement:()=>dialog};
panel.shadowRoot.append = () => {};
const pending = panel._dialog({title:"Confirm",fields:[{id:"name"}],validate:v=>v.name==="sensor"?null:"Mismatch"});
assert.equal(dialog.headerTitle,"Confirm");
assert.match(dialog.markup, /<div slot="footer">.*data-cancel.*data-accept/s);
assert.doesNotMatch(dialog.markup, /slot="primaryAction"/);
acceptClick();
assert.equal(alert.textContent,"Mismatch");
assert.equal(panel._activeDialog,dialog);
panel.render();
assert.equal(panel._activeDialog,dialog);
field.value="sensor";
acceptClick();
assert.equal((await pending).name,"sensor");
const cancelled = panel._dialog({title:"Cancel"});
cancelClick();
assert.equal(await cancelled,false);
const dismissed = panel._dialog({title:"Dismiss"});
closed();
assert.equal(await dismissed,false);

dialog.heading="";
const legacyConfirmation=panel._dialog({title:"Legacy confirmation"});
assert.equal(dialog.heading,"Legacy confirmation");
assert.match(dialog.markup,/slot="primaryAction" data-accept/);
assert.match(dialog.markup,/slot="secondaryAction" data-cancel/);
acceptClick();
assert.equal(await legacyConfirmation,true);
delete dialog.heading;

const requests=[];
panel._hass.callWS=async request=>{requests.push(request);};
panel._load=async()=>{};
const adoption=panel._adopt({device_id:"new-device",host:"fd00::2",thread_mac:"0011223344556677",model:"LWR02"});
assert.match(dialog.markup,/<div slot="footer">.*data-accept/s);
acceptClick();
await adoption;
assert.equal(requests.length,1);
assert.equal(requests[0].type,"lafaer/device/adopt");
for(const language of ["en","zh-Hans","zh-Hant"]){
  panel._hass.language=language;
  assert.match(panel.t.takeoverWarning,/\nHome Assistant/);
  assert.match(panel.t.connectionFailedHint,/IPv6/);
}

console.log("frontend locale and lifecycle checks passed");
