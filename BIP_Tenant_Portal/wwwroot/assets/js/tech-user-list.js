$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Users/GetUserTechniciansPropertyUserWise/" + UserID,
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'userID', 'render': function (userID, type, row, meta) {
                            console.log(row['approvalStatus']);
                            console.log(row['userStatus']);
                            if (row['approvalStatus'] === "Approved") {
                                if (row['userStatus'] === "Active") {
                                    return '<a href="' + PortalBaseUrl + '/UserManagement/ServiceProviderDetails/' + userID + '" target="_blank" class="btn btn-secondary btn-sm">View</a>&nbsp;' +
                                        '<a href="' + PortalBaseUrl + '/UserManagement/EditServiceProvider/' + userID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;' +
                                        '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + userID + '">Deactivate</button>';
                                }
                                else {
                                    return '<a href="' + PortalBaseUrl + '/UserManagement/ServiceProviderDetails/' + userID + '" target="_blank" class="btn btn-secondary btn-sm">View</a>&nbsp;' +
                                        '<a href="' + PortalBaseUrl + '/UserManagement/EditServiceProvider/' + userID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;' +
                                        '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#deleteAConfirmationModal" data-id="' + userID + '">Activate</button>';
                                }
                            }
                            else {
                                return '<a href="' + PortalBaseUrl + '/UserManagement/ServiceProviderDetails/' + userID + '" target="_blank" class="btn btn-secondary btn-sm">View</a>';
                            }
                            //else {
                            //    return '<a href="' + PortalBaseUrl + '/UserManagement/Edit/' + userID + '" class="btn btn-success btn-sm">Edit</a>&nbsp;' +
                            //        '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#deleteAConfirmationModal" data-id="' + userID + '">Activate</button>';
                            //}
                        }
                    },
                    { data: 'fullName' },
                    { data: 'email' },
                    { data: 'mobile' },
                    {
                        'data': 'approvalStatus',
                        'render': function (userStatus, type, row, meta) {
                            let badgeClass = '';

                            switch (userStatus) {
                                case "Pending":
                                    userStatus = "Approval Pending"
                                    badgeClass = "badge badge-secondary"; // Grey
                                    break;
                                case "Approved":
                                    badgeClass = "badge badge-success"; // Green
                                    break;
                                case "Rejected":
                                    badgeClass = "badge badge-danger"; // Red
                                    break;
                                case "InActive":
                                    badgeClass = "badge badge-dark"; // Black
                                    break;
                                case "Active":
                                    badgeClass = "badge badge-warning"; // Yellow
                                    break;
                                default:
                                    badgeClass = "badge badge-light"; // Default fallback
                            }

                            return `<span class="${badgeClass}">${userStatus}</span>`;
                        }
                    },

                    //{
                    //    data: 'propertyNames',
                    //    render: function (data, type, row, meta) {
                    //        if (!Array.isArray(data) || data.length === 0) return ''; // Handle empty or non-array values

                    //        let badges = data.map(value => `<span class="badge badge-info mb-1">${value.trim()}</span>`).join(' ');

                    //        return badges;
                    //    }
                    //},
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
                    }
                ],
                dom: 'Bfrtip', // Defines the placement of buttons
                buttons: [
                    'excelHtml5', // Excel Export
                    'csvHtml5'   // CSV Export
                ]
            });
        },
        error: function (xhr, a, b) {
            console.log(xhr);
            console.log(a);
            console.log(b);
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
            $('#Source').val("TechnicianList");
            $('form').submit();
        }
    });

    $('#confirmDeleteABtn').click(function () {
        if (itemIdToDelete) {
            console.log("Deleting item with ID:", itemIdToDelete);
            $('#UserID').val(itemIdToDelete);
            $('#Operation').val("Activate");
            $('#Source').val("TechnicianList");
            $('form').submit();
        }
    });
});




