using AutoMapper;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.Common.Email;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.Domain.AggregatesModel.ValueObjects;

namespace DefendX.API.AppLayer {
    // TODO AutoMapperProfiles should only be used to map domain objects to DTOs or to map DTOs to constructed domain object.  
    // Use DomainMapping in DSL for mapping to existing domain objects
    public class AutoMapperProfiles : Profile {
        public AutoMapperProfiles () 
        {
            CreateMap<LicenseDTO, NameVO>();
            CreateMap<LicenseDTO, PersonalInformationVO>();
            CreateMap<LicenseDTO, DriverRestrictionsVO>();                        
            CreateMap<LicenseDTO, SofaLicense>()
                .ConstructUsing(dto => new SofaLicense(
                    dto.FirstName,
                    dto.MiddleInitial,
                    dto.LastName,
                    dto.Gender,
                    dto.Dob,
                    dto.Height,
                    dto.Weight,
                    dto.HairColor,
                    dto.EyeColor,
                    dto.Glasses,
                    dto.Tdy,
                    dto.OnBaseOnly,
                    dto.AutoJeep,
                    dto.MotorCycle,
                    dto.Motor,
                    dto.Other,
                    dto.ServiceId,
                    dto.LastEditedById,
                    dto.DateExpired,
                    dto.SignatureData,
                    dto.PermitNumber,
                    false,
                    dto.DodId,
                    dto.UnitId,
                    dto.SponsorId,
                    dto.RankId,
                    dto.Remarks
                ))
                .ForMember(l => l.DateCreated, dto => dto.Ignore())
                .ForMember(l => l.DateUpdated, dto => dto.Ignore())
                .ForMember(l => l.LastEditedBy, dto => dto.Ignore())
                .ForMember(l => l.Dependents, dto => dto.Ignore())
                .ForMember(l => l.Issues, dto => dto.Ignore())
                .ForMember(l => l.Rank, dto => dto.Ignore())
                .ForMember(l => l.Service, dto => dto.Ignore())
                .ForMember(l => l.Unit, dto => dto.Ignore())
                .ForMember(l => l.Sponsor, dto => dto.Ignore())
                .ForMember(l => l.Name, 
                    opt => opt.MapFrom(dto => dto))
                .ForMember(l => l.PersonalInfo, 
                    opt => opt.MapFrom(dto => dto))
                .ForMember(l => l.DriverRestrictions, 
                    opt => opt.MapFrom(dto => dto));

            CreateMap<SofaLicense, LicenseSearchDTO>()
                .ForMember(dto => dto.FirstName,
                opt => opt.MapFrom(license => license.Name.FirstName))
                .ForMember(dto => dto.LastName,
                opt => opt.MapFrom(license => license.Name.LastName))
                .ForMember(dto => dto.MiddleInitial,
                opt => opt.MapFrom(license => license.Name.MiddleInitial));

            CreateMap<SofaLicenseIssue, SofaLicenseIssueDTO>()
                .ForMember(dto => dto.User,
                opt => opt.MapFrom(i => i.User));

            CreateMap<SofaLicense, LicenseDTO>()
                .ForMember(dto => dto.SponsorDodId,
                    l => l.Ignore())
                .ForMember(dto => dto.FirstName,
                opt => opt.MapFrom(l => l.Name.FirstName))
                .ForMember(dto => dto.MiddleInitial,
                opt => opt.MapFrom(l => l.Name.MiddleInitial))
                .ForMember(dto => dto.LastName,
                opt => opt.MapFrom(l => l.Name.LastName))
                .ForMember(dto => dto.Gender,
                opt => opt.MapFrom(l => l.PersonalInfo.Gender))
                .ForMember(dto => dto.Dob,
                opt => opt.MapFrom(l => l.PersonalInfo.DoB))
                .ForMember(dto => dto.Height,
                opt => opt.MapFrom(l => l.PersonalInfo.Height))
                .ForMember(dto => dto.Weight,
                opt => opt.MapFrom(l => l.PersonalInfo.Weight))
                .ForMember(dto => dto.HairColor,
                opt => opt.MapFrom(l => l.PersonalInfo.HairColor))
                .ForMember(dto => dto.EyeColor,
                opt => opt.MapFrom(l => l.PersonalInfo.EyeColor))
                .ForMember(dto => dto.Glasses,
                opt => opt.MapFrom(l => l.DriverRestrictions.Glasses))
                .ForMember(dto => dto.Tdy,
                opt => opt.MapFrom(l => l.DriverRestrictions.Tdy))
                .ForMember(dto => dto.OnBaseOnly,
                opt => opt.MapFrom(l => l.DriverRestrictions.OnBaseOnly))
                .ForMember(dto => dto.AutoJeep,
                opt => opt.MapFrom(l => l.DriverRestrictions.AutoJeep))
                .ForMember(dto => dto.MotorCycle,
                opt => opt.MapFrom(l => l.DriverRestrictions.MotorCycle))
                .ForMember(dto => dto.Motor,
                opt => opt.MapFrom(l => l.DriverRestrictions.Motor))
                .ForMember(dto => dto.Other,
                opt => opt.MapFrom(l => l.DriverRestrictions.Other))
                .ForMember(dto => dto.Dependents,
                opt => opt.MapFrom(l => l.Dependents))
                .ForMember(dto => dto.Issues,
                opt => opt.MapFrom(l => l.Issues));

            CreateMap<UserUpdateDTO, Account>()
                .ForMember( a => a.AccountTypeId, opt => opt.MapFrom( dto => dto.AccountTypeId ) );
            CreateMap<UserUpdateDTO, NameVO>();
            CreateMap<UserUpdateDTO, ContactInfoVO>();

            CreateMap<UserUpdateDTO, User>()
             .ConstructUsing(dto => new User(
                 dto.DsnPhone,
                 dto.CommPhone,
                 dto.Email,
                 dto.AccountId,
                 dto.UnitId,
                 dto.ServiceId,
                 dto.RankId,
                 dto.SignatureData
             ))
                .ForMember(u => u.Rank, dto => dto.Ignore())
                .ForMember(u => u.Unit, dto => dto.Ignore())
                .ForMember(u => u.Service, dto => dto.Ignore())
                .ForMember(u => u.ContactInfo,   
                    opt => opt.MapFrom(dto => dto))
                .ForMember(u => u.Account, 
                    opt => opt.MapFrom(dto => dto))
                .ForMember(u => u.Name, 
                    opt => opt.MapFrom(dto => dto));
            
            CreateMap<User, UserDTO>()
                .ForMember(dto => dto.FirstName,
                    opt => opt.MapFrom(u => u.Name.FirstName))
                    .ForMember(dto => dto.MiddleInitial,
                    opt => opt.MapFrom(u => u.Name.MiddleInitial))
                    .ForMember(dto => dto.LastName,
                    opt => opt.MapFrom(u => u.Name.LastName))
                    .ForMember(dto => dto.DsnPhone,
                    opt => opt.MapFrom(u => u.ContactInfo.DsnPhone))
                    .ForMember(dto => dto.CommPhone,
                    opt => opt.MapFrom(u => u.ContactInfo.CommPhone))
                    .ForMember(dto => dto.Email,
                    opt => opt.MapFrom(u => u.ContactInfo.Email));

            CreateMap<User, ViewUserDTO>()
                .ForMember(dto => dto.FirstName,
                    opt => opt.MapFrom(u => u.Name.FirstName))
                    .ForMember(dto => dto.MiddleInitial,
                    opt => opt.MapFrom(u => u.Name.MiddleInitial))
                    .ForMember(dto => dto.LastName,
                    opt => opt.MapFrom(u => u.Name.LastName))
                    .ForMember(dto => dto.DsnPhone,
                    opt => opt.MapFrom(u => u.ContactInfo.DsnPhone))
                    .ForMember(dto => dto.CommPhone,
                    opt => opt.MapFrom(u => u.ContactInfo.CommPhone))
                    .ForMember(dto => dto.Email,
                    opt => opt.MapFrom(u => u.ContactInfo.Email));

            CreateMap<User, UserSearchDTO>()
                .ForMember(dto => dto.FirstName,
                    opt => opt.MapFrom(u => u.Name.FirstName))
                .ForMember(dto => dto.MiddleInitial,
                    opt => opt.MapFrom(u => u.Name.MiddleInitial))
                .ForMember(dto => dto.LastName,
                    opt => opt.MapFrom(u => u.Name.LastName))
                .ForMember(dto => dto.LastLoginDate,
                    opt => opt.MapFrom(u => u.Account.LastLoginDate))
                .ForMember(dto => dto.AccountTypeName,
                    opt => opt.MapFrom(u => u.Account.AccountType.Type));

            CreateMap<FaqDTO, Faq>();
        }
    }
}