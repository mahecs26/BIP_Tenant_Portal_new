$(document).ready(function () {
    $.ajax({
        url: WebApiUrl + '/api/Users/TechnicianForAssign',
        method: 'GET',
        success: function (data) {
            var dropdown = $('#ResourceIDDropdown');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.fullName, item.userID));
            });
        },
        error: function () {
            alert('Failed to load resource dropdown.');
        }
    });
});