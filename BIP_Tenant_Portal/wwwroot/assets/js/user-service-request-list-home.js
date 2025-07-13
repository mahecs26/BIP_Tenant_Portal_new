$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/TenantQueries/GetTenantQueryInDetailsForUser/" + TenantId,
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'queryID', 'render': function (queryID, type, row, meta) {
                            if (row['status'] == 'Resolved') {
                                return '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#acceptConfirmationModal" data-id="' + queryID + '">Accept</button>&nbsp;<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#reopenConfirmationModal" data-id="' + queryID + '">Reopen</button>&nbsp;<a href="' + PortalBaseUrl + '/UserServiceRequest/DetailedView/' + queryID + '" class="btn btn-primary btn-sm">View</a>';
                            }
                            else {
                                return '<button type="button" disabled class="btn btn-success btn-sm" data-toggle="modal" data-target="#acceptConfirmationModal" data-id="' + queryID + '">Accept</button>&nbsp;<button disabled type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#reopenConfirmationModal" data-id="' + queryID + '">Reopen</button>&nbsp;<a href="' + PortalBaseUrl + '/UserServiceRequest/DetailedView/' + queryID + '" class="btn btn-primary btn-sm">View</a>';
                            }
                        }
                    },
                    { data: 'serviceRequestNumber' },
                    { data: 'categoryType' },
                    { data: 'raisedOn' },
                    {
                        'data': 'status',
                        'render': function (status, type, row, meta) {
                            // Define badge classes for different statuses
                            var badgeClass = '';
                            switch (status) {
                                case 'Open':
                                    badgeClass = 'badge-primary';
                                    break;
                                case 'Scheduled':
                                    badgeClass = 'badge-info';
                                    break;
                                case 'InProgress':
                                    badgeClass = 'badge-warning';
                                    break;
                                case 'OnHold':
                                    badgeClass = 'badge-secondary';
                                    break;
                                case 'Resolved':
                                    badgeClass = 'badge-success';
                                    break;
                                case 'ReOpened':
                                    badgeClass = 'badge-danger';
                                    break;
                                default:
                                    badgeClass = 'badge-light'; // Default badge
                                    break;
                            }
                            return '<span class="badge ' + badgeClass + '">' + status + '</span>';
                        }
                    },
                    { data: 'preferedVisitTime' },
                    { data: 'queryID' },
                    { data: 'description' },
                ]
            });
        }
    });

    let itemIdToAccept = null;

    $('#acceptConfirmationModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        itemIdToAccept = button.data('id');
    });

    $('#confirmAcceptBtn').click(function () {
        if (itemIdToAccept) {
            console.log("Deleting item with ID:", itemIdToAccept);
            $('#QueryID').val(itemIdToAccept);
            $('#Operation').val("Accept");
            $('form').submit();
        }
    });

    let itemIdToReopen = null;

    $('#reopenConfirmationModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        itemIdToReopen = button.data('id');
    });

    $('#confirmReopenBtn').click(function () {
        if (itemIdToReopen) {
            console.log("Deleting item with ID:", itemIdToReopen);
            $('#QueryID').val(itemIdToReopen);
            $('#Operation').val("Reopen");
            $('form').submit();
        }
    });
});
