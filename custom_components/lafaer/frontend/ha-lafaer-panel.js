const WORDS = {
  en: {
    title: "Lafaer", devices: "Devices", scan: "Scan for devices", scanning: "Scanning…",
    noDevices: "No Lafaer devices found", disconnected: "Not connected", connected: "Connected while this page is open",
    open: "Open", takeover: "Take over in Home Assistant", takeoverTitle: "Take over this device?",
    takeoverWarning: "The sensor stores one management key. Home Assistant will replace the App key, and the App will no longer manage this sensor.",
    pairHint: "Hold the sensor button for 3 seconds until its light flashes slowly, then confirm.", cancel: "Cancel", confirm: "Confirm takeover",
    occupancy: "Occupancy", detected: "Detected", clear: "Clear", illuminance: "Illuminance", battery: "Battery",
    temperature: "Temperature", humidity: "Humidity", workMode: "Detection mode", controls: "Controls",
    led: "LED", identify: "Identify", learning: "Auto adaptation / self-learning", settings: "Settings",
    presenceTimeout: "Presence timeout", darkness: "Report only in darkness", darknessThreshold: "Darkness threshold",
    save: "Save", radar: "Radar configuration", range: "Distance ranges", trigger: "Trigger sensitivity", hold: "Presence sensitivity",
    detectionThreshold: "Motion threshold", keepThreshold: "Presence threshold", advanced: "Danger zone",
    radarReset: "Reset radar parameters", factoryReset: "Factory reset device", release: "Release management",
    forget: "Forget locally", dangerConfirm: "This action is destructive. Continue?", debug: "Debug", refresh: "Refresh",
    clearLogs: "Clear logs", back: "Back", error: "Error", hiddenPause: "Updates pause while this tab is hidden.",
    takeoverDone: "Home Assistant has taken over the device.", deviceInfo: "Device information", networkInfo: "Network information",
    pirOnly: "PIR only", radarOnly: "Radar only", hybrid: "Hybrid", low: "Low", medium: "Medium", high: "High", custom: "Custom",
    disposable: "Disposable", rechargeable: "Rechargeable", batteryType: "Battery type", pirSensitivity: "PIR sensitivity", radarSensitivity: "Radar sensitivity",
    performance: "High performance", batteryPower: "On battery power", usbPower: "On USB power", download: "Download",
    manualAdd: "Manual takeover", model: "Model", deviceId: "Device ID", host: "IPv6 address / hostname", threadMac: "Thread MAC",
    requiredFields: "Device ID, address, and Thread MAC are required.", saved: "Saved.", working: "Working…",
    rename: "Rename", deviceName: "Device name", renamed: "Device renamed.",
    confirmName: "To confirm, enter the device name exactly:", nameMismatch: "The device name did not match. No action was taken.", actionDone: "Action completed.",
    distance: "Detection distance", powerSource: "Power source", batterySource: "Battery", usbSource: "USB", usbBatterySource: "USB + battery",
    serialNumber: "Serial number", firmware: "Firmware", radarFirmware: "Radar firmware", threadNetwork: "Thread network", signal: "Signal", ipv6: "IPv6",
    adoptedDevices: "Managed by Home Assistant", discoveredDevices: "Discovered devices", noAdopted: "No devices have been taken over yet.",
    noDiscovered: "No other Lafaer devices have been discovered.", available: "Available", offline: "Offline", checking: "Checking…", lastSeen: "Last seen",
    adoptedHelp: "Opening a device starts its connection. The saved address is retained for later connections.",
    discoveredHelp: "Opening this panel runs one mDNS scan. Cached devices remain listed; scanning does not connect to a sensor.",
    takeoverConnecting: "Connecting and authenticating…", takeoverFailed: "Takeover failed", takeoverSucceeded: "Takeover completed",
    unknownError: "No error detail was returned. Download Lafaer diagnostics for the recorded failure stage.",
    moreActions: "More actions", deviceStatus: "Device status", deviceControls: "Device controls", modeSensing: "Mode & sensing",
    pirStatus: "PIR status", radarStatus: "Radar status", triggered: "Triggered", notTriggered: "Clear", advancedSettings: "Advanced settings",
    currentEnergy: "Current energy", thresholdValue: "Threshold", energyLegend: "Bar: current energy · Line: configured threshold", close: "Close"
  },
  "zh-Hans": {
    title: "Lafaer", devices: "设备", scan: "扫描设备", scanning: "正在扫描…", noDevices: "未发现 Lafaer 设备",
    disconnected: "当前未连接", connected: "仅在此页面打开时保持连接", open: "打开", takeover: "由 Home Assistant 接管",
    takeoverTitle: "接管此设备？", takeoverWarning: "传感器只能保存一套管理密钥。Home Assistant 将覆盖 App 密钥，此后 App 无法继续管理该传感器。",
    pairHint: "请长按传感器按钮 3 秒，直到指示灯缓慢闪烁，然后确认。", cancel: "取消", confirm: "确认接管",
    occupancy: "占用状态", detected: "检测到有人", clear: "无人", illuminance: "照度", battery: "电量",
    temperature: "温度", humidity: "湿度", workMode: "检测模式", controls: "快捷控制", led: "指示灯",
    identify: "识别设备", learning: "自动适配 / 雷达自学习", settings: "设置", presenceTimeout: "无人延时",
    darkness: "仅暗光时上报", darknessThreshold: "暗光阈值", save: "保存", radar: "雷达配置", range: "距离分区",
    trigger: "触发灵敏度", hold: "维持灵敏度", detectionThreshold: "运动阈值", keepThreshold: "存在阈值",
    advanced: "危险操作", radarReset: "重置雷达参数", factoryReset: "恢复设备出厂设置", release: "解除设备管理",
    forget: "仅从 HA 移除", dangerConfirm: "此操作具有破坏性，是否继续？", debug: "Debug", refresh: "刷新",
    clearLogs: "清空日志", back: "返回", error: "错误", hiddenPause: "此标签页不可见时将暂停更新。",
    takeoverDone: "Home Assistant 已接管设备。", deviceInfo: "设备信息", networkInfo: "网络信息",
    pirOnly: "仅 PIR", radarOnly: "仅雷达", hybrid: "融合模式", low: "低", medium: "中", high: "高", custom: "自定义",
    disposable: "一次性电池", rechargeable: "可充电电池", batteryType: "电池类型", pirSensitivity: "PIR 灵敏度", radarSensitivity: "雷达灵敏度",
    performance: "高性能模式", batteryPower: "电池供电时", usbPower: "USB 供电时", download: "下载",
    manualAdd: "手动接管", model: "型号", deviceId: "设备 ID", host: "IPv6 地址 / 主机名", threadMac: "Thread MAC",
    requiredFields: "设备 ID、地址和 Thread MAC 均为必填项。", saved: "已保存。", working: "正在处理…",
    rename: "重命名", deviceName: "设备名称", renamed: "设备名称已更新。",
    confirmName: "请输入完整设备名称以确认：", nameMismatch: "设备名称不匹配，未执行任何操作。", actionDone: "操作已完成。",
    distance: "检测距离", powerSource: "供电方式", batterySource: "电池", usbSource: "USB", usbBatterySource: "USB + 电池",
    serialNumber: "序列号", firmware: "固件版本", radarFirmware: "雷达固件", threadNetwork: "Thread 网络", signal: "信号", ipv6: "IPv6",
    adoptedDevices: "已由 Home Assistant 接管", discoveredDevices: "发现的设备", noAdopted: "尚未接管设备。",
    noDiscovered: "尚未发现其他 Lafaer 设备。", available: "可用", offline: "离线", checking: "正在检查…", lastSeen: "上次发现",
    adoptedHelp: "只有打开设备详情才会建立连接，保存的地址会保留供以后再次连接。",
    discoveredHelp: "打开本页面会执行一次 mDNS 扫描；历史发现会保留，扫描本身不会连接传感器。",
    takeoverConnecting: "正在连接并认证…", takeoverFailed: "接管失败", takeoverSucceeded: "接管完成",
    unknownError: "后端未返回错误详情，请下载 Lafaer 诊断信息查看已记录的失败阶段。",
    moreActions: "更多功能", deviceStatus: "设备状态", deviceControls: "设备控制", modeSensing: "模式与感应",
    pirStatus: "PIR 状态", radarStatus: "雷达状态", triggered: "已触发", notTriggered: "未触发", advancedSettings: "高级设置",
    currentEnergy: "当前能量", thresholdValue: "设定阈值", energyLegend: "柱形：当前能量 · 横线：设定阈值", close: "关闭"
  },
  "zh-Hant": {
    title: "Lafaer", devices: "裝置", scan: "掃描裝置", scanning: "正在掃描…", noDevices: "找不到 Lafaer 裝置",
    disconnected: "目前未連線", connected: "僅在此頁面開啟時保持連線", open: "開啟", takeover: "由 Home Assistant 接管",
    takeoverTitle: "接管此裝置？", takeoverWarning: "感測器只能保存一組管理金鑰。Home Assistant 將覆寫 App 金鑰，此後 App 無法繼續管理此感測器。",
    pairHint: "請長按感測器按鈕 3 秒，直到指示燈緩慢閃爍，然後確認。", cancel: "取消", confirm: "確認接管",
    occupancy: "佔用狀態", detected: "偵測到有人", clear: "無人", illuminance: "照度", battery: "電量",
    temperature: "溫度", humidity: "濕度", workMode: "偵測模式", controls: "快速控制", led: "指示燈",
    identify: "識別裝置", learning: "自動調適 / 雷達自學習", settings: "設定", presenceTimeout: "無人延遲",
    darkness: "僅暗光時回報", darknessThreshold: "暗光閾值", save: "儲存", radar: "雷達設定", range: "距離分區",
    trigger: "觸發靈敏度", hold: "維持靈敏度", detectionThreshold: "運動閾值", keepThreshold: "存在閾值",
    advanced: "危險操作", radarReset: "重設雷達參數", factoryReset: "恢復裝置原廠設定", release: "解除裝置管理",
    forget: "僅從 HA 移除", dangerConfirm: "此操作具有破壞性，是否繼續？", debug: "Debug", refresh: "重新整理",
    clearLogs: "清除日誌", back: "返回", error: "錯誤", hiddenPause: "此分頁不可見時將暫停更新。",
    takeoverDone: "Home Assistant 已接管裝置。", deviceInfo: "裝置資訊", networkInfo: "網路資訊",
    pirOnly: "僅 PIR", radarOnly: "僅雷達", hybrid: "融合模式", low: "低", medium: "中", high: "高", custom: "自訂",
    disposable: "一次性電池", rechargeable: "可充電電池", batteryType: "電池類型", pirSensitivity: "PIR 靈敏度", radarSensitivity: "雷達靈敏度",
    performance: "高效能模式", batteryPower: "電池供電時", usbPower: "USB 供電時", download: "下載",
    manualAdd: "手動接管", model: "型號", deviceId: "裝置 ID", host: "IPv6 位址 / 主機名稱", threadMac: "Thread MAC",
    requiredFields: "裝置 ID、位址和 Thread MAC 均為必填欄位。", saved: "已儲存。", working: "正在處理…",
    rename: "重新命名", deviceName: "裝置名稱", renamed: "裝置名稱已更新。",
    confirmName: "請輸入完整裝置名稱以確認：", nameMismatch: "裝置名稱不相符，未執行任何操作。", actionDone: "操作已完成。",
    distance: "偵測距離", powerSource: "供電方式", batterySource: "電池", usbSource: "USB", usbBatterySource: "USB + 電池",
    serialNumber: "序號", firmware: "韌體版本", radarFirmware: "雷達韌體", threadNetwork: "Thread 網路", signal: "訊號", ipv6: "IPv6",
    adoptedDevices: "已由 Home Assistant 接管", discoveredDevices: "探索到的裝置", noAdopted: "尚未接管裝置。",
    noDiscovered: "尚未探索到其他 Lafaer 裝置。", available: "可用", offline: "離線", checking: "正在檢查…", lastSeen: "上次發現",
    adoptedHelp: "只有開啟裝置詳細資料才會建立連線，儲存的位址會保留供日後再次連線。",
    discoveredHelp: "開啟本頁面會執行一次 mDNS 掃描；歷史探索結果會保留，掃描本身不會連線感測器。",
    takeoverConnecting: "正在連線並驗證…", takeoverFailed: "接管失敗", takeoverSucceeded: "接管完成",
    unknownError: "後端未回傳錯誤詳情，請下載 Lafaer 診斷資訊查看已記錄的失敗階段。",
    moreActions: "更多功能", deviceStatus: "裝置狀態", deviceControls: "裝置控制", modeSensing: "模式與感應",
    pirStatus: "PIR 狀態", radarStatus: "雷達狀態", triggered: "已觸發", notTriggered: "未觸發", advancedSettings: "進階設定",
    currentEnergy: "目前能量", thresholdValue: "設定閾值", energyLegend: "柱形：目前能量 · 橫線：設定閾值", close: "關閉"
  }
};

