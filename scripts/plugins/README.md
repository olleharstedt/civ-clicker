Classes in this folder listen for events to execute code.

List of available events:

## Global

| Name | Value | Description
|---|---|---
| global.autosave | - | Run when autosave is successful.
| global.doPurchase.success | - | Run when a purchase is successful.
| global.doPurchase.finished | - | Run when a purchase is finished, that is, when complete progress is done..
| global.init | - | Run when game is initialised.
| global.pluginInitDone | - | Run after all plugins are initialised.
| global.onIncrement | - | Run when user clicks on any primary resource button.
| global.tick | - | Run on every tick (once each second).
| global.update.buildings | - | Fired when all owned buildings should update their number.

## DayNight

| Name | Value | Description
|---|---|---
| daynight.day.begin | - |  Run when day begin (after night).
| daynight.night.begin | - |  Run when night begin.

## Weather

| Name | Value | Description
|---|---|---
| weather.wetOrDry | 'wet', 'dry' | If this day/night is wet or dry
| weather.temperature | integer | Current temperature
