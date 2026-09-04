using YamlDotNet.Core.Tokens;
using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.POSsystem_Server>("possystem-server");

builder.AddJavaScriptApp("client", "../possystem.client", runScriptName: "start")
       .WithReference(backend)
       .WithHttpEndpoint(env: "DEV_SERVER_PORT")
       .PublishAsDockerFile();

builder.Build().Run();

