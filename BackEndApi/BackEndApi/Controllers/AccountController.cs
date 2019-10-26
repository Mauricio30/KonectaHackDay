using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BackEndApi.Models;
using BackEndApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BackEndApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public AccountController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("Authenticate")]
        [AllowAnonymous]
        public IActionResult Authenticate([FromBody] AuthenticationDTO authenticationDTO)
        {
            var claims = new List<Claim>
                    {
                        new Claim("roles", "vendedor"),
                        new Claim(JwtRegisteredClaimNames.Sub, authenticationDTO.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, authenticationDTO.UserName)
                    };

            var symmetricSecurityKey = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes("YouCannotAlterTokenIfYouCannotHoldThisVeryLongKey")
                );
            var signingCredentials = new SigningCredentials(
                symmetricSecurityKey, SecurityAlgorithms.HmacSha256
                );
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: "ThunderHacks",
                audience: "Konecta",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: signingCredentials
                );

            var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            return Ok(token);
        }
        

        [AllowAnonymous]
        [HttpPost("newCodes")]
        public async Task<IActionResult> CreateCodes([FromBody] CodesDTO codes)
        {
            var random = new Random();

            var emailcode = random.Next(0, 999999).ToString("D6");
            var smscode = random.Next(0, 999999).ToString("D6");
            codes.EmailCode = emailcode;
            codes.CellphoneCode = smscode;

            //var sendNotification = Task.Run(new Action(() => _notificationService.SendNotification("CODES_GENERATED", user, loanRequest)));
            var sendNotification = await _notificationService.SendNotificationAsync("CODES_GENERATED", codes);

            return Ok(new
            {
                Message = "Revisa tu correo y tu celular e ingresa los códigos que te enviamos. Algunas veces el correo llega a spam",
                ShowMessage = true,
            });

        }

    }


}