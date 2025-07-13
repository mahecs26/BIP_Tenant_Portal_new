$(document).ready(function () {

    $('#MobileTxt').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
    });
   
});

$(document).ready(function () {

    $('#idbtnTechUserCreate').on('click', function () {
        var frmDate = $('#conStartDate').val();
        var toDate = $('#conEndDate').val();
        if (!frmDate || !isValidDateFormat(frmDate) || !isValidDate(frmDate)) {
            alert('Please provide a valid "Start Date".');
            return false;
        }

        if (!toDate || !isValidDateFormat(toDate) || !isValidDate(toDate)) {
            alert('Please provide a valid "End Date".');
            return false;
        }

        if (new Date(frmDate) > new Date(toDate)) {
            alert('The "Start Date" cannot be later than the "End Date".');
            return false;
        }
        if (new Date(toDate) < new Date(frmDate)) {
            alert('The "End Date" cannot be past than the "Start Date".');
            return false;
        }
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

});

