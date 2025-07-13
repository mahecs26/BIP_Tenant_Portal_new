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