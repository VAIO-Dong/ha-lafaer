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
const controls = source.slice(source.indexOf("  _renderAdvanced(){"), source.indexOf("\n", source.indexOf("  _renderAdvanced(){")));
assert.doesNotMatch(controls, /id="led"/);
assert.ok(controls.indexOf('id="battery-type"') < controls.indexOf('id="darkness"'));
const header = source.slice(source.indexOf("  _detailHeader("), source.indexOf("\n", source.indexOf("  _detailHeader(")));
assert.match(header, /data-forget role="menuitem"/);
assert.ok(header.indexOf("data-forget") < header.indexOf('data-danger="factory_reset"'));
const info = source.slice(source.indexOf("  _renderInfo(){"), source.indexOf("\n", source.indexOf("  _renderInfo(){")));
assert.doesNotMatch(info, /data-forget/);
for (const label of ["Remove from Lafaer management", "从 Lafaer 管理中移除", "從 Lafaer 管理中移除"]) {
  assert.ok(dictionarySource.includes(label));
}
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
  document: { hidden: false },
  setInterval: () => 1,
  clearInterval: () => {},
  setTimeout: () => 1,
  clearTimeout: () => {},
  HTMLElement: FakeHTMLElement,
  CustomEvent: class {constructor(type,options){this.type=type;Object.assign(this,options);}},
  customElements: {
    define: (name, constructor) => registry.set(name, constructor),
    get: (name) => registry.get(name),
  },
};
vm.runInNewContext(source, context);
const words = vm.runInNewContext("WORDS", context);
assert.deepEqual(Object.keys(words.en).sort(), Object.keys(words["zh-Hans"]).sort());
assert.deepEqual(Object.keys(words.en).sort(), Object.keys(words["zh-Hant"]).sort());
assert.equal(words["zh-Hans"].learning, "雷达自学习");
assert.equal(words["zh-Hans"].pirStatus, "红外感应状态");
assert.equal(words["zh-Hans"].darkness, "仅在低照度时上报有人");
assert.ok(words["zh-Hans"].learningTip.includes("30秒内离开检测区域"));

