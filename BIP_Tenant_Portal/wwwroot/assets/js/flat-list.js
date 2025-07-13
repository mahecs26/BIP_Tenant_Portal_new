$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Flats",
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'flatID', 'render': function (flatID, type, row, meta) {
                            return '<a href="' + PortalBaseUrl + '/FlatManagement/Edit/' + flatID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + flatID + '">Deactivate</button>';
                        }
                    },
                    { data: 'flatID' },
                    { data: 'propertyName' },
                    { data: 'buildingCode' },
                    { data: 'flatNumber' },
                    { data: 'floor' },
                    { data: 'noOfRooms' },
                    { data: 'flatType' },
                    {
                        data: 'isOccupied',
                        render: function (data) {
                            return data ? 'Yes' : 'No';
                        }
                    },
                    {
                        "data": "createdOn",
                        "render": function (data, type, row) {
                            if (!data) return ""; // Handle empty values
                            if (type === "display" || type === "filter") {
                                return moment(data).format("DD-MM-YYYY hh:mm A"); // Format: 08-03-2025 02:41 AM
                            }
                            return data;
                        }
                    }
                ]
            });
        }
    });

    let itemIdToDelete = null;

    $('#deleteConfirmationModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        itemIdToDelete = button.data('id');
    });

    $('#confirmDeleteBtn').click(function () {
        if (itemIdToDelete) {
            console.log("Deleting item with ID:", itemIdToDelete);
            $('#FlatID').val(itemIdToDelete);
            $('form').submit();
        }
    });
});