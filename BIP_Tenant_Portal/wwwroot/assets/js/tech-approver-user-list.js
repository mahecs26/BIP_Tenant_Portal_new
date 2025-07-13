$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Users/TechnicianApprover",
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'userID', 'render': function (userID, type, row, meta) {
                            return '<a href="' + PortalBaseUrl + '/UserManagement/ServiceProviderDetails/' + userID + '" target="_blank" class="btn btn-secondary btn-sm">View</a>&nbsp;' +
                                '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#deleteConfirmationModal" data-id="' + userID + '">Approve</button>&nbsp;' +
                                '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteAConfirmationModal" data-id="' + userID + '">Reject</button>';
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

                    {
                        data: 'propertyNames',
                        render: function (data, type, row, meta) {
                            if (!Array.isArray(data) || data.length === 0) return ''; // Handle empty or non-array values

                            let badges = data.map(value => `<span class="badge badge-info mb-1">${value.trim()}</span>`).join(' ');

                            return badges;
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
            $('#Operation').val("Approve");
            $('#Source').val("TechnicianApproverList");
            $('form').submit();
        }
    });

    $('#confirmDeleteABtn').click(function () {
        if (itemIdToDelete) {
            console.log("Deleting item with ID:", itemIdToDelete);
            $('#UserID').val(itemIdToDelete);
            $('#Operation').val("Reject");
            $('#Source').val("TechnicianApproverList");
            $('form').submit();
        }
    });
});