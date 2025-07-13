using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BIP_Tenant_Portal
{
    public class SessionTimeout : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string? usercode = Convert.ToString(context.HttpContext.Session.GetString("UserID"));
            if (string.IsNullOrEmpty(usercode))
            {
                context.Result =
                    new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        controller = "Home",
                        action = "Login"
                    }));
            }
            base.OnActionExecuting(context);
        }
    }
}
