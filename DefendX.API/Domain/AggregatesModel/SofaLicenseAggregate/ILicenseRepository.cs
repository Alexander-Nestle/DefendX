using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.DAL.Models.Pagination;

namespace DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate
{
    public interface ILicenseRepository : IGenericRepository<SofaLicense>
    {
        Task<SearchResult<SofaLicense>> GetLicenses(
            string queryString, 
            int pageNumber, 
            int pageSize,
            int? unitId = null,
            Expression<Func<SofaLicense, bool>> filter = null);  

        Task<IEnumerable<SofaLicense>> GetLicenses(
            string queryString,
            int? unitId = null,
            Expression<Func<SofaLicense, bool>> filter = null);

        void LoadObjectProperties(SofaLicense license);   
        Task<bool> ContainsId(int id);
        int GetMaxPermitNumber();
    }
}