const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const localeFor = (language = "en") => {
  const normalized = language.replace("_", "-").toLowerCase();
  if (["zh-hant", "zh-tw", "zh-hk", "zh-mo"].some(x => normalized.startsWith(x))) return "zh-Hant";
  if (normalized === "zh" || ["zh-hans", "zh-cn", "zh-sg"].some(x => normalized.startsWith(x))) return "zh-Hans";
  return "en";
};

const LIST_STYLES = `<style>
.menu-wrap{position:relative}.function-menu{position:absolute;z-index:20;right:0;top:44px;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;box-shadow:var(--ha-card-box-shadow,0 3px 12px rgba(0,0,0,.18))}.function-menu button{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:6px;padding:12px;background:transparent;color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer}.function-menu button:hover{background:var(--secondary-background-color)}.modal-backdrop{position:fixed;z-index:50;inset:0;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.35)}.modal{width:min(480px,100%);padding:22px;background:var(--card-background-color);border-radius:12px;box-shadow:0 10px 34px rgba(0,0,0,.3)}.modal header{margin-bottom:8px}.modal label{display:grid;gap:6px;margin:12px 0}.modal input,.modal select{box-sizing:border-box;width:100%;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:10px}.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}@media(max-width:600px){.modal{padding:16px}}
</style>`;

