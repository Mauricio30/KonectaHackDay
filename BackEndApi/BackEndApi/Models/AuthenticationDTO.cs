using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEndApi.Models
{
    public class AuthenticationDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
