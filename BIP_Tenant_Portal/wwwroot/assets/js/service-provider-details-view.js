$(document).ready(function () {
    let userId = $('#UserID').val();
    // Fetch distinct property names
    $.ajax({
        url: WebApiUrl + `/api/Users/GetDistinctPropertyNames/${userId}`,
        type: "GET",
        success: function (response) {
            console.log(response);
            $("#propertyBadgeContainer").empty();
            response.forEach(function (value) {
                let badge = $("<span class='badge badge-primary mr-1'></span>").text(value.trim());
                $("#propertyBadgeContainer").append(badge);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching property names:", error);
        }
    });

    // Fetch distinct category types
    $.ajax({
        url: WebApiUrl + `/api/Users/GetDistinctCategoryTypes/${userId}`,
        type: "GET",
        success: function (response) {
            $("#categoryBadgeContainer").empty();
            response.forEach(function (value) {
                let badge = $("<span class='badge badge-success mr-1'></span>").text(value.trim());
                $("#categoryBadgeContainer").append(badge);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching category types:", error);
        }
    });
});