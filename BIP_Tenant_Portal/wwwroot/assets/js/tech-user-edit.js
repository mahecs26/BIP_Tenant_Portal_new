$(document).ready(function () {

    let userId = $('#UserID').val();
    // Fetch distinct property names
    $.ajax({
        url: WebApiUrl + `/api/Users/GetDistinctPropertyNames/${userId}`,
        type: "GET",
        success: function (response) {
            console.log(response);
            $.ajax({
                url: WebApiUrl + '/api/Properties',
                method: 'GET',
                success: function (data) {
                    console.log(data);
                    var dropdown = $('#PropertyDropdown');
                    dropdown.empty(); // optional: clear existing options

                    $.each(data, function (index, item) {
                        var option = new Option(item.propertyName, item.propertyID);

                        if (response.includes(item.propertyName)) {
                            option.selected = true;
                        }

                        dropdown.append(option);
                    });

                    // If you're using a plugin like Select2 or Bootstrap Select, refresh it here
                    // $('#PropertyDropdown').trigger('change'); // optional
                },
                error: function () {
                    alert('Failed to load properties dropdown.');
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching property names:", error);
        }
    });

    // Fetch distinct category types
    $.ajax({
        url: WebApiUrl + `/api/Users/GetDistinctCategoryTypes/${userId}`,
        type: "GET",
        success: function (response) {
            console.log(response);
            $.ajax({
                url: WebApiUrl + '/api/ServiceMainCategory',
                method: 'GET',
                success: function (data) {
                    var dropdown = $('#CategoryIDDropdown');
                    dropdown.empty(); // optional: clear existing options

                    $.each(data, function (index, item) {
                        var option = new Option(item.mainCategoryName, item.mainCategoryID);

                        if (response.includes(item.mainCategoryName)) {
                            option.selected = true;
                        }

                        dropdown.append(option);
                    });

                    // If using a dropdown plugin, trigger refresh or change
                    // $('#CategoryIDDropdown').trigger('change');
                },
                error: function () {
                    alert('Failed to load category dropdown.');
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching category types:", error);
        }
    });
});


