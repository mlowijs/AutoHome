$(function() {
   var socket = io();

    //
    // Receive valueSet events
    //
    socket.on("valueSet", function(thingId, value) {
        var controls = $("[data-thing='" + thingId + "']");

        controls.each(function() {
            var control = $(this);

            if (control.hasClass("btn-group")) {
                var button = control.find(".btn[data-value='" + value + "']").first();
                button.addClass("active").siblings().removeClass("active");
            } else if (control.hasClass("text")) {
                control.text(value);
            }
        });
    });

    //
    // Send setValue events
    //
    function emitSetValue(thingId, value) {
        socket.emit("setValue", thingId, value);
    }

    $(".btn:not(.dropdown-toggle)").on("click", function() {
        var button = $(this);
        var buttonGroup = button.closest(".btn-group");

        emitSetValue(buttonGroup.data("thing"), button.data("value"));
    });

    $(".dropdown-menu a").on("click", function() {
        var link = $(this);

        emitSetValue(link.data("thing"), link.data("value"));
    })
});