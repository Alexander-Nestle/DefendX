using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;
using DefendX.API.DAL.Context;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Repositories
{
    public class UnitRepository : GenericRepository<Unit>, IUnitRepository
    {
        public UnitRepository(DataContext context) : base(context) { }

        public async Task<IEnumerable<Unit>> GetUnits(
            UnitUserParams userParams,  
            Expression<Func<Unit, bool>> filter = null)
        {
             var units = _context.Unit.AsQueryable();

            units = ProcessUnitFilter(units, userParams, filter);
            return await units.ToListAsync();
        }

        private IQueryable<Unit> ProcessUnitFilter(IQueryable<Unit> units, UnitUserParams userParams, Expression<Func<Unit, bool>> filter)
        {
            if (filter != null)
            {
                units = units.Where(filter);
            }

            if (userParams.Name != null)
            {
                var nameArray = userParams.Name.Split();
                units = units.Where(u => nameArray.Any(n => u.Name.Contains(n)));
                //units = units.Where(u => u.Name.Contains(userParams.Name));
            }

            return units;
        }
    }
}