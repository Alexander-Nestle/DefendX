using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.Domain.AggregatesModel.ValueObjects;
using DefendX.API.Domain.Values;

namespace DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate {

    public class SofaLicense : TEntity, IAggregateRoot {
        [Key]
        public int Id { get; private set; }
        public long DodId { get; private set; }
        public int? SponsorId { get; private set; }

        [ForeignKey ("SponsorId")]
        public virtual SofaLicense Sponsor { get; private set; }
        public int UnitId { get; private set; }

        [ForeignKey ("UnitId")]
        public virtual Unit Unit { get; private set; }
        public int? RankId { get; private set; }

        [ForeignKey ("RankId")]
        public virtual Rank Rank { get; private set; }
        public int ServiceId { get; private set; }
        public virtual Service Service { get; private set; }

        [ConcurrencyCheck]
        public long LastEditedById { get; private set; }

        [ForeignKey ("LastEditedById")]
        public virtual User LastEditedBy { get; private set; }
        public virtual NameVO Name { get; private set; }
        public virtual PersonalInformationVO PersonalInfo { get; private set; }
        public virtual DriverRestrictionsVO DriverRestrictions { get; private set; }

        [ConcurrencyCheck]
        public DateTime DateUpdated { get; private set; }
        public DateTime DateCreated { get; private set; }
        public DateTime DateExpired { get; private set; }

        [Required]
        public string SignatureData { get; private set; }
       
        [MaxLength (100)]
        [Required]
        public string PermitNumber { get; private set; }
        public bool IsAuthenticated { get; private set; }

        [MaxLength (30)]
        public string Remarks { get; private set; }
        public virtual List<SofaLicenseIssue> Issues { get; private set; }
        public virtual List<SofaLicense> Dependents { get; private set; }
        public SofaLicense () { }
        public SofaLicense (
                        NameVO name,
                        PersonalInformationVO personalInfo,
                        DriverRestrictionsVO driverRestrictions,
                        int serviceId,
                        int lastEditedById,
                        DateTime dateExpired,
                        string signatureData,
                        string permitNumber,
                        bool inPrintQueue,
                        long dodId,
                        int unitId,
                        int? sponsorId = null,
                        int? rankId = null,
                        string remarks = null) {
            this.Name = name;
            this.PersonalInfo = personalInfo;
            this.DriverRestrictions = driverRestrictions;
            this.ServiceId = serviceId;
            this.LastEditedById = lastEditedById;
            this.DateUpdated = DateTime.Now;
            this.DateCreated = DateTime.Now;
            this.DateExpired = dateExpired;
            this.SignatureData = signatureData;
            this.PermitNumber = permitNumber;
            this.DodId = dodId;
            this.SponsorId = sponsorId;
            this.UnitId = unitId;
            this.RankId = rankId;
            this.Remarks = remarks;
        }

        // Constructor used by automapper
        public SofaLicense (
                        string firstName,
                        string middleInitial,
                        string lastName,
                        string gender,
                        DateTime dob,
                        int height,
                        int weight,
                        string hairColor,
                        string eyeColor,
                        bool glasses,
                        bool tdy,
                        bool onBaseOnly,
                        bool autoJeep,
                        bool motorCycle,
                        bool motor,
                        bool other,
                        int serviceId,
                        int lastEditedById,
                        DateTime dateExpired,
                        string signatureData,
                        string permitNumber,
                        bool inPrintQueue,
                        long dodId,
                        int unitId,
                        int? sponsorId = null,
                        int? rankId = null,
                        string remarks = null) {
            this.Name = new NameVO(firstName, lastName, middleInitial);
            this.PersonalInfo = new PersonalInformationVO(gender, dob, height, weight, hairColor, eyeColor);
            this.DriverRestrictions = new DriverRestrictionsVO(glasses, tdy, onBaseOnly, autoJeep, motorCycle, motor, other);
            this.ServiceId = serviceId;
            this.LastEditedById = lastEditedById;
            this.DateUpdated = DateTime.Now;
            this.DateCreated = DateTime.Now;
            this.DateExpired = dateExpired;
            this.SignatureData = signatureData;
            this.PermitNumber = permitNumber;
            this.DodId = dodId;            
            this.SponsorId = sponsorId;
            this.UnitId = unitId;
            this.RankId = rankId;
            this.Remarks = remarks;
        }

        public void SetLastEditedById(long userId) 
        {
            // bounds of DoD ID
            if(userId < DOD_ID.MIN  || userId > DOD_ID.MAX) 
                 throw new ArgumentException ("Invalid Argument", nameof (userId));
            
            this.LastEditedById = userId;
        }

        public void SetPermitNumber(string permitNumber)
        {
            if (permitNumber == null || !(Regex.Match(permitNumber, @"^1-\d{1,9}$").Success))
                throw new ArgumentException ("Invalid Argument", nameof (permitNumber));

            this.PermitNumber = permitNumber;
        }

        public void SetDateUpdated()
        {
            this.DateUpdated = DateTime.Now;
        }

        public void SetSponsorId(int? id) 
        {
            this.SponsorId = id;
        }

        public void SetIsAuthenticated(bool isAuthenticated) 
        {
            this.IsAuthenticated = isAuthenticated;
        }

        public void SetRemarks(string remarks)
        {
            this.Remarks = remarks;
        }

        public void AddIssue(SofaLicenseIssue issue)
        {
            this.Issues.Add(issue);
        }

        public bool IsValid() 
        {
            if (
                DodId >= DOD_ID.MIN && DodId <= DOD_ID.MAX
                && (SponsorId == null || SponsorId > 0) 
                && ServiceId > 0
                && UnitId > 0
                && LastEditedById > 0
                && Name != null && Name.IsValid()
                && PersonalInfo != null
                && DriverRestrictions != null
                && ((IsAuthenticated && !String.IsNullOrEmpty(SignatureData)) || !IsAuthenticated)
                && (PermitNumber != null && (Regex.Match(PermitNumber, @"^1-\d{1,9}$").Success))
                && (Remarks == null || Remarks.Length <= 30)
            ) {
                return true;
            }
            return false;
        }
    }
}