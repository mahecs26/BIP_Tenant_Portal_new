$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/QueryStatusHistories/GetQueryStatusHistoryById/" + QueryId,
        success: function (data) {
            console.log(data);
            data.sort((a, b) => new Date(b.queryStatusHistory.changedDate) - new Date(a.queryStatusHistory.changedDate));
            const statusClasses = {
                "Scheduled": "badge-scheduled",
                "InProgress": "badge-inprogress",
                "Resolved": "badge-resolved",
                "Closed": "badge-closed",
                "Reopened": "badge-reopened",
                "OnHold": "badge-onhold",
                "Open": "badge-open"
            };
            const $ul = $(".list-group");
            data.forEach(item => {
                const status = item.queryStatusHistory.newStatus;
                const badgeClass = statusClasses[status] || "badge-default";
                const changedDate = new Date(item.queryStatusHistory.changedDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });
                const raisedOn = new Date(item.tenantQueries.raisedOn).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });
                const description = item.queryStatusHistory.description || "No additional details.";
                const changedBy = item.changedByFullName;
                const technician = item.assignedUserFullName;

                //    const listItem = `
                //    <li class="list-group-item">
                //        <span class="badge ${badgeClass} status-badge">${status}</span>
                //        <strong>${changedDate}</strong> - ${description}
                //        <br><strong>Changed By:</strong> ${changedBy}, <strong>Technician:</strong> ${technician}
                //    </li>
                //`;

                $("#complaintId2").text(item.tenantQueries.serviceRequestNumber);
                $("#complaintId").text(item.tenantQueries.serviceRequestNumber);

                const badgeClass2 = statusClasses[item.tenantQueries.status] || "badge-default";

                $("#currentStatus").text(item.tenantQueries.status).addClass(badgeClass2);
                $("#initialDescription").text(item.tenantQueries.description);

                $("#createdAt").text(raisedOn);
                $("#technicianName").text(item.assignedUserFullName);

                $("#mainCategory").text(item.mainCategory);
                $("#subCategory").text(item.subCategory);

                if (item.imagePath && item.imagePath.trim() !== "") {
                    $("#imganchor").attr('href', PortalBaseUrl + "/uploads/" + item.imagePath);
                    $("#imgservicephoto").attr('src', PortalBaseUrl + "/uploads/" + item.imagePath).show();
                } else {
                    // Optional: hide image or show placeholder
                    $("#imganchor").removeAttr('href');
                    $("#imgservicephoto").hide(); // or set a default src
                }

                const listItem = `
                <li class="list-group-item">
                    <span class="badge ${badgeClass} status-badge">${status}</span>
                    <strong>${changedDate}</strong> - ${description}
                </li>
            `;
                $ul.append(listItem);
            });
        }
    });
});
