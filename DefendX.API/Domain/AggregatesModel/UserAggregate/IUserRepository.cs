using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;
using DefendX.API.DAL.Models.Pagination;

namespace DefendX.API.Domain.AggregatesModel.UserAggregate
{
    public interface IUserRepository : IGenericRepository<User>
    {
        void LoadObjectProperties(User user);
        Task<User> Get(long id, Expression<Func<User, object>>[] includeProperties = null);
        Task<SearchResult<User>> GetUsers(
            string queryString, 
            int pageNumber, 
            int pageSize, 
            Expression<Func<User, bool>> filter = null
        );
    }
}