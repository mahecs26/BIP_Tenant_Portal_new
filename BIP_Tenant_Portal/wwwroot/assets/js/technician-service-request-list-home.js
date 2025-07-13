$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/TenantQueries/GetTenantQueryInDetailsForTechnician/" + TenantId,
        success: function (data) {
            console.log(data);
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'queryID', 'render': function (queryID, type, row, meta) {
                            return '<a href="' + PortalBaseUrl + '/TechnicianServiceRequest/Update/' + queryID + '" class="btn btn-success btn-sm">Edit</a>&nbsp<a href="' + PortalBaseUrl + '/TechnicianServiceRequest/ShowImage/' + queryID + '" class="btn btn-info btn-sm">View</a>';
                        }
                    },
                    { data: 'serviceRequestNumber' },
                    { data: 'tenantName' },
                    { data: 'propertyName' },
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
                    { data: 'statusChangedOn' },
                    { data: 'durationFromRaisedOn' },
                    { data: 'flatNumber' },
                    { data: 'description' },
                    { data: 'preferedVisitTime' }
                ]
            });
        }
    });
});
