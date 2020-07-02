using System;
using System.Threading.Tasks;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.AppLayer.Params;
using DefendX.API.AppLayer.Services;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DefendX.API.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    [Authorize (Roles = "Administrator, User, CSS")]
    public class LicensesController : TController {

        private LicensesAppService _licensesAppService;

        public LicensesController (
            LicensesAppService licensesAppservice,  
            ILogRepository logRepo): base(logRepo) {
            _licensesAppService = licensesAppservice;
        }

        [HttpGet]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> GetLicenses () {
            var licenses = await _licensesAppService.GetLicenses();
            foreach(var license in licenses)
            {
                await _logRepo.LogAsync(LogTypes.Read, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Read, "License Read", license.Id));
            }
            await _logRepo.SaveAsync();
            return Ok (licenses);
        }

        [HttpGet ("{id}")]
        public async Task<IActionResult> GetLicense (int id) {
            try {
                var license = await _licensesAppService.GetLicense (id);
                await _logRepo.LogAsync(LogTypes.Read, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Read, "License Read", license.Id));
                await _logRepo.SaveAsync();
                return Ok (license);                
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        //create
        [HttpPut]
        public async Task<IActionResult> SaveNewLicense (LicenseDTO license) 
        {
            try {
                var savedLicense = await _licensesAppService.SaveLicense(license);
                await _logRepo.LogAsync(LogTypes.Create, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Create, "New License", savedLicense.Id));
                await _logRepo.SaveAsync();
                return Ok (savedLicense);
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        //update
        [HttpPost]
        public async Task<IActionResult> UpdateLicense (LicenseDTO license) 
        {
            try {
                var updatedLicense = await _licensesAppService.UpdateLicense(license);
                await _logRepo.LogAsync(LogTypes.Update, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Update, "Update license", updatedLicense.Id));
                await _logRepo.SaveAsync();
                return Ok(updatedLicense);
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpGet ("search")]
        [Authorize (Roles = "Administrator, CSS")]
        public async Task<IActionResult> SearchLicenses ([FromQuery] SearchUserParams userParams) 
        {
            return Ok (await _licensesAppService.SearchLicenses (userParams));
        }

        [HttpDelete ("{id}")]
        public async Task<IActionResult> DeleteLicense (int id) 
        {
            try {
                await _licensesAppService.DeleteLicense (id);
                await _logRepo.LogAsync(LogTypes.Delete, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Delete, "Delete license", id));
                await _logRepo.SaveAsync();
                return Ok ();                
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpDelete("many")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> DeleteLicenses ([FromQuery] int[] ids) 
        {
            try {
                await _licensesAppService.DeleteLicense (ids);
                foreach(var id in ids)
                {
                    await _logRepo.LogAsync(LogTypes.Delete, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Delete, "Delete license", id));
                    await _logRepo.SaveAsync();
                }
                return Ok ();                
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        // Endpoint returns dependent and user licenses
        [HttpGet("user")]
        public async Task<IActionResult> GetUserLicensesForDisplay()
        {
            try {
             return Ok (await _licensesAppService.GetUserLicensesForDisplay());
            } catch (ArgumentException e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpGet("printQueue")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> GetLicensePrintQueue () 
        {
            var printQueueTuple = await _licensesAppService.GetLicensePrintQueue();
            return Ok(new {LicenseIds = printQueueTuple.Item1, licenses = printQueueTuple.Item2 });
        }

        [HttpPut("printQueue")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> AddToPrintQueue([FromBody] int id)
        { 
            try {
                await _licensesAppService.AddToPrintQueue(id); 
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
                return Ok();              
        }

        [HttpPut("printQueue/many")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> AddToPrintQueue([FromBody] int[] ids)
        {
            try {
                await _licensesAppService.AddToPrintQueue(ids); 
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
                return Ok(); 
        }

        [HttpDelete("printQueue/{licenceId}")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> RemoveFromPrintQueue(int licenceId)
        {
            await _licensesAppService.RemoveFromPrintQueue(licenceId);
            return Ok();
        }

        [HttpDelete("printQueue")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> RemoveAllFromPrintQueue()
        {
            await _licensesAppService.RemoveAllFromPrintQueue();
            return Ok();
        }

        [HttpPut("printed")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> Printed([FromBody] int[] ids)
        {
            var licenseIssue = _licensesAppService.IssueLicenses(ids);
            foreach(var id in ids)
            {
                await _logRepo.LogAsync(LogTypes.LicensePrint, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.LicensePrint, "License issued", id));
            }
            await licenseIssue;
            await _logRepo.SaveAsync();
            return Ok();
        }

    }
}