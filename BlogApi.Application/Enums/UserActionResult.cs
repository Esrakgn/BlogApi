using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.Enums
{
    public enum UserActionResult
    {
        Success,
        NotFound,
        Conflict,
        InvalidCredentials
    }
}