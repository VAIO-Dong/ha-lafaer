const WORDS = {
  en: {
    gateBlocked: "Blocked",
    sidebarMenu: "Open sidebar",
    radarFault: "Radar fault. Check the device before changing radar settings.", pirFault: "Infrared sensor fault. Check the device before changing infrared settings.", climateFault: "Temperature and humidity sensor fault.", radarModeRequired: "Select radar or hybrid mode first.",
    pirConfiguration: "Infrared configuration",
    factoryResetConfirm: "Restore this device to factory settings? You will need to pair it again.",
    forgetConfirm: "Remove this device from Lafaer management? Its device settings will not change.",
    releaseConfirm: "Remove this device's management key? You will need to pair it again to manage it.",
    learningRunning: "In the radar self-learning, please wait for the self-learning to be completed before setting it",
    adaptationStart: "Start Adapting",
    adaptationTip: "Please try to remove any potentially interfering devices in the detection area. After installing the device in a suitable location, leave the detection area and click the button below to start auto-adaptation.\nThe adaptive feature intelligently changes the detection range parameters according to your current usage environment to enhance your user experience.",
    adaptation: "Self-adaption",
    learningCountdown: "Please leave the detection area within {time}s",
    learningWaiting: "Radar self-learning in progress. Please wait until it finishes before changing settings.",
    learningDone: "Radar self-learning completed",
    learningStart: "Start Self-Learning",
    learningTip: "Please remove any devices that might cause interference from the detection area and install the device in an appropriate location. Tap the button below to start Auto-Adaptation. Once started, please leave the detection area immediately within 30 seconds. This feature will intelligently optimize the radar sensitivity parameters based on your current environment for a better experience.",
    title: "Lafaer", devices: "Devices", scan: "Scan", scanning: "Scanning…",
    noDevices: "No devices scanned", disconnected: "Disconnected", connected: "Connected",
    open: "Open", takeover: "Take over", takeoverTitle: "Take over this device?",
    takeoverWarning: "The sensor stores one management key.\nHome Assistant will replace the App key, and the App will no longer manage this sensor.",
    pairHint: "Hold the sensor button for 3 seconds until its light flashes slowly, then confirm.", cancel: "Cancel", confirm: "Confirm",
    occupancy: "Occupancy", detected: "Detected", clear: "Cleared", illuminance: "Illuminance", battery: "Battery",
    temperature: "Temperature", humidity: "Humidity", workMode: "Detection Mode", controls: "Controls",
    led: "LED", identify: "Identify Device", learning: "Radar Self-Learning", settings: "Settings",
    presenceTimeout: "Presence Timeout", darkness: "Report Presence Only Below the Illuminance Threshold", darknessThreshold: "Darkness threshold",
    save: "Save", radar: "Radar configuration", range: "Radar range settings", trigger: "Trigger Existence State Sensitivity", hold: "People Maintain State Sensitivity ",
    detectionThreshold: "Motion Detection Energy & Threshold", keepThreshold: "Presence Hold Energy & Threshold", advanced: "Danger zone",
    radarReset: "Reset radar parameters", factoryReset: "Reset Device", release: "Disconnect App",
    forget: "Remove from Lafaer management", dangerConfirm: "This action is destructive. Continue?", debug: "Debug", refresh: "Refresh",
    clearLogs: "Clear logs", back: "Back", error: "Error",
    takeoverDone: "Home Assistant has taken over the device.", deviceInfo: "Device Information", networkInfo: "Network Information",
    pirOnly: "PIR Only", radarOnly: "Radar Only", hybrid: "Hybrid", low: "Low", medium: "Medium", high: "High", custom: "Custom",
    disposable: "Disposable Battery", rechargeable: "Rechargeable Battery", batteryType: "Battery Type", pirSensitivity: "PIR Sensitivity", radarSensitivity: "Radar Sensitivity",
    performance: "High Performance Mode", batteryPower: "Battery Powered", usbPower: "USB Powered", download: "Download",
    manualAdd: "Manual takeover", model: "Model", deviceId: "Device ID", host: "IPv6 address / hostname", threadMac: "Thread MAC",
    requiredFields: "Device ID, address, and Thread MAC are required.", saved: "Saved.", working: "Working…",
    requiredValue: "Enter a value.", confirmAction: "Confirm", rename: "Rename", deviceName: "Device Name", renamed: "Device renamed.",
    confirmName: "To confirm, enter the device name exactly:", nameMismatch: "The device name did not match. No action was taken.", actionDone: "Action completed.",
    distance: "Detection distance", externalPower: "External power", powerSource: "Power source", batterySource: "Battery", usbSource: "USB", usbBatterySource: "USB + battery",
    serialNumber: "Serial number", firmware: "Firmware", radarFirmware: "Radar Version", threadNetwork: "Thread Network Name", signal: "Signal", ipv6: "IPv6",
    adoptedDevices: "Managed by Home Assistant", discoveredDevices: "Discovered devices", noAdopted: "No devices have been taken over yet.",
    noDiscovered: "No other Lafaer devices have been discovered.", available: "Available", offline: "Offline", checking: "Checking…", lastSeen: "Last seen",
    adoptedHelp: "View sensor status and manage device settings.",
    discoveredHelp: "Select a device to let Home Assistant manage it.",
    takeoverConnecting: "Connecting and authenticating…", takeoverFailed: "Takeover failed", takeoverSucceeded: "Takeover completed",
    unknownError: "Takeover failed. Try again or download diagnostics.",
    moreActions: "More actions", deviceStatus: "Device status", deviceControls: "Device controls", modeSensing: "Mode & Sensing",
    advancedSettings: "Advanced Settings",
    rangeHint: "Select a distance segment below to enable or disable detection in that segment.",
    currentEnergy: "Current", thresholdValue: "Threshold", energyLegend: "Bar: current energy · Line: configured threshold", keepEnergyLegend: "Bar: current energy · Line: configured threshold · Radar data becomes available after the radar has been running for a while.", close: "Close",
    connectingDevice: "Connecting to device", connectingHint: "Connecting through the Home Assistant IPv6 network.", connectionFailed: "Unable to connect", connectionFailedHint: "Check that Home Assistant can reach the Thread Border Router and sensor over IPv6, then try again.", retry: "Retry",
    radarUnavailable: "Distance settings are temporarily unavailable. Other device information is still available.", radarConfiguration: "Radar configuration", pirStatus: "PIR Status", energyAdvanced: "Radar advanced settings"
  },
  "zh-Hans": {
    gateBlocked: "屏蔽",
    sidebarMenu: "展开侧边栏",
    radarFault: "雷达故障，请检查设备后再调整雷达设置。", pirFault: "红外传感器故障，请检查设备后再调整红外设置。", climateFault: "温湿度传感器故障。", radarModeRequired: "请先选择雷达模式或融合模式。",
    pirConfiguration: "红外配置",
    factoryResetConfirm: "将此设备恢复为出厂设置？恢复后需要重新配对。",
    forgetConfirm: "从 Lafaer 管理中移除此设备？设备上的设置不会改变。",
    releaseConfirm: "删除此设备的管理密钥？之后需要重新配对才能管理。",
    learningRunning: "雷达自学习中，请等待自学习完后再设置",
    adaptationStart: "开始适应",
    adaptationTip: "请尽量移除检测区域内任何可能干扰的设备。将设备安装到合适的位置后，离开检测区域并单击下面的按钮开始自动适应。\n自适应功能会根据您当前的使用环境，智能更改检测范围相关参数，提升您的用户体验。",
    adaptation: "自适应",
    learningCountdown: "请在 {time} 秒内离开检测区域",
    learningWaiting: "雷达自学习中，请等待完成后再设置",
    learningDone: "雷达自学习已完成",
    learningStart: "开始自学习",
    learningTip: "请尽量移除检测区域内任何可能干扰的设备。并将设备安装到合适位置。点击下方按钮开始自动适应。启动后，请在30秒内离开检测区域。\n自适应功能将根据当前环境，智能优化雷达灵敏度参数，为您带来更佳体验。",
    title: "Lafaer", devices: "设备", scan: "扫描", scanning: "正在扫描…", noDevices: "未扫描到设备",
    disconnected: "未连接", connected: "已连接", open: "打开", takeover: "接管",
    takeoverTitle: "接管此设备？", takeoverWarning: "传感器只能保存一套管理密钥。\nHome Assistant 将覆盖 App 密钥，此后 App 无法继续管理该传感器。",
    pairHint: "请长按传感器按钮 3 秒，直到指示灯缓慢闪烁，然后确认。", cancel: "取消", confirm: "确认",
    occupancy: "状态", detected: "有人", clear: "无人", illuminance: "照度", battery: "电量",
    temperature: "温度", humidity: "湿度", workMode: "工作模式", controls: "快捷控制", led: "指示灯",
    identify: "识别设备", learning: "雷达自学习", settings: "设置", presenceTimeout: "无人退出时间",
    darkness: "仅在低照度时上报有人", darknessThreshold: "暗光阈值", save: "保存", radar: "雷达配置", range: "雷达感应范围设置",
    trigger: "触发有人存在状态灵敏度", hold: "保持有人存在状态灵敏度", detectionThreshold: "触发有人检测能量值及阈值", keepThreshold: "有人状态维持能量值与阈值",
    advanced: "危险操作", radarReset: "重置雷达参数", factoryReset: "重置设备", release: "断开 App 连接",
    forget: "从 Lafaer 管理中移除", dangerConfirm: "此操作具有破坏性，是否继续？", debug: "Debug", refresh: "刷新",
    clearLogs: "清空日志", back: "返回", error: "错误",
    takeoverDone: "Home Assistant 已接管设备。", deviceInfo: "设备信息", networkInfo: "网络信息",
    pirOnly: "红外", radarOnly: "雷达", hybrid: "融合", low: "低", medium: "中", high: "高", custom: "自定义",
    disposable: "一次性电池", rechargeable: "可充电电池", batteryType: "电池类型", pirSensitivity: "红外灵敏度", radarSensitivity: "雷达灵敏度",
    performance: "高性能模式", batteryPower: "电池供电", usbPower: "USB 供电", download: "下载",
    manualAdd: "手动接管", model: "型号", deviceId: "设备 ID", host: "IPv6 地址 / 主机名", threadMac: "Thread MAC",
    requiredFields: "设备 ID、地址和 Thread MAC 均为必填项。", saved: "已保存。", working: "正在处理…",
    requiredValue: "请输入内容。", confirmAction: "确认", rename: "重命名", deviceName: "设备名称", renamed: "设备名称已更新。",
    confirmName: "请输入完整设备名称以确认：", nameMismatch: "设备名称不匹配，未执行任何操作。", actionDone: "操作已完成。",
    distance: "检测距离", externalPower: "外接电源", powerSource: "供电方式", batterySource: "电池", usbSource: "USB", usbBatterySource: "USB + 电池",
    serialNumber: "序列号", firmware: "固件版本", radarFirmware: "雷达版本", threadNetwork: "Thread 网络名称", signal: "信号", ipv6: "IPv6",
    adoptedDevices: "已由 Home Assistant 接管", discoveredDevices: "发现的设备", noAdopted: "尚未接管设备。",
    noDiscovered: "尚未发现其他 Lafaer 设备。", available: "可用", offline: "离线", checking: "正在检查…", lastSeen: "上次发现",
    adoptedHelp: "查看传感器状态并管理设备设置。",
    discoveredHelp: "选择设备并交由 Home Assistant 管理。",
    takeoverConnecting: "正在连接并认证…", takeoverFailed: "接管失败", takeoverSucceeded: "接管完成",
    unknownError: "接管失败，请重试或下载诊断信息。",
    moreActions: "更多功能", deviceStatus: "设备状态", deviceControls: "设备控制", modeSensing: "工作模式与感应",
    advancedSettings: "高级设置",
    rangeHint: "点击下方距离段，开启或关闭该距离段的检测。",
    currentEnergy: "当前", thresholdValue: "阈值", energyLegend: "柱形：当前能量 · 横线：设定阈值", keepEnergyLegend: "柱形：当前能量 · 横线：设定阈值 · 雷达运行一段时间后，才可获取相应数据。", close: "关闭",
    connectingDevice: "正在连接设备", connectingHint: "正在通过 Home Assistant 的 IPv6 网络连接。", connectionFailed: "无法连接设备", connectionFailedHint: "请检查 Home Assistant 到 Thread 边界路由器和传感器的 IPv6 网络是否连通，然后重试。", retry: "重试",
    radarUnavailable: "距离设置暂不可用，其他设备信息仍可查看。", radarConfiguration: "雷达配置", pirStatus: "红外感应状态", energyAdvanced: "雷达高级设置"
  },
  "zh-Hant": {
    gateBlocked: "屏蔽",
    sidebarMenu: "展開側邊欄",
    radarFault: "雷達故障，請檢查裝置後再調整雷達設定。", pirFault: "紅外感測器故障，請檢查裝置後再調整紅外設定。", climateFault: "溫濕度感測器故障。", radarModeRequired: "請先選擇雷達模式或融合模式。",
    pirConfiguration: "紅外設定",
    factoryResetConfirm: "將此裝置恢復為原廠設定？恢復後需要重新配對。",
    forgetConfirm: "從 Lafaer 管理中移除此裝置？裝置上的設定不會改變。",
    releaseConfirm: "刪除此裝置的管理金鑰？之後需要重新配對才能管理。",
    learningRunning: "雷達正在進行自我學習，請等待完成後再設定。",
    adaptationStart: "開始環境自適應",
    adaptationTip: "請盡量移除偵測區域內可能造成干擾的設備。將裝置安裝於合適位置後，離開偵測區域，再點選下方按鈕開始環境自適應。\n此功能會根據目前環境，自動調整偵測範圍的相關參數。",
    adaptation: "環境自適應",
    learningCountdown: "請在 {time} 秒內離開偵測區域",
    learningWaiting: "雷達正在進行自我學習，請等待完成後再設定。",
    learningDone: "雷達自我學習已完成",
    learningStart: "開始自我學習",
    learningTip: "請盡量移除偵測區域內可能造成干擾的設備，並將裝置安裝於合適位置。點選下方按鈕開始雷達自我學習，並在啟動後 30 秒內離開偵測區域。\n此功能會根據目前環境，自動調整雷達靈敏度參數。",
    title: "Lafaer", devices: "裝置", scan: "掃描", scanning: "正在掃描…", noDevices: "未找到裝置",
    disconnected: "未連線", connected: "已連線", open: "開啟", takeover: "接管",
    takeoverTitle: "接管此裝置？", takeoverWarning: "感測器只能保存一組管理金鑰。\nHome Assistant 將覆寫 App 金鑰，此後 App 無法繼續管理此感測器。",
    pairHint: "請長按感測器按鈕 3 秒，直到指示燈緩慢閃爍，然後確認。", cancel: "取消", confirm: "確認",
    occupancy: "人體存在狀態", detected: "有人", clear: "無人", illuminance: "照度", battery: "電量",
    temperature: "溫度", humidity: "濕度", workMode: "偵測模式", controls: "快速控制", led: "指示燈",
    identify: "識別裝置", learning: "雷達自我學習", settings: "設定", presenceTimeout: "無人確認時間",
    darkness: "僅在低照度時回報有人", darknessThreshold: "暗光閾值", save: "儲存", radar: "雷達設定", range: "雷達感測範圍設定",
    trigger: "有人觸發靈敏度", hold: "有人狀態維持靈敏度", detectionThreshold: "有人觸發能量值與閾值", keepThreshold: "有人狀態維持能量值與閾值",
    advanced: "危險操作", radarReset: "重設雷達參數", factoryReset: "重設裝置", release: "中斷 App 連線",
    forget: "從 Lafaer 管理中移除", dangerConfirm: "此操作具有破壞性，是否繼續？", debug: "Debug", refresh: "重新整理",
    clearLogs: "清除日誌", back: "返回", error: "錯誤",
    takeoverDone: "Home Assistant 已接管裝置。", deviceInfo: "裝置資訊", networkInfo: "網路資訊",
    pirOnly: "僅被動式紅外線（PIR）", radarOnly: "僅毫米波雷達", hybrid: "融合模式", low: "低", medium: "中", high: "高", custom: "自訂",
    disposable: "拋棄式電池", rechargeable: "充電式電池", batteryType: "電池類型", pirSensitivity: "PIR 靈敏度", radarSensitivity: "雷達靈敏度",
    performance: "高效能模式", batteryPower: "電池供電", usbPower: "USB 供電", download: "下載",
    manualAdd: "手動接管", model: "型號", deviceId: "裝置 ID", host: "IPv6 位址 / 主機名稱", threadMac: "Thread MAC",
    requiredFields: "裝置 ID、位址和 Thread MAC 均為必填欄位。", saved: "已儲存。", working: "正在處理…",
    requiredValue: "請輸入內容。", confirmAction: "確認", rename: "重新命名", deviceName: "裝置名稱", renamed: "裝置名稱已更新。",
    confirmName: "請輸入完整裝置名稱以確認：", nameMismatch: "裝置名稱不相符，未執行任何操作。", actionDone: "操作已完成。",
    distance: "偵測距離", externalPower: "外接電源", powerSource: "供電方式", batterySource: "電池", usbSource: "USB", usbBatterySource: "USB + 電池",
    serialNumber: "序號", firmware: "韌體版本", radarFirmware: "雷達版本", threadNetwork: "Thread 網路名稱", signal: "訊號", ipv6: "IPv6",
    adoptedDevices: "已由 Home Assistant 接管", discoveredDevices: "探索到的裝置", noAdopted: "尚未接管裝置。",
    noDiscovered: "尚未探索到其他 Lafaer 裝置。", available: "可用", offline: "離線", checking: "正在檢查…", lastSeen: "上次發現",
    adoptedHelp: "查看感測器狀態並管理裝置設定。",
    discoveredHelp: "選擇裝置並交由 Home Assistant 管理。",
    takeoverConnecting: "正在連線並驗證…", takeoverFailed: "接管失敗", takeoverSucceeded: "接管完成",
    unknownError: "接管失敗，請重試或下載診斷資訊。",
    moreActions: "更多功能", deviceStatus: "裝置狀態", deviceControls: "裝置控制", modeSensing: "運作模式與感測",
    advancedSettings: "進階設定",
    rangeHint: "點選下方距離區段，開啟或關閉該區段的偵測。",
    currentEnergy: "目前", thresholdValue: "閾值", energyLegend: "柱形：目前能量 · 橫線：設定閾值", keepEnergyLegend: "柱形：目前能量 · 橫線：設定閾值 · 雷達運作一段時間後，才可取得相應資料。", close: "關閉",
    connectingDevice: "正在連線裝置", connectingHint: "正在透過 Home Assistant 的 IPv6 網路連線。", connectionFailed: "無法連線裝置", connectionFailedHint: "請檢查 Home Assistant 到 Thread 邊界路由器和感測器的 IPv6 網路是否連通，然後重試。", retry: "重試",
    radarUnavailable: "距離設定暫不可用，其他裝置資訊仍可查看。", radarConfiguration: "雷達設定", pirStatus: "PIR 感測狀態", energyAdvanced: "雷達進階設定"
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
.menu-wrap{position:relative}.function-menu{position:absolute;z-index:20;right:0;top:44px;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;box-shadow:var(--ha-card-box-shadow,0 3px 12px rgba(0,0,0,.18))}.function-menu button{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:6px;padding:12px;background:transparent;color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer}.function-menu button:hover{background:var(--secondary-background-color)}
</style>`;

const DETAIL_STYLES = `<style>
.detail-surface{margin-top:24px;padding:0 28px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px}.detail-surface>hr{border:0;border-top:1px solid var(--divider-color);margin:0}.detail-section{margin:0;padding:28px 0}.detail-section h2{margin:0 0 20px;font-size:20px}.detail-section h3{margin:28px 0 12px;font-size:16px}.detail-header .menu-wrap{position:relative}.detail-header .function-menu{position:absolute;z-index:20;right:0;top:44px;min-width:220px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;box-shadow:var(--ha-card-box-shadow,0 3px 12px rgba(0,0,0,.18))}.detail-header .function-menu button{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:6px;padding:12px;background:transparent;color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer}.detail-header .function-menu button:hover{background:var(--secondary-background-color)}.detail-header .function-menu button.danger-item{color:var(--error-color)}.connection-state{display:grid;justify-items:center;align-content:center;min-height:55vh;text-align:center}.connection-state ha-circular-progress,.connection-state>ha-icon{margin-bottom:20px}.connection-state>ha-icon{--mdc-icon-size:52px;color:var(--error-color)}.connection-state h2{margin:0 0 8px}.connection-state p{max-width:520px;margin:0 0 22px;color:var(--secondary-text-color)}.status-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0}.status-item{display:flex;align-items:center;gap:12px;min-height:58px;padding:10px 18px;border-left:1px solid var(--divider-color)}.status-item:first-child{border-left:0}.status-item ha-icon{color:var(--primary-color)}.status-item small,.status-item strong{display:block}.status-item small{color:var(--secondary-text-color)}.status-item strong{margin-top:5px;font-size:18px}.status-item.active strong{color:var(--primary-color)}.setting-row{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;padding:4px 0}.form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 24px}.detail-section label{display:grid;gap:6px;margin:12px 0}.detail-section input,.detail-section select{box-sizing:border-box;width:100%;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:10px}.button-row{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:18px}.radar-config{margin-top:24px;padding-top:4px;border-top:1px solid var(--divider-color)}.energy-advanced{margin-top:24px;border-top:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color)}.energy-advanced summary{cursor:pointer;padding:18px 0;font-weight:500;list-style-position:inside}.energy-advanced[open]{padding-bottom:22px}.energy-advanced[open] summary{margin-bottom:4px}.threshold-block+.threshold-block{margin-top:32px;padding-top:8px;border-top:1px solid var(--divider-color)}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}.info-row{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px solid var(--divider-color)}.info-row span{color:var(--secondary-text-color)}.info-row code{text-align:right;overflow-wrap:anywhere}.detail-section .rename{align-items:end}.detail-section .rename label{margin:0}.detail-section .rename ha-button{align-self:end}.threshold-column{min-width:112px;text-align:center}.threshold-column>span,.threshold-column>small{display:block;margin:6px 0}.threshold-column>small{color:var(--secondary-text-color)}.threshold-column label{min-width:0;margin:8px 0;font-size:12px}.threshold-column input{text-align:center}.chart-legend{color:var(--secondary-text-color);font-size:13px}.bar{border-radius:4px;overflow:hidden}.bar output{position:absolute;top:6px;left:0;right:0;z-index:2;font-size:12px;font-weight:600}.bar i{opacity:.75}.danger{margin-top:22px}.danger ha-button{--mdc-theme-primary:var(--error-color)}@media(max-width:600px){.detail-surface{padding:0 16px}.status-grid{grid-template-columns:1fr 1fr}.status-item{padding:10px 8px;border-left:0;border-bottom:1px solid var(--divider-color)}.info-grid{grid-template-columns:1fr}.rename{grid-template-columns:1fr}.connection-state{min-height:48vh}}
</style>`;

const RESPONSIVE_STYLES = `<style>
main{box-sizing:border-box;width:100%;min-width:0}
.device-title{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;flex:1;min-width:0}
.device-title h1{flex:initial;overflow-wrap:anywhere;font-size:24px}
.title-connected{display:inline-flex;align-items:center;gap:5px;color:var(--success-color,#43a047);font-size:13px;white-space:nowrap}
.title-connected ha-icon{--mdc-icon-size:18px}
.detail-header>ha-icon-button,.detail-header>.menu-wrap{flex-shrink:0}
.detail-section .form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.detail-section .form-grid>*{min-width:0}
.detail-section [hidden]{display:none!important}
.status-grid{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}
.status-item{border-left:0;min-width:0;padding:10px}
.info-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.info-row{min-width:0}.info-row code{min-width:0}
.range-grid{flex-wrap:wrap}.range-segment{flex:1 0 90px}
.threshold-grid{max-width:100%}
ha-dialog .dialog-fields{display:grid;gap:18px;min-width:0}
ha-dialog input,ha-dialog select{width:100%;box-sizing:border-box}
ha-dialog p{white-space:pre-line}ha-dialog .dialog-fields label{display:grid;gap:8px}ha-dialog input,ha-dialog select{font:inherit;padding:12px;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:4px}
@media(max-width:600px){.detail-section .form-grid,.info-grid{grid-template-columns:minmax(0,1fr)}.device-title h1{font-size:20px}.detail-header{gap:4px}.title-connected{font-size:12px}.detail-section{padding:22px 0}.status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sliders{grid-template-columns:minmax(0,1fr)}}
</style>`;


const HA_LAYOUT_STYLES = `<style>
:host{font-family:var(--ha-font-family-body,Roboto,Arial,sans-serif);font-size:var(--ha-font-size-m,14px);line-height:var(--ha-line-height-normal,1.5);width:100%;min-width:0}
main{box-sizing:border-box;width:100%;max-width:none;margin:0;padding:0 0 32px;container-type:inline-size}
main>header{box-sizing:border-box;width:100%;height:var(--header-height,56px);min-height:var(--header-height,56px);margin:0;padding:0 20px;gap:16px;border-bottom:1px solid var(--divider-color);background:var(--app-header-background-color,var(--primary-background-color));color:var(--app-header-text-color,var(--primary-text-color))}
main>header h1,.device-title h1{font-size:20px;font-weight:var(--ha-font-weight-normal,400);line-height:1.4;overflow-wrap:anywhere}
main>header .device-title{flex-wrap:nowrap;min-width:0}main>header h1{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}main>header .device-title h1{flex:0 1 auto}main>header .title-connected{flex-shrink:0}main>header>h1{min-width:0}main>ha-alert{display:block;margin:16px 24px}
.page-content{box-sizing:border-box;width:100%;padding:32px clamp(16px,3.5%,48px);gap:16px}
.device-layout{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}
.card-column{display:grid;gap:16px;min-width:0}
.settings-layout{display:grid;grid-template-columns:minmax(280px,1fr) minmax(0,2fr);align-items:start}
.list-layout{display:grid;grid-template-columns:minmax(0,1fr)}
.panel-card{display:block;min-width:0;max-width:100%;overflow:visible;--ha-card-border-radius:12px;--ha-card-box-shadow:none}
.panel-card>.detail-section{box-sizing:border-box;margin:0;padding:20px 16px 0;min-width:0}
.panel-card>.detail-section:last-child{padding-bottom:16px}
.detail-section h2,.section-header h2{font-size:var(--ha-font-size-xl,24px);font-weight:var(--ha-font-weight-normal,400);margin:0 0 16px;overflow-wrap:anywhere}
.detail-section h3{overflow-wrap:anywhere}.section-header p{font-size:14px}
.cards{gap:0;margin:16px 0 0}.cards>[role=listitem]+[role=listitem]{border-top:1px solid var(--divider-color)}
.device{padding:16px 0;min-height:64px}.device h3{font-size:16px;font-weight:500;overflow-wrap:anywhere}.device>ha-icon{--mdc-icon-size:24px}
.setting-row{min-height:48px;gap:16px}.setting-row>span{overflow-wrap:anywhere}
.detail-section .setting-row>h3{margin:0;min-width:0;line-height:24px;overflow-wrap:anywhere}
.energy-advanced>.setting-row{align-items:center;gap:12px;padding:8px 0}
.energy-advanced>.setting-row>ha-button{flex-shrink:0;align-self:center}
.control-card .form-grid{grid-template-columns:minmax(0,1fr)}
.detail-section:not(:has(.energy-advanced)) input,.detail-section select{min-height:48px;font:inherit;border-radius:var(--ha-border-radius-sm,4px)}
.detail-section>.button-row,.card-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;border-top:1px solid var(--divider-color);margin:16px -16px -16px;padding:8px 16px;min-height:40px;align-items:center}
.card-actions{justify-content:flex-start;margin-bottom:0}
.overview .status-grid{grid-template-columns:minmax(0,1fr)}
.status-item{min-height:48px;padding:8px 0;border:0}.status-item>div{display:flex;flex:1;align-items:center;justify-content:space-between;gap:16px;min-width:0}.status-item small{font-size:14px}.status-item strong{font-size:16px;font-weight:500;margin:0;text-align:end}
.info-grid{grid-template-columns:minmax(0,1fr)}.info-row{align-items:baseline;min-height:24px;gap:16px}.info-row:last-child{border-bottom:0}.info-row code{font-family:inherit;font-size:14px}
.navigation-row{box-sizing:border-box;display:flex;align-items:center;gap:16px;width:calc(100% + 32px);min-height:56px;margin:0 -16px -16px;padding:12px 16px;border:0;border-top:1px solid var(--divider-color);background:transparent;color:var(--primary-text-color);font:inherit;text-align:start;cursor:pointer;border-radius:0 0 12px 12px}
.navigation-row span{flex:1}.navigation-row ha-icon{color:var(--secondary-text-color)}
button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--primary-color);outline-offset:3px}
.navigation-row:not(:last-child){margin-bottom:0;border-radius:0}
.cards{margin:16px -16px -16px}.cards .device{padding:16px}.cards>[role=listitem]:last-child .device{border-radius:0 0 12px 12px}
.notification-layer{position:fixed;z-index:1000;top:calc(env(safe-area-inset-top,0px) + var(--header-height,56px) + 8px);left:50%;transform:translateX(-50%);width:min(560px,calc(100% - 32px));pointer-events:auto;filter:drop-shadow(0 4px 12px rgba(0,0,0,.18))}.notification-layer.enter{animation:notification-enter .2s ease-out}.notification-layer>ha-alert{display:block}.notification-content{box-sizing:border-box;display:block;padding-inline-end:44px;min-height:24px;line-height:24px}.notification-layer>#dismiss-notice{position:absolute;inset-inline-end:8px;top:50%;transform:translateY(-50%);margin:0}.notification-content>span{flex:1;min-width:0;overflow-wrap:anywhere}.notification-content>ha-icon-button{flex-shrink:0}.device-name-row{display:flex;align-items:center;gap:4px;min-width:0}.device-name-row h3{min-width:0}.device-name-row ha-icon-button{flex-shrink:0;--mdc-icon-button-size:36px;--mdc-icon-size:20px}@keyframes notification-enter{from{opacity:0;transform:translate(-50%,-16px)}to{opacity:1;transform:translate(-50%,0)}}@media(prefers-reduced-motion:reduce){.notification-layer.enter{animation:none}}
.cards>.empty{box-sizing:border-box;margin:0;padding:16px;min-height:56px;color:var(--secondary-text-color);text-align:start;overflow-wrap:anywhere}
.detail-section label:has(>select),.detail-section label:has(>#timeout){display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:48px;margin:4px 0}.detail-section label>select,.detail-section label>#timeout{width:auto;flex:0 1 55%;min-width:100px;max-width:65%}
.range-segment{box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px}.range-segment small{display:block;font-size:12px}.range-segment.occupied{background:var(--success-color,#43a047);border-color:var(--success-color,#43a047);color:var(--text-primary-color,#fff)}#range-status .range-segment.enabled:not(.occupied){background:var(--secondary-background-color);color:var(--primary-text-color);border-color:var(--divider-color)}
.pir-section{margin-top:24px;padding-top:4px;border-top:1px solid var(--divider-color)}
.threshold-column{flex:0 0 76px;min-width:76px;max-width:76px}.threshold-column>span{font-size:11px;white-space:nowrap}.threshold-column>small{font-size:12px;white-space:nowrap}.threshold-column input{padding:8px 4px;font-size:12px}.threshold-column .bar{height:130px}.threshold-grid{overscroll-behavior-x:contain}
.radar-config>.energy-advanced{border-top:0;border-bottom:0}
.detail-section select,.detail-section #timeout{box-sizing:border-box;height:38px;min-height:38px;padding:8px 10px;font:inherit;line-height:20px}
.radar-config>h3,.pir-section>h3{margin:16px 0 12px}
.radar-config>.setting-row{box-sizing:border-box;min-height:48px;padding:0}
.radar-config>.energy-advanced{margin-top:4px}
.energy-advanced:not([open]){padding-bottom:0}
.energy-advanced>summary{box-sizing:border-box;min-height:48px;padding:12px 0}
.sensing-card .detail-section:has(.energy-advanced:not([open]))>.button-row{margin-top:8px}
.navigation-row:hover,.device:hover{background:var(--secondary-background-color)}
.debug-content{margin:0;padding:0}.debug-content pre{box-sizing:border-box;margin:0;padding:16px;font-size:13px;max-height:calc(100vh - 180px)}
main.busy button,main.busy ha-icon-button{pointer-events:none;opacity:.65}
.function-menu{max-width:calc(100vw - 32px)}.function-menu button{min-height:48px;overflow-wrap:anywhere}

.list-layout>.panel-card>.detail-section{padding-top:16px}
.list-layout .section-header{align-items:center;gap:12px}
.list-layout .section-header>div{min-width:0}
.list-layout .section-header h2{margin:0 0 6px;font-size:20px;line-height:28px}
.list-layout .section-header p{margin:0;font-size:14px;line-height:20px;overflow-wrap:anywhere}
.list-layout .cards{margin-top:12px}
.list-layout .cards .device{box-sizing:border-box;padding:8px 12px;min-height:72px;gap:8px;align-items:center}
.list-layout .device>ha-icon{--mdc-icon-size:24px;box-sizing:border-box;width:72px;height:72px;margin:0;flex:0 0 72px;align-self:center}
.list-layout .device>div{flex:1 1 180px;min-width:0}
.device .device-name-row{min-height:32px;gap:2px;align-items:center;max-width:100%;width:fit-content}
.device .device-name-row h3{margin:0;max-width:28ch;font-size:16px;line-height:20px;overflow-wrap:anywhere}
.device .device-name-row ha-icon-button{--mdc-icon-button-size:32px;--mdc-icon-size:18px;width:32px;height:32px;padding:0}
.device>div>p{margin:2px 0;font-size:13px;line-height:20px}
.device>div>small{margin:2px 0 0;font-size:12px;line-height:18px;overflow-wrap:anywhere}
.status-item{box-sizing:border-box;min-height:48px;align-items:center}
.status-item small,.status-item strong{line-height:20px}
.navigation-row,.function-menu button{line-height:20px}
.navigation-row>span,.function-menu .menu-label{min-width:0;line-height:20px;overflow-wrap:anywhere}
ha-icon{display:inline-flex;align-items:center;justify-content:center;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);line-height:0;vertical-align:middle;flex-shrink:0}
.device-name-row ha-icon-button{display:inline-flex;align-items:center;justify-content:center}
.function-menu button>ha-icon,.navigation-row>ha-icon,.status-item>ha-icon{align-self:center}
ha-dialog{--mdc-dialog-max-width:min(600px,95vw)}
.connection-state{padding:24px;box-sizing:border-box}
@container(max-width:1000px){.device-layout{grid-template-columns:repeat(2,minmax(0,1fr))}.settings-layout{grid-template-columns:minmax(0,1fr)}}
@container(max-width:650px){.device-layout{grid-template-columns:minmax(0,1fr)}.device-layout>.card-column:nth-child(2){order:-2}.device-layout>.card-column:nth-child(3){order:-1}.page-content{padding:16px}.detail-section .form-grid{grid-template-columns:minmax(0,1fr)}.device{flex-wrap:wrap}.device>div{flex-basis:calc(100% - 48px)}.device ha-button{margin-left:auto}.section-header{flex-wrap:wrap}.section-header>div{min-width:0}.setting-row{flex-wrap:wrap}.setting-row ha-switch{flex-shrink:0}}
@media(max-width:600px){main{padding:0 0 16px}main>header{gap:8px;padding:0 12px}.device-title h1{font-size:20px}.device-layout,.settings-layout{grid-template-columns:minmax(0,1fr)}.page-content{padding:16px}.panel-card>.detail-section{padding:16px}.section-header h2,.detail-section h2{font-size:22px}}
</style>`;


class LafaerRangeEditor extends HTMLElement {
  set config(value) { this._config = value; this._values = [...(value?.values || [])]; this.render(); }
  get value() { return [...(this._values || [])]; }
  connectedCallback() { this.render(); }
  render() {
    const c = this._config || {},step=c.step??.75; this._values ||= [...(c.values || [])];
    const count=Math.min(c.visibleCount||this._values.length,this._values.length);
    this.innerHTML = `<div class="range-grid">${this._values.slice(0,count).map((v,i) => {const start=Number((i*step).toFixed(2)),end=Number(((i+1)*step).toFixed(2)),state=c.states?.[i],label=c.stateLabels?.[state]??"—",tag=c.readOnly?"div":"button";return `<${tag} class="range-segment ${v === (c.disabledValue ?? 2) ? "disabled" : "enabled"} ${state===1?"occupied":""}" data-i="${i}" title="${start}-${end} m${c.states?": "+esc(label):""}" ${c.readOnly?`role="img" aria-label="${start}-${end} m: ${esc(label)}"`:`aria-pressed="${v !== (c.disabledValue ?? 2)}"`}><span>${start}-${end}m</span>${c.states?`<small>${esc(label)}</small>`:""}</${tag}>`;}).join("")}</div>`;
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
    const signature=JSON.stringify([c.values,c.visibleCount,c.energyLabel,c.thresholdLabel,c.legend]);
    const columns=this.querySelectorAll(".threshold-column");
    if(this._signature===signature&&columns.length===count){columns.forEach((column,i)=>{column.querySelector(".bar i").style.height=`${Math.min(100,(energy[i]??0)/max*100)}%`;column.querySelector(".bar b").style.bottom=`${Math.min(100,this._values[i]/max*100)}%`;column.querySelector("output").textContent=energy[i]??0;column.querySelector("small strong").textContent=energy[i]??0;});return;}
    const scrollLeft=this.querySelector?.(".threshold-grid")?.scrollLeft||0;
    this._signature=signature;
    this.innerHTML=`<p class="chart-legend">${esc(c.legend||"")}</p><div class="threshold-grid">${this._values.slice(0,count).map((v,i)=>`<div class="threshold-column"><span>${i*.75}-${(i+1)*.75}m</span><div class="bar"><i style="height:${Math.min(100,energy[i]/max*100)}%"></i><b style="bottom:${Math.min(100,v/max*100)}%"></b><output>${energy[i]??0}</output></div><small>${esc(c.energyLabel||"Energy")}:<strong>${energy[i]??0}</strong></small><label>${esc(c.thresholdLabel||"Threshold")}<input type="number" min="0" max="65535" value="${v}" data-i="${i}"></label></div>`).join("")}</div>`;
    const grid=this.querySelector?.(".threshold-grid");if(grid)grid.scrollLeft=scrollLeft;
    this.querySelectorAll("input").forEach(input => input.onchange=()=>{this._values[Number(input.dataset.i)]=Number(input.value); this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:true}));});
  }
}
if (!customElements.get("lafaer-threshold-chart")) customElements.define("lafaer-threshold-chart", LafaerThresholdChart);

class HaLafaerPanel extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:"open"}); this._view="list"; this._devices=[]; this._discovered=[]; this._snapshot=null; this._unsub=null; this._heartbeat=null; this._busy=false; this._notice=null; this._sessionGeneration=0; this._subscribing=false; this._initialScanStarted=false; this._hasScanned=false; this._loading=false; this._adoptionStates=new Map(); this._adoptingKey=null; this._menuOpen=false; this._energyOpen=false; this._visibility=()=>this._onVisibility();this._pageHide=()=>{this._pageClosing=true;this._closeSession();}; }
  set hass(value) { const old=this._hass?.language; this._hass=value; this._bindSidebar(); if(!this._loaded) this._load(); else if(old!==value.language) this.render(); }
  set narrow(value){this._narrow=Boolean(value);this._bindSidebar();}
  get narrow(){return this._narrow??false;}
  _sidebarButton(){return customElements.get("ha-menu-button")?`<ha-menu-button id="sidebar-menu"></ha-menu-button>`:`<ha-icon-button id="sidebar-menu" title="${esc(this._hass?.localize?.("ui.sidebar.sidebar_toggle")||this.t.sidebarMenu)}"><ha-icon icon="mdi:menu"></ha-icon></ha-icon-button>`;}
  _bindSidebar(){const button=this.shadowRoot?.querySelector("#sidebar-menu");if(!button)return;if(button.tagName==="HA-MENU-BUTTON"){button.hass=this._hass;button.narrow=this.narrow;}else{button.onclick=()=>this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true}));}}
  set panel(value) { this._panel=value; }
  connectedCallback() { this._detached=false;this._pageClosing=false;window.addEventListener("pagehide",this._pageHide);this._loaded=true; document.addEventListener("visibilitychange",this._visibility); if(this._hass) this._load(); }
  disconnectedCallback() { this._finishScrollRestore?.();clearTimeout(this._noticeTimer);this._detached=true;window.removeEventListener("pagehide",this._pageHide);document.removeEventListener("visibilitychange",this._visibility); this._closeSession(); }
  get t() { return WORDS[localeFor(this._hass?.language)]; }
  async _load() { if(!this._hass||this._loading)return;this._loading=true;try {this._devices=await this._hass.callWS({type:"lafaer/devices/list"});this.render();if(!this._initialScanStarted){this._initialScanStarted=true;await this._scan();}} catch(e){this._error=e.message;this.render();}finally{this._loading=false;} }
  async _scan() { if(this._scanning)return;this._scanning=true;this._error=null;this.render();try{this._discovered=await this._hass.callWS({type:"lafaer/discover",timeout:15});this._devices=await this._hass.callWS({type:"lafaer/devices/list"});}catch(e){this._error=e.message;}finally{this._hasScanned=true;this._scanning=false;this.render();} }

  async _dialog({title,text="",fields=[],accept=this.t.save,validate}){
    if(this._activeDialog)return false;
    const dialog=document.createElement("ha-dialog");
    // HA replaced the legacy action slots with a single footer slot.
    const legacy="heading" in dialog;
    if(legacy)dialog.heading=title;
    else dialog.headerTitle=title;
    const actions=legacy
      ? `<ha-button slot="secondaryAction" data-cancel>${this.t.cancel}</ha-button><ha-button slot="primaryAction" data-accept>${esc(accept)}</ha-button>`
      : `<div slot="footer"><ha-button appearance="plain" data-cancel>${this.t.cancel}</ha-button><ha-button data-accept>${esc(accept)}</ha-button></div>`;
    dialog.innerHTML=`<p>${esc(text)}</p><div class="dialog-fields">${fields.map(field=>field.options?`<label>${esc(field.label)}<select data-field="${field.id}">${field.options.map(value=>`<option>${esc(value)}</option>`).join("")}</select></label>`:`<label for="dialog-${field.id}">${esc(field.label)}<input id="dialog-${field.id}" data-field="${field.id}" type="text" value="${esc(field.value||"")}" ${field.maxLength?`maxlength="${field.maxLength}"`:""} required></label>`).join("")}</div><ha-alert hidden alert-type="error"></ha-alert>${actions}`;
    this._activeDialog=dialog;
    this.shadowRoot.append(dialog);
    dialog.open=true;
    return new Promise(resolve=>{
      const finish=value=>{if(this._activeDialog!==dialog)return;this._activeDialog=null;dialog.open=false;dialog.remove();this.render();resolve(value);};
      dialog.addEventListener("closed",()=>finish(false));
      for(const field of dialog.querySelectorAll("input"))field.oninput=()=>field.setCustomValidity("");
      dialog.querySelector("[data-cancel]").onclick=()=>finish(false);
      dialog.querySelector("[data-accept]").onclick=()=>{
        const values=Object.fromEntries([...dialog.querySelectorAll("[data-field]")].map(field=>[field.dataset.field,field.value.trim()]));
        for(const field of dialog.querySelectorAll("input")){field.setCustomValidity(field.value.trim()?"":this.t.requiredValue);if(!field.reportValidity())return;}
        const error=validate?.(values);
        if(error){const alert=dialog.querySelector("ha-alert");alert.hidden=false;alert.textContent=error;return;}
        finish(fields.length?values:true);
      };
    });
  }
  async _manualDialog(){
    const t=this.t,values=await this._dialog({title:t.manualAdd,accept:t.takeover,fields:[{id:"model",label:t.model,options:["LWR01","LWR02"]},{id:"device_id",label:t.deviceId},{id:"host",label:t.host},{id:"thread_mac",label:t.threadMac}]});
    if(values)await this._adopt({...values,name:`${values.model} ${values.device_id}`});
  }
  _adoptionKey(device){return `${device?.model||""}:${device?.device_id||""}`;}
  _errorText(error){const values=[error?.message,error?.body?.message,error?.error?.message,typeof error==="string"?error:null,error?.code];const detail=values.find(value=>typeof value==="string"&&value.trim()&&value.trim().toLowerCase()!=="unknown error");const message=detail?.trim();return this.t[message]||message||this.t.unknownError;}
  async _adopt(device) { if(!device?.device_id?.trim()||!device?.host?.trim()||!device?.thread_mac?.trim()){this._error=this.t.requiredFields;this.render();return;}if(this._adoptingKey)return;if(!await this._dialog({title:this.t.takeoverTitle,text:`${this.t.takeoverWarning}\n\n${this.t.pairHint}`,accept:this.t.confirm}))return;const key=this._adoptionKey(device);this._adoptingKey=key;this._adoptionStates.set(key,{status:"working",message:this.t.takeoverConnecting});this._busy=true;this._error=this._notice=null;this.render();const request={type:"lafaer/device/adopt",device_id:device.device_id.trim(),model:device.model,host:device.host.trim(),thread_mac:device.thread_mac.trim(),version:device.version||"",name:device.name||`${device.model} ${device.device_id}`};if(typeof device.blue_id==="string")request.blue_id=device.blue_id;try{await this._hass.callWS(request);this._adoptionStates.set(key,{status:"success",message:this.t.takeoverSucceeded});await this._load();}catch(e){this._adoptionStates.set(key,{status:"error",message:`${this.t.takeoverFailed}: ${this._errorText(e)}`});}finally{this._adoptingKey=null;this._busy=false;this.render();} }
  async _open(device) { this._selected=device; this._settingsPage=false; this._view="detail"; this._snapshot=null; this._error=this._notice=null; this._menuOpen=false; this._energyOpen=false; this._rangeOpen=false; this._rangeDraft=this._detectionDraft=this._keepDraft=this._triggerDraft=this._holdDraft=this._timeoutDraft=this._luxDraft=this._darknessDraft=this._batteryPerformanceDraft=this._usbPerformanceDraft=this._workModeDraft=this._pirDraft=this._radarDraft=this._batteryTypeDraft=null; this.render(); await this._subscribe(); }
  async _subscribe(){
    if(this._detached||!this._selected||document.hidden||this._unsub||this._subscribing)return;
    const generation=this._sessionGeneration,deviceId=this._selected.device_id;
    this._subscribing=true;this._connecting=true;this._snapshot=null;this._error=null;this.render();
    try{
      const unsubscribe=await this._hass.connection.subscribeMessage(e=>{if(generation===this._sessionGeneration&&this._selected?.device_id===deviceId)this._applySnapshot(e);},{type:"lafaer/session/subscribe",device_id:deviceId});
      if(generation!==this._sessionGeneration||document.hidden||this._view!=="detail"||this._selected?.device_id!==deviceId){await unsubscribe();return;}
      this._unsub=unsubscribe;
      this._heartbeat=setInterval(()=>{if(this._viewerId&&!document.hidden)this._hass.callWS({type:"lafaer/session/heartbeat",device_id:deviceId,viewer_id:this._viewerId}).catch(()=>{});},10000);
      if(this._energyOpen)this._setEnergyPolling(true);if(this._settingsPage)this._setRangePolling(true);
    }catch(e){if(generation===this._sessionGeneration){this._connecting=false;this._error=e.message;this.render();}}
    finally{this._subscribing=false;if(generation!==this._sessionGeneration&&!document.hidden&&this._view==="detail"&&!this._unsub)this._subscribe();}
  }
  _applySnapshot(event){const previous=this._snapshot;this._snapshot={...(previous||{}),...event};if(event.viewer_id)this._viewerId=event.viewer_id;if(event.connected===true){if(this._connecting)this._error=null;this._connecting=false;}else if(event.error){this._connecting=false;}const learningChanged=this._syncLearningState();if(document.hidden||this._pageClosing)return;if(this._snapshot.connected===true&&previous?.connected!==true&&this._settingsPage)this._setRangePolling(true);if(this._settingsPage){this._syncSensingControls();if(JSON.stringify(previous?.detection_thresholds)!==JSON.stringify(this._snapshot.detection_thresholds)||JSON.stringify(previous?.keep_thresholds)!==JSON.stringify(this._snapshot.keep_thresholds))this._refreshThresholdCharts();}const unchanged=previous?.connected===true&&this._snapshot.connected===true&&previous.error===this._snapshot.error&&previous.status?.work_mode===this._snapshot.status?.work_mode&&JSON.stringify(previous.config)===JSON.stringify(this._snapshot.config);if(learningChanged)this.render();if(unchanged&&(this._settingsPage||this._view==="detail"&&this._updateHomeStatus()))return;const active=this.shadowRoot.activeElement;if(!active||!["INPUT","SELECT"].includes(active.tagName))this.render();}
  _capturePageScroll(){const positions=[];let element=this;while(element){positions.push([element,element.scrollTop||0,element.scrollLeft||0]);element=element.parentElement||element.getRootNode?.()?.host;}const page=document.scrollingElement;if(page&&!positions.some(([node])=>node===page))positions.push([page,page.scrollTop,page.scrollLeft]);return positions;}
  _preserveRenderScroll(){
    this._finishScrollRestore?.();
    const positions=this._capturePageScroll(),root=this.shadowRoot,internal=[];
    for(const node of root.querySelectorAll("*")){if(!node.scrollTop&&!node.scrollLeft)continue;const path=[];let current=node;while(current&&current!==root){path.unshift([...current.parentNode.children].indexOf(current));current=current.parentNode;}internal.push([path,node.scrollTop,node.scrollLeft]);}
    const style=this.style,oldMin=style?.minHeight,height=this.getBoundingClientRect?.().height;
    if(style&&height)style.minHeight=`${height}px`;
    let stopped=false,frame;
    const restore=()=>{if(stopped)return;for(const [path,top,left] of internal){let node=root;for(const index of path)node=node?.children?.[index];if(node){node.scrollTop=top;node.scrollLeft=left;}}for(const [node,top,left] of positions){node.scrollTop=top;node.scrollLeft=left;}};
    const events=["wheel","touchstart","pointerdown","keydown"];
    const finish=()=>{if(stopped)return;stopped=true;if(frame!=null)cancelAnimationFrame(frame);for(const event of events)window.removeEventListener(event,finish,true);if(style)style.minHeight=oldMin;if(this._finishScrollRestore===finish)this._finishScrollRestore=null;};
    for(const event of events)window.addEventListener(event,finish,true);
    this._finishScrollRestore=finish;
    return ()=>{restore();if(typeof requestAnimationFrame!=="function"){finish();return;}frame=requestAnimationFrame(()=>{restore();frame=requestAnimationFrame(()=>{if(stopped)return;if(style)style.minHeight=oldMin;restore();finish();});});};
  }
  _thresholdValues(keep=false){const mode=Number(this._radarDraft??this._snapshot?.config?.radar_sensitivity??0),key=keep?"keep_thresholds":"detection_thresholds";return (mode===3?(keep?this._keepDraft:this._detectionDraft):null)||this._snapshot?.[key]?.[["low","medium","high","custom"][mode]]||[];}
  _refreshThresholdCharts(){for(const keep of [false,true]){const chart=this.shadowRoot.querySelector(keep?"#keep-chart":"#detection-chart");if(chart)chart.config={values:this._thresholdValues(keep),energy:this._snapshot?.[keep?"keep_energy":"detection_energy"],visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:keep?this.t.keepEnergyLegend:this.t.energyLegend};}}
  _selectRadarSensitivity(value){this._radarDraft=Number(value);this._refreshThresholdCharts();}
  _editThresholds(keep,values){const detection=[...this._thresholdValues(false)],presence=[...this._thresholdValues(true)];this._detectionDraft=keep?detection:[...values];this._keepDraft=keep?[...values]:presence;this._radarDraft=3;const field=this.shadowRoot.querySelector("#radar-sensitivity");if(field)field.value="3";this._refreshThresholdCharts();}
  async _readEnergy(kind){if(this._snapshot?.connected!==true||this._connecting||this._pollStatusReady===false||this._busy||this._snapshot?.config?.radar_error===1||this._snapshot?.radar_status?.studying===1||document.hidden||!this._viewerId||!this._settingsPage||!this._energyOpen||this._snapshot?.status?.work_mode===0||Number(this._workModeDraft)===0&&this._workModeDraft!=null)return;const pendingKey=`_pending_${kind}`;if(this[pendingKey])return;this[pendingKey]=true;const generation=this._sessionGeneration;try{const r=await this._hass.callWS({type:"lafaer/device/read",device_id:this._selected.device_id,kind});if(generation!==this._sessionGeneration||!this._settingsPage||!this._energyOpen)return;if(r.available===false){this._pollStatusReady=false;return;}this._snapshot={...(this._snapshot||{}),[kind]:r.values};const chart=this.shadowRoot.querySelector(kind==="detection_energy"?"#detection-chart":"#keep-chart");if(chart){chart.config={values:this._thresholdValues(kind==="keep_energy"),energy:r.values,visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:kind==="keep_energy"?this.t.keepEnergyLegend:this.t.energyLegend};}}catch(e){if(generation===this._sessionGeneration&&this._settingsPage&&this._energyOpen){this._pollStatusReady=false;this._pollDue={...this._pollDue,sensing_status:Date.now()+2000};this._error=this._errorText(e);this.render();}}finally{this[pendingKey]=false;}}
  _setEnergyPolling(enabled){const changed=this._energyOpen!==Boolean(enabled);this._energyOpen=Boolean(enabled);if(changed&&enabled){this._pollDue={...this._pollDue,detection_energy:0,keep_energy:0};}this._schedulePolling();}
  _healthMessage(){const cfg=this._snapshot?.config||{},radar=this._snapshot?.radar_status||{};return [cfg.radar_error===1?this.t.radarFault:"",cfg.pir_error===1?this.t.pirFault:"",cfg.climate_error===1?this.t.climateFault:""].filter(Boolean).join(" ");}
  _syncSensingControls(){const cfg=this._snapshot?.config||{},radar=this._snapshot?.radar_status||{},mode=Number(this._workModeDraft??this._snapshot?.status?.work_mode??2),waiting=radar.studying===1;const q=s=>this.shadowRoot.querySelector(s),set=(s,disabled)=>{const node=q(s);if(node){node.disabled=Boolean(disabled);node.inert=Boolean(disabled);}};set("#work-mode",waiting);set("#timeout",waiting);set("#pir-sensitivity",waiting||cfg.pir_error===1);set("#radar-sensitivity",waiting||cfg.radar_error===1);set("#learning",waiting||cfg.radar_error===1);set("#range",waiting||cfg.radar_error===1||radar.ranges_valid===false);set("#detection-chart",waiting||cfg.radar_error===1);set("#keep-chart",waiting||cfg.radar_error===1);set('[data-danger="radar_reset"]',waiting);set("#save-mode",waiting||cfg.radar_error===1&&mode!==0||cfg.pir_error===1&&mode!==1);const message=q("#sensing-message");if(message){message.textContent=this._healthMessage();message.hidden=!message.textContent;}}
  _setRangePolling(enabled){const changed=this._rangePollingEnabled!==Boolean(enabled);this._rangePollingEnabled=Boolean(enabled);if(changed&&enabled){this._pollStatusReady=false;this._pollDue={...this._pollDue,sensing_status:0};}this._schedulePolling();}
  _stopPolling(){clearTimeout(this._pollTimer);this._pollTimer=null;this._rangePollingEnabled=false;this._pollStatusReady=false;this._pollDue={};}
  _schedulePolling(){if(this._snapshot?.connected!==true||this._connecting||document.hidden||this._detached||this._pageClosing||!this._viewerId||!this._settingsPage||this._selected?.model!=="LWR02"||!this._rangePollingEnabled){clearTimeout(this._pollTimer);this._pollTimer=null;return;}if(this._pollRunning||this._pollTimer)return;this._pollTimer=setTimeout(()=>{this._pollTimer=null;this._runPolling();},150);}
  async _runPolling(){if(this._pollRunning)return;this._pollRunning=true;try{if(this._snapshot?.connected!==true||this._connecting||document.hidden||this._detached||this._pageClosing||!this._viewerId||!this._settingsPage||!this._rangePollingEnabled||this._busy)return;const now=Date.now(),due=this._pollDue||={},energy=this._energyOpen&&this._pollStatusReady!==false;const jobs=[["sensing_status",2000],...(energy?[["detection_energy",1000],["keep_energy",5000]]:[])];const job=jobs.find(([kind])=>(due[kind]||0)<=now);if(!job)return;const [kind,interval]=job,generation=this._sessionGeneration;if(kind==="sensing_status")await this._readRadarStatus();else await this._readEnergy(kind);if(generation===this._sessionGeneration)this._pollDue={...this._pollDue,[kind]:Date.now()+interval};}finally{this._pollRunning=false;this._schedulePolling();}}
  _rangeStatusConfig(status=this._snapshot?.radar_status){return this._selected?.model==="LWR02"?{states:status?.ranges_valid===false?[]:status?.ranges||[],stateLabels:{0:this.t.clear,1:this.t.detected,2:this.t.gateBlocked}}:{};}
  async _readRadarStatus(){if(this._snapshot?.connected!==true||this._connecting||this._busy||!this._settingsPage||document.hidden||!this._viewerId||this._pendingStatus)return;this._pendingStatus=true;const generation=this._sessionGeneration;try{const r=await this._hass.callWS({type:"lafaer/device/read",device_id:this._selected.device_id,kind:"sensing_status"});if(generation!==this._sessionGeneration||!this._settingsPage)return;this._pollStatusReady=r.values.ranges_valid!==false;this._snapshot={...this._snapshot,radar_status:r.values};if(this._syncLearningState())this.render();const pir=this.shadowRoot.querySelector("#pir-state");if(pir)pir.textContent=r.values.pir_status===1?this.t.detected:this.t.clear;const gates=this.shadowRoot.querySelector("#range-status");if(gates)gates.config={...this._rangeStatusConfig(r.values),values:r.values.ranges,visibleCount:8,step:.75,readOnly:true};const range=this.shadowRoot.querySelector("#range");if(range){range.inert=r.values.ranges_valid===false;range.config={values:this._rangeDraft||r.values.ranges.map(value=>value===2?2:0),visibleCount:8,step:.75,disabledValue:2,enabledValue:0};}this._syncSensingControls();}catch(e){this._pollStatusReady=false;if(generation===this._sessionGeneration&&this._settingsPage){this._error=this._errorText(e);this.render();}}finally{this._pendingStatus=false;}}
  async _closeSession(){this._connecting=false;clearInterval(this._learningTimer);this._learningTimer=null;this._learningState=null;this._stopPolling();clearTimeout(this._backgroundTimer);this._backgroundTimer=null;clearInterval(this._rangeTimer);this._rangeTimer=null;this._sessionGeneration++;clearInterval(this._heartbeat);clearInterval(this._detectionTimer);clearInterval(this._keepTimer);this._heartbeat=this._detectionTimer=this._keepTimer=null;this._viewerId=null;if(this._unsub){const u=this._unsub;this._unsub=null;await u();}}
  async _onVisibility(){
    if(this._view!=="detail"||this._detached)return;
    clearTimeout(this._backgroundTimer);this._backgroundTimer=null;
    if(document.hidden){
      if(this._pageClosing)return;
      const generation=this._sessionGeneration;
      this._stopPolling();
      for(const timer of [this._rangeTimer,this._detectionTimer,this._keepTimer])clearInterval(timer);
      this._rangeTimer=this._detectionTimer=this._keepTimer=null;
      this._backgroundTimer=setTimeout(()=>{if(document.hidden&&generation===this._sessionGeneration)this._closeSession();},60000);
      if(this._viewerId)try{await this._hass.callWS({type:"lafaer/session/heartbeat",device_id:this._selected.device_id,viewer_id:this._viewerId,background:true});}catch(e){if(document.hidden&&generation===this._sessionGeneration)await this._closeSession();}
      return;
    }
    this._pageClosing=false;
    if(this._unsub&&this._viewerId){
      const generation=this._sessionGeneration;
      try{await this._hass.callWS({type:"lafaer/session/heartbeat",device_id:this._selected.device_id,viewer_id:this._viewerId,background:false});}
      catch(e){if(generation!==this._sessionGeneration)return;await this._closeSession();}
      if(generation!==this._sessionGeneration&&this._unsub)return;
    }
    if(document.hidden||this._detached)return;
    if(!this._unsub)await this._subscribe();
    if(this._settingsPage)this._setRangePolling(true);
    if(this._energyOpen)this._setEnergyPolling(true);
    this.render();
  }
  async _back(){await this._closeSession();this._view="list";this._selected=null;this._snapshot=null;this._menuOpen=false;this._energyOpen=false;await this._load();}
  async _retry(){if(this._connecting||this._subscribing||this._retrying)return;this._retrying=true;try{await this._closeSession();this._snapshot=null;this._error=this._notice=null;this.render();await this._subscribe();}finally{this._retrying=false;}}
  async _action(action,data={}){if(this._busy)return false;this._busy=true;this._error=this._notice=null;this.render();try{await this._hass.callWS({type:"lafaer/device/action",device_id:this._selected.device_id,action,data});if(action!=="start_learning"||this._selected?.model!=="LWR02")this._notice=this.t.actionDone;return true;}catch(e){this._error=this._errorText(e);return false;}finally{this._busy=false;this.render();}}

  _syncLearningState(){
    const radar=this._snapshot?.radar_status;
    if(this._selected?.model!=="LWR02"||this._snapshot?.connected!==true)return false;
    if(radar?.studying===1){
      const startedAt=this._snapshot.learning_started_at,deviceId=this._selected.device_id;
      if(this._learningState?.deviceId===deviceId&&this._learningState.startedAt===startedAt)return false;
      this._learningState={deviceId,startedAt};
      return true;
    }
    if(radar?.studying===0&&radar.ranges_valid!==false&&this._learningState?.deviceId===this._selected.device_id){
      this._learningState=null;
      clearInterval(this._learningTimer);this._learningTimer=null;
      this._notice=this.t.learningDone;
      return true;
    }
    return false;
  }
  _learningText(){
    const start=this._learningState?.startedAt;
    if(!Number.isFinite(start))return this.t.learningWaiting;
    const seconds=Math.min(30,Math.max(0,Math.ceil((start*1000+30000-Date.now())/1000)));
    if(!seconds)return this.t.learningWaiting;
    return this.t.learningCountdown.replace("{time}",String(seconds));
  }
  _alerts(){
    const transient=this._transientAlerts();
    const learning=this._view==="detail"&&this._learningState?.deviceId===this._selected?.device_id&&this._snapshot?.connected===true;
    if(!learning){clearInterval(this._learningTimer);this._learningTimer=null;return transient;}
    if(!this._learningTimer&&!this._detached&&!this._pageClosing)this._learningTimer=setInterval(()=>{
      if(document.hidden||this._detached||this._pageClosing)return;
      const text=this.shadowRoot.querySelector("#learning-notice-text");
      if(text)text.textContent=this._learningText();
    },1000);
    return `<div class="notification-layer learning-layer"><ha-alert alert-type="info" role="status"><span id="learning-notice-text">${esc(this._learningText())}</span></ha-alert>${transient}<style>.learning-layer>.notification-layer{position:relative;top:auto;left:auto;transform:none;width:100%;margin-top:8px;filter:none;animation:none}</style></div>`;
  }
  _transientAlerts(){const message=this._error||this._notice,key=JSON.stringify([this._error,this._notice]),changed=key!==this._notificationKey;if(changed){this._notificationKey=key;clearTimeout(this._noticeTimer);if(this._notice&&!this._error){const notice=this._notice;this._noticeTimer=setTimeout(()=>{if(this._notice===notice){this._notice=null;this.render();}},5000);}}if(!message)return "";return `<div class="notification-layer ${changed?"enter":""}" role="${this._error?"alert":"status"}" aria-atomic="true"><ha-alert alert-type="${this._error?"error":"success"}"><div class="notification-content"><span>${esc(message)}</span></div></ha-alert><ha-icon-button id="dismiss-notice" title="${esc(this.t.close)}"><ha-icon icon="mdi:close"></ha-icon></ha-icon-button></div>`;}
  async _confirmLearning(){if(this._busy||this._snapshot?.radar_status?.studying===1)return;const deviceId=this._selected?.device_id,generation=this._sessionGeneration,lwr01=this._selected?.model==="LWR01";const confirmed=await this._dialog({title:lwr01?this.t.adaptation:this.t.learning,text:lwr01?this.t.adaptationTip:this.t.learningTip,accept:lwr01?this.t.adaptationStart:this.t.learningStart});if(!confirmed||deviceId!==this._selected?.device_id||generation!==this._sessionGeneration||!this._settingsPage||document.hidden)return;await this._action("start_learning");}
  async _deviceAction(action){if(this._busy)return;if(action!=="radar_reset"&&!await this._confirmDanger(action))return;this._menuOpen=false;if(!await this._action(action))return;if(["factory_reset","delete_management"].includes(action)){await this._back();return;}if(action==="radar_reset"){this._rangeDraft=this._radarDraft=this._detectionDraft=this._keepDraft=null;this.render();}}
  async _confirmDanger(action="forget"){const t=this.t,title=action==="factory_reset"?t.factoryReset:action==="delete_management"?t.release:t.forget,text=action==="factory_reset"?t.factoryResetConfirm:action==="delete_management"?t.releaseConfirm:t.forgetConfirm;return Boolean(await this._dialog({title,text:`${this._selected.name}\n\n${text}`,accept:t.confirmAction}));}
  async _rename(device=this._selected){if(!device||this._busy)return;const values=await this._dialog({title:this.t.rename,fields:[{id:"name",label:this.t.deviceName,value:device.name,maxLength:64}],accept:this.t.save});if(!values)return;const name=values.name.trim();if(!name){this._error=this.t.requiredFields;this.render();return;}this._busy=true;this._error=this._notice=null;this.render();try{const updated=await this._hass.callWS({type:"lafaer/device/rename",device_id:device.device_id,name});if(this._selected?.device_id===updated.device_id)this._selected=updated;this._devices=this._devices.map(device=>device.device_id===updated.device_id?updated:device);this._notice=this.t.renamed;}catch(e){this._error=e.message;}finally{this._busy=false;this.render();}}
  _statusItem(title,value,icon,active=false){return `<div class="status-item ${active?"active":""}"><ha-icon icon="${icon}"></ha-icon><div><small>${title}</small><strong>${esc(value)}</strong></div></div>`;}
  _detailHeader(withMenu=true){const t=this.t;return `<header class="detail-header"><ha-icon-button id="back" title="${esc(t.back)}"><ha-icon icon="mdi:arrow-left"></ha-icon></ha-icon-button><div class="device-title"><h1>${esc(this._settingsPage?this.t.advancedSettings:this._selected.name)}</h1>${withMenu&&!this._settingsPage?`<ha-icon-button id="rename" title="${esc(t.rename)}"><ha-icon icon="mdi:pencil-outline"></ha-icon></ha-icon-button><span class="title-connected"><ha-icon icon="mdi:lan-connect"></ha-icon>${t.connected}</span>`:""}</div>${withMenu?`<div class="menu-wrap"><ha-icon-button id="detail-more" title="${esc(t.moreActions)}"><ha-icon icon="mdi:dots-vertical"></ha-icon></ha-icon-button>${this._menuOpen?`<div class="function-menu" role="menu">${this._selected.model==="LWR01"?`<button class="danger-item" data-danger="delete_management" role="menuitem"><ha-icon icon="mdi:link-off"></ha-icon><span class="menu-label">${t.release}</span></button>`:""}<button class="danger-item" data-forget role="menuitem"><ha-icon icon="mdi:delete-outline"></ha-icon><span class="menu-label">${t.forget}</span></button><button class="danger-item" data-danger="factory_reset" role="menuitem"><ha-icon icon="mdi:delete-forever-outline"></ha-icon><span class="menu-label">${t.factoryReset}</span></button></div>`:""}</div>`:""}</header>`;}
  _renderConnection(){const t=this.t,failed=!this._connecting&&Boolean(this._snapshot?.error||this._error);return `${DETAIL_STYLES}${this._detailHeader(false)}<div class="connection-state">${failed?`<ha-icon icon="mdi:lan-disconnect"></ha-icon><h2>${t.connectionFailed}</h2><p>${t.connectionFailedHint}</p><ha-button id="retry">${t.retry}</ha-button>`:`<ha-circular-progress active></ha-circular-progress><h2>${t.connectingDevice}</h2><p>${t.connectingHint}</p>`}</div>`;}
  _availability(device){if(!this._hasScanned)return null;const found=this._discovered.find(item=>item.device_id===device.device_id&&item.model===device.model);return found?.available===true;}
  _lastSeen(device){if(!device?.last_seen)return "";const date=new Date(device.last_seen);if(Number.isNaN(date.valueOf()))return "";return new Intl.DateTimeFormat(localeFor(this._hass?.language),{dateStyle:"medium",timeStyle:"short"}).format(date);}
  _deviceCard(device,{adopted}){const t=this.t,available=this._availability(device),cached=this._discovered.find(item=>item.device_id===device.device_id&&item.model===device.model),lastSeen=this._lastSeen(cached||device),state=available===null?t.checking:available?t.available:t.offline,operation=this._adoptionStates.get(this._adoptionKey(device)),working=operation?.status==="working",operationColor=operation?.status==="success"?"var(--success-color,#43a047)":operation?.status==="error"?"var(--error-color,#db4437)":"var(--secondary-text-color)";return `<div role="listitem"><div class="device"><ha-icon icon="mdi:motion-sensor"></ha-icon><div><div class="device-name-row"><h3>${esc(device.name||`${device.model} ${device.device_id}`)}</h3>${adopted?`<ha-icon-button data-rename="${esc(device.device_id)}" title="${esc(t.rename)}"><ha-icon icon="mdi:pencil-outline"></ha-icon></ha-icon-button>`:""}</div><p>${esc(device.model)} · ${esc(device.version||"")}</p>${lastSeen?`<small>${t.lastSeen}: ${esc(lastSeen)}</small>`:""}${operation?`<div style="display:flex;align-items:center;gap:7px;margin:10px 3px 2px;font-size:13px;color:${operationColor}">${working?`<ha-circular-progress active size="small"></ha-circular-progress>`:`<ha-icon icon="${operation.status==="success"?"mdi:check-circle":"mdi:alert-circle"}" style="--mdc-icon-size:18px"></ha-icon>`}<span>${esc(operation.message)}</span></div>`:""}</div><span class="status ${available===true?"available":available===false?"offline":"checking"}">${esc(state)}</span><ha-button ${adopted?`data-open="${esc(device.device_id)}"`:`data-adopt="${esc(device.device_id)}"`} ${working||(!adopted&&available!==true)?"disabled":""}>${working?t.takeoverConnecting:adopted?t.open:t.takeover}</ha-button></div></div>`;}
  _renderList(){const t=this.t,unmanaged=this._discovered.filter(d=>!this._devices.some(s=>s.device_id===d.device_id&&s.model===d.model));return `${LIST_STYLES}<header class="list-header">${this._sidebarButton()}<h1>${t.devices}</h1><div class="menu-wrap"><ha-icon-button id="more" title="${esc(t.moreActions)}"><ha-icon icon="mdi:dots-vertical"></ha-icon></ha-icon-button>${this._menuOpen?`<div class="function-menu" role="menu"><button id="menu-manual" role="menuitem"><ha-icon icon="mdi:plus-network"></ha-icon><span class="menu-label">${t.manualAdd}</span></button><button id="menu-debug" role="menuitem"><ha-icon icon="mdi:bug-outline"></ha-icon><span class="menu-label">${t.debug}</span></button></div>`:""}</div></header><div class="page-content list-layout"><ha-card class="panel-card"><section class="detail-section"><div class="section-header"><div><h2>${t.adoptedDevices}</h2><p>${t.adoptedHelp}</p></div></div><div class="cards" role="list">${this._devices.length?this._devices.map(d=>this._deviceCard(d,{adopted:true})).join(""):`<p class="empty">${t.noAdopted}</p>`}</div></section></ha-card><ha-card class="panel-card"><section class="detail-section"><div class="section-header"><div><h2>${t.discoveredDevices}</h2><p>${t.discoveredHelp}</p></div><ha-button id="scan">${this._scanning?t.scanning:t.scan}</ha-button></div><div class="cards" role="list">${unmanaged.length?unmanaged.map(d=>this._deviceCard(d,{adopted:false})).join(""):`<p class="empty">${this._scanning?t.scanning:t.noDiscovered}</p>`}</div></section></ha-card></div>`;}
  _renderDetail(){
    if(this._snapshot?.connected!==true)return this._renderConnection();
    if(this._settingsPage)return this._renderSettingsPage();
    const t=this.t,cfg=this._snapshot.config||{},overview=this._homeStatusRows().map(row=>this._statusItem(...row)).join("");
    return `${DETAIL_STYLES}${this._detailHeader()}<div class="page-content device-layout"><div class="card-column">${this._renderInfo()}</div><div class="card-column">${this._card(`<section class="detail-section overview"><h2>${t.deviceStatus}</h2>${this._snapshot?.config?.climate_error===1?`<p role="status">${t.climateFault}</p>`:""}<div class="status-grid">${overview}</div></section>`)}</div><div class="card-column">${this._card(`<section class="detail-section"><h2>${t.deviceControls}</h2><div class="setting-row"><span>${t.led}</span><ha-switch id="led" ${(cfg.led_enabled??this._snapshot?.ranges?.led_enabled)?"checked":""}></ha-switch></div><button class="navigation-row" id="identify"><ha-icon icon="mdi:crosshairs-gps"></ha-icon><span>${t.identify}</span><ha-icon icon="mdi:chevron-right"></ha-icon></button><button class="navigation-row" id="open-settings"><ha-icon icon="mdi:cog-outline"></ha-icon><span>${t.advancedSettings}</span><ha-icon icon="mdi:chevron-right"></ha-icon></button></section>`)}</div></div>`;
  }
  _homeStatusRows(){
    const t=this.t,s=this._snapshot.status||{};
    const power=s.power_type===0?t.batterySource:[1,2].includes(s.power_type)?t.externalPower:"—";
    const occupied=typeof s.occupied==="boolean"?s.occupied:null;
    const rows=[[t.occupancy,occupied===null?"—":occupied?t.detected:t.clear,"mdi:account-check",occupied===true],[t.illuminance,s.illuminance==null?"—":`${s.illuminance} lx`,"mdi:brightness-5"]];
    if(this._selected.model==="LWR02")rows.push([t.temperature,s.temperature_c==null||this._snapshot?.config?.climate_error===1?"—":`${s.temperature_c} °C`,"mdi:thermometer"],[t.humidity,s.humidity==null||this._snapshot?.config?.climate_error===1?"—":`${s.humidity}%`,"mdi:water-percent"],[t.battery,s.battery_level==null?"—":`${s.battery_level}%`,"mdi:battery"]);
    else {rows.push([t.powerSource,power,"mdi:power-plug"]);if([0,1].includes(s.power_type)&&s.battery_level!=null)rows.push([t.battery,`${s.battery_level}%`,"mdi:battery"]);}
    return rows;
  }
  _updateHomeStatus(){const nodes=[...this.shadowRoot.querySelectorAll(".overview .status-item")],rows=this._homeStatusRows();if(nodes.length!==rows.length)return false;rows.forEach(([title,value,icon,active],index)=>{const node=nodes[index];node.querySelector("small").textContent=title;node.querySelector("strong").textContent=value;node.classList.toggle("active",Boolean(active));});return true;}
  _card(content,className=""){return `<ha-card class="panel-card ${className}">${content}</ha-card>`;}
  _renderSettingsPage(){const t=this.t;return `${DETAIL_STYLES}${this._detailHeader()}<div class="page-content settings-layout">${this._card(this._renderAdvanced(),"control-card")}${this._card(this._renderModeSensing(),"sensing-card")}</div>`;}
  _renderInfo(){const t=this.t,i=this._snapshot?.information||{};const rows=(values)=>values.map(([k,v])=>`<div class="info-row"><span>${esc(k)}</span><code>${esc(v||"—")}</code></div>`).join("");return `<ha-card class="panel-card"><section class="detail-section"><h2>${t.deviceInfo}</h2><div class="info-grid">${rows([[t.model,i.model||this._selected.model],[t.deviceId,this._selected.device_id],[t.serialNumber,i.serial_number],["MAC",i.mac],[t.firmware,i.firmware_version||this._selected.version],[t.radarFirmware,i.radar_version]])}</div></section></ha-card><ha-card class="panel-card"><section class="detail-section"><h2>${t.networkInfo}</h2><div class="info-grid">${rows([[t.threadNetwork,i.thread_network_name],[t.signal,i.rssi],[t.ipv6,this._selected.host],[t.threadMac,i.thread_mac]])}</div></section></ha-card>`;}
  _renderModeSensing(){const t=this.t,cfg=this._snapshot?.config||{},ranges=this._snapshot?.ranges,s=this._snapshot?.status||{};if(this._selected.model==="LWR01")return `<section class="detail-section"><h2>${t.modeSensing}</h2><div class="form-grid"><label>${t.presenceTimeout}<input id="timeout" type="number" min="20" max="3600" value="${cfg.presence_timeout??30}"></label></div><div class="setting-row"><span>${this._selected.model==="LWR01"?t.adaptation:t.learning}</span><ha-icon-button id="learning" title="${esc(this._selected.model==="LWR01"?t.adaptation:t.learning)}" ${this._snapshot?.radar_status?.studying===1?"disabled":""}><ha-icon icon="mdi:chevron-right"></ha-icon></ha-icon-button></div><details id="range-details" class="energy-advanced" ${this._rangeOpen?"open":""}><summary>${t.range}</summary><lafaer-range-editor id="range"></lafaer-range-editor><div class="sliders">${(ranges?.trigger||[]).map((v,i)=>`<label>${i+1} ${t.trigger}<input class="trigger" data-i="${i}" type="range" min="10" max="90" value="${100-v}"></label><label>${i+1} ${t.hold}<input class="hold" data-i="${i}" type="range" min="10" max="90" value="${100-ranges.hold[i]}"></label>`).join("")}</div></details><div class="button-row"><ha-button id="save-mode">${t.save}</ha-button></div></section>`;const mode=Number(this._workModeDraft??s.work_mode??2),pirAvailable=mode!==1,radarAvailable=mode!==0;return `<section class="detail-section"><h2>${t.modeSensing}</h2><p id="sensing-message" role="status" ${this._healthMessage()?"":"hidden"}>${esc(this._healthMessage())}</p><div class="form-grid"><label>${t.workMode}<select id="work-mode"><option value="0">${t.pirOnly}</option><option value="1">${t.radarOnly}</option><option value="2">${t.hybrid}</option></select></label><label>${t.presenceTimeout}<input id="timeout" type="number" min="10" max="3600" value="${cfg.presence_timeout??30}"></label></div>${pirAvailable?`<div class="pir-section"><h3>${t.pirConfiguration}</h3><div class="form-grid pir-config"><div class="setting-row"><span>${t.pirStatus}</span><strong id="pir-state">${this._snapshot?.radar_status?.pir_status==null?"—":this._snapshot.radar_status.pir_status===1?t.detected:t.clear}</strong></div><label>${t.pirSensitivity}<select id="pir-sensitivity"><option value="0">${t.low}</option><option value="1">${t.medium}</option><option value="2">${t.high}</option></select></label></div></div>`:""}${radarAvailable?`<div class="radar-config"><h3>${t.radarConfiguration}</h3><div class="form-grid"><label>${t.radarSensitivity}<select id="radar-sensitivity"><option value="0">${t.low}</option><option value="1">${t.medium}</option><option value="2">${t.high}</option><option value="3">${t.custom}</option></select></label></div><lafaer-range-editor id="range-status"></lafaer-range-editor><div class="setting-row"><span>${t.learning}</span><ha-icon-button id="learning" title="${esc(t.learning)}"><ha-icon icon="mdi:chevron-right"></ha-icon></ha-icon-button></div><details id="energy-advanced" class="energy-advanced" ${this._energyOpen?"open":""}><summary>${t.energyAdvanced}</summary><div class="setting-row"><h3>${t.radarConfiguration}</h3><ha-button data-danger="radar_reset">${t.radarReset}</ha-button></div><h3>${t.range}</h3><p class="chart-legend">${t.rangeHint}</p><lafaer-range-editor id="range"></lafaer-range-editor><div class="threshold-block"><h3>${t.detectionThreshold}</h3><lafaer-threshold-chart id="detection-chart"></lafaer-threshold-chart></div><div class="threshold-block"><h3>${t.keepThreshold}</h3><lafaer-threshold-chart id="keep-chart"></lafaer-threshold-chart></div></details></div>`:""}<div class="button-row"><ha-button id="save-mode">${t.save}</ha-button></div></section>`;}
  _renderAdvanced(){const t=this.t,cfg=this._snapshot?.config||{};return `<section class="detail-section"><h2>${t.deviceControls}</h2><div class="form-grid">${this._selected.model==="LWR01"?`<div class="setting-row"><span>${t.batteryPower} · ${t.performance}</span><ha-switch id="battery-performance" ${cfg.battery_performance?"checked":""}></ha-switch></div><div class="setting-row"><span>${t.usbPower} · ${t.performance}</span><ha-switch id="usb-performance" ${cfg.usb_performance?"checked":""}></ha-switch></div>`:`<label>${t.batteryType}<select id="battery-type"><option value="0">${t.disposable}</option><option value="1">${t.rechargeable}</option></select></label>`}<div class="setting-row"><span>${t.darkness}</span><ha-switch id="darkness" ${cfg.darkness_enabled?"checked":""}></ha-switch></div><label id="lux-field" ${(this._darknessDraft??cfg.darkness_enabled)?"":"hidden"}>${t.darknessThreshold}<input id="lux" type="number" min="0" max="1000" value="${cfg.darkness_threshold??0}"></label></div><div class="button-row"><ha-button id="save-advanced">${t.save}</ha-button></div></section>`;}
  async _renderDebug(){let logs=[];try{logs=await this._hass.callWS({type:"lafaer/debug/list"});}catch(e){this._error=e.message;}this._logs=logs;this.render();}
  _debugView(){return `<header><ha-icon-button id="back-debug" title="${esc(this.t.back)}"><ha-icon icon="mdi:arrow-left"></ha-icon></ha-icon-button><h1>${this.t.debug}</h1><ha-button id="download-debug">${this.t.download}</ha-button><ha-button id="clear-debug">${this.t.clearLogs}</ha-button></header><div class="page-content"><ha-card class="panel-card"><section class="debug-content"><pre tabindex="0" aria-label="${esc(this.t.debug)}">${esc(JSON.stringify(this._logs||[],null,2))}</pre></section></ha-card></div>`;}
  _bind(){
    this._bindSidebar();
    const dismiss=this.shadowRoot.querySelector("#dismiss-notice");if(dismiss)dismiss.onclick=()=>{this._error=this._notice=null;this.render();};
    const q=s=>this.shadowRoot.querySelector(s);
    for(const [id,label] of [["led",this.t.led],["darkness",this.t.darkness],["battery-performance",`${this.t.batteryPower} · ${this.t.performance}`],["usb-performance",`${this.t.usbPower} · ${this.t.performance}`]])q(`#${id}`)?.setAttribute("aria-label",label);
    this.shadowRoot.onkeydown=e=>{if(e.key==="Escape"&&this._menuOpen){this._menuOpen=false;this.render();(q("#detail-more")||q("#more"))?.focus();}};
    if(q("#more"))q("#more").onclick=()=>{this._menuOpen=!this._menuOpen;this.render();};
    if(q("#detail-more"))q("#detail-more").onclick=()=>{this._menuOpen=!this._menuOpen;this.render();};
    if(q("#menu-manual"))q("#menu-manual").onclick=()=>{this._menuOpen=false;this.render();this._manualDialog();};
    if(q("#menu-debug"))q("#menu-debug").onclick=()=>{this._menuOpen=false;this._view="debug";this._renderDebug();};
    if(q("#scan"))q("#scan").onclick=()=>this._scan();
    this.shadowRoot.querySelectorAll("[data-rename]").forEach(b=>b.onclick=()=>this._rename(this._devices.find(device=>device.device_id===b.dataset.rename)));
    this.shadowRoot.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>this._open([...this._devices,...this._discovered].find(d=>d.device_id===b.dataset.open)));
    this.shadowRoot.querySelectorAll("[data-adopt]").forEach(b=>b.onclick=()=>this._adopt(this._discovered.find(d=>d.device_id===b.dataset.adopt)));
    if(q("#open-settings"))q("#open-settings").onclick=()=>{this._settingsPage=true;this._notice=null;this._menuOpen=false;this.render();this._setRangePolling(true);};
    if(q("#back"))q("#back").onclick=()=>{if(this._settingsPage){this._settingsPage=false;this._setEnergyPolling(false);this._setRangePolling(false);this._notice=null;this._menuOpen=false;this.render();}else this._back();};
    if(q("#retry"))q("#retry").onclick=()=>this._retry();
    if(q("#back-debug"))q("#back-debug").onclick=()=>{this._view="list";this.render();};
    if(q("#clear-debug"))q("#clear-debug").onclick=async()=>{await this._hass.callWS({type:"lafaer/debug/clear"});this._renderDebug();};
    if(q("#download-debug"))q("#download-debug").onclick=()=>{const blob=new Blob([JSON.stringify(this._logs||[],null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`lafaer-debug-${new Date().toISOString()}.json`;a.click();URL.revokeObjectURL(url);};
    if(q("#led"))q("#led").onchange=e=>this._action("set_led",{enabled:e.target.checked});
    if(q("#identify"))q("#identify").onclick=()=>this._action("identify");
    if(q("#learning"))q("#learning").onclick=()=>this._confirmLearning();
    if(q("#rename"))q("#rename").onclick=()=>this._rename();
    if(q("#range-status"))q("#range-status").config={...this._rangeStatusConfig(),values:this._snapshot?.radar_status?.ranges||[],visibleCount:8,step:.75,readOnly:true};
    if(q("#range")){
      const fallback=this._selected.model==="LWR01"?(this._snapshot?.ranges?.enabled||Array(8).fill(0)):(this._snapshot?.radar_status?.ranges||Array(15).fill(0));
      q("#range").config={values:this._rangeDraft||(this._selected.model==="LWR02"?fallback.map(value=>value===2?2:0):fallback),visibleCount:8,step:this._selected.model==="LWR01"?1.4:.75,disabledValue:this._selected.model==="LWR01"?0:2,enabledValue:this._selected.model==="LWR01"?1:0};
      q("#range").inert=this._snapshot?.radar_status?.ranges_valid===false;
      q("#range").addEventListener("value-changed",e=>{this._rangeDraft=e.detail.value;});
    }
    if(q("#detection-chart")){
      q("#detection-chart").config={values:this._thresholdValues(false),energy:this._snapshot?.detection_energy,visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:this.t.energyLegend};
      q("#detection-chart").addEventListener("value-changed",e=>this._editThresholds(false,e.detail.value));
    }
    if(q("#keep-chart")){
      q("#keep-chart").config={values:this._thresholdValues(true),energy:this._snapshot?.keep_energy,visibleCount:8,energyLabel:this.t.currentEnergy,thresholdLabel:this.t.thresholdValue,legend:this.t.keepEnergyLegend};
      q("#keep-chart").addEventListener("value-changed",e=>this._editThresholds(true,e.detail.value));
    }
    if(q("#range-details"))q("#range-details").ontoggle=e=>{this._rangeOpen=e.target.open;};
    if(q("#energy-advanced"))q("#energy-advanced").ontoggle=e=>this._setEnergyPolling(e.target.open);
    const triggers=[...this.shadowRoot.querySelectorAll(".trigger")],holds=[...this.shadowRoot.querySelectorAll(".hold")];
    triggers.forEach((x,i)=>{if(this._triggerDraft)x.value=this._triggerDraft[i];x.oninput=()=>{this._triggerDraft=triggers.map(y=>Number(y.value));};});
    holds.forEach((x,i)=>{if(this._holdDraft)x.value=this._holdDraft[i];x.oninput=()=>{this._holdDraft=holds.map(y=>Number(y.value));};});
    if(q("#timeout")){if(this._timeoutDraft!==null)q("#timeout").value=this._timeoutDraft;q("#timeout").oninput=e=>{this._timeoutDraft=e.target.value;};}
    if(q("#lux")){if(this._luxDraft!==null)q("#lux").value=this._luxDraft;q("#lux").oninput=e=>{this._luxDraft=e.target.value;};}
    if(q("#darkness")){if(this._darknessDraft!==null)q("#darkness").checked=this._darknessDraft;q("#darkness").onchange=e=>{this._darknessDraft=e.target.checked;q("#lux-field").hidden=!e.target.checked;};}
    const cfg=this._snapshot?.config||{},status=this._snapshot?.status||{};
    if(q("#battery-performance")){q("#battery-performance").checked=this._batteryPerformanceDraft??cfg.battery_performance??false;q("#battery-performance").onchange=e=>{this._batteryPerformanceDraft=e.target.checked;};}
    if(q("#usb-performance")){q("#usb-performance").checked=this._usbPerformanceDraft??cfg.usb_performance??false;q("#usb-performance").onchange=e=>{this._usbPerformanceDraft=e.target.checked;};}
    for(const [selector,draftName,fallback] of [["#work-mode","_workModeDraft",status.work_mode??0],["#pir-sensitivity","_pirDraft",cfg.pir_sensitivity??0],["#radar-sensitivity","_radarDraft",cfg.radar_sensitivity??0],["#battery-type","_batteryTypeDraft",status.battery_type??0]]){const field=q(selector);if(field){field.value=String(this[draftName]??fallback);field.onchange=e=>{this[draftName]=Number(e.target.value);};}}
    if(q("#radar-sensitivity"))q("#radar-sensitivity").onchange=e=>this._selectRadarSensitivity(e.target.value);
    if(q("#work-mode"))q("#work-mode").onchange=e=>{this._timeoutDraft=q("#timeout")?.value??this._timeoutDraft;if(q("#pir-sensitivity"))this._pirDraft=Number(q("#pir-sensitivity").value);if(q("#radar-sensitivity"))this._radarDraft=Number(q("#radar-sensitivity").value);this._workModeDraft=Number(e.target.value);this._setEnergyPolling(false);this.render();};
    if(q("#save-mode"))q("#save-mode").onclick=async()=>{const data={presence_timeout:Number(q("#timeout").value)};if(this._selected.model==="LWR01")Object.assign(data,{enabled:q("#range").value,trigger:triggers.map(x=>100-Number(x.value)),hold:holds.map(x=>100-Number(x.value))});else{const mode=Number(q("#work-mode").value);data.work_mode=mode;if(mode!==1)data.pir_sensitivity=Number(q("#pir-sensitivity").value);if(mode!==0)Object.assign(data,{radar_sensitivity:Number(q("#radar-sensitivity").value),ranges:q("#range").value,detection_thresholds:q("#detection-chart").value,keep_thresholds:q("#keep-chart").value});}if(await this._action("save_mode_sensing",data)){this._notice=this.t.saved;this._rangeDraft=this._triggerDraft=this._holdDraft=this._timeoutDraft=this._workModeDraft=this._pirDraft=this._radarDraft=this._detectionDraft=this._keepDraft=null;this.render();}};
    if(q("#save-advanced"))q("#save-advanced").onclick=async()=>{const data={darkness_enabled:q("#darkness").checked,darkness_threshold:Number(q("#lux").value)};if(this._selected.model==="LWR01")Object.assign(data,{battery_performance:q("#battery-performance").checked,usb_performance:q("#usb-performance").checked});else data.battery_type=Number(q("#battery-type").value);if(await this._action("save_advanced",data)){this._notice=this.t.saved;this._luxDraft=this._darknessDraft=this._batteryPerformanceDraft=this._usbPerformanceDraft=this._batteryTypeDraft=null;this.render();}};
    this.shadowRoot.querySelectorAll("[data-danger]").forEach(b=>b.onclick=()=>this._deviceAction(b.dataset.danger));
    if(q("[data-forget]"))q("[data-forget]").onclick=async()=>{if(await this._confirmDanger()){this._menuOpen=false;this._busy=true;this.render();try{await this._hass.callWS({type:"lafaer/device/forget",device_id:this._selected.device_id});await this._back();}catch(e){this._error=e.message;}finally{this._busy=false;this.render();}}};
  }
  render(){if(!this.shadowRoot||this._activeDialog)return;const restoreScroll=this._preserveRenderScroll();const scrollPositions=[...this.shadowRoot.querySelectorAll("lafaer-threshold-chart")].map(chart=>[chart.id,chart.querySelector(".threshold-grid")?.scrollLeft||0]);this.shadowRoot.innerHTML=`<style>:host{display:block;background:var(--primary-background-color);min-height:100vh;color:var(--primary-text-color)}main{max-width:1100px;margin:auto;padding:24px}main.busy{cursor:progress}main.busy ha-button,main.busy ha-switch,main.busy input,main.busy select{pointer-events:none;opacity:.65}header{display:flex;align-items:center;gap:12px;margin-bottom:20px}header h1{flex:1;margin:0}section{margin:28px 0 36px}.section-header{display:flex;align-items:flex-start;gap:16px}.section-header>div{flex:1}.section-header h2,.section-header p{margin:0 0 6px}.section-header p{color:var(--secondary-text-color);max-width:760px}.cards{display:grid;gap:16px;margin:18px 0}.device{display:flex;align-items:center;gap:16px;padding:18px}.device>div{flex:1;min-width:0}.device h3,.device p{margin:3px}.device small{display:block;color:var(--secondary-text-color);margin:5px 3px}.device>ha-icon{--mdc-icon-size:36px;color:var(--primary-color)}.status{border-radius:999px;padding:4px 10px;font-size:12px;font-weight:500;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}.status.available{background:color-mix(in srgb,var(--success-color,#43a047) 15%,transparent);color:var(--success-color,#43a047)}.status.offline{background:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);color:var(--secondary-text-color)}.power{display:flex;gap:8px;align-items:center;color:var(--secondary-text-color)}.power.on{color:var(--success-color,#43a047)}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0}.metric{padding:18px;display:flex;gap:14px;align-items:center}.metric ha-icon{color:var(--primary-color)}.metric small,.metric strong{display:block}.metric strong{font-size:20px;margin-top:5px}.section{padding:20px;margin-bottom:16px}.section h2{font-size:18px}.row{display:flex;justify-content:space-between;align-items:center;padding:10px 0}.section label,.manual label{display:grid;gap:5px;margin:12px 0}.section input,.section select,.manual input,.manual select{color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:4px;padding:9px}.manual{padding:18px;margin-bottom:16px}.rename{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:12px}.danger ha-button{--mdc-theme-primary:var(--error-color);margin:5px}.range-grid{display:flex;gap:3px;overflow:auto;padding:10px 0}.range-segment{min-width:78px;height:64px;border:1px solid var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff);border-radius:4px}.range-segment.disabled{border-color:var(--divider-color);background:var(--disabled-color,#9e9e9e)}.threshold-grid{display:flex;gap:8px;overflow:auto}.threshold-grid label{min-width:70px;text-align:center}.bar{height:150px;position:relative;background:var(--secondary-background-color)}.bar i{position:absolute;bottom:0;left:20%;right:20%;background:var(--primary-color)}.bar b{position:absolute;left:0;right:0;border-top:2px solid var(--error-color)}pre{padding:18px;overflow:auto;max-height:70vh}.sliders{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}@media(max-width:600px){main{padding:12px}.metrics{grid-template-columns:1fr 1fr}.device{padding:12px;gap:9px;flex-wrap:wrap}.device>div{flex-basis:calc(100% - 54px)}.device ha-button{margin-left:auto;max-width:150px}.section-header{align-items:center}.section-header p{font-size:13px}.rename{grid-template-columns:1fr}}</style><main class="${this._busy?"busy":""}" aria-busy="${this._busy}">${this._view==="detail"?this._renderDetail():this._view==="debug"?this._debugView():this._renderList()}${RESPONSIVE_STYLES}${HA_LAYOUT_STYLES}</main>${this._alerts()}`;this._bind();if(this._settingsPage)this._syncSensingControls();for(const [id,left] of scrollPositions){const grid=this.shadowRoot.querySelector(`#${id} .threshold-grid`);if(grid)grid.scrollLeft=left;}restoreScroll();}
}
if (!customElements.get("ha-lafaer-panel")) customElements.define("ha-lafaer-panel", HaLafaerPanel);
