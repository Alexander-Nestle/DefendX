using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DefendX.API.Domain.AggregatesModel.LogAggregate
{
    public enum LogTypes
    {
        Error = 1,
        Login,
        Create,
        Read,
        Update,
        Delete,
        LicensePrint,
        Email
    }

    public class LogEntryType : TEntity, IAggregateRoot
    {
        public int Id { get; private set; }
        [MaxLength(25)]
        [Required]
        public string Type { get; private set; }
        public virtual List<LogEntry> LogEntries { get; private set; }
        public LogEntryType() {}

        [JsonConstructor]
        public LogEntryType(string type) {
            this.Type = type;
        }

        public void AddLogEntry(LogEntry e) 
        {
            if (e == null || e.LogEntryTypeId != Id)
            {
                throw new System.ApplicationException("Log failed");
            }

            if (LogEntries == null)
            {
                LogEntries = new List<LogEntry>();
            }

            LogEntries.Add(e);
        }
    }
}