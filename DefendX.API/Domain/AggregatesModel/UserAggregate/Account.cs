using System;
using System.ComponentModel.DataAnnotations.Schema;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.Values;

namespace DefendX.API.Domain.AggregatesModel.UserAggregate
{
    public class Account : TEntity
    {
        //change the name space of the classes
        //add the Irepo to the agregate to control the access
        //access account through the accountType, so a list of accounts
        //User will still reference account with an ID
        //access rank through services
        //make a Name valueobject for user and account
        //possibly make a signature value oject aswell
        //to confirgure the value objects use the following link
        //https://docs.microsoft.com/en-us/dotnet/standard/microservices-architecture/microservice-ddd-cqrs-patterns/implement-value-objects?view=aspnetcore-2.1
        //https://docs.microsoft.com/en-us/dotnet/standard/microservices-architecture/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design?view=aspnetcore-2.1#the-repository-pattern
        //possilby add a unit of work
        public int Id { get; private set; }
        public int AccountTypeId { get; private set; }

        [ForeignKey ("AccountTypeId")]
        public virtual AccountType AccountType { get; private set; }
        public DateTime LastLoginDate { get; private set; }
        public DateTime DateCreated { get; private set; }

        public Account() {}

        public Account(int accountTypeId, DateTime lastLoginDate, DateTime dateCreated) 
        {
            this.AccountTypeId = accountTypeId;
            this.LastLoginDate = lastLoginDate;
            this.DateCreated = dateCreated; 
        }

        public void RefreshLoginDate()
        {
            LastLoginDate = DateTime.Now;
        }

        public void SetAccountTypeId (int id)
        {
            if (!Enum.IsDefined(typeof(AccountTypes), id))
                throw new ArgumentException ("Invalid Argument", nameof (AccountType));

            this.AccountTypeId = id;
        }

        public bool IsValid ()
        {
            if (AccountTypeId >= ACCOUNT_TYPES.MIN_ID &&
                AccountTypeId <= ACCOUNT_TYPES.MAX_ID) 
            {
                return true;
            }
            return false;
        }
    }
}