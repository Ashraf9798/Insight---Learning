
$(document).ready(function() {
    var socket = io();

    var roomName = $('#groupName').val();
    var sender = $('#sender').val();

    socket.on('connect', function() {
        console.log('User connected successfully');
        var params = { room: roomName, name: sender };
        socket.emit('join', params, function() {
            console.log(`User has joined ${roomName} group`);
        }); 
    });

    socket.on('userList', function(users) {
        // console.log(users);
        var ol = $('<ol></ol>');
        for(var i = 0; i < users.length; i++) {
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }

        $(document).on('click', '#val', function() {
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr('href', '/profile/'+$(this).text());
        });

        $('#numValue').text(`(${users.length})`);
        $('#users').html(ol);
    });

    socket.on('newMessage', (data) => {
        // console.log(data);
        var template = $('#message-template').html();
        var messages = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });
        $('#messages').append(messages);
    });

    $('#message-form').on('submit', function(e) {
        e.preventDefault();
        var message = $('#msg').val();
        socket.emit('createMessage', {
            text: message,
            room: roomName,
            sender: sender 
        }, function() {
            $('#msg').val('');
        });

        $.ajax({
            url: `/group/${roomName}`,
            type: 'POST',
            data: {
                message: message,
                groupName: roomName
            },
            success: function() {
                $('#msg').val('');
            }
        });
    });
});