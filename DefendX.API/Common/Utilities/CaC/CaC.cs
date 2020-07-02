namespace DefendX.API.Common.Utilities.CaC
{
    public class CaC
    {
        public long DodId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }

        public CaC() {}
        public CaC(long dodId, string firstName, string lastName, string middleName ) {
            this.DodId = dodId;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.MiddleName = middleName;
        }
    }
}