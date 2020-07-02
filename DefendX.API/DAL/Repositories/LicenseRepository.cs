using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.DAL.Context;
using DefendX.API.DAL.Models.Pagination;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Repositories
{
    public class LicenseRepository : GenericRepository<SofaLicense>, ILicenseRepository
    {
        public LicenseRepository(DataContext context) : base(context) { }

        public override async Task Insert(SofaLicense license)
        {
            await _context.Set<SofaLicense>().AddAsync(license);
        }

        // TODO remove
        public void LoadObjectProperties(SofaLicense license)
        {
            _context.Entry(license).Reference(l => l.Service).Load();
            _context.Entry(license).Reference(l => l.Rank).Load();
            _context.Entry(license).Reference(l => l.Unit).Load();            
        }

        public int GetMaxPermitNumber()
        {
            return _context.SofaLicense.DefaultIfEmpty().Max(l => int.Parse(l.PermitNumber.Substring(2, l.PermitNumber.Length)));
        }

        public async Task<SearchResult<SofaLicense>> GetLicenses(
            string queryString, 
            int pageNumber, 
            int pageSize,
            int? unitId = null,
            Expression<Func<SofaLicense, bool>> filter = null)
        {
             var licenses = _context.SofaLicense.AsQueryable();

            licenses = ProcessFilter(licenses, queryString, unitId, filter);
            return new SearchResult<SofaLicense>(
                await licenses.Skip(pageNumber * pageSize).Take(pageSize).ToListAsync(), 
                await licenses.CountAsync());
        }


        public async Task<IEnumerable<SofaLicense>> GetLicenses(
            string queryString,
            int? unitId = null,
            Expression<Func<SofaLicense, bool>> filter = null)
        {
             var licenses = _context.SofaLicense.AsQueryable();

            licenses = ProcessFilter(licenses, queryString, unitId, filter);
            return await licenses.ToListAsync();
        }

        public async Task<bool> ContainsId(int id) 
        {
            return await _context.SofaLicense.AnyAsync(l => l.Id == id);
        }

        private IQueryable<SofaLicense> ProcessFilter(IQueryable<SofaLicense> licenses, string queryString, int? unitId, Expression<Func<SofaLicense, bool>> filter)
        {
            if (filter != null)
            {
                licenses = licenses.Where(filter);
            }

            if (unitId != null && unitId != 0)
            {
                licenses = licenses.Where(l => l.UnitId == unitId);
            }

            if (!String.IsNullOrEmpty(queryString))
            {
                var queryArray = queryString.Split();
                licenses = licenses.Where(l => 
                    queryArray.Any(n => l.Name.FirstName.Contains(n, StringComparison.OrdinalIgnoreCase)) 
                    || queryArray.Any(n => l.Name.LastName.Contains(n, StringComparison.OrdinalIgnoreCase))   
                    || queryArray.Any(n => l.DodId.ToString().Contains(n)));
            }
            return licenses;
        }
    }
}