using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DefendX.API.Domain.AggregatesModel {
    public interface IGenericRepository<T> where T : IAggregateRoot {
        Task<IEnumerable<T>> GetAsync (
            Expression<Func<T, bool>> filter = null,
            System.Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Expression<Func<T, object>>[] includeProperties = null);

        Task<T> GetAsync(object id);

        Task<T> GetFirstOrDefault(Expression<Func<T, bool>> filter, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, Expression<Func<T, object>>[] includeProperties = null);

        Task Insert(T entity);
        Task InsertMany(List<T> entities);
        Task Delete(object id);
        void Delete(T entityToDelete);
        void Update(T entityToUpdate);
        void Save();
        Task SaveAsync();
    }
}