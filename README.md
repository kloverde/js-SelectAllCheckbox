SelectAllCheckbox v1.0
======================

See LICENSE for this software's licensing terms.

SelectAllCheckbox is a JavaScript library which makes it easy to create "select all" checkboxes for checkbox groups.

This library is a vanilla JavaScript port of [my jQuery SelectAllCheckbox plugin](https://www.github.com/kloverde/jquery-SelectAllCheckbox).


## Differences between this and the jQuery version

* This library is incompatible with all versions of IE.  I do projects like this to learn, and I wanted to use ES6 features.  (I tested in Chromium, Firefox and legacy Edge, and those were OK).
* The use of indeterminate checkboxes can no longer be disabled via configuration
* Minor API differences, though conceptually it's the same (see the [Using](#Using) section)

## Features

* Grants a checkbox control over a group of checkboxes to select or deselect all of them
* When checkboxes are individually checked/unchecked, the select-all checkbox's state updates accordingly between not checked, indeterminate (partially checked) and checked
* Supports any number of checkbox groups
* Configuration accepts a callback which executes when one or more checkboxes changes state
* The callback receives the changed checkbox(es) as an array of DOM objects, plus the status of the checkbox group (all/some/none checked)
* Select-all checkboxes do not modify the state of disabled checkboxes.  Disabled checkboxes do affect the state of the select-all checkbox.


## Using

### Class:  `CheckboxGroup`

#### Class Constants

| Property | Description |
| ----------------- | ----------------------------------------|
| `CheckboxGroup.GROUP_STATE_NONE` | Reflects the state of the checkbox group; a string with value `none` |
| `CheckboxGroup.GROUP_STATE_SOME` | Reflects the state of the checkbox group; a string with value `some` |
| `CheckboxGroup.GROUP_STATE_ALL` | Reflects the state of the checkbox group; a string with value `all` |

#### Constructor Arguments

| Property | Description |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `selectAllId` | The HTML "id" attribute of the select-all checkbox |
| `groupName` | The HTML "name" attribute of the checkboxes.  Note:  the select-all checkbox should not have a "name" attribute. |
| `onChangeCallback` | A callback to execute when a checkbox's state changes |


The callback function receives two arguments:

1.  The affected checkboxes as an array of DOM objects
2.  A string representing how many checkboxes in the group are checked; see `CheckboxGroup.GROUP_STATE_NONE`, `CheckboxGroup.GROUP_STATE_SOME` and `CheckboxGroup.GROUP_STATE_ALL`.

#### Example

```javascript

let group1 = new CheckboxGroup(
   "selectAllButton",
   "checkboxGroup",
   function( checkboxes, checkedState ) { do stuff; }
);

```

See `demo/demo.html` file for a more thorough demo.

If you change a checkbox's state via script (for example, with `document.getElementById("box1").checked = true`, you must manually fire the `change` event on the checkbox to ensure that the select-all checkbox's state is updated.
