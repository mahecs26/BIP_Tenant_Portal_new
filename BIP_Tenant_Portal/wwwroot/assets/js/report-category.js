$(document).ready(function () {

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
function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}
function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}
// Validate date format YYYY-MM-DD
function isValidDateFormat(dateString) {
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
}

// Button click (or submit) event handler
$('#btnRetreive').on('click', function () {
    var frmDate = $('#fromDate').val();
    var toDate = $('#toDate').val();
    var categoryIDDropdown = $('#CategoryIDDropdown').val();

    console.log('From Date:', frmDate);
    console.log('To Date:', toDate);
    console.log('categoryIDDropdown :', categoryIDDropdown);

    if (!frmDate || !isValidDateFormat(frmDate) || !isValidDate(frmDate)) {
        alert('Please provide a valid "From Date".');
        return false;
    }

    if (!toDate || !isValidDateFormat(toDate) || !isValidDate(toDate)) {
        alert('Please provide a valid "To Date".');
        return false;
    }

    if (new Date(frmDate) > new Date(toDate)) {
        alert('The "From Date" cannot be later than the "To Date".');
        return false;
    }

    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Report/CategoryReport?fromDate=" + frmDate + "&toDate=" + toDate + "&categoryID=" + categoryIDDropdown ,
        success: function (data) {
            $('#usersTable').DataTable({
                data: data,
                destroy: true,
                columns: [
                    { data: 'queryID' },
                    { data: 'serviceRequestNumber' },
                    //{ data: 'technicianName' },
                    { data: 'tenantName' },
                    { data: 'flatNumber' },
                    { data: 'propertyName' },
                    { data: 'description' },
                    { data: 'categoryType' },
                    { data: 'raisedOn' },
                    { data: 'status' },
                    { data: 'durationFromRaisedOn' },
                    { data: 'statusChangedOn' }
                ],
                dom: 'Bfrtip', // Defines the placement of buttons
                buttons: [
                    'excelHtml5', // Excel Export
                    'csvHtml5'   // CSV Export
                ]
            });
        },
        error: function () {
            alert('Failed to load the report at this moment.');
        }
    });

});