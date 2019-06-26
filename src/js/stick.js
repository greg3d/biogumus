(function () {

    jQuery(document).ready(function () {
        "use strict";

        $(".navbar-burger").click(function () {

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            $(".navbar-burger").toggleClass("is-active");
            $(".navbar-menu").toggleClass("is-active");

        });

        var w = $(window).width();

        function stickUnstick() {
            if (w < 752) {
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
            }
        }

        stickUnstick();


        $(window).resize(function () {
            w = $(window).width();
            stickUnstick();
        });

        /*

        $("#CollapseShopCartButton").click(function () {
            $(".pre_korzina").addClass("collapsed");
        });
*/
        /*
        $(".pre_korzina").hover(function () {


            $(this).removeClass("collapsed");


        }, function () {

            $(this).addClass("collapsed");


        })*/

        var square = document.querySelector(".pre_korzina");

        // Create a manager to manage the element
        var manager = new Hammer.Manager(square);

        // Create a recognizer
        var Tap = new Hammer.Tap({
            taps: 1
        });

        // Add the recognizer to the manager
        manager.add(Tap);

        // Subscribe to the desired event
        manager.on('tap', function (e) {
            
            $(".pre_korzina").toggleClass('collapsed');
        });



    });
}());