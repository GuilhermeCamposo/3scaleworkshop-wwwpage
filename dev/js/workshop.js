$(document).ready(function() {

        // Keycloak Config Start
        var keyOptions = {
            url: 'ENVIRONMENT.KEYCLOAK_URL/auth',
            realm: 'ENVIRONMENT.KEYCLOAK_REALM',
            clientId: 'ENVIRONMENT.KEYCLOAK_CLIENT_ID'
        };

        var keycloak = Keycloak(keyOptions);
        keycloak.init({ onLoad: 'check-sso' }).then(function (authenticated) {
            if (authenticated) {
                $("<h4>Welcome " + keycloak.idTokenParsed.preferred_username + "</h4> ").insertBefore($('#mapid'));
                $.cookie("workshop-token", keycloak.token);
                $('#loginUrl').hide();
                $('#mapid').show();
            }
            else {
                $('#mapid').hide();
                $('#loginUrl').show();
            }
        }).catch(function (data) {
            alert('Failed to initialize keycloak: ' + data);
        });

        var opts = {
            redirectUri: window.location.origin + "/locations.html"
        };

        var loginUrl = keycloak.createLoginUrl(opts);
        document.getElementById('loginUrl').href = loginUrl;
        // Keycloak Config End
  });

 function listLocations(el,type){

   var token = $.cookie("workshop-token");

   if(token != null){
     clearBox("mapid");

     if(el != null){
       defineSelection(el);
     }

     $( "#mapid" ).each(function( index, element ) {
       $.ajax({
           url: 'ENVIRONMENT.BACKEND_URL' + '?type=' + type,
            // Headers Start
            headers: {
                'Authorization': 'Bearer ' + token
            },
            // Headers End
           dataType: 'json',
           success: function(result){

             $.each(result, function(i, obj) {

                $( element ).append(
                    '<div style="width:70%;"> \n ' +
                      '<h4 style="color:black;">' + obj.name +'</h4> \n ' +
                      '<p style="color:red;">' + obj.type+'</p> \n ' +
                    '</div><br> \n ' );
              });
           }
       })
     });
   }

 }

 function defineSelection(el) {

     $("#typeList").children().each(function() {
       $(this).removeClass('current');
     });

     $(el).parent().addClass('current');

  }

 function clearBox(elementID) {
      var div = document.getElementById(elementID);

      while(div.firstChild) {
          div.removeChild(div.firstChild);
      }
  }
