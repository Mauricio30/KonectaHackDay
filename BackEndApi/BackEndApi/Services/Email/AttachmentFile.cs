using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEndApi.Services.Email
{
    public class AttachmentFile
    {
            public string Name { get; set; }
            public byte[] Data { get; set; }
    }
}
