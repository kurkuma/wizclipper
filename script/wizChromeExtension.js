wiz = function wiz() {};

wiz.prototype.SETTING_USERNAME = "username";
wiz.prototype.SETTING_PASSWORD = "password";
wiz.prototype.SETTING_REMEMBERME = "rememberme";
wiz.prototype.SETTING_CLIPPER = "selectClipper";


function _get(name) {
    return localStorage[name];
}

function _set(name, value) {
    localStorage[name] = value;
}

function localizeBlock(block) {
    if (block.attr("message"))
        localizeElement(block);
    var siblings = block.find("[message], [placeholder], [title]");
    for ( var i = 0; i < siblings.length; i++) {
        var sibling = $(siblings.get(i));
        localizeElement(sibling);
    }
}

function localizeElement(element, force) {
    if (!force && element.attr("localized")
        && element.attr("localized") == "true") {
            return;
    }

    var field = extractLocalizationField(element);
    var placeholderField = extractLocalizationPlaceholderField(element);
    var titleField = extractLocalizationTitleField(element);
    var fieldData = extractLocalizationDataField(element);
    var localized = false;

    if (field) {
        if (fieldData) {
            var msg = chrome.i18n.getMessage(field, fieldData);
        } else {
            var msg = chrome.i18n.getMessage(field);
        }
        if (element.attr("type") == "button") {
            element.attr("value", msg);
        } else {
            element.html(msg);
        }
        localized = true;
    }

    if (placeholderField) {
        var msg = chrome.i18n.getMessage(placeholderField);
        element.attr("placeholder", msg);
        localized = true;
    }

    if (titleField) {
        var msg = chrome.i18n.getMessage(titleField);
        element.attr("title", msg);
        localized = true;
    }

    if (localized) {
        element.attr("localized", "true");
    }
}

function extractLocalizationField(element) {
    if (typeof element.attr == 'function' && element.attr("message"))
        return element.attr("message");
    else
        return null;
}

function extractLocalizationPlaceholderField(element) {
    if (typeof element.attr == 'function' && element.attr("placeholder"))
        return element.attr("placeholder");
    else
        return null;
}

function extractLocalizationTitleField(element) {
    if (typeof element.attr == 'function' && element.attr("title"))
        return element.attr("title");
    else
        return null;
}

function extractLocalizationDataField(element) {
    if (typeof element.attr == 'function' && element.attr("messagedata")) {
        var v = element.attr("messagedata");
        try {
            v = eval(v);
        } catch (e) {}
        if (!(v instanceof Array))
            v = [ v ];
            return v;
        } else {
            return null;
    }
}

