namespace DefendX.API.Domain.AggregatesModel.Builders
{
    public interface IEntityBuilder
    {
         void CreateEntity();
         TEntity GetEntity();
    }
}