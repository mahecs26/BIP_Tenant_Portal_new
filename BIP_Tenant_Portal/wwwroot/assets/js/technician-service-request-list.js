$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/TenantQueries/GetTenantQueryInDetailsForTechnician/" + TenantId,
        success: function (data) {
            var datatableVariable = $('#usersTable').DataTable({
                data: data,
                columns: [
                    {
                        'data': 'queryID', 'render': function (queryID, type, row, meta) {
                            return '<a href="' + PortalBaseUrl + '/TechnicianServiceRequest/Update/' + queryID + '" class="btn btn-success btn-sm">Edit</a>&nbsp<a href="' + PortalBaseUrl + '/TechnicianServiceRequest/DetailedView/' + queryID + '" class="btn btn-info btn-sm" target="_blank">View</a>';
                        }
                    },
                    { data: 'serviceRequestNumber' },
                    { data: 'tenantName' },
                    { data: 'propertyName' },
                    { data: 'categoryType' },
                    { data: 'subCategoryType' },
                    {
                        "data": "raisedOn",
                        "render": function (data, type, row) {
                            if (!data) return ""; // Handle empty values
                            if (type === "display" || type === "filter") {
                                return moment(data).format("DD-MM-YYYY hh:mm A"); // Format: 08-03-2025 02:41 AM
                            }
                            return data;
                        }
                    },
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
                    {
                        "data": "statusChangedOn",
                        "render": function (data, type, row) {
                            if (!data) return ""; // Handle empty values
                            if (type === "display" || type === "filter") {
                                return moment(data).format("DD-MM-YYYY hh:mm A"); // Format: 08-03-2025 02:41 AM
                            }
                            return data;
                        }
                    },
                    { data: 'durationFromRaisedOn' },
                    { data: 'flatNumber' },
                    { data: 'description' },
                    {
                        "data": "preferedVisitTime",
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
});
