using System;
using System.Collections.Generic;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.AppLayer.DTOs
{
    public class LicenseDTO : TDTO
    {
        public int Id { get; set; }
        public long DodId { get; set; }
        public long? SponsorDodId { get; set; }
        public int? SponsorId { get; set; }
        public LicenseDTO Sponsor { get; set; }
        public int UnitId { get; set; }
        public Unit Unit { get; set; }
        public int? RankId { get; set; }
        public Rank Rank { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int LastEditedById { get; set; }
        public User LastEditedBy { get; set; }        
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime Dob { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string HairColor { get; set; }
        public string EyeColor { get; set; }
        public bool Glasses { get; set; }
        public bool Tdy { get; set; }
        public bool OnBaseOnly { get; set; }
        public bool AutoJeep { get; set; }
        public bool MotorCycle { get; set; }
        public bool Motor { get; set; }
        public bool Other { get; set; }
        public DateTime DateUpdated { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateExpired { get; set; }
        public string SignatureData { get; set; }
        public string PermitNumber { get; set; }
        public IEnumerable<LicenseSearchDTO> Dependents { get; set; }
        public IEnumerable<SofaLicenseIssueDTO> Issues { get; set; }

        public bool IsAuthenticated { get; set; }
        public string Remarks { get; set; }
    }
}