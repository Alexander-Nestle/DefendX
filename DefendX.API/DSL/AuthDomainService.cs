using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using DefendX.API.Common.Utilities;
using DefendX.API.Common.Utilities.CaC;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.Builders;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.DSL
{
    public class AuthDomainService : TDomainService
    {
        public AuthDomainService(IUserRepository userRepo) : base(userRepo) {}

        public async Task<User> Register(CaC cac)
        {
            EntityBuildDirector builder = new EntityBuildDirector(new AccountBuilder());
            var account = (Account) builder.BuildEntity();

            builder.SetBuilder(new UserBuilder());
            var user = (User) builder.BuildEntity();
            user.SetAccount(account);
            user.SetUserCacInfo(cac);

            await _userRepo.Insert(user);
            await _userRepo.SaveAsync();
            _userRepo.LoadObjectProperties(user);
            return user;
        }
    }
}