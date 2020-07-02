using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DefendX.API.DAL.Context;
using DefendX.API.Domain.AggregatesModel;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Repositories {
        public class GenericRepository<T> : IGenericRepository<T> where T : TEntity, IAggregateRoot {
            internal DataContext _context;

            public GenericRepository (DataContext context) {
                this._context = context;
            }

            public virtual async Task Insert (T entity) {
                await _context.Set<T> ().AddAsync (entity);
            }

            public virtual async Task InsertMany (List<T> entities) {
                await _context.Set<T> ().AddRangeAsync (entities);
            }

            public async Task<T> GetAsync (object id) {
                return await _context.Set<T> ().FindAsync (id);
            }

            public async Task<IEnumerable<T>> GetAsync (Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, Expression<Func<T, object>>[] includeProperties = null) {
                IQueryable<T> query = _context.Set<T> ();

                if (filter != null) {
                    query = query.Where (filter);
                }

                //TODO take out includeproperties as they are not needed with lazy loading
                if (includeProperties != null) {
                    foreach (Expression<Func<T, object>> includeProperty in includeProperties) {
                        query = query.Include<T, object> (includeProperty);
                    }
                }

                if (orderBy != null) {
                    return await orderBy (query).ToListAsync ();
                } else {
                    return await query.ToListAsync ();
                }
            }

            public async Task<T> GetFirstOrDefault (Expression<Func<T, bool>> filter, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, Expression<Func<T, object>>[] includeProperties = null) {
                IQueryable<T> query = _context.Set<T> ();

                // Not needed when using lazy loading
                // if (includeProperties != null)
                // {
                //     foreach (Expression<Func<T, object>> includeProperty in includeProperties)
                //     {
                //         query = query.Include<T, object>(includeProperty);
                //     }
                // }

                if (orderBy != null) {
                    return await orderBy (query).Where (filter).FirstOrDefaultAsync ();
                } else {
                    return await query.Where (filter).FirstOrDefaultAsync ();
                }
            }

            public void Update (T entityToUpdate) {
                _context.Set<TEntity> ().Attach (entityToUpdate);
                // _context.Entry(entityToUpdate).State = EntityState.Modified;
            }

            public async Task Delete (object id) {
                T entityToDelete = await _context.Set<T> ().FindAsync (id);
                Delete (entityToDelete);
            }

            public void Delete (T entityToDelete) {
                if (_context.Entry (entityToDelete).State == EntityState.Detached) {
                    _context.Set<T> ().Attach (entityToDelete);
                }
                _context.Set<T> ().Remove (entityToDelete);
            }

            public void Save () {
                _context.SaveChanges ();
            }

            public virtual async Task SaveAsync () {
                try {
                    await _context.SaveChangesAsync ();
                } catch (DbUpdateConcurrencyException e) {
                    foreach (var entry in e.Entries) {
                        // if (entry.Entity is SofaLicense)
                        // {
                        var proposedValues = entry.CurrentValues;
                        var databaseValues = entry.GetDatabaseValues ();
                        var originalValues = entry.OriginalValues;

                        // already deleted
                        if (databaseValues == null ) {
                            return;
                        }

                        foreach (var property in proposedValues.Properties) {
                            var proposedValue = proposedValues[property];
                            var databaseValue = databaseValues[property];
                            var originalValue = originalValues[property];

                            if (databaseValue == null && proposedValue == null && originalValue == null)
                            {
                                continue;
                            } 
                            
                            if ((originalValue != null && proposedValue != null && databaseValue == null) 
                                    || (!databaseValue.Equals(originalValue) && proposedValue.Equals(originalValue)))  
                            {
                                proposedValues[property] = databaseValue;
                            }


                            // TODO: decide which value should be written to database
                            // proposedValues[property] = <value to be saved>;
                        }

                        // Refresh original values to bypass next concurrency check
                        entry.OriginalValues.SetValues (databaseValues);
                        await SaveAsync();
                        // }
                        // else
                        // {
                        //     throw new NotSupportedException(
                        //         "Don't know how to handle concurrency conflicts for "
                        //         + entry.Metadata.Name);
                        // }
                    }
                }
            }
        }
}
