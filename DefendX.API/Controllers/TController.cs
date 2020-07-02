using System.Linq;
using System.Security.Claims;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using Microsoft.AspNetCore.Mvc;

namespace DefendX.API.Controllers
{
    public class TController : ControllerBase
    {
        protected ILogRepository _logRepo;
        public TController(ILogRepository logRepo)
        {
            _logRepo = logRepo;
        }

        public long GetCurrentUserId() 
        {
            return long.Parse(Request.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
        }

        public string GetIpAddress()
        {
            return Request.HttpContext.Connection.RemoteIpAddress.ToString();
        }
    }
}