const DETAIL_STYLES = `<style>
.detail-surface{margin-top:24px;padding:0 28px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px}.detail-surface>hr{border:0;border-top:1px solid var(--divider-color);margin:0}.detail-section{margin:0;padding:28px 0}.detail-section h2{margin:0 0 20px;font-size:20px}.detail-section h3{margin:28px 0 12px;font-size:16px}.status-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0}.status-item{display:flex;align-items:center;gap:12px;min-height:58px;padding:10px 18px;border-left:1px solid var(--divider-color)}.status-item:first-child{border-left:0}.status-item ha-icon{color:var(--primary-color)}.status-item small,.status-item strong{display:block}.status-item small{color:var(--secondary-text-color)}.status-item strong{margin-top:5px;font-size:18px}.status-item.active strong{color:var(--primary-color)}.setting-row{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;padding:4px 0}.form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 24px}.detail-section label{display:grid;gap:6px;margin:12px 0}.detail-section input,.detail-section select{box-sizing:border-box;width:100%;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:10px}.button-row{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:18px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}.info-row{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px solid var(--divider-color)}.info-row span{color:var(--secondary-text-color)}.info-row code{text-align:right;overflow-wrap:anywhere}.threshold-column{min-width:112px;text-align:center}.threshold-column>span,.threshold-column>small{display:block;margin:6px 0}.threshold-column>small{color:var(--secondary-text-color)}.threshold-column label{min-width:0;margin:8px 0;font-size:12px}.threshold-column input{text-align:center}.chart-legend{color:var(--secondary-text-color);font-size:13px}.bar{border-radius:4px;overflow:hidden}.bar output{position:absolute;top:6px;left:0;right:0;z-index:2;font-size:12px;font-weight:600}.bar i{opacity:.75}.danger{margin-top:22px}.danger ha-button{--mdc-theme-primary:var(--error-color)}@media(max-width:600px){.detail-surface{padding:0 16px}.status-grid{grid-template-columns:1fr 1fr}.status-item{padding:10px 8px;border-left:0;border-bottom:1px solid var(--divider-color)}.info-grid{grid-template-columns:1fr}.rename{grid-template-columns:1fr}}
</style>`;

class LafaerRangeEditor extends HTMLElement {
  set config(value) { this._config = value; this._values = [...(value?.values || [])]; this.render(); }
  get value() { return [...(this._values || [])]; }
  connectedCallback() { this.render(); }
  render() {
    const c = this._config || {},step=c.step??.75; this._values ||= [...(c.values || [])];
    const count=Math.min(c.visibleCount||this._values.length,this._values.length);
    this.innerHTML = `<div class="range-grid">${this._values.slice(0,count).map((v,i) => {const start=Number((i*step).toFixed(2)),end=Number(((i+1)*step).toFixed(2));return `<button class="range-segment ${v === (c.disabledValue ?? 2) ? "disabled" : "enabled"}" data-i="${i}" title="${start}-${end} m" aria-pressed="${v !== (c.disabledValue ?? 2)}"><span>${start}-${end}m</span></button>`;}).join("")}</div>`;
    this.querySelectorAll("button").forEach(b => b.onclick = () => { const i=Number(b.dataset.i),disabled=c.disabledValue??2,enabled=c.enabledValue??0; this._values[i] = this._values[i] === disabled ? enabled : disabled; this.dispatchEvent(new CustomEvent("value-changed", {detail:{value:this.value}, bubbles:true})); this.render(); });
  }
}
if (!customElements.get("lafaer-range-editor")) customElements.define("lafaer-range-editor", LafaerRangeEditor);

class LafaerThresholdChart extends HTMLElement {
  set config(value) { this._config = value; this.render(); }
  get value() { return [...(this._values || [])]; }
  connectedCallback() { this.render(); }
  render() {
    const c=this._config||{}; this._values=[...(c.values||Array(15).fill(100))]; const energy=c.energy||Array(15).fill(0); const max=Math.max(1000,...this._values,...energy);
    const count=Math.min(c.visibleCount||this._values.length,this._values.length);
    this.innerHTML=`<p class="chart-legend">${esc(c.legend||"")}</p><div class="threshold-grid">${this._values.slice(0,count).map((v,i)=>`<div class="threshold-column"><span>${i*.75}-${(i+1)*.75}m</span><div class="bar"><i style="height:${Math.min(100,energy[i]/max*100)}%"></i><b style="bottom:${Math.min(100,v/max*100)}%"></b><output>${energy[i]??0}</output></div><small>${esc(c.energyLabel||"Energy")} <strong>${energy[i]??0}</strong></small><label>${esc(c.thresholdLabel||"Threshold")}<input type="number" min="0" max="65535" value="${v}" data-i="${i}"></label></div>`).join("")}</div>`;
    this.querySelectorAll("input").forEach(input => input.onchange=()=>{this._values[Number(input.dataset.i)]=Number(input.value); this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:true}));});
  }
}
if (!customElements.get("lafaer-threshold-chart")) customElements.define("lafaer-threshold-chart", LafaerThresholdChart);

