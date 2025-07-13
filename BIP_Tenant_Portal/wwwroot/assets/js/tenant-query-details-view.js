function getQueryIdFromPath() {
    // Example URL: https://yourdomain.com/Details/1220
    // We get the last segment of the path as the QueryID
    const pathSegments = window.location.pathname.split('/').filter(s => s.length > 0);
    // Assuming 'Details' is second last and ID is last segment
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment;
}

async function loadDetails(queryId) {
    if (!queryId) {
        document.getElementById("detailsCard").innerHTML = `<div class="alert alert-warning">QueryID not provided in URL.</div>`;
        return;
    }

    try {
        const response = await fetch(WebApiUrl + `/api/TenantQueries/GetTenantQueryInDetailsByQueryId/${queryId}`);
        if (!response.ok) throw new Error("Failed to load data");

        const data = await response.json();

        console.log(data);

        // 👉 Card 1: Request Info
        document.getElementById("serviceRequestNumber").textContent = data.serviceRequestNumber ?? "N/A";

        // Example status from data
        const status = data.status ?? "N/A";

        // Map status to badge classes (Bootstrap 5 classes)
        const statusClasses = {
            Closed: "bg-secondary",        // gray
            InProgress: "bg-primary",      // blue
            Open: "bg-success",            // green
            ReOpened: "bg-warning text-dark", // yellow
            Resolved: "bg-info text-dark",     // light blue
            Scheduled: "bg-info text-dark"     // light blue (same as Resolved)
        };

        document.getElementById("servicestatus").textContent = status;
        document.getElementById("servicestatus").className = "badge " + (statusClasses[status] || "bg-dark");

        document.getElementById("preferredTime").textContent = data.preferedVisitTime
            ? new Date(data.preferedVisitTime).toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
            : "N/A";
        document.getElementById("raisedOn").textContent = data.raisedOn
            ? new Date(data.raisedOn).toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
            : "N/A";

        // 👉 Card 2: Tenant Info
        document.getElementById("tenantName").textContent = data.tenantName ?? "N/A";
        document.getElementById("tenantPhone").textContent = data.mobile ?? "N/A";
        document.getElementById("tenantEmail").textContent = data.email ?? "N/A";
        document.getElementById("contactMode").textContent = data.communicationMethod ?? "N/A";

        // 👉 Card 3: Service Info
        document.getElementById("mainCategory").textContent = data.mainCategory ?? "N/A";
        document.getElementById("subCategory").textContent = data.subCategory ?? "N/A";
        document.getElementById("description").textContent = data.description ?? "N/A";

        // 👉 Card 4: Image (only one image expected)
        if (data.fileName && data.fileName.trim() !== "") {
            document.getElementById("imganchor").setAttribute("href", PortalBaseUrl + "/uploads/" + data.fileName);
            document.getElementById("imgservicephoto").setAttribute("src", PortalBaseUrl + "/uploads/" + data.fileName);
            document.getElementById("imgservicephoto").style.display = "block";
        } else {
            // Optional: fallback or hide if no image
            document.getElementById("imganchor").removeAttribute("href");
            document.getElementById("imgservicephoto").style.display = "none";
        }

    } catch (error) {
        console.error(error);
        //document.getElementById("detailsCard").innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }

}

// Get QueryID from URL query string
const queryId = getQueryIdFromPath();
loadDetails(queryId);