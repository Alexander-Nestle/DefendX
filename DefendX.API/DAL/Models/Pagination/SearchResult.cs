using System.Collections;
using System.Collections.Generic;

namespace DefendX.API.DAL.Models.Pagination
{
    public class SearchResult<T>
    {
        public IEnumerable<T> Results { get; set; }
        public int TotalCount { get; set; }

        public SearchResult() {}
        public SearchResult(IEnumerable<T> results, int totalCount)
        {
            this.Results  = results;
            this.TotalCount = totalCount;
        }
    }
}