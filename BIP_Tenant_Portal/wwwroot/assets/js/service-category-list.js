$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/ServiceCategories/GetSubCategoriesWithType",
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'categoryID', 'render': function (categoryID, type, row, meta) {
                            return '<a href="' + PortalBaseUrl + '/ServiceCategory/Edit/' + categoryID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + categoryID + '">Delete</button>';
                        }
                    },
                    { data: 'categoryType' },
                    { data: 'categoryDesc' }
                ]
            });
        }
    });
});