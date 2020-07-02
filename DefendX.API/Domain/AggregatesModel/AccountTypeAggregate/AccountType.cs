using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DefendX.API.Domain.AggregatesModel.AccountTypeAggregate
{
    public enum AccountTypes
    {
        User = 1,
        Administrator,
        Css
    }
    public class AccountType : TEntity, IAggregateRoot
    {
        public int Id { get; private set; }
        [MaxLength(15)]
        [Required]
        public string Type { get; private set; }

        //private HashSet<Account> _accounts;
        //public IEnumerable<Account> Accounts => _accounts;

        public virtual List<Faq> Faqs { get; private set; }

        public AccountType() { }

        [JsonConstructor]
        public AccountType(string type)
        {
            this.Type = type;
        }

        public void AddFaq(Faq faq)
        {
            if (faq == null)
            {
                throw new System.ArgumentNullException(nameof(faq));
            }

            if(Faqs == null)
            {
                Faqs = new List<Faq>();
            }

            Faqs.Add(faq);
        }

        public void UpdateFaq(Faq faq)
        {
            if (faq == null)
            {
                throw new System.ArgumentNullException(nameof(faq));
            }

            var updateFaq = Faqs.Find(myFaq => myFaq.Id == faq.Id);
            updateFaq.UpdateFaq(faq.Question, faq.Answer, faq.AccountTypeId);
        }

        public void RemoveFaq(Faq faq)
        {
            if (faq == null)
            {
                throw new System.ArgumentNullException(nameof(faq));
            }

            var removeFaq = Faqs.Find(myFaq => myFaq.Id == faq.Id);
            Faqs.Remove(removeFaq);
        }
    }
}