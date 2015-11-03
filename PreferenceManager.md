# Introduction #
In order to easily customize Highland Dots, a combination preference and plugin manager
has been developed.

_Note_:  At this time, there is no coding difference between plugins and built-in modules.

# Preferences #

Preferences should be limited to those things that affect multiple parts of the
Highland Dots system or enable/disable certain features.

To create a preference, use this format:

```
hdots_prefs.registerPreference( {
                               type: "boolean",
                               name: "boundingbox",
                               label: "Draw bounding boxes?",
                               def: false
});
```

  * `type` may be one of the following: `select`, `plugin`, `text` or `boolean`.  These types are explained below.
  * `name` is the name of the preference.  This may be any valid ECMAScript identifier.
  * `label` is the long description of the preference.  This is the text that will appear on preference configuration screen.
  * `def` is the default value for that preference.
  * `options` are explained under the `select` heading.


_New types coming soon:  `integer`, `float` and `number`._

Under the current implementation of the preference manager, the once the user runs the software, the default value is saved. Changing the default at a later time will not update the saved value.

# Preference types in detail #
## `select` ##
```
hdots_prefs.registerPreference( {
    type: "select",                        // The type of preference
    label: "What is your favorite color",  // The text that the user sees
    name: "favcolor",                      // The name of this preference
    def:  "green",                         // The default value
    options: [                             // And the options allowed
      {"#FF0000": "red"},                  // Note:  It is the FIRST value
      {"#0000FF": "blue"},                 // that is returned back
      {"#00FF00": "green"}                 // So the value of this preference
    ]                                      // is `"#00FF00"`
});
```

## `boolean` ##
```
hdots_prefs.registerPreference( {
    type: "boolean",
    name: "eatrobin",
    label: "Shall we eat Sir Robin?",
    def: true
});
```

## `text` ##
```
hdots_prefs.registerPreference( {
    type: "text",
    label: "What is your quest?",
    name: "quest",
    def:  "To seek the Grail"
});
```

_Coming soon:  A `size` property._

## `plugin` ##
```
hdots_prefs.registerPreference( {
    type: "plugin",
    label: "What weapon shall we use?",
    name: "weapon",
    options: [],
});
```

Please note that this simply creates a spot for the a plugin (or built in module)
to register itself.   At this point, it is an empty stub that needs filled.  More about that below.

# Registering Plugins #
In the example above, we create a place to register a plugin, but there is no plugin
registered to be used.  Lets solve that now.

## Registering a plugin with no sub-preferences ##
```
hdots_prefs.registerPlugin("weapon",        // The same name as used in registerPreference
                           "club",          // A short name for /this/ plugin.  Must be a valid ECMAScript identifier.
                           "A heavy club",  // A descriptive name that the user will see
                           swingClub        // What function to call
                           );

```

Now under the preference menu, the option of 'What weapon shall we use' will have a choice of 'A heavy club.'

## Registering a plugin with sub-preferences ##
```
hdots_prefs.registerPlugin("weapon",        // The same name as used in registerPreference
                           "sword",         // A short name for /this/ plugin.  Must be a valid ECMAScript identifier.
                           "A light sword", // A descriptive name that the user will see
                           swingSword       // What function to call
                           );

```

This creates a new plugin that is available under the 'weapon' option.  Now lets add some preferences.
```
hdots_prefs.registerPluginPreference("weapon", "sword", {
    type: "text",
    label: "The name of this sword",
    name: "name",
    def:  "Sting"
});
```

You may register any type of preference with the sole exception of `plugin`.  Plugins are not allowed to have plugins.

# Retrieving data #
## Retrieving a preference ##

Being able to create a preference is only half of it.  One needs to be able to get the values back from the preference manager.

```
  var color = hdots_prefs.getValueOf("favcolor");
```

`color` will now hold the value selected by the user, or the default value if none was choosen.

(Although not available yet, the following methods are scheduled to be implemented:
```
hdots_prefs.getBoolean
hdots_prefs.getString
hdots_prefs.getNumber
hdots_prefs.getFloat
hdots_prefs.getInteger
```
)

## Retrieving a selected plugin ##
```
var weaponFunction = hdots_prefs.getPluginFunction("weapon");
weaponFunction("Your Parameter");
```

It is important to note that a new object will be automatically added as the first parameter to the function.  This object will hold the preference values for that chosen plugin.

For example, the function `swingSword` might look like this:
```
function swingSword(localPref, damage) {
  alert("You swing " + localPref.name + " and do " + damage + " to the enemy.");
}
weaponFunction(99); // Do 99 damage
```

