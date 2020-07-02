using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DefendX.API.Common.Utilities.CaC;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.ValueObjects;
using DefendX.API.Domain.Values;

namespace DefendX.API.Domain.AggregatesModel.UserAggregate {
    public class User : TEntity, IAggregateRoot {
        [Key]
        [DatabaseGenerated (DatabaseGeneratedOption.None)]
        public long DodId { get; private set; }

        public int AccountId { get; private set; }

        [ForeignKey ("AccountId")]
        public virtual Account Account { get; private set; }
        public int? UnitId { get; private set; }

        [ForeignKey ("UnitId")]
        public virtual Unit Unit { get; private set; }

        public int? ServiceId { get; private set; }

        [ForeignKey ("ServiceId")]
        public virtual Service Service { get; private set; }
        public int? RankId { get; private set; }

        [ForeignKey ("RankId")]
        public virtual Rank Rank { get; private set; }

        public virtual NameVO Name { get; private set; }
        public virtual ContactInfoVO ContactInfo { get; private set; }

        public string SignatureData { get; private set; }

        [Timestamp]
        public byte[] RowVersion { get; private set; }

        public User () { }
        public User (NameVO name,
            ContactInfoVO contactInfo,
            int accountId = 0,
            int? unitId = null,
            int? serviceId = null,
            int? rankId = null,
            string signatureData = null) {
            this.Name = name;
            this.ContactInfo = contactInfo;
            this.AccountId = accountId;
            this.UnitId = unitId;
            this.ServiceId = serviceId;
            this.RankId = rankId;
            this.SignatureData = signatureData;
        }

        // Constructor used by mapper
        public User(
            string dsnPhone,
            string commPhone,
            string email,
            int? accountId,
            int? unitId = null,
            int? serviceId = null,
            int? rankId = null,
            string signatureData = null
        ) 
        {
            this.ContactInfo = new ContactInfoVO(dsnPhone, commPhone, email);
            this.AccountId = accountId ?? 0;
            this.UnitId = unitId;
            this.ServiceId = serviceId;
            this.RankId = rankId;
            this.SignatureData = signatureData;
        }

        // copy constructor
        public User (User user) {
            this.Name = new NameVO(user.Name.FirstName, user.Name.LastName, user.Name.MiddleInitial);
            this.ContactInfo = new ContactInfoVO(user.ContactInfo.DsnPhone, user.ContactInfo.CommPhone, user.ContactInfo.Email);
            this.AccountId = user.AccountId;
            this.Account = new Account(user.Account.AccountTypeId, user.Account.DateCreated, user.Account.LastLoginDate);
            this.UnitId = user.UnitId;
            this.ServiceId = user.ServiceId;
            this.RankId = user.RankId;
            this.SignatureData = user.SignatureData;
        }

        public void SetUserCacInfo (CaC cac) {
            if (string.IsNullOrEmpty (cac.FirstName) || string.IsNullOrEmpty (cac.LastName) || cac.DodId < DOD_ID.MIN || cac.DodId > DOD_ID.MAX) {
                throw new ArgumentNullException (nameof (cac), "Invalid information");
            }
            var middleInitial = ( String.IsNullOrEmpty(cac.MiddleName) ? "" : cac.MiddleName[0].ToString());
            this.Name = new NameVO (cac.FirstName, cac.LastName, middleInitial);
            this.DodId = cac.DodId;
        }

        public void SetAccount (Account account)
        {
            if (!account.IsValid())
                throw new ApplicationException ("Account Invalid");

            this.Account = account;
        }

        public void SetAccountTypeId (int id) 
        {
            if (this.Account == null)
                throw new ApplicationException("Account Undefined");
            this.Account.SetAccountTypeId(id);
        }

        public void SetUnitId (int id) 
        {
            if (id < UNITS.MIN_ID || id > UNITS.MAX_ID)
                throw new ArgumentException ("Invalid Argument", nameof (UnitId));
            this.UnitId = id;
            this.Unit = null;
        }

        public void SetServiceId (int id)
        {
            if (id < SERVICE.MIN_ID || id > SERVICE.MAX_ID)
                throw new ArgumentException ("Invalid Argument", nameof (ServiceId));
            
            this.ServiceId = id;
            this.Service = null;
        } 
        public void SetRankId (int id)
        {
            if (id < RANK.MIN_ID || id > RANK.MAX_ID)
                throw new ArgumentException ("Invalid Argument", nameof (RankId));
            
            this.RankId = id;
            this.Rank = null;
        }

        public void SetContactInfo (string dsnPhone, string commPhone, string email)
        {
            this.ContactInfo = new ContactInfoVO(dsnPhone, commPhone, email);
        }

        public void SetSignatureData(string sigData)
        {
            if (!sigData.Contains("data:image/png;base64"))
                throw new ArgumentException ("Invalid Argument", "Signature");

            this.SignatureData = sigData;
        } 

        public Boolean IsValid()
        {
            if (
                DodId >= DOD_ID.MIN && DodId <= DOD_ID.MAX
                && Name != null && Name.IsValid()
                && AccountId > 0
                && Account.IsValid()
            ) {
                return true;
            }
            return false;
        }
    }
}