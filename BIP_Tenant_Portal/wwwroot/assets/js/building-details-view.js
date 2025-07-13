$(document).ready(function () {
   
    $.ajax({
        url: WebApiUrl + '/api/PropertyBuildingCodes/GetBuildingCodesByProperty/' + $('#PropertyID').val(),
        method: 'GET',
        success: function (response) {
            $("#propertyBadgeContainer").empty();
            response.forEach(function (value) {
                let badge = $("<span class='badge badge-primary mr-1'></span>").text(value.buildingCode.trim());
                $("#propertyBadgeContainer").append(badge);
            });
        },
        error: function (a, b, c) {
            console.error(a);
            console.error(b);
            console.error(c);
        }
    });
});