using DefendX.API.AppLayer.DTOs;
using DefendX.API.Domain.AggregatesModel;

namespace DefendX.API.DSL.DomainMapping.Mappers
{
    public abstract class TDomainMapper<T, U>
        where T : TDTO
        where U : TEntity
    {
        protected T source;
        protected U destination;

        protected TDomainMapper(T source, U destination)
        {
            this.source = source;
            this.destination = destination;
        }
        public abstract U Map();
    }
}