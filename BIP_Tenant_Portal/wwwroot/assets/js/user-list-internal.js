$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Users/GetInternalUsers",
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    { data: 'fullName' },
                    { data: 'email' },
                    { data: 'mobile' },
                    {
                        'data': 'userStatus', 'render': function (userStatus, type, row, meta) {
                            if (userStatus === "Active") {
                                return '<span class="badge badge-warning">' + userStatus + '</span>';
                            }
                            else {
                                return '<span class="badge badge-danger">' + userStatus + '</span>';
                            }
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
                    },
                    {
                        "data": "lastLogin",
                        "render": function (data, type, row) {
                            if (!data) return ""; // Handle empty values
                            if (type === "display" || type === "filter") {
                                return moment(data).format("DD-MM-YYYY hh:mm A"); // Format: 08-03-2025 02:41 AM
                            }
                            return data;
                        }
                    },
                    {
                        'data': 'userID', 'render': function (userID, type, row, meta) {
                            console.log(row['approvalStatus']);
                            console.log(row['userStatus']);

                            if (row['userStatus'] === "Active") {
                                return '<a href="' + PortalBaseUrl + '/UserManagement/ServiceProviderDetails/' + userID + '" target="_blank" class="btn btn-secondary btn-sm">View</a>&nbsp;' +
                                    '<a href="' + PortalBaseUrl + '/UserManagement/EditInternalUser/' + userID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;' +
                                    '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + userID + '">Deactivate</button>';
                            }
                            else {
                                return '<a href="' + PortalBaseUrl + '/UserManagement/ServiceProviderDetails/' + userID + '" target="_blank" class="btn btn-secondary btn-sm">View</a>&nbsp;' +
                                    '<a href="' + PortalBaseUrl + '/UserManagement/EditInternalUser/' + userID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;' +
                                    '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#deleteAConfirmationModal" data-id="' + userID + '">Activate</button>';
                            }
                        }
                    }
                ],
                dom: 'Bfrtip', // Defines the placement of buttons
                buttons: [
                    'excelHtml5', // Excel Export
                    'csvHtml5'   // CSV Export
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
            $('#UserID').val(itemIdToDelete);
            $('#Operation').val("Deactivate");
            $('#Source').val("UserList");
            $('form').submit();
        }
    });

    $('#confirmDeleteABtn').click(function () {
        if (itemIdToDelete) {
            console.log("Deleting item with ID:", itemIdToDelete);
            $('#UserID').val(itemIdToDelete);
            $('#Operation').val("Activate");
            $('#Source').val("UserList");
            $('form').submit();
        }
    });
});