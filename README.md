# ha-lafaer

<img src="assets/logo.svg" alt="Lafaer" width="240">

Open-source, local-only Home Assistant management panel for Lafaer LWR01 and
LWR02 presence sensors.

> Development status: early preview. Protocol and UI behavior are based on the
> Lafaer App 1.1.0+30 source. Test with non-critical devices before release.

## Power behavior

The integration does not create polling entities and does not contact sensors
at Home Assistant startup or while dashboards and automations are running.

- Opening the Lafaer panel starts one bounded 15-second mDNS scan; **Scan** can
  repeat it manually. Discovery results are cached without opening a sensor
  session.
- A CoAP transport is created only while a device detail page is visible.
- Leaving the page closes it immediately.
- A 10-second heartbeat and 25-second server lease close abandoned sessions.
- Hiding the browser tab unsubscribes and stops all polling.
- Unloading the integration closes every task and UDP transport.

## Supported features

- LWR01 and LWR02 discovery over `_glinet._tcp.local.`
- Persistent discovery cache with available/offline and last-seen status
- Exclusive Home Assistant takeover/pairing
- Occupancy, illuminance, battery and power status
- LWR02 temperature, humidity and work mode
- LED, identify, timeout and darkness settings
- LWR01 range and sensitivity configuration
- LWR02 radar range, real-time energy and threshold configuration
- Auto-adaptation / radar self-learning
- Radar reset and factory reset; LWR01 firmware management release
- Local device rename and forget controls
- In-memory debug viewer, optional rotating logs and redacted HA diagnostics
- English, Simplified Chinese and Traditional Chinese UI

BLE firmware updates are intentionally not included in v1.

## Installation (development)

1. Copy `custom_components/lafaer` to the Home Assistant `config/custom_components`
   directory.
2. Restart Home Assistant.
3. Open **Settings → Devices & services → Add integration**, search for
   **Lafaer**, and complete setup.
4. Open **Lafaer** in the sidebar.

Opening the sidebar performs mDNS discovery but does not create a sensor
session. A device connection is created only after opening that device's
detail page, and is closed when the page is left or hidden.

For HACS, add this repository as a custom **Integration** repository. Formal
HACS installation requires a tagged release.

## Network requirements

The Home Assistant host/container must be able to access mDNS, UDP port 5683,
and the sensor's Thread IPv6 route. Container network isolation or a missing
IPv6 route cannot be bypassed by this integration.

## Pairing warning

The sensor stores only one management key. Taking it over in Home Assistant
replaces the App key. Pairing it with the App again invalidates the Home
Assistant key and requires another takeover.

## Development

The backend targets Home Assistant 2024.12 or later and Python 3.12 or later.
The panel is shipped as a prebuilt dependency-free JavaScript module.

## License

Apache License 2.0.
