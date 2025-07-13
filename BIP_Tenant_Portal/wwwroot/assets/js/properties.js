$(document).ready(function () {
    $.ajax({
        url: WebApiUrl + '/api/Properties/GetPropertyByUser/' + UserID,
        method: 'GET',
        success: function (data) {
            var dropdown = $('#propertyDropdown');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.propertyName, item.propertyID));
            });
        },
        error: function () {
            alert('Failed to load properties.');
        }
    });

    $('#propertyDropdown').change(function () {
        var propertyId = $(this).val();
        var dropdown = $('#BuildingCodeDropdown');

        dropdown.empty();
        //dropdown.append(new Option("--Select Building Code--", ""));

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
});