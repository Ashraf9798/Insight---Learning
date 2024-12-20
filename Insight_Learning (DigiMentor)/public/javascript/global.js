$(document).ready(function() {

    var socket = io();

    socket.on('connect', function() {

        var room = 'Global Room';
        var name = $('#user-name').val();
        var image = $('#user-image').val();

        socket.emit('global room', { room, name, image });
         
        socket.on('messageDisplay', function() {
            $('#reload').load(location.href + ' #reload');
        });

    });
    
    socket.on('loggedInUser', function(users) {
        var friends = $('.friend').text();
        var friend = friends.split('@');
        // console.log(friend)
        // console.log(friends)
        
        var name = $('#user-name').val();
        var ol = $('<div></div>');
        var arr = [];
        
        for(var i = 0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                 
                var userName = users[i].name.toLowerCase();
                
                var list = `<img src = ${users[i].image} class="pull-left img-circle" style="width:50px; height:50px; margin-right:10px;"/>
                <p><a id="val" href="/chat/${userName.toLowerCase()}.${name.toLowerCase()}"><h3 style="padding-top:15px;color:gray; font-size:14px;">@${users[i].name}<span class="fa fa-circle online_friend"></span></h3></a></p><hr/>`
                // <div class="clearfix"></div><hr style=" margin-top: 14px; margin-bottom: 14px;" />`
                ol.append(list);
            }
            // console.log(users[i])
        }
        // console.log(arr);
        
        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol);
    });

});