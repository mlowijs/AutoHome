$(function() {
   var socket = io();

    socket.on("valueSet", function(thingId, value) {
        var controls = $("[data-thing='" + thingId + "']");

        controls.each(function() {
            var control = $(this);

            if (control.hasClass("btn-group")) {
                var button = control.find(".btn[data-value='" + value + "']").first();
                button.addClass("active").siblings().removeClass("active");
            } else if (control.hasClass("run")) {
                control.text(value);
            }
        });
    });

    $(".btn:not(.dropdown-toggle)").on("click", function() {
        var button = $(this);
        var buttonGroup = button.closest(".btn-group");

        socket.emit("setValue", buttonGroup.data("thing"), button.data("value"));
    });

    $(".dropdown-menu a").on("click", function() {
        var link = $(this);

        socket.emit("setValue", link.data("thing"), link.data("value"));
    })
});