using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEndApi.DAL;
using BackEndApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEndApi.Controllers
{
    [Route("api/Register")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        [HttpPost("RegisterUser")]
        [AllowAnonymous]
        
        public IActionResult Register([FromBody] Register NewUser )
        {
            if( NewUser == null)
            {
                return BadRequest();
            }

            var Response = "Usuario registrado con exito";

            return Ok(Response);
        }
    }
}