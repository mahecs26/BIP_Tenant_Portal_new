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
        BuildingCodeIDDropdownChangeEvent();
    });

    function BuildingCodeIDDropdownChangeEvent() {
        $('#spanPropertyType').hide();
        var propertyId = $('#BuildingCodeIDDropdown').val();
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
    }
});


