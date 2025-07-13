!function (o) {
    "use strict";
    var e,

        a = "eng";

    function s(e) {
        1 == o("#light-mode-switch").prop("checked") && "light-mode-switch" === e ? (o("#dark-mode-switch").prop("checked", !1),
            o("#rtl-mode-switch").prop("checked", !1),
            o("#bootstrap-style").attr("href", "assets/css/bootstrap.min.css"),
            o("#app-style").attr("href", "assets/css/app.min.css"),
            sessionStorage.setItem("is_visited", "light-mode-switch")) : 1 == o("#dark-mode-switch").prop("checked") && "dark-mode-switch" === e ? (o("#light-mode-switch").prop("checked", !1),
                o("#rtl-mode-switch").prop("checked", !1),
                o("#bootstrap-style").attr("href", "assets/css/bootstrap-dark.min.css"),
                o("#app-style").attr("href", "assets/css/app-dark.min.css"),
                sessionStorage.setItem("is_visited", "dark-mode-switch")) : 1 == o("#rtl-mode-switch").prop("checked") && "rtl-mode-switch" === e && (o("#light-mode-switch").prop("checked", !1),
                    o("#dark-mode-switch").prop("checked", !1),
                    o("#bootstrap-style").attr("href", "assets/css/bootstrap.min.css"),
                    o("#app-style").attr("href", "assets/css/app-rtl.min.css"),
                    sessionStorage.setItem("is_visited", "rtl-mode-switch"))
    } function c() {
        var a, n, s; o(".edit-icon").click(function (e) {
            var t = o(this).parent(); o(".dashboard_new_name").hide(),
                o(".dashboard_name").show(); var a = t.find(".dashboard_name").text(); t.find(".dashboard_new_name").val(a),
                    t.find(".dashboard_name").hide(), t.find(".dashboard_new_name").show(), o(this).hide()
        }), o(".dashboard_new_name").keyup((a = function (e) {
            var t = o(this).parent(), a = o(this).parent().find(".dashboard_name"),
                n = o(this).val(); a.html(n), t.find(".dashboard_name").show(), t.find(".dashboard_new_name").hide(), o(".edit-icon").show()
        }, n = 500, s = 0, function () { var e = this, t = arguments; clearTimeout(s), s = setTimeout(function () { a.apply(e, t) }, n || 0) }))
    } function l() {
        document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || (console.log("pressed"),
            o("body").removeClass("fullscreen-enable"))
    } o("#side-menu").metisMenu(), o(".vertical-menu-btn").on("click", function (e) {
        e.preventDefault(), o("body").toggleClass("sidebar-enable"),
            992 <= o(window).width() ? o("body").toggleClass("vertical-collpsed") : o("body").removeClass("vertical-collpsed")
    }), o("#sidebar-menu a").each(function () {
        var e = window.location.href.split(/[?#]/)[0]; this.href == e && (o(this).addClass("active"),
            o(this).parent().addClass("mm-active"), o(this).parent().parent().addClass("mm-show"), o(this).parent().parent().prev().addClass("mm-active"), o(this).parent().parent().parent().addClass("mm-active"), o(this).parent().parent().parent().parent().addClass("mm-show"), o(this).parent().parent().parent().parent().parent().addClass("mm-active"))
    }),
        o(document).ready(function () {
            var e; 0 < o("#sidebar-menu").length && 0 < o("#sidebar-menu .mm-active .active").length && (300 < (e = o("#sidebar-menu .mm-active .active").offset().top) && (e -= 300, o(".simplebar-content-wrapper").animate({ scrollTop: e }, "slow")))
        }), o('[data-toggle="fullscreen"]').on("click", function (e) {
            e.preventDefault(), o("body").toggleClass("fullscreen-enable"),
                document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ? document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }), document.addEventListener("fullscreenchange", l),
        document.addEventListener("webkitfullscreenchange", l),
        document.addEventListener("mozfullscreenchange", l),
        o(".navbar-nav a").each(function () {
            var e = window.location.href.split(/[?#]/)[0];
            this.href == e && (o(this).addClass("active"),
                o(this).parent().addClass("active"),
                o(this).parent().parent().addClass("active"),
                o(this).parent().parent().parent().addClass("active"),
                o(this).parent().parent().parent().parent().addClass("active"),
                o(this).parent().parent().parent().parent().parent().addClass("active"))
        }), o(".right-bar-toggle").on("click", function (e) {
            o("body").toggleClass("right-bar-enabled")
        }), o(document).on("click", "body", function (e) {
            0 < o(e.target).closest(".right-bar-toggle, .right-bar").length || o("body").removeClass("right-bar-enabled")
        }), o(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
            return o(this).next().hasClass("show") || o(this).parents(".dropdown-menu").first().find(".show").removeClass("show"), o(this).next(".dropdown-menu").toggleClass("show"), !1
        }), function () {
            o(function () { o('[data-toggle="tooltip"]').tooltip() }), o(function () {
                o('[data-toggle="popover"]').popover()
            }); var a = o(this).attr("data-delay") ? o(this).attr("data-delay") : 100,
                n = o(this).attr("data-time") ? o(this).attr("data-time") : 1200; o('[data-plugin="counterup"]').each(function (e, t) {
                    o(this).counterUp({ delay: a, time: n })
                })
        }(),
        window.sessionStorage && ((e = sessionStorage.getItem("is_visited")) ? (o(".right-bar input:checkbox").prop("checked", !1),
            o("#" + e).prop("checked", !0),
            s(e)) : sessionStorage.setItem("is_visited", "light-mode-switch")),
        o("#light-mode-switch, #dark-mode-switch, #rtl-mode-switch").on("change", function (e) {
            s(e.target.id)
        }), o(window).on("load", function () {
            o("#status").fadeOut(),
                o("#preloader").delay(350).fadeOut("slow")
        }),
        Waves.init(),
        o("#checkAll").on("change", function () {
            o(".table-check .custom-control-input").prop("checked", o(this).prop("checked"))
        }), o(".table-check .custom-control-input").change(function () {
            o(".table-check .custom-control-input:checked").length == o(".table-check .custom-control-input").length ? o("#checkAll").prop("checked", !0) : o("#checkAll").prop("checked", !1)
        }),
        c(),
        o(".language").on("click", function (e) {
            n(o(this).attr("data-lang"))
        }), o(function () { feather.replace() })
}(jQuery);


document.onreadystatechange = function () {
    console.log("onreadystatechange");
    console.log(document.readyState);
    if (document.readyState === "interactive") {
        BlockUI();
    } else if (document.readyState === "complete") {
        setTimeout(function () {
            $.unblockUI();
        }, 500);
    }
};

window.addEventListener('beforeunload', function (e) {
    BlockUI();
});

async function handleApiRequest(url, options) {
    BlockUI();

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status: ${response.status}\n${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    } finally {
        $.unblockUI();
    }
}

function configureXhr() {
    var xhr = new window.XMLHttpRequest();

    xhr.addEventListener("progress", function (evt) {
        BlockUI();
        console.log("progress start");
        console.log(evt);
        console.log(evt.lengthComputable);
        if (evt.lengthComputable) {
            var percentComplete = (evt.loaded / evt.total) * 100;
            console.log("Progress: " + percentComplete.toFixed(2) + "%");
            if (percentComplete >= 100) {
                $.unblockUI();
            } else {
                BlockUI();
            }
        }
    }, false);

    xhr.addEventListener("load", function () {
        console.log("Request completed. 100% progress.");
        $.unblockUI();
    }, false);

    return xhr;
}

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById('preferedVisitTime');
    const timeInput = document.getElementById('time');

    console.log('dateInput:' + dateInput);

    // Function to validate and combine the date and time
    function validateAndCombineDateTime() {
        const selectedDate = dateInput.value; // Get the selected date from the input
        const selectedTime = timeInput.value; // Get the selected time from the dropdown

        // If either date or time is not selected, show an error message
        if (!selectedDate || !selectedTime) {
            return; // Don't do anything if date or time is missing
        }

        // Combine date and time into a single DateTime string
        const combinedDateTime = `${selectedDate} ${selectedTime}`;

        // Convert the combined string to a JavaScript Date object
        const dateTimeObj = new Date(combinedDateTime);

        // Check if the Date is valid
        if (isNaN(dateTimeObj)) {
            alert('Invalid date or time format.');
            return;
        }

        // Check if the date-time is less than today (before 9:00 AM today)
        if (isDateLessThanToday(combinedDateTime)) {
            alert('Visit time cannot be in the past, and current day visit should be after 9 AM.');
            return;
        }

        // Now, dateTimeObj holds the combined DateTime and you can send it to the API or perform validation
        console.log('Selected Date and Time:', dateTimeObj);
    }

    function isDateLessThanToday(dateString) {
        var selectedDate = new Date(dateString);
        var today = new Date();

        // Reset today's date to compare only the date portion (no time)
        today.setHours(0, 0, 0, 0);

        // If the selected date is today, check if the time is before 9:00 AM
        if (selectedDate.toDateString() === today.toDateString()) {
            var nineAM = new Date(today);
            nineAM.setHours(9, 0, 0, 0); // Set the time to 9:00 AM

            // Allow registration at or after 9:00 AM today
            if (selectedDate < nineAM) {
                return true;  // Invalid if it's before 9 AM today
            }
        }

        // If it's a future date, it's always valid
        return false; // Valid if it's a future date
    }

    if (dateInput !== null) {
        // Date input change event
        dateInput.addEventListener("change", function () {
            console.log('Date input change event');
            validateAndCombineDateTime(); // Validate and combine when the date is changed
        });
    }

    if (timeInput !== null) {
        // Time input change event
        timeInput.addEventListener("change", function () {
            validateAndCombineDateTime(); // Validate and combine when the time is changed
        });
    }

});



