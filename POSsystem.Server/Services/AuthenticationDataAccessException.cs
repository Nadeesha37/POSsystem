namespace POSsystem.Server.Services;

public sealed class AuthenticationDataAccessException : Exception
{
    public AuthenticationDataAccessException(Exception innerException)
        : base("The authentication data store could not be accessed.", innerException)
    {
    }
}
