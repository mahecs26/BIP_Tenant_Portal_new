!function () {
    "use strict";
    window.addEventListener("load", function () {
        var forms = document.getElementsByClassName("needs-validation");
        console.log("Forms found:", forms.length);

        Array.prototype.filter.call(forms, function (form) {
            console.log("Attaching submit event to form:", form);
            form.addEventListener("submit", function (event) {
                if (!form.checkValidity()) {
                    console.log("Form validation failed");
                    event.preventDefault();
                    event.stopPropagation();

                    // Find the first invalid field
                    var firstInvalidField = form.querySelector(":invalid");
                    if (firstInvalidField) {
                        console.log("First invalid field found:", firstInvalidField);
                        firstInvalidField.focus();

                        // Scroll smoothly to the field with more offset
                        var fieldPosition = firstInvalidField.getBoundingClientRect().top + window.scrollY;
                        var scrollOffset = 200; // Increased to 200px for better visibility
                        console.log("Scrolling to position:", fieldPosition - scrollOffset);
                        window.scrollTo({ top: fieldPosition - scrollOffset, behavior: "smooth" });
                    } else {
                        console.log("No invalid field found!");
                    }
                } else {
                    console.log("Form validation passed");
                }

                form.classList.add("was-validated");
            }, false);
        });
    }, false);
}();

$(document).ready(function () {
    console.log("jQuery Ready - Initializing Parsley");

    $(".custom-validation").parsley();

    $(".custom-validation").on("form:validate", function (event) {
        console.log("Parsley validation triggered");

        var $firstInvalidField = $(this).find(":input.parsley-error").first();
        if ($firstInvalidField.length) {
            console.log("First invalid field found by Parsley:", $firstInvalidField[0]);
            $firstInvalidField.focus();

            // Scroll smoothly to the field with more offset
            var fieldPosition = $firstInvalidField.offset().top;
            var scrollOffset = 200; // Increased to 200px for better visibility
            console.log("Scrolling to position:", fieldPosition - scrollOffset);
            $("html, body").animate({ scrollTop: fieldPosition - scrollOffset }, 500);
        } else {
            console.log("No invalid field found by Parsley!");
        }
    });
});
