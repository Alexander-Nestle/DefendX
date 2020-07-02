using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;

namespace DefendX.API.AppLayer.Services
{
    public abstract class TAppService
    {
        protected readonly IHttpContextAccessor _accessor;
        protected IUserRepository _userRepo;
        public TAppService(
            IHttpContextAccessor accessor,
            IUserRepository userRepo)
        {
            _accessor = accessor;
            _userRepo = userRepo;
        }

        public bool IsCurrentUser(int id)
        {
            var userId = _accessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            return userId.Equals(id.ToString());
        }

        public long GetCurrentUserId() {
            return long.Parse(_accessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
        }
    }
}