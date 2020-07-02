using System;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.DSL.DomainMapping.Mappers;

namespace DefendX.API.DSL.DomainMapping
{
    public class DomainMapperCreator
    {
        public TDomainMapper<T, U> GetMapper<T, U>(T source, U destination) 
            where T : TDTO
            where U : TEntity
        {
            if (typeof(T) == typeof(UserUpdateDTO) && typeof(U) == typeof(User))
            {
                return new UserUpdateDTOtoUser((source as UserUpdateDTO), (destination as User)) as TDomainMapper<T, U>;
            }
            else
            {
                throw new ArgumentException("Invalid Argument Types");
            }
        }
    }
}