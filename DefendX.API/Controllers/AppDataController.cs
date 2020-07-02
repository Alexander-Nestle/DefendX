using System;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;
using DefendX.API.AppLayer.Services;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DefendX.API.AppLayer.DTOs;

namespace DefendX.API.Controllers
{
    [Route ("api/[controller]")]
    [ApiController]
    [Authorize (Roles = "Administrator, User, CSS")]
    public class AppDataController : TController
    {
        private AppDataAppService _appDataService;
        public AppDataController(
            AppDataAppService appDataService,
            ILogRepository logRepo) : base(logRepo)
        {
            _appDataService = appDataService;
        }

        [HttpGet ("services")]
        public async Task<IActionResult> GetServices ()
        {
            return Ok(await _appDataService.GetServices());
        }

        [HttpGet ("ranks/{serviceId}")]
        public async Task<IActionResult> GetRanks (int serviceId)
        {
            return Ok(await _appDataService.GetRanks(serviceId));
        }

        [HttpGet ("units")]
        public async Task<IActionResult> GetUnit ([FromQuery] UnitUserParams unitParams)
        {
            return Ok(await _appDataService.GetUnits(unitParams));
        }

        [HttpGet("accountTypes")]
        public async Task<IActionResult> GetAccountTypes ()
        {
            return Ok(await _appDataService.GetAccountTypes());
        }

        [HttpPut("faqs")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> SaveNewFaq (FaqDTO newFaq) 
        {
            try {
                var savedFaq = await _appDataService.SaveNewFaq(newFaq);
                await _logRepo.LogAsync(LogTypes.Update, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Update, "Added FAQ", savedFaq.Id));
                await _logRepo.SaveAsync();
                return Ok(savedFaq);
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpPost("faqs")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> UpdateFaq (FaqDTO faq) 
        {
            try {
                var updatedFaq = await _appDataService.UpdateFaq(faq);
                await _logRepo.LogAsync(LogTypes.Update, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Update, "Update FAQ", updatedFaq.Id));
                await _logRepo.SaveAsync();
                return Ok(updatedFaq);
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpDelete ("faqs")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> DeleteFaq ([FromQuery] FaqDTO faq) 
        {
            try {
                await _appDataService.DeleteFaq (faq);
                await _logRepo.LogAsync(LogTypes.Delete, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Delete, "Delete FAQ", faq.Id));
                await _logRepo.SaveAsync();
                return Ok ();                
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }
    }
}