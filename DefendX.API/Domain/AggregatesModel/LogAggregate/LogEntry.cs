using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.Domain.AggregatesModel.LogAggregate {
    public class LogEntry : TEntity {
        public int Id { get; private set; }
        public long UserId { get; private set; }

        // [ForeignKey ("UserId")]
       // public virtual User User { get; private set; }
        public string IpAddress { get; private set; }
        public long EntityId { get; private set; }
        public int LogEntryTypeId { get; private set; }

        [ForeignKey ("LogEntryTypeId")]
        public virtual LogEntryType LogEntryType { get; private set; }

        [MaxLength (150)]
        [Required]
        public string Message { get; private set; }

        public string Stack { get; private set; }

        public DateTime TimeStamp { get; private set; }

        public LogEntry () { }

        public LogEntry (
            long userId,
            string ipAddress,
            int logEntryTypeId,
            string message,
            long EntityId = 0,
            string stack = null) {
            this.UserId = userId;
            this.IpAddress = ipAddress;
            this.LogEntryTypeId = logEntryTypeId;
            this.EntityId = EntityId;
            this.Stack = stack;
            this.Message = message;
            TimeStamp = DateTime.Now;
        }
    }
}