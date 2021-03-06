/*
    ./options/cross-window.js

    The cross-window option; provides the ability to emit and receive messages across
    multiple browser tabs / windows within the same web browser.
*/
msngr.extend((function(external, internal) {
    "use strict";

    external.config("cross-window", {
        channel: "__msngr_cross-window"
    });

    // Let's check if localstorage is even available. If it isn't we shouldn't register
    if (typeof localStorage === "undefined" || typeof window === "undefined") {
        return {};
    }

    window.addEventListener("storage", function(event) {
        if (event.key === internal.config["cross-window"].channel) {
            // New message data. Respond!
            var obj;
            try {
                obj = JSON.parse(event.newValue);
            } catch (ex) {
                throw "msngr was unable to parse the data in its storage channel"
            }

            if (obj !== undefined && external.isObject(obj)) {
                internal.objects.message(obj.message).emit(obj.payload);
            }
        }
    });

    internal.option("cross-window", function(message, payload, options, async) {
        // Normalize all of the inputs
        options = options || {};
        options = options["cross-window"] || {};

        var obj = {
            message: message,
            payload: payload
        };

        try {
            localStorage.setItem(internal.config["cross-window"].channel, JSON.stringify(obj));
        } catch (ex) {
            throw "msngr was unable to store data in its storage channel";
        }

        return undefined;
    });

    // This is an internal extension; do not export explicitly.
    return {};
}));
