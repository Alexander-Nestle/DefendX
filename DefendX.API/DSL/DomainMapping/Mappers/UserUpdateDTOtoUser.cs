using DefendX.API.AppLayer.DTOs;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.DSL.DomainMapping.Mappers
{
    public class UserUpdateDTOtoUser : TDomainMapper<UserUpdateDTO, User>
    {
        public UserUpdateDTOtoUser(UserUpdateDTO dto, User user) : base (dto, user){}

        public override User Map() 
        {
            if (source.AccountTypeId != null ) destination.SetAccountTypeId(source.AccountTypeId.Value);
            if (source.UnitId != null) destination.SetUnitId(source.UnitId.Value);
            if (source.ServiceId != null) destination.SetServiceId((int) source.ServiceId);
            if (source.ServiceId != null && source.RankId != null) 
            {
                destination.SetRankId((int) source.RankId);
            }
            destination.SetContactInfo(source.DsnPhone, source.CommPhone, source.Email);
            if (!string.IsNullOrEmpty(source.SignatureData)) destination.SetSignatureData(source.SignatureData);

            return destination;
        }
    }
}