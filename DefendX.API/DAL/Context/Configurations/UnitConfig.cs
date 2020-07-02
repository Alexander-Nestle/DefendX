using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DefendX.API.DAL.Context.Configurations
{
    public class UnitConfig : IEntityTypeConfiguration<Unit>
    {
        public void Configure(EntityTypeBuilder<Unit> builder)
        {
            // builder.HasOne(u => u.ParentUnit);

            // builder.Metadata
            //     .FindNavigation(nameof(Unit.ChildUnits))
            //     .SetPropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}