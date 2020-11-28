# TODO List:

## autom-dash Items
- Could not restore PostgreSQL database from backup. Many foriegn key constrainst violations.
- RemoteDash component does not reload after drag-n-drop of item component. Cause UI to be out-of-date.
  - This works now when not using OnPush change management.
  - UI is not refreshed after drag-n-drop of item.
- Create IRSignal dialog: Save button doesn't activate until you click in Name field after entering content.
- User information is not cleared from cache after logging out. Need to refresh browser to clear user.
  - Entity cache is not cleared when user logs out
- Save button on RemoteDashComponent should only be enabled when unsaved changes exists 
- None of the iconUrl properties are hooked up to anything. Need to provide some static image assets
  to choose from.
- Use the seqNo property exposed via the dialogs is an awkward way to change display ordering.
  Maybe hide the field and use drag/move to reorder items.
- Remote Dash button items show entire IR Signal. Takes up a lot of space. Probably should just remove
  the field or an interim solution is to shorten the field using CSS.
- Add automatic detection of RestfulLearnIR services on network.
- Add ability to group RemoteDash items visually
- Add ability to group and chain RemoteDash items. e.g. a "Power On" group which powers on
  AVR, TV, STB.
  Possibly create these groups outside of RemoteDash and they just show up as a special type of item
- DONE. NEEDS TO BE TESTED. autom-dash install script needs to add aduser user to dialout group to be able to attach
- Add logic to autom-dash install script to install on-screen keyboard and add icon to RPI taskbar to
  toggle on-screen keyboard.
  https://pimylifeup.com/raspberry-pi-on-screen-keyboard/
- Consider removing need for ButtonItem Edit button by adding duration component to mouse clicks
  Treat long duration mouse clicks as an edit request
  https://stackoverflow.com/questions/25180332/how-can-i-listen-for-a-click-and-hold-in-angularjs

## RestfulLearnIR service:
- Update RestfulLearnIR.py to allow the tty for the USB serial port to be set from command line.
  Possibly have script search for a default to USB serial port of a single USB port is allocated.
  to tty USB serial port
- Create script to install/configure/execute RestfulLearnIR.py service as a system service
  Needs unprivileged user. Re-use aduser user used by autom-dash.

## Alexa related
### Remote Dash Button Item button properties. Mark properties used to integrate with Alexa
- Power buttons should have 'toggle' property to indicate they act as on/off buttons.
- Numeric buttons should have a numeric property to indicate they can be chained to change channel
- Favorites may need a toggle/progression button to indicate they can be pressed multiple times to progress 
  selection.

All buttons should have a 'class' property:
classes: power, volume, channel (as in up/down), favorites
NOTE: Look at Baba Zoo Alexa skill for how I broke out classes. Alexa probably has a better name than class.