const RangeEditor = registry.get("lafaer-range-editor");
const Chart = registry.get("lafaer-threshold-chart");
const energyChart = new Chart();
const chartConfig = {values:[100], energy:[20], visibleCount:1, energyLabel:"当前"};
energyChart.config = chartConfig;
const oldMarkup = energyChart.innerHTML;
const bar = {style:{}}, line = {style:{}}, output = {}, reading = {};
energyChart.querySelectorAll = selector => selector === ".threshold-column" ? [{querySelector:selector=>({".bar i":bar,".bar b":line,"output":output,"small strong":reading})[selector]}] : [];
const scrollContainer = {scrollLeft:137};
energyChart.querySelector = () => scrollContainer;
energyChart.config = {...chartConfig, energy:[80]};
assert.equal(energyChart.innerHTML, oldMarkup, "energy-only refresh must retain DOM");
assert.equal(scrollContainer.scrollLeft, 137);
assert.equal(output.textContent, 80);
assert.equal(reading.textContent, 80);
assert.equal(bar.style.height, "8%");
const rangeEditor = new RangeEditor();
const gateView = new RangeEditor();
gateView.config={values:[0,1,2],states:[0,1,2],stateLabels:{0:"无人",1:"有人",2:"屏蔽"},visibleCount:3,readOnly:true};
assert.match(gateView.innerHTML, /<small>无人<\/small>/);
assert.match(gateView.innerHTML, /<small>有人<\/small>/);
assert.match(gateView.innerHTML, /<small>屏蔽<\/small>/);
assert.match(gateView.innerHTML, /enabled occupied/);
assert.doesNotMatch(gateView.innerHTML, /<button/);
gateView.config={values:[2],states:[1],stateLabels:{1:"有人"},visibleCount:1};
assert.equal(gateView.value[0],2,"live occupancy must not overwrite the pending mask");
assert.match(gateView.innerHTML, /<small>有人<\/small>/);
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
const renamePanel = new Panel();
const managedDevice = {device_id:"rename-test",name:"Old",model:"LWR02"};
let renameRequest;
renamePanel._devices=[managedDevice];
renamePanel._hass={language:"en",callWS:async request=>{renameRequest=request;return {...managedDevice,name:request.name};}};
renamePanel._dialog=async()=>({name:"New"});
await renamePanel._rename(managedDevice);
assert.equal(renameRequest.type,"lafaer/device/rename");
assert.equal(renameRequest.device_id,"rename-test");
assert.equal(renamePanel._devices[0].name,"New");
assert.equal(renamePanel._selected,undefined,"list rename must not select or connect a device");
assert.match(renamePanel._deviceCard(managedDevice,{adopted:true}),/data-rename="rename-test"/);
assert.doesNotMatch(renamePanel._deviceCard(managedDevice,{adopted:false}),/data-rename/);
assert.match(renamePanel.shadowRoot.innerHTML,/<\/main><div class="notification-layer/);
assert.match(source,/\.notification-layer\{position:fixed;/);
renamePanel._error="Test error";
assert.match(renamePanel._alerts(),/role="alert"/);
const sidebarPanel = new Panel();
sidebarPanel._hass = {language:"zh-Hans"};
let sidebarEvent;
const sidebarButton = {tagName:"HA-ICON-BUTTON"};
sidebarPanel.shadowRoot.querySelector = selector => selector === "#sidebar-menu" ? sidebarButton : null;
sidebarPanel.dispatchEvent = event => {sidebarEvent=event;};
sidebarPanel._bindSidebar();
sidebarButton.onclick();
assert.equal(sidebarEvent.type,"hass-toggle-menu");
assert.equal(sidebarEvent.bubbles,true);
assert.equal(sidebarEvent.composed,true);
sidebarButton.tagName="HA-MENU-BUTTON";
sidebarPanel.narrow=true;
assert.equal(sidebarButton.narrow,true);
assert.equal(sidebarButton.hass,sidebarPanel._hass);
sidebarPanel.narrow=false;
assert.equal(sidebarButton.narrow,false);
assert.match(sidebarPanel._renderList(),/id="sidebar-menu"/);
sidebarPanel._selected={name:"Test"};
assert.doesNotMatch(sidebarPanel._detailHeader(),/id="sidebar-menu"/);
assert.doesNotMatch(sidebarPanel._debugView(),/id="sidebar-menu"/);
assert.match(sidebarPanel._detailHeader(),/id="back"/);
const visibilityPanel = new Panel();
let closedSessions=0, backgroundRequest;
visibilityPanel._view="detail";visibilityPanel._selected={device_id:"test"};
visibilityPanel._viewerId="viewer";visibilityPanel._unsub=async()=>{closedSessions++;};
visibilityPanel._hass={language:"en",callWS:async request=>{backgroundRequest=request;}};
context.document.hidden=true;
await visibilityPanel._onVisibility();
assert.equal(closedSessions,0);
assert.equal(backgroundRequest.background,true);
assert.equal(visibilityPanel._backgroundTimer,1);
context.document.hidden=false;
await visibilityPanel._onVisibility();
assert.equal(closedSessions,0);
assert.equal(backgroundRequest.background,false);
assert.equal(visibilityPanel._backgroundTimer,null);
await visibilityPanel._closeSession();
assert.equal(closedSessions,1);
let renders=0;
visibilityPanel.render=()=>{renders++;};
visibilityPanel._settingsPage=true;
visibilityPanel._snapshot={connected:true,status:{work_mode:2},config:{}};
visibilityPanel._applySnapshot({connected:true,status:{work_mode:2,occupied:true},config:{}});
assert.equal(renders,0,"status ticks must not rebuild settings");
visibilityPanel._applySnapshot({connected:true,status:{work_mode:1},config:{}});
assert.equal(renders,1);
const actionPanel = new Panel();
actionPanel._hass = {language: "en"};
actionPanel._selected = {name: "Test", device_id: "test"};
let actionDialog, resetCalls = 0, backCalls = 0;
actionPanel._dialog = async options => {actionDialog = options;return null;};
actionPanel._action = async () => {resetCalls++;return true;};
actionPanel._back = async () => {backCalls++;};
actionPanel._rangeDraft = [2];
await actionPanel._deviceAction("radar_reset");
assert.equal(resetCalls, 1);
assert.equal(actionDialog, undefined, "radar reset does not ask for confirmation");
assert.equal(actionPanel._rangeDraft, null);
await actionPanel._deviceAction("factory_reset");
assert.equal(resetCalls, 1, "cancelled factory reset sends nothing");
assert.equal(actionDialog.fields, undefined, "confirmation must not require typing a name");
actionPanel._dialog = async () => true;
await actionPanel._deviceAction("factory_reset");
assert.equal(resetCalls, 2);
assert.equal(backCalls, 1);
actionPanel._dialog = async options => {actionDialog = options;return null;};
await actionPanel._confirmDanger();
assert.equal(actionDialog.title, actionPanel.t.forget);
assert.equal(actionDialog.fields, undefined);
const learningPanel = new Panel();
learningPanel._hass = {language: "zh-Hans"};
learningPanel._selected = {model: "LWR02", device_id: "learning"};
learningPanel._settingsPage = true;
let learningActions = 0, confirmation;
learningPanel._action = async action => {assert.equal(action, "start_learning");learningActions++;};
learningPanel._dialog = async options => {confirmation = options;return null;};
await learningPanel._confirmLearning();
assert.equal(learningActions, 0);
assert.equal(confirmation.text, learningPanel.t.learningTip);
learningPanel._dialog = async () => true;
await learningPanel._confirmLearning();
assert.equal(learningActions, 1);
learningPanel._selected.model = "LWR01";
learningPanel._dialog = async options => {confirmation = options;return null;};
await learningPanel._confirmLearning();
assert.equal(confirmation.text, learningPanel.t.adaptationTip);
assert.equal(confirmation.accept, learningPanel.t.adaptationStart);
learningPanel._dialog = async () => {learningPanel._sessionGeneration++;return true;};
await learningPanel._confirmLearning();
assert.equal(learningActions, 1, "expired sessions cannot start learning");
assert.match(source, /const HA_LAYOUT_STYLES/);
assert.match(source, /height:var\(--header-height,56px\);min-height:var\(--header-height,56px\);margin:0;padding:0 20px/);
assert.match(source, /\.cards>\.empty\{box-sizing:border-box;margin:0;padding:16px;/);
assert.match(source, /class="navigation-row" id="open-settings"/);
assert.match(source, /role="listitem"/);
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
assert.match(panel._renderDetail(), /id="led"/);
assert.match(panel._renderDetail(), /id="open-settings"/);
assert.match(panel._renderDetail(), /id="identify"/);
assert.ok(panel._renderDetail().includes(panel.t.deviceInfo));
assert.doesNotMatch(panel._renderDetail(), /id="save-mode"|id="battery-type"/);
panel._settingsPage = true;
assert.match(panel._renderDetail(), /id="save-mode"/);
assert.doesNotMatch(panel._renderDetail(), /id="led"/);
assert.ok(!panel._renderDetail().includes(panel.t.deviceInfo));
assert.doesNotMatch(panel._renderDetail(), /page-subtitle/);
assert.match(panel._renderDetail(), /page-content settings-layout/);
assert.match(panel._renderDetail(), /ha-card class="panel-card control-card"/);
assert.match(source, /max-width:none;margin:0;padding:0 0 32px/);
assert.match(source, /@container\(max-width:650px\)/);
assert.doesNotMatch(panel._renderDetail(), /id="identify"/);
panel._snapshot.radar_status.ranges_valid = false;
assert.doesNotMatch(panel._renderDetail(), /alert-type="warning"/);
assert.match(panel._renderDetail(), /id="pir-state"/);
assert.match(panel._renderDetail(), /class="pir-section"/);
assert.match(panel._renderDetail(), /id="radar-state"/);
assert.match(panel._renderDetail(), /id="range-status"/);
assert.match(source, /label:has\(>#timeout\)\{display:flex;align-items:center/);
assert.doesNotMatch(source, /range\.config=\{\.\.\.this\._rangeStatusConfig/);
assert.doesNotMatch(source, /q\("#range"\)\.config=\{\.\.\.this\._rangeStatusConfig/);
assert.equal(words["zh-Hans"].range,"雷达感应范围设置");
assert.equal(words["zh-Hant"].range,"雷達感測範圍設定");
assert.equal(words.en.range,"Radar range settings");
assert.match(source, /class="navigation-row" id="identify"/);
assert.match(source, /flex:0 0 76px/);
assert.match(source, /grid\.scrollLeft=left/);
assert.match(panel._renderDetail(), /<details id="energy-advanced"[^]*id="range"[^]*id="detection-chart"[^]*id="keep-chart"[^]*<\/details>/);
assert.doesNotMatch(panel._renderDetail(), /id="range-details"/);
assert.doesNotMatch(panel._renderDetail(), /class="button-row"><ha-button id="learning"/);
assert.match(panel._renderDetail(), /data-danger="radar_reset"[^]*id="detection-chart"/);
assert.match(source, /this\._readEnergy\("detection_energy"\),1000/);
assert.match(source, /this\._readEnergy\("keep_energy"\),5000/);
assert.match(source, /this\._readRadarStatus\(\),2000/);
panel._settingsPage = false;
panel._selected.model = "LWR01";
panel._snapshot.status = {power_type: 2, battery_level: 100};
assert.match(panel._renderDetail(), /External power/);
assert.doesNotMatch(panel._renderDetail(), /Detection distance|<small>Battery<\/small>|Temperature|Humidity/);
panel._snapshot.status.power_type = 1;
assert.match(panel._renderDetail(), /100%/);

panel._snapshot = null;
assert.match(panel._renderDetail(), /Connecting to device/);

const pollingPanel = new Panel();
let radarReads = 0;
pollingPanel._hass = { language: "en", callWS: async () => {radarReads++;return {values: [1]};} };
pollingPanel._selected = {device_id: "test", model: "LWR02"};
pollingPanel._viewerId = "viewer";
pollingPanel._snapshot = {connected: true, status: {work_mode: 2}};
pollingPanel._energyOpen = true;
await pollingPanel._readEnergy("detection_energy");
assert.equal(radarReads, 0, "device home must not request radar energy");
pollingPanel._settingsPage = true;
await pollingPanel._readEnergy("detection_energy");
assert.equal(radarReads, 1);
context.document.hidden = true;
await pollingPanel._readEnergy("detection_energy");
assert.equal(radarReads, 1, "hidden pages must not request radar energy");
context.document.hidden = false;
pollingPanel._snapshot.status.work_mode = 0;
await pollingPanel._readEnergy("detection_energy");
assert.equal(radarReads, 1, "PIR mode must not request radar energy");
pollingPanel._snapshot.status.work_mode = 2;
pollingPanel._setEnergyPolling(false);
await pollingPanel._readEnergy("detection_energy");
assert.equal(radarReads, 1, "collapsed charts must stop reading");
pollingPanel._rangeTimer = 1;
await pollingPanel._closeSession();
assert.equal(pollingPanel._rangeTimer, null);
assert.equal(pollingPanel._viewerId, null);

// Background status renders must not replace a dialog while the user is typing.
let acceptClick, cancelClick, closed;
const field = {dataset:{field:"name"},value:"wrong",setCustomValidity(value){this.error=value;},reportValidity(){return !this.error;}};
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
assert.match(dialog.markup, /<input id="dialog-name"/);
assert.doesNotMatch(dialog.markup, /ha-textfield/);
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

panel._hass.callWS=async request=>{requests.push(request);return {...panel._selected,name:request.name};};
const rename=panel._rename();
assert.match(dialog.markup,/value="Test sensor"/);
assert.match(dialog.markup,/maxlength="64"/);
field.value="";
acceptClick();
assert.equal(panel._activeDialog,dialog);
field.value="Renamed sensor";
acceptClick();
await rename;
assert.equal(requests.at(-1).type,"lafaer/device/rename");
assert.equal(panel._selected.name,"Renamed sensor");
for(const language of ["en","zh-Hans","zh-Hant"]){
  panel._hass.language=language;
  assert.match(panel.t.takeoverWarning,/\nHome Assistant/);
  assert.match(panel.t.connectionFailedHint,/IPv6/);
}

console.log("frontend locale and lifecycle checks passed");
