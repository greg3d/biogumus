jQuery(document).ready(function() {
    "use strict";

    $("#korzina").stick_in_parent({
        parent: 'body',
        //spacer: '.side__menu'
    })
    .on("sticky_kit:unstick", function(e) {
        $(e.target).addClass("unsticked"); 
    })
    .on("sticky_kit:stick", function(e) {
        $(e.target).removeClass("unsticked"); 
    });
    
    $(".side__menu").stick_in_parent({
        parent: 'body'
    })
    .on("sticky_kit:unstick", function(e) {
        $(e.target).addClass("unsticked"); 
    })
    .on("sticky_kit:stick", function(e) {
        $(e.target).removeClass("unsticked"); 
    });

    

});