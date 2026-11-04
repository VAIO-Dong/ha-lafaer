import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { parseHTML } from "linkedom";

const { window, document, customElements, HTMLElement, CustomEvent } = parseHTML("<html><body></body></html>");
const timers=new Map();let nextTimer=0;
const context={window,document,customElements,HTMLElement,CustomEvent,
  setTimeout:(callback,delay)=>{timers.set(++nextTimer,{callback,delay});return nextTimer;},
  clearTimeout:id=>timers.delete(id),setInterval:()=>0,clearInterval:()=>{}};
vm.runInNewContext(fs.readFileSync("custom_components/lafaer/frontend/ha-lafaer-panel.js","utf8"),context);
const Panel=customElements.get("ha-lafaer-panel");
const sensor=(id,available=false)=>({device_id:id,model:"LWR02",name:id,host:"fd00::1",available});

for(const language of ["en","zh-Hans","zh-Hant"]){
  const panel=new Panel();document.body.append(panel);
  let update,unsubscribed=0,subscriptions=0;
  panel._hass={language,connection:{subscribeMessage:async callback=>{
    subscriptions++;update=callback;
    callback({scan_id:1,revision:0,scanning:true,devices:[sensor("managed")],discovered:[sensor("history")]});
    return async()=>{unsubscribed++;};
  }}};
  await panel._load();
  assert.equal(subscriptions,1);
  const root=panel.shadowRoot;
  const managed=root.querySelector('[data-device-key="LWR02:managed"]');
  const rename=managed.querySelector("[data-rename]");
  const history=root.querySelector("#discovery-history");
  const historyRow=root.querySelector('[data-device-key="LWR02:history"]');
  const list=root.querySelector(".list-layout");list.scrollTop=280;
  panel._historyOpen=true;history.setAttribute("open","");
  assert.equal(root.querySelector("#scan").hasAttribute("disabled"),true);
  assert.equal(root.querySelector("#historical-devices").children.length,1,"cache visible before scan completes");
  assert.ok(managed.textContent.includes(panel.t.checking));
  update({scan_id:1,revision:0,scanning:true,devices:[sensor("managed")],discovered:[sensor("managed",true),sensor("history"),sensor("fresh",true)]});
  assert.equal(root.querySelector('[data-device-key="LWR02:managed"]'),managed);
  assert.equal(managed.querySelector("[data-rename]"),rename,"unchanged actions keep their DOM node");
  assert.equal(root.querySelector("#discovery-history"),history);
  assert.equal(history.hasAttribute("open"),true);
  assert.equal(root.querySelector(".list-layout"),list);
  assert.equal(list.scrollTop,280);
  assert.ok(managed.textContent.includes(panel.t.available));
  assert.equal(root.querySelector('[data-adopt="fresh"]').hasAttribute("disabled"),false);
  await panel._scan();assert.equal(subscriptions,1,"repeated scan click shares the subscription");
  // Late ICD data and a cached device becoming discoverable do not recreate rows.
  update({scan_id:1,revision:0,scanning:true,devices:[sensor("managed")],discovered:[sensor("fresh",true),{...sensor("managed",true),icd_lit:true},sensor("history",true)]});
  assert.equal(root.querySelector('[data-device-key="LWR02:managed"]'),managed);
  assert.equal(managed.querySelector("[data-rename]"),rename);
  assert.ok(managed.querySelector("[data-icd]"));
  assert.equal(root.querySelector('[data-device-key="LWR02:history"]'),historyRow);
  assert.equal(historyRow.parentElement.id,"discovered-devices");
  assert.deepEqual([...root.querySelector("#discovered-devices").children].map(row=>row.dataset.deviceKey),["LWR02:fresh","LWR02:history"]);
  assert.equal(list.scrollTop,280);
  update({scan_id:1,revision:0,scanning:false,devices:[sensor("managed")],discovered:[sensor("fresh",true),sensor("managed",true),sensor("history",true)]});
  assert.equal(panel._scanning,false);assert.equal(unsubscribed,1);
  assert.equal(root.querySelector("#scan").hasAttribute("disabled"),false);
  assert.equal(root.querySelector("#scan-progress").textContent,"");
  assert.equal(root.querySelector('[data-device-key="LWR02:managed"]'),managed);
  panel.remove();
}

// Stale events and a delayed subscription acknowledgement cannot resurrect a departed page.
{
  const panel=new Panel();document.body.append(panel);let acknowledge,update,closed=0;
  panel._hass={language:"en",connection:{subscribeMessage:callback=>{update=callback;return new Promise(resolve=>{acknowledge=resolve;});}}};
  const pending=panel._scan();await Promise.resolve();
  await panel._stopDiscovery();panel._view="detail";
  update({scan_id:1,revision:0,scanning:true,devices:[sensor("late")],discovered:[]});
  acknowledge(async()=>{closed++;});await pending;
  assert.equal(closed,1);assert.equal(panel._devices.length,0);assert.equal(panel._scanning,false);
  panel.remove();
}

// A lost reply ends loading, retains cache and permits another scan.
{
  const panel=new Panel();document.body.append(panel);let update,closed=0;
  panel._hass={language:"en",connection:{subscribeMessage:async callback=>{update=callback;return async()=>{closed++;};}}};
  panel._discovered=[sensor("cached")];
  await panel._scan();
  const timeout=[...timers.values()].find(timer=>timer.delay===30000);
  assert.ok(timeout);timeout.callback();
  assert.equal(panel._scanning,false);assert.equal(closed,1);
  assert.equal(panel._discovered[0].device_id,"cached");
  assert.ok(panel._error);
  await panel._scan();assert.equal(panel._scanning,true);
  update({scan_id:2,revision:0,scanning:false,error:"network unavailable",devices:[],discovered:[sensor("cached")]});
  assert.equal(panel._scanning,false);assert.equal(panel._hasScanned,false);
  assert.ok(!panel.shadowRoot.querySelector("#scan").hasAttribute("disabled"));
  panel.remove();
}
console.log("progressive discovery DOM and subscription checks passed");
