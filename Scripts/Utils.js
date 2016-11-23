/*
 * Utils.js
 * Dependent upon jquery-1.6.1.min.js.
 *
 */

// VALIDATE functions
// The "validate" functions all follow the following pattern:
// The name indicates what is being validated, e.g., "validateConditionIsTrue".
// Unless otherwise specified, all validate functions have the same params,
// returns, side effects, and usage (see below).
// Params:      control - the control, fieldName - name of the control to be displayed in the message
// Returns:     Boolean indicating whether or not the control value is valid.
// SideEffects: Displays error message and focuses the control.
// Usage:       if (!validateConditionIsTrue($('#MyTextBox'), "My TextBox")) return; // or return false;

//TODO: add "is" functions to be called by validate functions


// Validates that a textbox does not contain a null or empty string.
function validateIsNotEmpty(control, fieldName) {
    if (control === null || $.trim(control.val()) === '') {
        alert('Please enter ' + fieldName + '.');
        control.focus();
        return false;
    }
    return true;
}

// Validates that the value entered in a textbox is numeric.
function validateIsNumeric(control, fieldName) {
    var value = control.val();
    for (i = 0; i < control.val().length; i++) {
        var char = value.charAt(i);
        if ((char < "0" || char > "9") && char != "" && char != "." && char != "-") {
            alert(fieldName + ' must be numeric.');
            control.focus();
            return false;
        }
    }
    return true;
}

// Validates that the value entered in a textbox is an integer.
// Note: by definition this means it is also numeric.
function validateIsIntegral(control, fieldName) {
    var value = control.val();
    for (i = 0; i < control.val().length; i++) {
        var char = value.charAt(i);
        if ((char < "0" || char > "9") && char != "" && char != "-") {
            alert(fieldName + ' must be an integer.');
            control.focus();
            return false;
        }
    }
    return true;
}

// Validates that the value entered in a textbox is a positive number.
// Note: by definition this means it is also numeric.
function validateIsPositive(control, fieldName) {
    var value = control.val();
    for (i = 0; i < control.val().length; i++) {
        var char = value.charAt(i);
        if ((char < "0" || char > "9") && char != "" && char != ".") {
            alert(fieldName + ' cannot be negative.');
            control.focus();
            return false;
        }
    }
    return true;
}

// Validates that the length (number of chars) entered in a textbox does not exceed the length param.
function validateLength(control, length, fieldName) {
    if (control.val().length > length) {
        alert(fieldName + ' cannot exceed ' + length + ' characters.');
        control.focus();
        return false;
    }
    return true;
}

// Validates that a textbox expecting a date value does not contain an invalid date
// according to the format [M]M/[D]D/YYYY.
// Note that it does not handle February with too many days (Leap year or otherwise).
function validateDate(control, fieldName) {
    if (control === null || $.trim(control.val()) === '') // nulls and empty strings allowed
        return true;
    
    if (!(/^(0?[1-9]|1[012])\/(0?[1-9]|1\d|2\d|3[01])\/\d{4}$/.test(control.val()))) {
        alert(fieldName + ' must be a valid date.\r\n\r\nFormat:  [M]M/[D]D/YYYY');
        control.focus();
        return false;
    }
    return true;
}

// Validates that a textbox expecting a time does not contain an invalid time
// according to the format - [H]H:MM [A/P]M.
function validateTime(control, fieldName) {
    if (control === null || $.trim(control.val()) === '') // nulls and empty strings allowed
        return true;

    if (!(/^(0?[1-9]|1[012])(:[0-5]\d)(\ [AP]M)$/i.test(control.val()))) {
        alert(fieldName + ' must be a valid time.\r\n\r\nFormat:  [H]H:MM [A/P]M');
        control.focus();
        return false;
    }
    return true;
}

// Returns the current date as a properly formatted string for display in textbox.
function getCurrentDate() {
    return getFormattedDate(new Date());
}

// Returns the current time as a properly formatted string for display in textbox.
function getCurrentTime() {
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ampm = "AM";
    if (hh >= 12) {
        if (hh > 12) hh -= 12;
        ampm = "PM";
    }
    if (Number(mm) < 10) {
        mm = "0" + mm;
    }
    return hh + ":" + mm + " " + ampm;
}

// Takes a date as an argument and returns a properly formatted string for use in a textbox.
function getFormattedDate(date) {
    var d = new Date(date);
    var mm = d.getMonth();
    var dd = d.getDate();
    var yy = d.getFullYear();
    mm += 1; //TODO: revisit appending zero's below
    if (Number(mm) < 10) {
        mm = '0' + mm;
    }
    if (Number(dd) < 10) {
        dd = '0' + dd;
    }
    return mm + '/' + dd + '/' + yy;
}

// Saves the form or page data via AJAX call.
// Params:  Expects url param with "/" at beginning.  Assumes hiddenURL on page.
// Return:  Success returns true.
function saveItem(url) {
    $.ajax({
        type: "POST",
        url: $('#hiddenURL').val() + url,
        data: $('form').serializeArray(),
        dataType: "json",
        cache: false,
        async: false,
        error: function (xhr, status, error) {
            // you may need to handle me if the json is invalid
            // this is the ajax object
            alert(error);
            return false;
        },
        success: function (data) {
            if (data.HasErrors) {
                alert(data.ErrorMessage);
                return false;
            }
            return true;
        }
    });
}

// Populates a drop down list via an AJAX call.
function populateList(dropdownlist, url) {
    resetList(dropdownlist);
    $.getJSON(url, function (data) {
        if (data.HasErrors) {
            alert(data.ErrorMessage);
            return;
        }
        $.each(data.Items, function (index, optionData) {
            dropdownlist.append("<option value='" + optionData + "'>" + optionData + "</option>");
        });
    });
}

// Clears a drop down list.
function resetList(dropdownlist) {
    dropdownlist.empty();
    dropdownlist.append("<option value =''></option>");
}
