$(document).ready(function() {
    
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    var params = paramOne.split('.');
    var username = params[0];
    $('#receiver_name').text(username);
    swap(params, 0, 1);
    var paramTwo = `${params[0]}.${params[1]}`;

    socket.on('connect', function() {
        var param = {
            room1: paramOne,
            room2: paramTwo
        }
        socket.emit('Join PM', param);

        socket.on('messageDisplay', function() {
            $('#reload').load(location.href + ' #reload');
        });
    });

    socket.on('new message', function(data) {
        var template = $('#message-template').html();
        var messages = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });
        $('#messages').append(messages);
    });

    $('#message_form').on('submit', function(e) {
        e.preventDefault();
        var message = $('#msg').val();
        var sender = $('#user-name').val();
        
        if(message.trim().length > 0) {
            socket.emit('privateMessage', {
                text: message,
                sender: sender,
                room: paramOne 
            }, function() {
                $('#msg').val('');
            });
        }
    });

    $('#send-message').on('click', function() {
        var message = $('#msg').val();
        $.ajax({
            url: `/chat/${paramOne}`,
            type: 'POST',
            data: { message },
            success: function() {
                $('#msg').val('');
            }
        });
    });

});

function swap(input, val1, val2) {
    var temp = input[val1];
    input[val1] = input[val2];
    input[val2] = temp;
}