namespace DefendX.API.AppLayer.DTOs
{
    public class FaqDTO
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public int AccountTypeId { get; set; }
    }
}