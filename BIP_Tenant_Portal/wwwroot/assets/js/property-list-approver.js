$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Properties/Approver",
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'propertyID', 'render': function (propertyID, type, row, meta) {
                            //return '<a href="' + PortalBaseUrl + '/Properties/ViewBuilding/' + propertyID + '" class="btn btn-warning btn-sm">View</a>&nbsp;<a href="' + PortalBaseUrl + '/Properties/Edit/' + propertyID + '" class="btn btn-success btn-sm">Approve</a>&nbsp;<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + propertyID + '">Reject</button>';
                            return '<a href="' + PortalBaseUrl + '/Properties/ViewBuilding/' + propertyID + '" class="btn btn-warning btn-sm">View</a>&nbsp;<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + propertyID + '">Approve</button>&nbsp;' +
                                '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteAConfirmationModal" data-id="' + propertyID + '">Reject</button>';
                        }
                    },
                    { data: 'propertyID' },
                    { data: 'propertyName' },
                    { data: 'buildingCodes' },
                    { data: 'city' },
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

    $('#deleteAConfirmationModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        itemIdToDelete = button.data('id');
    });

    $('#confirmDeleteBtn').click(function () {
        if (itemIdToDelete) {
            console.log("Deleting item with ID:", itemIdToDelete);
            $('#PropertyID').val(itemIdToDelete);
            $('#Operation').val("Approve");
            $('#Source').val("BuildingManagement");
            $('form').submit();
        }
    });

    $('#confirmDeleteABtn').click(function () {
        if (itemIdToDelete) {
            console.log("Deleting item with ID:", itemIdToDelete);
            $('#PropertyID').val(itemIdToDelete);
            $('#Operation').val("Reject");
            $('#Source').val("BuildingManagement");
            $('form').submit();
        }
    });
});