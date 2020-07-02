using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.Domain.AggregatesModel.ValueObjects;

namespace DefendX.API.Domain.AggregatesModel.Builders
{
    public class UserBuilder : IEntityBuilder
    {
        private User user;

        public void CreateEntity()
        {
            var nameVo = new NameVO("default", "default");
            var contactInfoVO = new ContactInfoVO();
            user = new User(nameVo, contactInfoVO);
        }

        public TEntity GetEntity()
        {
            return user;
        }
    }
}