using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;
using DefendX.API.DAL.Context;
using DefendX.API.DAL.Models.Pagination;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Repositories {
    public class UserRepository : GenericRepository<User>, IUserRepository {

        public UserRepository (DataContext context) : base (context) { }

        public void LoadObjectProperties(User user)
        {
            _context.Entry(user.Account).Reference(u => u.AccountType).Load();
            _context.Entry(user).Reference(u => u.Unit).Load();
            _context.Entry(user).Reference(u => u.Service).Load();
            _context.Entry(user).Reference(u => u.Rank).Load();
        }

        public async Task<User> Get (long id, Expression<Func<User, object>>[] includeProperties = null) 
        {
            IQueryable<User> query = _context.User;
            if (includeProperties != null) 
            {
                foreach (Expression<Func<User, object>> includeProperty in includeProperties) 
                {
                    // TODO not needed with lazy loading
                    if(includeProperty.Body.Type.Name.Equals(nameof(Account)))
                    {
                        //simplifies the access of Account Type from Account during user get
                        query = query.Include<User, object> (includeProperty).ThenInclude(a => ((Account)a).AccountType);
                    }
                    else
                    {
                        query = query.Include<User, object> (includeProperty);
                    }
                }
            }
            return await query.SingleOrDefaultAsync(u => u.DodId == id);
        }

        public async Task<SearchResult<User>> GetUsers(
            string queryString, 
            int pageNumber, 
            int pageSize, 
            Expression<Func<User, bool>> filter = null
        ) {
            var users = _context.User.AsQueryable();

            users = ProcessFilter(users, queryString, filter );
            return new SearchResult<User>(await users.Skip(pageNumber * pageSize).Take(pageSize).ToListAsync(), await users.CountAsync()); 
        }

        private IQueryable<User> ProcessProperties(IQueryable<User> users, Expression<Func<User, object>>[] includeProperties)
        {
            foreach (Expression<Func<User, object>> includeProperty in includeProperties)
            {
                users = users.Include<User, object>(includeProperty);
            }
            return users;
        }

        private IQueryable<User> ProcessFilter(IQueryable<User> users, string queryString, Expression<Func<User, bool>> filter)
        {
            if (filter != null)
            {
                users = users.Where(filter);
            }

            if(!String.IsNullOrEmpty(queryString))
            {
                var queryArray = queryString.Split();
                users = users.Where(u =>
                    queryArray.Any(n => u.Name.FirstName.Contains(n, StringComparison.OrdinalIgnoreCase))
                    || queryArray.Any(n => u.Name.LastName.Contains(n, StringComparison.OrdinalIgnoreCase))
                    || queryArray.Any(n => u.DodId.ToString().Contains(n)));
            }
            return users;
        }
    }
}
