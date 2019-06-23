(function () {
    // body of the function

    // Modals
    /*
        var rootEl = document.documentElement;
        var $modals = getAll('.modal');
        var $modalButtons = getAll('.modal-button');
        var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

        if ($modalButtons.length > 0) {
            $modalButtons.forEach(function ($el) {
                $el.addEventListener('click', function () {
                    var target = $el.dataset.target;
                    openModal(target);
                });
            });
        }

        if ($modalCloses.length > 0) {
            $modalCloses.forEach(function ($el) {
                $el.addEventListener('click', function () {
                    closeModals();
                });
            });
        }

        function openModal(target) {
            var $target = document.getElementById(target);
            rootEl.classList.add('is-clipped');
            $target.classList.add('is-active');
        }

        function closeModals() {
            rootEl.classList.remove('is-clipped');
            $modals.forEach(function ($el) {
                $el.classList.remove('is-active');
            });
        }

        document.addEventListener('keydown', function (event) {
            var e = event || window.event;
            if (e.keyCode === 27) {
                closeModals();
                closeDropdowns();
            }
        });

        */

    jQuery(document).ready(function () {
        "use strict";


        // Check for click events on the navbar burger icon
        $(".navbar-burger").click(function () {

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            $(".navbar-burger").toggleClass("is-active");
            $(".navbar-menu").toggleClass("is-active");

        });


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

        /*
        $(".side__menu").stick_in_parent({
            parent: 'body'
        })
        .on("sticky_kit:unstick", function(e) {
            $(e.target).addClass("unsticked"); 
        })
        .on("sticky_kit:stick", function(e) {
            $(e.target).removeClass("unsticked"); 
        });*/

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