$(document).ready(function () {

    $('#PasswordHashTxt').focus(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 50 // Adjust the offset as needed
        }, 300); // Adjust the animation speed in milliseconds
    });

    $.ajax({
        url: WebApiUrl + '/api/Properties',
        method: 'GET',
        success: function (data) {
            var dropdown = $('#PropertyDropdown');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.propertyName, item.propertyID));
            });
        },
        error: function () {
            alert('Failed to load properties dropdown.');
        }
    });

    $.ajax({
        url: WebApiUrl + '/api/ServiceMainCategory',
        method: 'GET',
        success: function (data) {
            var dropdown = $('#CategoryIDDropdown');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.mainCategoryName, item.mainCategoryID));
            });
        },
        error: function () {
            alert('Failed to load category dropdown.');
        }
    });
    
});


