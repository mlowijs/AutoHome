$(function() {
   var socket = io();

    socket.on("valueSet", function(thingId, value) {
        $("#" + thingId).text(value);
    })
});