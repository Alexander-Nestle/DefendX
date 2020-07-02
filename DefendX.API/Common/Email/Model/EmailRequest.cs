using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DefendX.API.Common.Email.Model
{
    public class EmailRequest
    {
        [Required]
        public string ToAddress { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
        public string Subject { get; set; }
        public IFormFile Attachment { get; set;  }
        public string LinkedImage { get; set; }
    }
}