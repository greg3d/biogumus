(function () {
    // body of the function

    jQuery(document).ready(function () {
        "use strict";


        // Check for click events on the navbar burger icon
        $(".navbar-burger").click(function () {
           
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            $(".navbar-burger").toggleClass("is-active");
            $(".navbar-menu").toggleClass("is-active");

        });

        $("#korzina").stick_in_parent({
                parent: 'body',
                //spacer: '.side__menu'
            })
            .on("sticky_kit:unstick", function (e) {
                $(e.target).addClass("unsticked");
            })
            .on("sticky_kit:stick", function (e) {
                $(e.target).removeClass("unsticked");
            });

        $(".side__menu").stick_in_parent({
                parent: 'body'
            })
            .on("sticky_kit:unstick", function (e) {
                $(e.target).addClass("unsticked");
            })
            .on("sticky_kit:stick", function (e) {
                $(e.target).removeClass("unsticked");
            });



    });
}());