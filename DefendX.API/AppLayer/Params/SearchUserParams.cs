namespace DefendX.API.AppLayer.Params
{
    public class SearchUserParams
    {
        public string QueryString { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}