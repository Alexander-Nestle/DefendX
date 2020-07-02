using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DefendX.API.AppLayer.DTOs
{
    public class AccountTypeChangeRequestDTO
    {
        [Required]
        public string AccountTypeName { get; set; }   
        public string Justification { get; set; }
        [Required]
        public string EmailAddress { get; set; }
        public IFormFile Attachment { get; set; }
    }
}