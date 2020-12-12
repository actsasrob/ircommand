# TODO List:

## autom-dash Items
- RemoteDash component does not reload after drag-n-drop of item component. Cause UI to be out-of-date.
  - This works now when not using OnPush change management.
  - UI is not refreshed after drag-n-drop of item.
- Need to rethink double clicking RemoteDash item to delete. Single clicking items rapidly (e.g. navigating up/down in a menu) is interpreted as a double click and the item gets deleted
- Create IRSignal dialog: Save button doesn't activate until you click in Name field after entering content.
- User information is not cleared from cache after logging out. Need to refresh browser to clear user.
  - Entity cache is not cleared when user logs out
- None of the iconUrl properties are hooked up to anything. Need to provide some static image assets
  to choose from.
- Use the seqNo property exposed via the dialogs is an awkward way to change display ordering.
  Maybe hide the field and use drag/move to reorder items.
- Add automatic detection of RestfulLearnIR services on network.
- Add ability to group RemoteDash items visually
- Add ability to group and chain RemoteDash items. e.g. a "Power On" group which powers on
  AVR, TV, STB.
  Possibly create these groups outside of RemoteDash and they just show up as a special type of item
- DONE. NEEDS TO BE TESTED. autom-dash install script needs to add aduser user to dialout group to be able to attach to USB tty to use a LearnIR device
- Add logic to autom-dash install script to install on-screen keyboard and add icon to RPI taskbar to
  toggle on-screen keyboard.
  https://pimylifeup.com/raspberry-pi-on-screen-keyboard/
- DONE. NEEDS TO BE TESTED MORE. Consider removing need for ButtonItem Edit button by adding duration component to mouse clicks
  Treat long duration mouse clicks as an edit request
  https://stackoverflow.com/questions/25180332/how-can-i-listen-for-a-click-and-hold-in-angularjs
- The Edit IR Signal dialog should probably have a custom validator that takes into considerations
  that the Alexa metadata fields are optional, but if specified should contain valid data

## RestfulLearnIR service:
- Update RestfulLearnIR.py to allow the tty for the USB serial port to be set from command line.
  Possibly have script search for a default to USB serial port of a single USB port is allocated.
  to tty USB serial port
  -- Or if multiple tty USB serial ports are found it could connect to each in-turn to see if
     a LearnIR device is attached.
- Create script to install/configure/execute RestfulLearnIR.py service as a system service
  Needs unprivileged user. Re-use aduser user used by autom-dash.

## Alexa related
### Remote Dash Button Item button properties. Mark properties used to integrate with Alexa
- Numeric buttons should have a numeric property to indicate they can be chained to change channel
- Favorites may need a toggle/progression button to indicate they can be pressed multiple times to progress 
  selection.

All buttons should have a 'class' property:
classes: power, volume, channel (as in up/down), favorites
NOTE: Look at Baba Zoo Alexa skill for how I broke out classes. Alexa probably has a better name than class.

For Baba Zoo: 
- intent -> category of command. e.g. volume_action
-- action -> type of command. e.g. VOLUME_DECREASE
--- component -> device with is target of command.
--- default_component: boolean. whether this device is the default target for the intent/action pair.
--- numargs: does the command except numeric arguments? This is meant to indicate a command/action pair
             can be executed multiple times. e.g. execute the VOLUME_DECREASE action 5 times. One sublety here is that with Baba Zoo the target shell script could control the amount of delay between each executed command. Baba Zoo the target shell script could control the amount of delay between each executed command..a
             for channel_action intents this can be used to specify the channel number to change to
##intents:
- generic - e.g. power on system, open dvd tray
- AVR - e.g. change compononent to DVD player
- volume - e.g. raise volume, decrease volume by 5
-- Takes numeric argument: positive integer indicating how much the volume should be raised or lowered
- channel - e.g. change channel on set top box to 746
-- Takes numeric argument which is the channel number to change to
- navigation - e.g. channel up, scroll right 5 times, page down
-- takes numeric argumment: number of times to repeat command
