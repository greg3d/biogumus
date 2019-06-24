(function () {

    jQuery(document).ready(function () {
        "use strict";

        $(".navbar-burger").click(function () {

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            $(".navbar-burger").toggleClass("is-active");
            $(".navbar-menu").toggleClass("is-active");

        });

        /*
        $(".pre_korzina").stick_in_parent({
                parent: 'body',
                //spacer: '.side__menu'
            })
            .on("sticky_kit:unstick", function (e) {
                $(e.target).addClass("unsticked");
                $(e.target).addClass("ontop");
            })
            .on("sticky_kit:stick", function (e) {
                $(e.target).removeClass("unsticked");
                $(e.target).removeClass("ontop");
            });
            */

        $(".pre_korzina").hover(function () {

            if ($(this).hasClass('ontop')) {
                $(this).removeClass("unsticked");
            }

        }, function () {
            if ($(this).hasClass('ontop')) {
                $(this).addClass("unsticked");
            }

        })



    });
}());