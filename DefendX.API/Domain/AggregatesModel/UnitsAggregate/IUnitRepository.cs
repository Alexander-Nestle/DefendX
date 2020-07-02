using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;

namespace DefendX.API.Domain.AggregatesModel.UnitsAggregate
{
    public interface IUnitRepository: IGenericRepository<Unit>
    {
          Task<IEnumerable<Unit>> GetUnits(
            UnitUserParams userParams,
            Expression<Func<Unit, bool>> filter = null
        );
    }
}