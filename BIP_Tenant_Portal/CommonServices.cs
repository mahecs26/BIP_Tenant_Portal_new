namespace BIP_Tenant_Portal
{
    public enum Alert
    {
        Success,
        Info,
        Warning,
        Danger
    }
    public static class CommonServices
    {
        public static string ShowAlert(Alert obj, string strMessage)
        {
            string alertClass = "";
            switch (obj)
            {
                case Alert.Success:
                    alertClass = "alert-success";
                    break;
                case Alert.Danger:
                    alertClass = "alert-danger";
                    break;
                case Alert.Info:
                    alertClass = "alert-info";
                    break;
                case Alert.Warning:
                    alertClass = "alert-warning";
                    break;
                default:
                    break;
            }

            if (!string.IsNullOrEmpty(alertClass))
            {
                return $"<div class='alert {alertClass} alert-dismissable' role='alert' id='alert'>" +
                    $"{strMessage}" +
                       "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>" +
                       "</div>";
            }

            return "";
        }
    }
}
