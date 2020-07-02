using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DefendX.API.Domain.AggregatesModel.AccountTypeAggregate
{
    public class Faq : TEntity
    {
        public int Id { get; private set; }
        public string Question { get; private set; }
        public string Answer { get; private set; }
        public int AccountTypeId { get; private set; }

        [ForeignKey ("AccountTypeId")]
        public virtual AccountType AccountType { get; private set; }

        public Faq() {}

        public Faq(string Question, string Answer, int AccountTypeId) {
            this.Question = Question;
            this.Answer = Answer;
            this.AccountTypeId = AccountTypeId;
        }

        public bool IsValid() 
        {
            if (Question != null && Question != "" && Answer != null && Answer != "") {
                return true;
            }
            return false;
        }

        public void UpdateFaq(string Question, string Answer, int AccountTypeId)
        {
            this.Question = Question;
            this.Answer = Answer;
            this.AccountTypeId = AccountTypeId;
        }
    } 
}