using System;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.Domain.AggregatesModel.Builders
{
    public class AccountBuilder : IEntityBuilder
    {
        private Account _account;
        public void CreateEntity()
        {
            _account = new Account((int)AccountTypes.User, DateTime.Now, DateTime.Now);
        }

        public TEntity GetEntity()
        {
            return _account;
        }
    }
}