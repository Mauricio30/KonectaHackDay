using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEndApi.Models
{
    public class Register
    {
            
        public string Name { get; set; }
        public double Identification { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string CelPhone { get; set; }

    }
}