$(document).ajaxSend(function (event, jqXHR, settings) {
    console.log("AJAX Request URL:", settings.url);
});

function showAlert(type, message) {
    let alertContainer = document.getElementById("msg");

    // Create the alert HTML
    let alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>`;

    // Replace the alert instead of appending
    alertContainer.innerHTML = alertHtml;

    alertContainer.style.display = "block";

    // Auto-dismiss alert after 3 seconds
    setTimeout(() => {
        let alertDiv = alertContainer.querySelector(".alert");
        if (alertDiv) {
            alertDiv.classList.remove("show");
            setTimeout(() => alertDiv.remove(), 500); // Allow fade-out animation
        }
    }, 3000);
}

var timeOptions = '';

$(document).ready(function () {
    //var timeOptions = "";

    // Generate time options
    for (var hour = 9; hour <= 18; hour++) {
        for (var minute = 0; minute < 60; minute += 30) {
            if (hour === 18 && minute === 30) break;  // stop after 6:00 PM
            var hour12 = hour > 12 ? hour - 12 : hour;
            var ampm = hour >= 12 ? 'PM' : 'AM';
            var time = (hour12 < 10 ? '0' : '') + hour12 + ':' + (minute === 0 ? '00' : '30') + ' ' + ampm;
            timeOptions += '<option value="' + time + '">' + time + '</option>';
        }
    }

    $(".datetime-restrict").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0,
        onSelect: function (dateText) {
            filterTimeSlots(dateText);
        }
    });

    $('.timedropdwon').html(timeOptions); // Initially populate all

    function filterTimeSlots(selectedDate) {
        const now = new Date();
        const selected = new Date(selectedDate);
        const isToday = selected.toDateString() === now.toDateString();
        const timeDropdown = $('.timedropdwon');
        timeDropdown.empty();

        // Re-generate filtered options
        for (var hour = 9; hour <= 18; hour++) {
            for (var minute = 0; minute < 60; minute += 30) {
                if (hour === 18 && minute === 30) break;

                var dateTimeOption = new Date(selectedDate);
                dateTimeOption.setHours(hour, minute, 0, 0);

                if (isToday && dateTimeOption <= now) {
                    continue; // Skip past times for today
                }

                var hour12 = hour > 12 ? hour - 12 : hour;
                var ampm = hour >= 12 ? 'PM' : 'AM';
                var time = (hour12 < 10 ? '0' : '') + hour12 + ':' + (minute === 0 ? '00' : '30') + ' ' + ampm;
                timeDropdown.append('<option value="' + time + '">' + time + '</option>');
            }
        }
    }

    $('#submitBtn').click(function () {
        var selectedDate = $('#date').val();
        var selectedTime = $('.timedropdwon').val();

        if (selectedDate && selectedTime) {
            var dateTime = selectedDate + ' ' + selectedTime;
            alert("Selected Date and Time: " + dateTime);
        } else {
            alert("Please select both date and time.");
        }
    });

    $('#selectAllBtn').on('click', function () {
        var allOptions = [];
        $('.select2 option').each(function () {
            var val = $(this).val();
            if (val !== "0" && val !== "") { // exclude empty or "0"
                allOptions.push(val);
            }
        });
        $('.select2').val(allOptions).trigger('change');
    });
});
