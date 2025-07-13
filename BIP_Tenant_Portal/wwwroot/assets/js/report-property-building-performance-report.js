// Toggle custom date range visibility based on selected option
document.getElementById("DateRangeType").addEventListener("change", function () {
    var dateRangeType = this.value;
    var customStartDateRange = document.getElementById("CustomStartDateRange");
    var customEndDateRangeDiv = document.getElementById("CustomEndDateRange");

    if (dateRangeType === "Custom") {
        customStartDateRange.style.display = "block";
        customEndDateRangeDiv.style.display = "block";
    } else {
        customStartDateRange.style.display = "none";
        customEndDateRangeDiv.style.display = "none";
    }
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

$('#btnRetreive').on('click', function () {
    var dateRangeType = $('#DateRangeType').val();  // Get the selected Date Range type
    var frmDate, toDate;

    // Determine the fromDate and toDate based on the selected Date Range
    if (dateRangeType === 'Daily') {
        frmDate = toDate = new Date().toISOString().split('T')[0]; // Today's date for both From and To
    } else if (dateRangeType === 'Weekly') {
        frmDate = getStartOfWeek(new Date());  // Get the start of the current week
        toDate = getEndOfWeek(frmDate);  // Get the end of the current week
    } else if (dateRangeType === 'Monthly') {
        frmDate = getFirstOfMonth(new Date());  // Get the first day of the current month
        toDate = getLastOfMonth(frmDate);  // Get the last day of the current month
    } else if (dateRangeType === 'Yearly') {
        frmDate = getFirstOfYear(new Date());  // Get the first day of the current year
        toDate = getLastOfYear(frmDate);  // Get the last day of the current year
    } else if (dateRangeType === 'Custom') {
        // Here you can use the custom date inputs or any custom logic for this option
        // You can add input fields for "fromDate" and "toDate" or use another logic if needed
        frmDate = $('#StartDate').val();
        toDate = $('#EndDate').val();
    }

    var propertyDropdown = $('#PropertyDropdown').val();

    console.log('From Date:', frmDate);
    console.log('To Date:', toDate);
    console.log('Property:', propertyDropdown);

    // Validate From Date
    if (!frmDate || !isValidDateFormat(frmDate) || !isValidDate(frmDate)) {
        alert('Please provide a valid "From Date".');
        return false;
    }

    // Validate To Date
    if (!toDate || !isValidDateFormat(toDate) || !isValidDate(toDate)) {
        alert('Please provide a valid "To Date".');
        return false;
    }

    // Ensure From Date is not later than To Date
    if (new Date(frmDate) > new Date(toDate)) {
        alert('The "From Date" cannot be later than the "To Date".');
        return false;
    }

    // Make the AJAX request to fetch the data
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Report/PropertySummaryReport",
        data: {
            fromDate: frmDate,
            toDate: toDate,
            propertyID: propertyDropdown,
        },
        success: function (data) {
            // Initialize DataTable with the received data
            $('#usersTable').DataTable({
                data: data,
                destroy: true, // Allows re-initialization
                columns: [
                    { data: 'propertyName' },
                    { data: 'totalComplaints' },
                    { data: 'totalWorkingHours' },
                    { data: 'avgResolutionHours' }
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

// Helper functions to validate the date format and check for a valid date
function isValidDateFormat(date) {
    var regex = /^\d{4}-\d{2}-\d{2}$/; // Checks for YYYY-MM-DD format
    return regex.test(date);
}

function isValidDate(date) {
    if (!isValidDateFormat(date)) return false;

    var parts = date.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // JavaScript months: 0-11
    var day = parseInt(parts[2], 10);

    var parsedDate = new Date(year, month, day);

    return parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month &&
        parsedDate.getDate() === day;
}



// Helper function to get the start of the week (Sunday)
function getStartOfWeek(date) {
    var currentDate = new Date(date);
    var day = currentDate.getDay(),
        diff = currentDate.getDate() - day; // Get the date of the previous Sunday
    currentDate.setDate(diff);
    return currentDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

// Helper function to get the end of the week (Saturday)
function getEndOfWeek(startDate) {
    var currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 6); // Add 6 days to get the Saturday of the week
    return currentDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

// Helper function to get the first day of the month
function getFirstOfMonth(date) {
    var currentDate = new Date(date);
    currentDate.setDate(1); // Set to the first day of the month
    return currentDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

// Helper function to get the last day of the month
function getLastOfMonth(date) {
    var currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
    currentDate.setDate(0); // Set to the last day of the current month
    return currentDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

// Helper function to get the first day of the year
function getFirstOfYear(date) {
    var currentDate = new Date(date);
    currentDate.setMonth(0); // Set to January
    currentDate.setDate(1); // Set to the first day of the month
    return currentDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

// Helper function to get the last day of the year
function getLastOfYear(date) {
    var currentDate = new Date(date);
    currentDate.setMonth(11); // Set to December
    currentDate.setDate(31); // Set to the last day of the month
    return currentDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}
