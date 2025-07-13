$(document).ready(function () {

    funShowIdCardPart("hide");
    $('#VATfileAttachedLabelDiv').hide();

    $('#flatIDDropdown').change(function () {
        flatIDDropdownChangeEvent();
    });

    flatIDDropdownChangeEvent();

    function flatIDDropdownChangeEvent() {
        var propertyId = $('#BuildingCodeIDDropdown').val();
        //var flatId = $('#flatIDDropdown').val();

        var flatIdArray = $('#flatIDDropdown').val(); // This will be an array
        console.log(flatIdArray);
        console.log(Array.isArray(flatIdArray));
        var flatId = Array.isArray(flatIdArray) ? flatIdArray[0] : flatIdArray;

        console.log('flatId:' + flatId);

        funShowIdCardPart("hide");
        if (flatId !== '' && flatId !== '0' && flatId !== undefined) {
            $.ajax({
                url: WebApiUrl + '/api/Flats/GetFlatsByPropertyAndFlat/' + propertyId + '/' + flatId,
                method: 'GET',
                success: function (data) {
                    console.log(data);
                    if (data.flatType && data.flatType === "Residential") {
                        funShowIdCardPart("show");
                        funResidential();
                        $('#spanPropertyType').text("Residential").show();
                    }
                    else if (data.flatType && data.flatType === "Commercial") {
                        funShowIdCardPart("show");
                        funCommercial();
                        $('#spanPropertyType').text("Commercial").show();
                        $('#VATfileAttachedLabelDiv').show();
                    }
                    else {
                        $('#spanPropertyType').hide();
                    }
                },
                error: function () {
                    funShowIdCardPart("hide");
                    //alert('Failed to load flat dropdown.');
                }
            });
        }
    }

    $('#LeaseType').change(function () {
        LeaseTypeChangeEvent();
    });

    function LeaseTypeChangeEvent() {
        if ($('#LeaseType').val() === "Personal") {
            funShowIdCardPart("show");
            funResidential();
        }
        else {
            funShowIdCardPart("show");
            funCommercial();
        }
    }

    $('#idExpiryDateText').change(function () {
        var expiryDateText = $('#idExpiryDateText').val();

        if (expiryDateText != '' && isValidDate(expiryDateText)) {
            if (isDateLessThanToday(expiryDateText)) {
                alert('Expiry Date cannot be past date.');
            }
        }
        else {
            alert('Please provide a valid "Expiry Date".');
        }
    });
    $('#CRExpiryDateText').change(function () {
        var expiryDateText = $('#CRExpiryDateText').val();

        if (expiryDateText != '' && isValidDate(expiryDateText)) {
            if (isDateLessThanToday(expiryDateText)) {
                alert('Expiry Date cannot be past date.');
            }
        }
        else {
            alert('Please provide a valid "Expiry Date".');
        }
    });
});
function funResidential() {
    $("#employeeIdDiv").show();
    $("#idCardLabel").text("Civil ID Number");
    $("#idExpiryDateLabel").text("Civil ID Expiry Date");

    $("#CRNumberLabelDiv").hide();
    $("#CRExpiryDateLabelDiv").hide();
    $("#CRfileAttachedLabelDiv").hide();
}
function funCommercial() {
    $("#employeeIdDiv").hide();
    $("#idCardLabel").text("Authorized Signatory ID");
    $("#idExpiryDateLabel").text("Authorized Signatory ID Expiry Date");

    $("#CRNumberLabelDiv").show();
    $("#CRExpiryDateLabelDiv").show();
    $("#CRfileAttachedLabelDiv").show();
}
function funShowIdCardPart(value) {
    console.log(value);
    if (value === 'show') {
        $("#idCardLabelDiv").show();
        $("#idExpiryDateLabelDiv").show();
        $("#idCardfileAttachedLabelDiv").show();

        $("#CRNumberLabelDiv").show();
        $("#CRExpiryDateLabelDiv").show();
        $("#CRfileAttachedLabelDiv").show();
    }
    else {
        $("#idCardLabelDiv").hide();
        $("#idExpiryDateLabelDiv").hide();
        $("#idCardfileAttachedLabelDiv").hide();

        $("#CRNumberLabelDiv").hide();
        $("#CRExpiryDateLabelDiv").hide();
        $("#CRfileAttachedLabelDiv").hide();

        $("#employeeIdDiv").hide();
    }
}

function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}
function isValidDateFormat(dateString) {
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
}

function isDateLessThanToday(inputDate) {
    var today = new Date();
    var comparisonDate = new Date(inputDate);

    today.setHours(0, 0, 0, 0);
    comparisonDate.setHours(0, 0, 0, 0);

    return comparisonDate < today;
}