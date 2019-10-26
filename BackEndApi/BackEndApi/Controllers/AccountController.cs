using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BackEndApi.Models;
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
                System.Text.Encoding.UTF8.GetBytes("TokenKey")
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

    }
}