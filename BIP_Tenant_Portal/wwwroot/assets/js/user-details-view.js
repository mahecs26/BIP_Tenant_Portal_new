$(document).ready(function () {
   
    $('#aShowDocument').click(function () {
        //const password = generatePassword();
        showModal();
    });
    function showModal() {
        //$('#generatedPassword').val(password);
        modalInstance = new bootstrap.Modal(document.getElementById('documentViewModal'));
        modalInstance.show();
    }

    $.ajax({
        url: WebApiUrl + '/api/Flats/' + $('#FlatID').val(),
        method: 'GET',
        success: function (data) {
            $('#spanFlatID').text(data.flatNumber);
            $('#spanPropertyType').text(data.flatType);
        },
        error: function (a, b, c) {
            console.error(a);
            console.error(b);
            console.error(c);
        }
    });

    

    $.ajax({
        url: WebApiUrl + '/api/PropertyBuildingCodes/' + $('#BuildingCodeID').val(),
        method: 'GET',
        success: function (data) {
            $('#spanBuildingCodeID').text(data.buildingCode);

            $.ajax({
                url: WebApiUrl + '/api/Properties/' + data.propertyID,
                method: 'GET',
                success: function (data1) {
                    $('#spanPropertyID').text(data1.propertyName);
                    $('#PropertyID').val(data.propertyID);
                },
                error: function (a, b, c) {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                }
            });

        },
        error: function (a, b, c) {
            console.error(a);
            console.error(b);
            console.error(c);
        }
    });
});