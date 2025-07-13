$(document).ready( function () {
   
    $.ajax({
        url: WebApiUrl + '/api/Users/Technician',
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
function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
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
    var resourceId = $('#ResourceIDDropdown').val();
    
    console.log('From Date:', frmDate);
    console.log('To Date:', toDate);
    console.log('Resource ID:', resourceId);

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
        url: WebApiUrl + "/api/Report/StaffReport?fromDate=" + frmDate + "&toDate=" + toDate + "&technicianName=" + resourceId,
        success: function (data) {
            $('#usersTable').DataTable({
                data: data,
                destroy: true,
                columns: [
                    { data: 'assignmentID' },
                    { data: 'serviceRequestNumber' },
                    { data: 'technicianName' },
                    { data: 'propertyName' },
                    { data: 'flatNumber' },
                    { data: 'categoryType' },
                    { data: 'raisedOn' },
                    { data: 'status' },
                    { data: 'durationFromRaisedOn' },
                    { data: 'statusChangedOn' },
                    { data: 'description' }
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