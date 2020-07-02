using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.AppLayer.Params;
using DefendX.API.AppLayer.Services;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DefendX.API.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    [Authorize (Roles = "Administrator, User, CSS")]
    public class UsersController : TController {
        private UsersAppService _usersAppService;
        private EmailAppService _emailAppService;
        public UsersController (UsersAppService usersAppService, EmailAppService emailAppService, ILogRepository logRepo): base(logRepo) {
            _usersAppService = usersAppService;
            _emailAppService = emailAppService;
        }

        [HttpGet ("{id}")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> GetUser (long id) {
            try {
                var user = await _usersAppService.GetUser (id);
                await _logRepo.LogAsync(LogTypes.Read, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Read, "User Account Read", user.DodId));
                await _logRepo.SaveAsync();
                return Ok (user);
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Exception", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpGet]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> GetUsers () {
            var users = await _usersAppService.GetUsers ();
            foreach(var user in users)
            {
                await _logRepo.LogAsync(LogTypes.Read, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Read, "User Account Read", user.DodId));
                await _logRepo.SaveAsync();
            }
            return Ok (users);
        }

        [HttpGet ("search")]
        [Authorize (Roles = "Administrator")]
        public async Task<IActionResult> SearchUsers([FromQuery] SearchUserParams userParams) {
            return Ok(await _usersAppService.SearchUsers(userParams));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateUser (UserUpdateDTO user) {
            try {
                var updatedUser = await _usersAppService.UpdateUser (user);
                await _logRepo.LogAsync(LogTypes.Update, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Update, "Updated User Account", user.DodId));
                await _logRepo.SaveAsync();
                return Ok(updatedUser);
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Error", e.Message);
                return BadRequest (ModelState);
            }
        }

        [HttpPost("request")]
        public async Task<IActionResult> AccountTypeChangeRequest([FromForm] AccountTypeChangeRequestDTO changeRequest)
        {
            try {
                var emailRequest = await _emailAppService.SendAccountChange(changeRequest);
                await _logRepo.LogAsync(LogTypes.Email, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Email, emailRequest.Subject));
                await _logRepo.SaveAsync();
                return Ok();
            } catch (Exception e) {
                await _logRepo.LogAsync(LogTypes.Error, new LogEntry(GetCurrentUserId(), GetIpAddress(), (int)LogTypes.Error, e.Message, 0, e.StackTrace));
                await _logRepo.SaveAsync();
                ModelState.AddModelError ("Error", e.Message);
                return BadRequest (ModelState);
            }
        }
    }
}