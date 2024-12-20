$(document).ready(function() {

    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    var params = paramOne.split('.');
    
    swap(params, 0, 1);
    var paramTwo = `${params[0]}.${params[1]}`;

    socket.on('connect', function() {
        var param = {
            room1: paramOne,
            room2: paramTwo
        }
        socket.emit('Join PM', param);
    });

    socket.on('new refresh', function() {
        $('#reload').load(location.href + ' #reload');
    });

    $(document).on('click', '#messageLink', function() {
        var chatId = $(this).data().value;

        $.ajax({
            url : `/chat/${paramOne}`,
            type: 'POST',
            data: { chatId },
            success: function() {

            }
        });

        socket.emit('refresh', {});
    });

});

function swap(input, val1, val2) {
    var temp = input[val1];
    input[val1] = input[val2];
    input[val2] = temp;
}