using Microsoft.AspNetCore.Mvc;
using POSsystem.Server.Models;
using POSsystem.Server.Services;

namespace POSsystem.Server.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class LoginController(
    IAuthenticationService authenticationService,
    ILogger<LoginController> logger) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(UserAccount), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserAccount>> Login(
        [FromBody] LoginRequest? request,
        CancellationToken cancellationToken)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid login request.",
                Detail = "User name and password are required.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        try
        {
            var account = await authenticationService.AuthenticateAsync(request, cancellationToken);
            return account is null
                ? Unauthorized(new ProblemDetails
                {
                    Title = "Authentication failed.",
                    Detail = "The supplied credentials are invalid.",
                    Status = StatusCodes.Status401Unauthorized
                })
                : Ok(account);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (AuthenticationDataAccessException exception)
        {
            logger.LogError(exception, "The login data store could not be accessed.");
            return Problem(
                title: "Authentication service unavailable.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unexpected error while processing a login request.");
            return Problem(
                title: "An unexpected error occurred.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}
