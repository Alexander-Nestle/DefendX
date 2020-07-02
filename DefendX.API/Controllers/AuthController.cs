using System;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Services;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DefendX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : TController
    {
        private AuthAppService _authAppService { get; set; }
        // private ILogRepository _logRepo;
        public AuthController(
            AuthAppService authService,
            ILogRepository logRepo
        ) : base(logRepo){
            _authAppService = authService;
            // _logRepo = logRepo;
        }

        [HttpGet()]
        [AllowAnonymous]
        public async Task<IActionResult> Login()
        {
            try{
                var userInfoTuple = await _authAppService.Login();
                var user = userInfoTuple.Item2;

                await _logRepo.LogAsync(
                    LogTypes.Login, 
                    new LogEntry(
                        user.DodId, 
                        GetIpAddress(), 
                        (int)LogTypes.Login, 
                        $"{user.FirstName} {user.LastName} successfully logged in"
                    )
                );
                await _logRepo.SaveAsync();
                return Ok(new {Token = userInfoTuple.Item1, User = userInfoTuple.Item2 });
            } catch (Exception e) {
                await _logRepo.LogAsync(
                    LogTypes.Error, 
                    new LogEntry(
                        0, 
                        GetIpAddress(), 
                        (int)LogTypes.Error, 
                        e.Message,
                        0,
                        e.StackTrace
                    )
                );
                await _logRepo.SaveAsync();


                ModelState.AddModelError("Unauthorized", e.Message);
                return BadRequest(ModelState);
            }
        }
    }
}