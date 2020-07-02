using System.Threading;
using System.Threading.Tasks;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.DSL
{
    public abstract class TDomainService
    {
        protected IUserRepository _userRepo;

        public TDomainService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        protected async Task<bool> IsUserAdmin(long userId) 
        {
            var user = await _userRepo.GetAsync(userId);
            if(user.Account.AccountTypeId == (int)AccountTypes.Administrator)
                return true;

            return false;
        }
    }
}