$(document).ready(function () {
    $('#PasswordHashTxt').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#PasswordHashTxt').focus(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 50 // Adjust the offset as needed
        }, 300); // Adjust the animation speed in milliseconds
    });


    $('#PropertyDropdown').change(function () {
        $('#spanPropertyType').hide();

        var dropdown2 = $('#flatIDDropdown');
        dropdown2.empty();
        dropdown2.append(new Option("--Select Unit Number--", ""));

        var propertyId = $(this).val();
        var dropdown = $('#BuildingCodeIDDropdown');

        dropdown.empty();
        dropdown.append(new Option("--Select Building Code--", ""));

        if (propertyId != '') {
            $.ajax({
                url: WebApiUrl + '/api/PropertyBuildingCodes/GetBuildingCodesByProperty/' + propertyId,
                method: 'GET',
                success: function (data) {
                    $.each(data, function (index, item) {
                        dropdown.append(new Option(item.buildingCode, item.buildingCodeID));
                    });
                },
                error: function () {
                    alert('Failed to load Building Code dropdown.');
                }
            });
        }
    });

    $('#BuildingCodeIDDropdown').change(function () {
        $('#spanPropertyType').hide();
        var propertyId = $(this).val();
        var dropdown = $('#flatIDDropdown');

        dropdown.empty();
        dropdown.append(new Option("--Select Unit Number--", ""));

        if (propertyId != '') {
            $.ajax({
                url: WebApiUrl + '/api/Flats/GetFlatsByPropertyTenantCreation/' + propertyId,
                method: 'GET',
                success: function (data) {
                    $.each(data, function (index, item) {
                        dropdown.append(new Option(item.flatNumber, item.flatID));
                    });
                },
                error: function () {
                    alert('Failed to load flat dropdown.');
                }
            });
        }
    });

    $('#flatIDDropdown').change(function () {

        var flatIdArray = $(this).val(); // This will be an array
        console.log(flatIdArray);
        console.log(Array.isArray(flatIdArray));
        var flatId = Array.isArray(flatIdArray) ? flatIdArray[0] : flatIdArray;

        console.log('flatId:' + flatId);

        if (flatId !== '' && flatId !== '0' && flatId !== undefined) {
            $.ajax({
                url: WebApiUrl + '/api/Users/GetUserByFlatId/' + flatId,
                method: 'GET',
                success: function (data) {
                    console.log(data);
                    if (data.userStatus == 'Active') {
                        $("#AddUser").attr("disabled", "disabled").css("cursor", "not-allowed").prop("disabled", true);
                        showAlert('danger', 'Error! Tenant already active in this unit. Please deactivate the existing tenant. Name: ' + data.fullName);
                    }
                    else {
                        $("#AddUser").removeAttr("disabled", "disabled").css("cursor", "").prop("disabled", false);
                    }
                },
                error: function (a) {
                    console.log(a);
                }
            });
        }
        else {
            $("#AddUser").removeAttr("disabled", "disabled").css("cursor", "").prop("disabled", false);
        }
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
});


