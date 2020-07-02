using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DefendX.API.DAL.Context.Configurations
{
    public class AccountTypeConfig : IEntityTypeConfiguration<AccountType>
    {
        public void Configure(EntityTypeBuilder<AccountType> builder)
        {
            // builder.HasMany (t => t.Accounts).WithOne (a => a.AccountType);
        }
    }
}