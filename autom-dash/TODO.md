# TODO List:

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
  on RemoteDash.

Remote Dash Button Item button properties. Mark properties used to integrate with Alexa
- Power buttons should have 'toggle' property to indicate they act as on/off buttons.
- Numeric buttons should have a numeric property to indicate they can be chained to change channel
- Favorites may need a toggle/progression button to indicate they can be pressed multiple times to progress 
  selection.

All buttons should have a 'class' property:
classes: power, volume, channel (as in up/down), favorites
NOTE: Look at Baba Zoo Alexa skill for how I broke out classes. Alexa probably has a better name than class.
