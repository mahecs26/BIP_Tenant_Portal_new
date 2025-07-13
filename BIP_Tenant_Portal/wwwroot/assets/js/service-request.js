$(document).ready(function () {
    var hiddenPreviousServiceRequestNumber = $("#hiddenPreviousServiceRequestNumber").val();
    if (hiddenPreviousServiceRequestNumber && hiddenPreviousServiceRequestNumber != 'Empty') {

        showModal();
    }
    function showModal() {
        //$('#generatedPassword').val(password);
        modalInstance = new bootstrap.Modal(document.getElementById('requestSuccessModal'));
        modalInstance.show();
    }
    $('#PropertyDropdown').change(function () {
        var propertyId = $(this).val();
        //var dropdown = $('#flatIDDropdown');

        //dropdown.empty();
        //dropdown.append(new Option("--Select Flat--", ""));

        if (propertyId != '') {
            $.ajax({
                url: WebApiUrl + '/api/Flats/GetFlatsByProperty/' + propertyId,
                method: 'GET',
                success: function (data) {
                    console.log(data);
                    //$.each(data, function (index, item) {
                    //    dropdown.append(new Option(item.flatNumber, item.flatID));
                    //});
                    var id = 0;
                    $.each(data, function (index, item) {
                        console.log(item.flatID);
                        if (id == 0) {
                            $('#FlatID').val(item.flatID);
                        }
                        id++;
                    });
                },
                error: function () {
                    alert('Failed to load flat dropdown.');
                }
            });
        }
    });


    $.ajax({
        url: WebApiUrl + '/api/Properties/GetPropertyByUser/' + UserID,
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

    $('#flatIDDropdown').change(function () {
        var flatId = $(this).val();
        $('#FullNameTxt').val('');

        if (flatId != '') {
            $.ajax({
                url: WebApiUrl + '/api/Users/GetUserByFlatId/' + flatId,
                method: 'GET',
                success: function (data) {
                    $('#FullNameTxt').val(data.fullName);
                    $('#TenantID').val(data.userID);
                },
                error: function () {
                    alert('No tenants found');
                }
            });
        }
    });

    $.ajax({
        url: WebApiUrl + '/api/ServiceCategories',
        method: 'GET',
        success: function (data) {
            var dropdown = $('#CategoryIDDropdown');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.categoryType, item.categoryID));
            });
        },
        error: function () {
            alert('Failed to load category dropdown.');
        }
    });

    
});



$(document).ready(function () {
    $('#mainCategory').change(function () {
        var mainCategoryId = $(this).val();

        // Clear and show loading message
        $('#subCategory').empty().append('<option value="">-- Loading... --</option>');

        if (mainCategoryId) {
            $.ajax({
                url: WebApiUrl + '/api/ServiceCategories/GetSubCategories', // Update path as needed
                type: 'GET',
                data: { mainCategoryId: mainCategoryId },
                success: function (data) {
                    $('#subCategory').empty().append('<option value="">-- Select Sub Category --</option>');
                    $.each(data, function (index, item) {
                        $('#subCategory').append(
                            $('<option>', {
                                value: item.value,
                                text: item.text
                            })
                        );
                    });
                },
                error: function () {
                    $('#subCategory').empty().append('<option value="">-- Error loading subcategories --</option>');
                }
            });
        } else {
            $('#subCategory').empty().append('<option value="">-- Select Sub Category --</option>');
        }
    });
});