
$(document).ready(function() {

    var socket = io();

    var roomName = $('#groupName').val();
    var sender = $('#sender-name').val();

    socket.on('connect', function() {
        var params = { sender };
        socket.emit('joinRequest', params, function() {
            console.log('Joined');
        });
    });

    socket.on('newFriendReq', function(frnd) {
        $('#reload').load(location.href + ' #reload');

        $(document).on('click', '#accept_friend', function() {
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
            $.ajax({
                url: '/group/'+roomName,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function() {
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
        });

        $(document).on('click', '#cancel_friend', function() { 
            var userId = $('#userId').val();
            
            $.ajax({
                url: '/group/'+roomName,
                type: 'POST',
                data: {
                    userId
                },
                success: function() {
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
        });
    });

    $('#add_friend').on('submit', function(e) {
        e.preventDefault();
        var receiver = $('#receiverName').val();
        $.ajax({
            url: '/group/'+roomName,
            type: 'POST',
            data: {
                receiver,
                sender
            },
            success: function() {
                socket.emit('friendReq', { receiver, sender }, function() {
                    console.log('Friend Req sent');
                });
            }
        });
    });

    $('#accept_friend').on('click', function() { 
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        $.ajax({
            url: '/group/'+roomName,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function() {
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });

    $('#cancel_friend').on('click', function() { 
        var userId = $('#userId').val();
        
        $.ajax({
            url: '/group/'+roomName,
            type: 'POST',
            data: {
                userId
            },
            success: function() {
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload');
    });

});