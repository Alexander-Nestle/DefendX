namespace DefendX.API.Domain.AggregatesModel.Builders
{
    public class EntityBuildDirector
    {
        private IEntityBuilder _builder;

        public EntityBuildDirector(IEntityBuilder builder)
        {
            _builder = builder;
        }

        public void SetBuilder(IEntityBuilder builder) {
            _builder = builder;
        }

        public TEntity BuildEntity()
        {
            _builder.CreateEntity();
            return _builder.GetEntity();
        }
    }
}