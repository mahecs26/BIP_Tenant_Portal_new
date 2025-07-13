
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
    var propertyID = $('#PropertyDropdown').val();
    var flatID = $('#flatIDDropdown').val();

   
    if (!isNumeric(flatID)) {
        flatID = 0;
    }
    console.log('From Date:', frmDate);
    console.log('To Date:', toDate);
    console.log('propertyID :', propertyID);
    console.log('flatIDDropdown :', flatID);

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
        url: WebApiUrl + "/api/Report/PropertyReport?fromDate=" + frmDate + "&toDate=" + toDate + "&propertyID=" + propertyID + "&flatID=" + flatID,
        success: function (data) {
            $('#usersTable').DataTable({
                data: data,
                destroy: true,
                columns: [
                    { data: 'queryID' },
                    { data: 'serviceRequestNumber' },
                    //{ data: 'technicianName' },
                    { data: 'propertyName' },
                    { data: 'flatNumber' },
                    { data: 'tenantName' },
                    { data: 'categoryType' },
                    { data: 'raisedOn' },
                    { data: 'status' },
                    { data: 'durationFromRaisedOn' },
                    { data: 'statusChangedOn' },
                    //{ data: 'description' },
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