class HaLafaerPanel extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:"open"}); this._view="list"; this._devices=[]; this._discovered=[]; this._snapshot=null; this._unsub=null; this._heartbeat=null; this._busy=false; this._notice=null; this._sessionGeneration=0; this._subscribing=false; this._initialScanStarted=false; this._hasScanned=false; this._loading=false; this._adoptionStates=new Map(); this._adoptingKey=null; this._menuOpen=false; this._manualOpen=false; this._visibility=()=>this._onVisibility(); }
  set hass(value) { const old=this._hass?.language; this._hass=value; if(!this._loaded) this._load(); else if(old!==value.language) this.render(); }
  set panel(value) { this._panel=value; }
  connectedCallback() { this._loaded=true; document.addEventListener("visibilitychange",this._visibility); if(this._hass) this._load(); }
  disconnectedCallback() { document.removeEventListener("visibilitychange",this._visibility); this._closeSession(); }
  get t() { return WORDS[localeFor(this._hass?.language)]; }
  async _load() { if(!this._hass||this._loading)return;this._loading=true;try {this._devices=await this._hass.callWS({type:"lafaer/devices/list"});this.render();if(!this._initialScanStarted){this._initialScanStarted=true;await this._scan();}} catch(e){this._error=e.message;this.render();}finally{this._loading=false;} }
  async _scan() { if(this._scanning)return;this._scanning=true;this._error=null;this.render();try{this._discovered=await this._hass.callWS({type:"lafaer/discover",timeout:15});this._devices=await this._hass.callWS({type:"lafaer/devices/list"});}catch(e){this._error=e.message;}finally{this._hasScanned=true;this._scanning=false;this.render();} }
  _adoptionKey(device){return `${device?.model||""}:${device?.device_id||""}`;}
  _errorText(error){const values=[error?.message,error?.body?.message,error?.error?.message,typeof error==="string"?error:null,error?.code];const detail=values.find(value=>typeof value==="string"&&value.trim()&&value.trim().toLowerCase()!=="unknown error");return detail?.trim()||this.t.unknownError;}
  async _adopt(device) { if(!device?.device_id?.trim()||!device?.host?.trim()||!device?.thread_mac?.trim()){this._error=this.t.requiredFields;this.render();return;}if(this._adoptingKey)return;if(!confirm(`${this.t.takeoverWarning}\n\n${this.t.pairHint}`))return;const key=this._adoptionKey(device);this._adoptingKey=key;this._adoptionStates.set(key,{status:"working",message:this.t.takeoverConnecting});this._busy=true;this._error=this._notice=null;this.render();const request={type:"lafaer/device/adopt",device_id:device.device_id.trim(),model:device.model,host:device.host.trim(),thread_mac:device.thread_mac.trim(),version:device.version||"",name:device.name||`${device.model} ${device.device_id}`};if(typeof device.blue_id==="string")request.blue_id=device.blue_id;try{await this._hass.callWS(request);this._adoptionStates.set(key,{status:"success",message:this.t.takeoverSucceeded});await this._load();}catch(e){this._adoptionStates.set(key,{status:"error",message:`${this.t.takeoverFailed}: ${this._errorText(e)}`});}finally{this._adoptingKey=null;this._busy=false;this.render();} }
  async _open(device) { this._selected=device; this._view="detail"; this._snapshot=null; this._error=this._notice=null; this._rangeDraft=this._detectionDraft=this._keepDraft=this._triggerDraft=this._holdDraft=this._timeoutDraft=this._luxDraft=this._darknessDraft=this._batteryPerformanceDraft=this._usbPerformanceDraft=this._workModeDraft=this._pirDraft=this._radarDraft=this._batteryTypeDraft=null; this.render(); await this._subscribe(); }
  async _subscribe(){
    if(!this._selected||document.hidden||this._unsub||this._subscribing)return;
    const generation=this._sessionGeneration,deviceId=this._selected.device_id;
    this._subscribing=true;
    try{
      const unsubscribe=await this._hass.connection.subscribeMessage(e=>{this._snapshot={...(this._snapshot||{}),...e};if(e.viewer_id)this._viewerId=e.viewer_id;const active=this.shadowRoot.activeElement;if(!active||!["INPUT","SELECT"].includes(active.tagName))this.render();},{type:"lafaer/session/subscribe",device_id:deviceId});
      if(generation!==this._sessionGeneration||document.hidden||this._view!=="detail"||this._selected?.device_id!==deviceId){await unsubscribe();return;}
      this._unsub=unsubscribe;
      this._heartbeat=setInterval(()=>{if(this._viewerId&&!document.hidden)this._hass.callWS({type:"lafaer/session/heartbeat",device_id:deviceId,viewer_id:this._viewerId}).catch(()=>{});},10000);
      if(this._selected.model==="LWR02"){this._readEnergy("detection_energy");this._readEnergy("keep_energy");this._detectionTimer=setInterval(()=>this._readEnergy("detection_energy"),1000);this._keepTimer=setInterval(()=>this._readEnergy("keep_energy"),5000);}
    }catch(e){this._error=e.message;this.render();}
    finally{this._subscribing=false;if(generation!==this._sessionGeneration&&!document.hidden&&this._view==="detail"&&!this._unsub)this._subscribe();}
  }
  async _readEnergy(kind){if(document.hidden||!this._viewerId)return;try{const r=await this._hass.callWS({type:"lafaer/device/read",device_id:this._selected.device_id,kind});this._snapshot={...(this._snapshot||{}),[kind]:r.values};const chart=this.shadowRoot.querySelector(kind==="detection_energy"?"#detection-chart":"#keep-chart");if(chart){const draft=kind==="detection_energy"?this._detectionDraft:this._keepDraft,key=kind==="detection_energy"?"detection_thresholds":"keep_thresholds";chart.config={values:draft||this._snapshot[key]?.custom,energy:r.values,visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:this.t.energyLegend};}}catch(e){/* regular status updates surface connection errors */}}
  async _closeSession(){this._sessionGeneration++;clearInterval(this._heartbeat);clearInterval(this._detectionTimer);clearInterval(this._keepTimer);this._heartbeat=this._detectionTimer=this._keepTimer=null;this._viewerId=null;if(this._unsub){const u=this._unsub;this._unsub=null;await u();}}
  async _onVisibility(){if(this._view!=="detail")return;if(document.hidden)await this._closeSession();else await this._subscribe();}
  async _back(){await this._closeSession();this._view="list";this._selected=null;this._snapshot=null;await this._load();}
  async _action(action,data={}){if(this._busy)return false;this._busy=true;this._error=this._notice=null;this.render();try{await this._hass.callWS({type:"lafaer/device/action",device_id:this._selected.device_id,action,data});this._notice=this.t.actionDone;return true;}catch(e){this._error=e.message;return false;}finally{this._busy=false;this.render();}}
  _alerts(){return `${this._error?`<ha-alert alert-type="error">${esc(this._error)}</ha-alert>`:""}${this._notice?`<ha-alert alert-type="success">${esc(this._notice)}</ha-alert>`:""}`;}
  _confirmDanger(){const expected=this._selected.name||`${this._selected.model} ${this._selected.device_id}`,entered=prompt(`${this.t.confirmName}\n${expected}`,"");if(entered===null)return false;if(entered!==expected){this._error=this.t.nameMismatch;this.render();return false;}return true;}
  async _rename(){const field=this.shadowRoot.querySelector("#device-name"),name=field?.value.trim();if(!name){this._error=this.t.requiredFields;this.render();return;}this._busy=true;this._error=this._notice=null;this.render();try{const updated=await this._hass.callWS({type:"lafaer/device/rename",device_id:this._selected.device_id,name});this._selected=updated;this._devices=this._devices.map(device=>device.device_id===updated.device_id?updated:device);this._notice=this.t.renamed;}catch(e){this._error=e.message;}finally{this._busy=false;this.render();}}
  _statusItem(title,value,icon,active=false){return `<div class="status-item ${active?"active":""}"><ha-icon icon="${icon}"></ha-icon><div><small>${title}</small><strong>${esc(value)}</strong></div></div>`;}
  _availability(device){if(!this._hasScanned)return null;const found=this._discovered.find(item=>item.device_id===device.device_id&&item.model===device.model);return found?.available===true;}
  _lastSeen(device){if(!device?.last_seen)return "";const date=new Date(device.last_seen);if(Number.isNaN(date.valueOf()))return "";return new Intl.DateTimeFormat(localeFor(this._hass?.language),{dateStyle:"medium",timeStyle:"short"}).format(date);}
  _deviceCard(device,{adopted}){const t=this.t,available=this._availability(device),cached=this._discovered.find(item=>item.device_id===device.device_id&&item.model===device.model),lastSeen=this._lastSeen(cached||device),state=available===null?t.checking:available?t.available:t.offline,operation=this._adoptionStates.get(this._adoptionKey(device)),working=operation?.status==="working",operationColor=operation?.status==="success"?"var(--success-color,#43a047)":operation?.status==="error"?"var(--error-color,#db4437)":"var(--secondary-text-color)";return `<ha-card><div class="device"><ha-icon icon="mdi:motion-sensor"></ha-icon><div><h3>${esc(device.name||`${device.model} ${device.device_id}`)}</h3><p>${esc(device.model)} · ${esc(device.version||"")}</p>${lastSeen?`<small>${t.lastSeen}: ${esc(lastSeen)}</small>`:""}${operation?`<div style="display:flex;align-items:center;gap:7px;margin:10px 3px 2px;font-size:13px;color:${operationColor}">${working?`<ha-circular-progress active size="small"></ha-circular-progress>`:`<ha-icon icon="${operation.status==="success"?"mdi:check-circle":"mdi:alert-circle"}" style="--mdc-icon-size:18px"></ha-icon>`}<span>${esc(operation.message)}</span></div>`:""}</div><span class="status ${available===true?"available":available===false?"offline":"checking"}">${esc(state)}</span><ha-button ${adopted?`data-open="${esc(device.device_id)}"`:`data-adopt="${esc(device.device_id)}"`} ${working||(!adopted&&available!==true)?"disabled":""}>${working?t.takeoverConnecting:adopted?t.open:t.takeover}</ha-button></div></ha-card>`;}
  _renderList(){const t=this.t,unmanaged=this._discovered.filter(d=>!this._devices.some(s=>s.device_id===d.device_id&&s.model===d.model));return `${LIST_STYLES}<header class="list-header"><h1>${t.devices}</h1><div class="menu-wrap"><ha-icon-button id="more" title="${esc(t.moreActions)}"><ha-icon icon="mdi:dots-vertical"></ha-icon></ha-icon-button>${this._menuOpen?`<div class="function-menu" role="menu"><button id="menu-manual" role="menuitem"><ha-icon icon="mdi:plus-network"></ha-icon>${t.manualAdd}</button><button id="menu-debug" role="menuitem"><ha-icon icon="mdi:bug-outline"></ha-icon>${t.debug}</button></div>`:""}</div></header>${this._alerts()}<section><div class="section-header"><div><h2>${t.adoptedDevices}</h2><p>${t.adoptedHelp}</p></div></div><div class="cards">${this._devices.length?this._devices.map(d=>this._deviceCard(d,{adopted:true})).join(""):`<p class="empty">${t.noAdopted}</p>`}</div></section><section><div class="section-header"><div><h2>${t.discoveredDevices}</h2><p>${t.discoveredHelp}</p></div><ha-button id="scan">${this._scanning?t.scanning:t.scan}</ha-button></div><div class="cards">${unmanaged.length?unmanaged.map(d=>this._deviceCard(d,{adopted:false})).join(""):`<p class="empty">${this._scanning?t.scanning:t.noDiscovered}</p>`}</div></section>${this._manualOpen?`<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(t.manualAdd)}"><header><h2>${t.manualAdd}</h2><ha-icon-button id="close-manual" title="${esc(t.close)}"><ha-icon icon="mdi:close"></ha-icon></ha-icon-button></header><label>${t.model}<select id="manual-model"><option>LWR01</option><option>LWR02</option></select></label><label>${t.deviceId}<input id="manual-id" required></label><label>${t.host}<input id="manual-host" required></label><label>${t.threadMac}<input id="manual-mac" required></label><div class="modal-actions"><ha-button id="cancel-manual">${t.cancel}</ha-button><ha-button id="manual-adopt">${t.takeover}</ha-button></div></div></div>`:""}`;}
  _renderDetail(){
    const t=this.t,s=this._snapshot?.status||{},cfg=this._snapshot?.config||{},radar=this._snapshot?.radar_status||{};
    const connected=this._snapshot?.connected===true,mode=[t.pirOnly,t.radarOnly,t.hybrid][s.work_mode]??"—",power=[t.batterySource,t.usbBatterySource,t.usbSource][s.power_type]??"—";
    const occupied=typeof s.occupied==="boolean"?s.occupied:null,pir=radar.pir_status===1,radarTriggered=radar.occupancy_status===1;
    let overview=this._statusItem(t.occupancy,occupied===null?"—":occupied?t.detected:t.clear,"mdi:account-check",occupied===true)+this._statusItem(t.illuminance,s.illuminance==null?"—":`${s.illuminance} lx`,"mdi:brightness-5");
    if(this._selected.model==="LWR02")overview+=this._statusItem(t.temperature,s.temperature_c==null?"—":`${s.temperature_c} °C`,"mdi:thermometer")+this._statusItem(t.humidity,s.humidity==null?"—":`${s.humidity}%`,"mdi:water-percent")+this._statusItem(t.workMode,mode,"mdi:tune-variant")+this._statusItem(t.pirStatus,radar.pir_status==null?"—":pir?t.triggered:t.notTriggered,"mdi:motion-sensor",pir)+this._statusItem(t.radarStatus,radar.occupancy_status==null?"—":radarTriggered?t.triggered:t.notTriggered,"mdi:radar",radarTriggered)+this._statusItem(t.battery,s.battery_level==null?"—":`${s.battery_level}%`,"mdi:battery");
    else overview+=this._statusItem(t.distance,s.distance_cm==null?"—":`${s.distance_cm} cm`,"mdi:map-marker-distance")+this._statusItem(t.powerSource,s.power_type==null?"—":power,"mdi:power-plug")+this._statusItem(t.battery,s.battery_level==null?"—":`${s.battery_level}%`,"mdi:battery");
    return `${DETAIL_STYLES}<header><ha-icon-button id="back"><ha-icon icon="mdi:arrow-left"></ha-icon></ha-icon-button><h1>${esc(this._selected.name)}</h1></header>${this._alerts()}${this._snapshot?.error?`<ha-alert alert-type="error">${esc(this._snapshot.error)}</ha-alert>`:""}<p class="power ${connected?"on":""}"><ha-icon icon="${connected?"mdi:lan-connect":"mdi:lan-disconnect"}"></ha-icon>${connected?t.connected:t.disconnected}</p><small>${t.hiddenPause}</small><div class="detail-surface"><section class="detail-section overview"><h2>${t.deviceStatus}</h2><div class="status-grid">${overview}</div></section><hr><section class="detail-section"><h2>${t.deviceControls}</h2><div class="setting-row"><span>${t.led}</span><ha-switch id="led" ${cfg.led_enabled?"checked":""}></ha-switch></div><div class="button-row"><ha-button id="identify">${t.identify}</ha-button></div></section><hr>${this._renderModeSensing()}<hr>${this._renderAdvanced()}<hr>${this._renderInfo()}</div>`;
  }
  _renderInfo(){const t=this.t,i=this._snapshot?.information||{};const rows=(values)=>values.map(([k,v])=>`<div class="info-row"><span>${esc(k)}</span><code>${esc(v||"—")}</code></div>`).join("");return `<section class="detail-section"><h2>${t.deviceInfo}</h2><div class="rename"><label>${t.deviceName}<input id="device-name" maxlength="64" value="${esc(this._selected.name)}"></label><ha-button id="rename">${t.rename}</ha-button></div><div class="info-grid">${rows([[t.model,i.model||this._selected.model],[t.deviceId,this._selected.device_id],[t.serialNumber,i.serial_number],["MAC",i.mac],[t.firmware,i.firmware_version||this._selected.version],[t.radarFirmware,i.radar_version]])}</div><h3>${t.networkInfo}</h3><div class="info-grid">${rows([[t.threadNetwork,i.thread_network_name],[t.signal,i.rssi],[t.ipv6,this._selected.host],[t.threadMac,i.thread_mac]])}</div><div class="danger button-row">${this._selected.model==="LWR01"?`<ha-button data-danger="delete_management">${t.release}</ha-button>`:""}<ha-button data-forget>${t.forget}</ha-button></div></section>`;}
  _renderModeSensing(){const t=this.t,cfg=this._snapshot?.config||{},ranges=this._snapshot?.ranges;if(this._selected.model==="LWR01")return `<section class="detail-section"><h2>${t.modeSensing}</h2><div class="form-grid"><label>${t.presenceTimeout}<input id="timeout" type="number" min="20" max="3600" value="${cfg.presence_timeout??30}"></label></div><div class="button-row"><ha-button id="learning">${t.learning}</ha-button><ha-button id="save-settings">${t.save}</ha-button></div><h3>${t.range}</h3><lafaer-range-editor id="range"></lafaer-range-editor><div class="sliders">${(ranges?.trigger||[]).map((v,i)=>`<label>${i+1} ${t.trigger}<input class="trigger" data-i="${i}" type="range" min="10" max="90" value="${100-v}"></label><label>${i+1} ${t.hold}<input class="hold" data-i="${i}" type="range" min="10" max="90" value="${100-ranges.hold[i]}"></label>`).join("")}</div><ha-button id="save-ranges">${t.save}</ha-button></section>`;return `<section class="detail-section"><h2>${t.modeSensing}</h2><div class="form-grid"><label>${t.workMode}<select id="work-mode"><option value="0">${t.pirOnly}</option><option value="1">${t.radarOnly}</option><option value="2">${t.hybrid}</option></select></label><label>${t.presenceTimeout}<input id="timeout" type="number" min="10" max="3600" value="${cfg.presence_timeout??30}"></label><label>${t.pirSensitivity}<select id="pir-sensitivity"><option value="0">${t.low}</option><option value="1">${t.medium}</option><option value="2">${t.high}</option></select></label><label>${t.radarSensitivity}<select id="radar-sensitivity"><option value="0">${t.low}</option><option value="1">${t.medium}</option><option value="2">${t.high}</option><option value="3">${t.custom}</option></select></label></div><div class="button-row"><ha-button id="learning">${t.learning}</ha-button><ha-button id="save-settings">${t.save}</ha-button></div><h3>${t.range}</h3><lafaer-range-editor id="range"></lafaer-range-editor><ha-button id="save-ranges">${t.save}</ha-button><h3>${t.detectionThreshold}</h3><lafaer-threshold-chart id="detection-chart"></lafaer-threshold-chart><ha-button id="save-detection">${t.save}</ha-button><h3>${t.keepThreshold}</h3><lafaer-threshold-chart id="keep-chart"></lafaer-threshold-chart><ha-button id="save-keep">${t.save}</ha-button></section>`;}
  _renderAdvanced(){const t=this.t,cfg=this._snapshot?.config||{};return `<section class="detail-section"><h2>${t.advancedSettings}</h2><div class="form-grid"><div class="setting-row"><span>${t.darkness}</span><ha-switch id="darkness" ${cfg.darkness_enabled?"checked":""}></ha-switch></div><label>${t.darknessThreshold}<input id="lux" type="number" min="0" max="1000" value="${cfg.darkness_threshold??0}"></label>${this._selected.model==="LWR01"?`<div class="setting-row"><span>${t.batteryPower} · ${t.performance}</span><ha-switch id="battery-performance" ${cfg.battery_performance?"checked":""}></ha-switch></div><div class="setting-row"><span>${t.usbPower} · ${t.performance}</span><ha-switch id="usb-performance" ${cfg.usb_performance?"checked":""}></ha-switch></div>`:`<label>${t.batteryType}<select id="battery-type"><option value="0">${t.disposable}</option><option value="1">${t.rechargeable}</option></select></label>`}</div><div class="button-row"><ha-button id="save-advanced">${t.save}</ha-button></div><div class="danger button-row"><ha-button data-danger="radar_reset">${t.radarReset}</ha-button><ha-button data-danger="factory_reset">${t.factoryReset}</ha-button></div></section>`;}
  async _renderDebug(){let logs=[];try{logs=await this._hass.callWS({type:"lafaer/debug/list"});}catch(e){this._error=e.message;}this._logs=logs;this.render();}
  _debugView(){return `<header><ha-icon-button id="back-debug"><ha-icon icon="mdi:arrow-left"></ha-icon></ha-icon-button><h1>${this.t.debug}</h1><ha-button id="download-debug">${this.t.download}</ha-button><ha-button id="clear-debug">${this.t.clearLogs}</ha-button></header><ha-card><pre>${esc(JSON.stringify(this._logs||[],null,2))}</pre></ha-card>`;}
  _bind(){
    const q=s=>this.shadowRoot.querySelector(s);
    if(q("#more"))q("#more").onclick=()=>{this._menuOpen=!this._menuOpen;this.render();};
    if(q("#menu-manual"))q("#menu-manual").onclick=()=>{this._menuOpen=false;this._manualOpen=true;this.render();};
    if(q("#menu-debug"))q("#menu-debug").onclick=()=>{this._menuOpen=false;this._view="debug";this._renderDebug();};
    if(q("#close-manual"))q("#close-manual").onclick=()=>{this._manualOpen=false;this.render();};
    if(q("#cancel-manual"))q("#cancel-manual").onclick=()=>{this._manualOpen=false;this.render();};
    if(q("#scan"))q("#scan").onclick=()=>this._scan();
    if(q("#manual-adopt"))q("#manual-adopt").onclick=()=>this._adopt({model:q("#manual-model").value,device_id:q("#manual-id").value.trim(),host:q("#manual-host").value.trim(),thread_mac:q("#manual-mac").value.trim(),version:"",name:`${q("#manual-model").value} ${q("#manual-id").value.trim()}`});
    this.shadowRoot.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>this._open([...this._devices,...this._discovered].find(d=>d.device_id===b.dataset.open)));
    this.shadowRoot.querySelectorAll("[data-adopt]").forEach(b=>b.onclick=()=>this._adopt(this._discovered.find(d=>d.device_id===b.dataset.adopt)));
    if(q("#back"))q("#back").onclick=()=>this._back();
    if(q("#back-debug"))q("#back-debug").onclick=()=>{this._view="list";this.render();};
    if(q("#clear-debug"))q("#clear-debug").onclick=async()=>{await this._hass.callWS({type:"lafaer/debug/clear"});this._renderDebug();};
    if(q("#download-debug"))q("#download-debug").onclick=()=>{const blob=new Blob([JSON.stringify(this._logs||[],null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`lafaer-debug-${new Date().toISOString()}.json`;a.click();URL.revokeObjectURL(url);};
    if(q("#led"))q("#led").onchange=e=>this._action("set_led",{enabled:e.target.checked});
    if(q("#identify"))q("#identify").onclick=()=>this._action("identify");
    if(q("#learning"))q("#learning").onclick=()=>this._action("start_learning");
    if(q("#rename"))q("#rename").onclick=()=>this._rename();
    if(q("#range")){
      const fallback=this._selected.model==="LWR01"?(this._snapshot?.ranges?.enabled||Array(8).fill(0)):(this._snapshot?.radar_status?.ranges||Array(15).fill(0));
      q("#range").config={values:this._rangeDraft||fallback,visibleCount:8,step:this._selected.model==="LWR01"?1.4:.75,disabledValue:this._selected.model==="LWR01"?0:2,enabledValue:this._selected.model==="LWR01"?1:0};
      q("#range").addEventListener("value-changed",e=>{this._rangeDraft=e.detail.value;});
    }
    if(q("#detection-chart")){
      q("#detection-chart").config={values:this._detectionDraft||this._snapshot?.detection_thresholds?.custom,energy:this._snapshot?.detection_energy,visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:this.t.energyLegend};
      q("#detection-chart").addEventListener("value-changed",e=>{this._detectionDraft=e.detail.value;});
    }
    if(q("#keep-chart")){
      q("#keep-chart").config={values:this._keepDraft||this._snapshot?.keep_thresholds?.custom,energy:this._snapshot?.keep_energy,visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:this.t.energyLegend};
      q("#keep-chart").addEventListener("value-changed",e=>{this._keepDraft=e.detail.value;});
    }
    const triggers=[...this.shadowRoot.querySelectorAll(".trigger")],holds=[...this.shadowRoot.querySelectorAll(".hold")];
    triggers.forEach((x,i)=>{if(this._triggerDraft)x.value=this._triggerDraft[i];x.oninput=()=>{this._triggerDraft=triggers.map(y=>Number(y.value));};});
    holds.forEach((x,i)=>{if(this._holdDraft)x.value=this._holdDraft[i];x.oninput=()=>{this._holdDraft=holds.map(y=>Number(y.value));};});
    if(q("#timeout")){if(this._timeoutDraft!==null)q("#timeout").value=this._timeoutDraft;q("#timeout").oninput=e=>{this._timeoutDraft=e.target.value;};}
    if(q("#lux")){if(this._luxDraft!==null)q("#lux").value=this._luxDraft;q("#lux").oninput=e=>{this._luxDraft=e.target.value;};}
    if(q("#darkness")){if(this._darknessDraft!==null)q("#darkness").checked=this._darknessDraft;q("#darkness").onchange=e=>{this._darknessDraft=e.target.checked;};}
    const cfg=this._snapshot?.config||{},status=this._snapshot?.status||{};
    if(q("#battery-performance")){q("#battery-performance").checked=this._batteryPerformanceDraft??cfg.battery_performance??false;q("#battery-performance").onchange=e=>{this._batteryPerformanceDraft=e.target.checked;};}
    if(q("#usb-performance")){q("#usb-performance").checked=this._usbPerformanceDraft??cfg.usb_performance??false;q("#usb-performance").onchange=e=>{this._usbPerformanceDraft=e.target.checked;};}
    for(const [selector,draftName,fallback] of [["#work-mode","_workModeDraft",status.work_mode??0],["#pir-sensitivity","_pirDraft",cfg.pir_sensitivity??0],["#radar-sensitivity","_radarDraft",cfg.radar_sensitivity??0],["#battery-type","_batteryTypeDraft",status.battery_type??0]]){const field=q(selector);if(field){field.value=String(this[draftName]??fallback);field.onchange=e=>{this[draftName]=Number(e.target.value);};}}
    if(q("#save-detection"))q("#save-detection").onclick=async()=>{if(await this._action("set_detection_thresholds",{values:q("#detection-chart").value}))this._detectionDraft=null;};
    if(q("#save-keep"))q("#save-keep").onclick=async()=>{if(await this._action("set_keep_thresholds",{values:q("#keep-chart").value}))this._keepDraft=null;};
    if(q("#save-ranges"))q("#save-ranges").onclick=async()=>{const ok=this._selected.model==="LWR01"?await this._action("set_lwr01_ranges",{enabled:q("#range").value,trigger:triggers.map(x=>100-Number(x.value)),hold:holds.map(x=>100-Number(x.value))}):await this._action("set_radar_range",{ranges:q("#range").value});if(ok)this._rangeDraft=this._triggerDraft=this._holdDraft=null;};
    const saveSettings=async()=>{const data={presence_timeout:Number(q("#timeout").value),darkness_enabled:q("#darkness").checked,darkness_threshold:Number(q("#lux").value)};if(this._selected.model==="LWR01")Object.assign(data,{battery_performance:q("#battery-performance").checked,usb_performance:q("#usb-performance").checked});else Object.assign(data,{work_mode:Number(q("#work-mode").value),pir_sensitivity:Number(q("#pir-sensitivity").value),radar_sensitivity:Number(q("#radar-sensitivity").value),battery_type:Number(q("#battery-type").value)});if(await this._action("set_settings",data)){this._notice=this.t.saved;this._timeoutDraft=this._luxDraft=this._darknessDraft=this._batteryPerformanceDraft=this._usbPerformanceDraft=this._workModeDraft=this._pirDraft=this._radarDraft=this._batteryTypeDraft=null;this.render();}};
    if(q("#save-settings"))q("#save-settings").onclick=saveSettings;
    if(q("#save-advanced"))q("#save-advanced").onclick=saveSettings;
    this.shadowRoot.querySelectorAll("[data-danger]").forEach(b=>b.onclick=async()=>{if(this._confirmDanger()){const removed=["factory_reset","delete_management"].includes(b.dataset.danger);if(await this._action(b.dataset.danger)&&removed)await this._back();}});
    if(q("[data-forget]"))q("[data-forget]").onclick=async()=>{if(this._confirmDanger()){this._busy=true;this.render();try{await this._hass.callWS({type:"lafaer/device/forget",device_id:this._selected.device_id});await this._back();}catch(e){this._error=e.message;}finally{this._busy=false;this.render();}}};
  }
  render(){if(!this.shadowRoot)return;this.shadowRoot.innerHTML=`<style>:host{display:block;background:var(--primary-background-color);min-height:100vh;color:var(--primary-text-color)}main{max-width:1100px;margin:auto;padding:24px}main.busy{cursor:progress}main.busy ha-button,main.busy ha-switch,main.busy input,main.busy select{pointer-events:none;opacity:.65}header{display:flex;align-items:center;gap:12px;margin-bottom:20px}header h1{flex:1;margin:0}section{margin:28px 0 36px}.section-header{display:flex;align-items:flex-start;gap:16px}.section-header>div{flex:1}.section-header h2,.section-header p{margin:0 0 6px}.section-header p{color:var(--secondary-text-color);max-width:760px}.cards{display:grid;gap:16px;margin:18px 0}.device{display:flex;align-items:center;gap:16px;padding:18px}.device>div{flex:1;min-width:0}.device h3,.device p{margin:3px}.device small{display:block;color:var(--secondary-text-color);margin:5px 3px}.device>ha-icon{--mdc-icon-size:36px;color:var(--primary-color)}.status{border-radius:999px;padding:4px 10px;font-size:12px;font-weight:500;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}.status.available{background:color-mix(in srgb,var(--success-color,#43a047) 15%,transparent);color:var(--success-color,#43a047)}.status.offline{background:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);color:var(--secondary-text-color)}.power{display:flex;gap:8px;align-items:center;color:var(--secondary-text-color)}.power.on{color:var(--success-color,#43a047)}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0}.metric{padding:18px;display:flex;gap:14px;align-items:center}.metric ha-icon{color:var(--primary-color)}.metric small,.metric strong{display:block}.metric strong{font-size:20px;margin-top:5px}.section{padding:20px;margin-bottom:16px}.section h2{font-size:18px}.row{display:flex;justify-content:space-between;align-items:center;padding:10px 0}.section label,.manual label{display:grid;gap:5px;margin:12px 0}.section input,.section select,.manual input,.manual select{color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:4px;padding:9px}.manual{padding:18px;margin-bottom:16px}.rename{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:12px}.danger ha-button{--mdc-theme-primary:var(--error-color);margin:5px}.range-grid{display:flex;gap:3px;overflow:auto;padding:10px 0}.range-segment{min-width:78px;height:64px;border:1px solid var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff);border-radius:4px}.range-segment.disabled{border-color:var(--divider-color);background:var(--disabled-color,#9e9e9e)}.threshold-grid{display:flex;gap:8px;overflow:auto}.threshold-grid label{min-width:70px;text-align:center}.bar{height:150px;position:relative;background:var(--secondary-background-color)}.bar i{position:absolute;bottom:0;left:20%;right:20%;background:var(--primary-color)}.bar b{position:absolute;left:0;right:0;border-top:2px solid var(--error-color)}pre{padding:18px;overflow:auto;max-height:70vh}.sliders{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}@media(max-width:600px){main{padding:12px}.metrics{grid-template-columns:1fr 1fr}.device{padding:12px;gap:9px;flex-wrap:wrap}.device>div{flex-basis:calc(100% - 54px)}.device ha-button{margin-left:auto;max-width:150px}.section-header{align-items:center}.section-header p{font-size:13px}.rename{grid-template-columns:1fr}}</style><main class="${this._busy?"busy":""}" aria-busy="${this._busy}">${this._view==="detail"?this._renderDetail():this._view==="debug"?this._debugView():this._renderList()}</main>`;this._bind();}
}
if (!customElements.get("ha-lafaer-panel")) customElements.define("ha-lafaer-panel", HaLafaerPanel);
