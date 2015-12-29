$(function() {
   var socket = io();

    socket.on("valueSet", function(thingId, value) {
        var control = $("*[data-thing='" + thingId + "'][data-value='" + value + "']");

        control.addClass("active").siblings().removeClass("active");
    });

    $(".btn:not(.dropdown-toggle)").on("click", function() {
        var button = $(this);

        socket.emit("valueSet", button.data("thing"), button.data("value"));
    })

    $(".dropdown-menu a").on("click", function() {
        var link = $(this);

        socket.emit("valueSet", link.data("thing"), link.data("value"));
    })
});